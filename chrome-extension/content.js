/* Brandivibe Maps Scraper — content script v5 (click-into-detail)
   ─────────────────────────────────────────────────────────────────────
   Two scraping modes, click mode is the default:

   1. CLICK MODE (default, reliable):
      Phase 1 — scroll the feed to load all place anchors into memory
      Phase 2 — for each place, click the anchor to open the detail pane,
                scrape structured data (name, website, address) from the
                pane using stable Google data-item-id selectors, go back
      Partial-save on CAPTCHA detection so you never lose collected work.

   2. LIST MODE (fallback, fast but misses button-style links):
      Scroll + parse-in-place — the old v1.4 logic. Kept as a kill-switch
      behind chrome.storage.local.useListMode = true if Google redesigns
      the detail pane and click mode breaks.

   Auto-scrape on page load still triggered via pendingAutoScrape flag.
   On-page overlay shows live two-phase progress.
*/

(() => {
  const log = (...args) => console.log("[Brandivibe Scraper]", ...args);

  // ─────────── Helpers ───────────

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function findResultsPanel() {
    const feed = document.querySelector('[role="feed"]');
    if (feed) return feed;
    const panels = document.querySelectorAll(
      'div[aria-label*="Results"], div[role="main"]'
    );
    for (const p of panels) {
      if (p.scrollHeight > p.clientHeight + 20) return p;
    }
    return null;
  }

  function findEndMarker() {
    const feed = findResultsPanel();
    if (!feed) return false;
    const text = feed.textContent || "";
    return /you['']?ve reached the end/i.test(text);
  }

  /** Scroll the feed until no new cards load for N rounds. */
  async function scrollResults(panel, onProgress, maxRounds = 40) {
    let lastCount = 0;
    let stableRounds = 0;
    const STABLE_BEFORE_STOP = 3;
    const WAIT_MS = 1200;

    for (let i = 0; i < maxRounds; i++) {
      const items = panel.querySelectorAll('a[href*="/maps/place/"]');
      const count = items.length;
      if (onProgress) onProgress(count);

      if (count === lastCount) {
        stableRounds++;
        if (stableRounds >= STABLE_BEFORE_STOP) break;
      } else {
        stableRounds = 0;
      }
      lastCount = count;

      if (findEndMarker()) break;

      if (items.length > 0) {
        try {
          items[items.length - 1].scrollIntoView({
            block: "end",
            inline: "nearest",
          });
        } catch {}
      }
      panel.scrollTop = panel.scrollHeight;
      panel.dispatchEvent(new Event("scroll", { bubbles: true }));

      await sleep(WAIT_MS);
    }
    return lastCount;
  }

  /** Detect if Google has throttled us. Check for captcha + unusual traffic. */
  function detectThrottle() {
    if (document.querySelector('iframe[title*="recaptcha" i]')) return true;
    const body = document.body?.innerText || "";
    if (/unusual traffic|automated queries|your computer or network/i.test(body)) return true;
    return false;
  }

  function readQuery() {
    const input = document.querySelector('input#searchboxinput, input[aria-label*="Search"]');
    if (input && input.value) return input.value;
    return document.title.replace(" - Google Maps", "").trim();
  }

  // ─────────── Click-mode extractors ───────────

  /**
   * Wait for the detail pane to fully render AFTER clicking a new place.
   * Tracks the last-known h1 text so we only return when it CHANGES —
   * this prevents returning the stale pane from the previous iteration.
   */
  let lastDetailH1 = "";

  async function waitForDetailPane(maxMs = 6000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const main = document.querySelector('[role="main"]');
      const h1 =
        main?.querySelector('h1') ||
        main?.querySelector('[role="heading"][aria-level="1"]');
      const text = h1 ? (h1.textContent || "").trim() : "";
      if (text && text !== lastDetailH1) {
        lastDetailH1 = text;
        // Extra settle — website link sometimes appears ~250ms after h1
        await sleep(350);
        return main;
      }
      await sleep(120);
    }
    return null;
  }

  /**
   * Extract name / website / location from the detail pane.
   * Uses a cascade of strategies — broadest net wins. Google changes
   * their internal data-item-id values occasionally, so the fallback is:
   * "any <a> inside [role='main'] with an external http(s) href that
   * isn't google / youtube / an image."
   */
  function extractFromDetailPane(main) {
    if (!main) return null;

    // ─── NAME ───
    const nameEl =
      main.querySelector("h1") ||
      main.querySelector('[role="heading"][aria-level="1"]') ||
      main.querySelector('[role="main"] h1');
    const name = nameEl ? (nameEl.textContent || "").trim() : "";
    if (!name) {
      log("skip · no h1 name");
      return null;
    }

    // ─── WEBSITE ─── cascade of strategies
    let website = "";

    const strategies = [
      // 1. Google's historical stable selector
      () => main.querySelector('a[data-item-id="authority"]'),
      () => main.querySelector('a[data-item-id^="authority"]'),
      // 2. Aria-label based (common)
      () => main.querySelector('a[aria-label^="Website" i]'),
      () => main.querySelector('a[aria-label*="Website:" i]'),
      // 3. Data-value / data-tooltip
      () => main.querySelector('a[data-value="Website" i]'),
      () => main.querySelector('a[data-tooltip*="website" i]'),
      // 4. Jsaction containing "website"
      () => main.querySelector('a[jsaction*="website"]'),
    ];

    for (const strat of strategies) {
      try {
        const el = strat();
        if (el && el.href && el.href.startsWith("http") && !el.href.includes("google.com")) {
          website = el.href;
          break;
        }
      } catch {}
    }

    // 5. Broadest net — any external https anchor in the detail pane
    if (!website) {
      const anchors = main.querySelectorAll("a[href]");
      for (const a of anchors) {
        const u = a.href;
        if (!u || !u.startsWith("http")) continue;
        if (u.includes("google.com")) continue;
        if (u.includes("googleusercontent.com")) continue;
        if (u.includes("goo.gl") || u.includes("g.co")) continue;
        if (u.includes("youtube.com") || u.includes("youtu.be")) continue;
        if (/\.(jpg|jpeg|png|gif|svg|webp|ico|pdf)(\?|$)/i.test(u)) continue;
        website = u;
        break;
      }
    }

    if (!website) {
      log("skip · no website found for", name);
      return null;
    }

    // ─── ADDRESS ─── multiple strategies
    let address = "";
    const addressSelectors = [
      'button[data-item-id="address"]',
      '[data-item-id="address"]',
      'button[aria-label^="Address" i]',
      '[aria-label^="Address" i]',
      'button[data-tooltip*="address" i]',
    ];
    for (const sel of addressSelectors) {
      const el = main.querySelector(sel);
      if (el) {
        address = (el.textContent || el.getAttribute("aria-label") || "")
          .replace(/^Address:\s*/i, "")
          .trim();
        if (address) break;
      }
    }

    log("+ extracted", name, "·", website);
    return { name, website, location: address };
  }

  /** Go back to the list view after viewing a detail. */
  async function goBackToList(maxMs = 3000) {
    // Strategy 1: history.back() — works in Maps SPA
    try {
      history.back();
    } catch {}

    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const feed = document.querySelector('[role="feed"]');
      if (feed) {
        await sleep(200); // settle
        return true;
      }
      await sleep(100);
    }

    // Strategy 2: click the back button by aria-label
    const backBtn = document.querySelector(
      'button[aria-label*="Back" i], button[jsaction*="pane.back"]'
    );
    if (backBtn) {
      backBtn.click();
      await sleep(500);
      return true;
    }
    return false;
  }

  // ─────────── CLICK MODE — main scraper ───────────

  async function scrapeMapsClickMode(sentWebsites, onProgress) {
    log("click mode scrape starting");

    // Reset the detail-pane h1 tracker so iterations across scrapes don't
    // get polluted by the last business name from a previous run
    lastDetailH1 = "";

    const panel = findResultsPanel();
    if (!panel) {
      return { ok: false, error: "No results panel found. Run a Maps search first." };
    }

    // PHASE 1 — scroll to load all cards
    if (onProgress) onProgress({ phase: 1, message: "Loading results · 0" });
    await scrollResults(panel, (count) => {
      if (onProgress) onProgress({ phase: 1, message: `Loading results · ${count}` });
    });

    // Collect place URLs (deduped by URL)
    const anchors = Array.from(panel.querySelectorAll('a[href*="/maps/place/"]'));
    const placeUrls = Array.from(new Set(anchors.map((a) => a.href)));
    const total = placeUrls.length;

    log("collected", total, "place URLs");

    if (total === 0) {
      return { ok: true, query: readQuery(), leads: [], duplicates: 0, droppedNoWebsite: 0 };
    }

    // PHASE 2 — click into each
    const dedupeSet = new Set(
      (Array.isArray(sentWebsites) ? sentWebsites : []).map((u) => (u || "").toLowerCase())
    );
    const leads = [];
    let duplicates = 0;
    let droppedNoWebsite = 0;
    let throttled = false;

    for (let i = 0; i < placeUrls.length; i++) {
      if (onProgress) {
        onProgress({
          phase: 2,
          message: `Scraping ${i + 1} / ${total} · ${leads.length} saved`,
        });
      }

      // Detect throttle before each click
      if (detectThrottle()) {
        log("throttle detected, stopping early");
        throttled = true;
        break;
      }

      // Re-query for the anchor (the feed may have re-rendered)
      const url = placeUrls[i];
      const escaped = url.replace(/"/g, '\\"');
      const anchor = document.querySelector(`a[href="${escaped}"]`);
      if (!anchor) {
        log("anchor missing for", url);
        droppedNoWebsite++;
        continue;
      }

      // Click it
      try {
        anchor.scrollIntoView({ block: "center" });
        await sleep(150);
        anchor.click();
      } catch (err) {
        log("click failed", err);
        droppedNoWebsite++;
        continue;
      }

      // Wait for detail pane
      const main = await waitForDetailPane(5000);
      if (!main) {
        log("detail pane never loaded");
        await goBackToList();
        droppedNoWebsite++;
        continue;
      }

      // Extract structured data
      const lead = extractFromDetailPane(main);
      if (!lead) {
        // No website — business isn't sendable
        droppedNoWebsite++;
        await goBackToList();
        continue;
      }

      // Dedupe against previously-sent websites
      const websiteLower = lead.website.toLowerCase();
      if (dedupeSet.has(websiteLower)) {
        duplicates++;
        await goBackToList();
        continue;
      }

      dedupeSet.add(websiteLower);
      leads.push(lead);
      log("+", lead.name, lead.website);

      // Go back for the next iteration
      await goBackToList();
      await sleep(300); // tiny cadence — less robot-like
    }

    return {
      ok: true,
      query: readQuery(),
      leads,
      duplicates,
      droppedNoWebsite,
      throttled,
      total,
    };
  }

  // ─────────── LIST MODE — fallback (old v1.4 logic) ───────────

  function findCardContainer(anchor) {
    let card = anchor;
    for (let i = 0; i < 6 && card.parentElement; i++) {
      card = card.parentElement;
      if (card.getAttribute("jsaction") || card.getAttribute("role") === "article") break;
    }
    return card;
  }

  function extractCard(anchor) {
    const card = findCardContainer(anchor);
    const ariaLabel = anchor.getAttribute("aria-label") || "";
    const name = ariaLabel.trim() || anchor.textContent.trim().split("\n")[0].trim();
    if (!name) return null;

    let website = "";
    const links = card.querySelectorAll("a[href]");
    for (const a of links) {
      const u = a.href;
      if (!u || !u.startsWith("http")) continue;
      if (u.includes("google.com")) continue;
      if (u.includes("googleusercontent.com")) continue;
      if (/\.(jpg|jpeg|png|gif|svg|webp|ico)(\?|$)/i.test(u)) continue;
      website = u;
      break;
    }
    if (!website) return null;

    const text = (card.innerText || card.textContent || "").trim();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    let location = "";
    for (const line of lines) {
      if (line === name) continue;
      if (/^\d\.\d/.test(line)) continue;
      if (/^[\d\s().+-]+$/.test(line)) continue;
      if (/\d/.test(line) && line.length > 5 && line.length < 200 && /[a-z]/i.test(line)) {
        location = line.replace(/^[·•]\s*/, "").trim();
        break;
      }
    }
    return { name, website, location };
  }

  async function scrapeMapsListMode(sentWebsites, onProgress) {
    log("list mode scrape starting (fallback)");
    const panel = findResultsPanel();
    if (!panel) {
      return { ok: false, error: "No results panel found." };
    }

    if (onProgress) onProgress({ phase: 1, message: "Loading results · 0" });
    await scrollResults(panel, (count) => {
      if (onProgress) onProgress({ phase: 1, message: `Loading results · ${count}` });
    });

    const anchors = Array.from(panel.querySelectorAll('a[href*="/maps/place/"]'));
    const dedupeSet = new Set(
      (Array.isArray(sentWebsites) ? sentWebsites : []).map((u) => (u || "").toLowerCase())
    );
    const seen = new Set();
    const leads = [];
    let droppedNoWebsite = 0;
    let duplicates = 0;

    for (const a of anchors) {
      const card = extractCard(a);
      if (!card) {
        droppedNoWebsite++;
        continue;
      }
      const websiteLower = card.website.toLowerCase();
      if (dedupeSet.has(websiteLower)) {
        duplicates++;
        continue;
      }
      const key = `${card.name}|${card.website}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      leads.push(card);
    }

    return {
      ok: true,
      query: readQuery(),
      leads,
      duplicates,
      droppedNoWebsite,
      throttled: false,
      total: anchors.length,
    };
  }

  // ─────────── Router: click mode default, list mode fallback ───────────

  async function scrapeMaps(sentWebsites, { withOverlay = false } = {}) {
    const stored = await new Promise((resolve) =>
      chrome.storage.local.get(["useListMode"], resolve)
    );
    const useListMode = !!stored.useListMode;

    const onProgress = withOverlay
      ? (p) => {
          if (p.phase === 1) showOverlay(p.message, "active");
          else if (p.phase === 2) showOverlay(p.message, "active");
        }
      : null;

    if (useListMode) {
      return scrapeMapsListMode(sentWebsites, onProgress);
    }
    return scrapeMapsClickMode(sentWebsites, onProgress);
  }

  // ─────────── On-page overlay ───────────

  let overlayEl = null;

  function showOverlay(text, mode = "active") {
    if (!overlayEl) {
      overlayEl = document.createElement("div");
      overlayEl.id = "brandivibe-overlay";
      overlayEl.setAttribute(
        "style",
        [
          "position:fixed",
          "top:20px",
          "right:20px",
          "z-index:2147483647",
          "min-width:260px",
          "max-width:360px",
          "padding:14px 18px",
          "background:linear-gradient(180deg,rgba(11,13,22,0.96),rgba(10,12,18,0.96))",
          "border:1px solid rgba(134,229,255,0.25)",
          "border-radius:16px",
          "box-shadow:0 20px 40px -12px rgba(0,0,0,0.6),0 0 40px -8px rgba(134,229,255,0.25)",
          "color:#ededf0",
          "font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif",
          "font-size:13px",
          "line-height:1.45",
          "-webkit-backdrop-filter:blur(16px)",
          "backdrop-filter:blur(16px)",
          "pointer-events:none",
        ].join(";")
      );
      document.documentElement.appendChild(overlayEl);
    }
    const dotColor =
      mode === "success" ? "#4ade80" : mode === "error" ? "#f87171" : "#86e5ff";
    overlayEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
        <span style="width:8px;height:8px;border-radius:50%;background:${dotColor};box-shadow:0 0 10px ${dotColor};"></span>
        <span style="font-family:'SF Mono',ui-monospace,monospace;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:rgba(237,237,240,0.55);font-weight:700;">
          — Brandivibe
        </span>
      </div>
      <div style="color:#ededf0;font-size:13px;line-height:1.5;">${escapeHtml(text)}</div>
    `;
  }

  function hideOverlay(afterMs = 0) {
    if (!overlayEl) return;
    setTimeout(() => {
      overlayEl?.remove();
      overlayEl = null;
    }, afterMs);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ─────────── Auto-scrape on page load ───────────

  async function checkAutoScrape() {
    const stored = await new Promise((resolve) =>
      chrome.storage.local.get(["pendingAutoScrape", "sentWebsites"], resolve)
    );
    const flag = stored.pendingAutoScrape;
    if (!flag || !flag.timestamp) return;

    const age = Date.now() - flag.timestamp;
    if (age > 3 * 60 * 1000) {
      chrome.storage.local.remove(["pendingAutoScrape"]);
      return;
    }

    log("auto-scrape flag detected, waiting 4s for Maps to render");
    showOverlay("Maps loaded · waiting for results to render…");
    chrome.storage.local.remove(["pendingAutoScrape"]);
    await sleep(4000);

    const sentWebsites = Array.isArray(stored.sentWebsites) ? stored.sentWebsites : [];
    const result = await scrapeMaps(sentWebsites, { withOverlay: true });

    if (!result.ok) {
      showOverlay(result.error || "Scrape failed", "error");
      hideOverlay(6000);
      return;
    }

    if (result.leads.length === 0) {
      const detail = result.throttled
        ? "Google throttled us"
        : `No new leads (${result.duplicates ?? 0} dedup, ${result.droppedNoWebsite ?? 0} no website)`;
      showOverlay(detail, "error");
      hideOverlay(6000);
      return;
    }

    showOverlay(`Sending ${result.leads.length} leads to dashboard…`);
    try {
      const syncResult = await chrome.runtime.sendMessage({
        action: "ingestLeads",
        query: result.query,
        leads: result.leads,
      });
      if (!syncResult?.ok) {
        showOverlay(`Sync failed: ${syncResult?.error || "unknown"}`, "error");
        hideOverlay(8000);
        return;
      }
      const throttleNote = result.throttled ? " (stopped early — Google throttled)" : "";
      showOverlay(
        `✓ ${syncResult.added} with email · ${syncResult.droppedNoEmail || 0} dropped${throttleNote}`,
        "success"
      );
      hideOverlay(10000);

      // Update dedupe cache
      const existing = new Set(sentWebsites);
      for (const l of result.leads) existing.add((l.website || "").toLowerCase());
      chrome.storage.local.set({ sentWebsites: Array.from(existing).slice(-10000) });
    } catch (err) {
      showOverlay(`Sync error: ${err?.message || err}`, "error");
      hideOverlay(8000);
    }
  }

  // ─────────── Message bridge (manual mode from popup) ───────────

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.action === "scrapeMaps") {
      scrapeMaps(msg.sentWebsites, { withOverlay: true })
        .then((result) => sendResponse(result))
        .catch((err) => sendResponse({ ok: false, error: String(err?.message || err) }));
      return true;
    }
  });

  // ─────────── Boot ───────────

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => checkAutoScrape(), { once: true });
  } else {
    setTimeout(() => checkAutoScrape(), 500);
  }

  log("content script v5 loaded (click mode default, list mode fallback)");
})();
