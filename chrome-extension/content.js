/* Brandivibe Maps Scraper — content script v3 (auto-scrape + overlay)
   ─────────────────────────────────────────────────────────────────────
   Runs inside google.com/maps tabs. Two modes:

   1. MANUAL: popup sends a scrapeMaps message → this script scrapes and
      returns leads.
   2. AUTO: popup sets chrome.storage.local.pendingAutoScrape before
      opening the Maps tab. This script reads that flag on page load,
      waits 4s for Maps results to render, auto-scrolls, scrapes,
      forwards the batch to background.js which POSTs to the dashboard,
      and shows an on-page overlay with live progress.

   Scroll v3 fixes the "not loading more results" bug:
   - Uses scrollIntoView({ block:'end' }) on the LAST visible card to
     trigger Google's IntersectionObserver lazy-load
   - Also dispatches a scroll event on the feed panel
   - Detects the "end of the list" marker for early exit
   - 40 max rounds (was 14), 1200ms between rounds (was 900ms)
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
    // Google shows "You've reached the end of the list." at the bottom
    // of fully loaded results. Search the feed for that text.
    const feed = findResultsPanel();
    if (!feed) return false;
    const text = feed.textContent || "";
    return /you['']?ve reached the end/i.test(text);
  }

  /**
   * Scroll v3 — uses scrollIntoView on the last card to trigger Google's
   * IntersectionObserver lazy-load. Detects the end-of-list marker.
   * Reports progress via the onProgress callback each round.
   */
  async function scrollResults(panel, onProgress, maxRounds = 40) {
    let lastCount = 0;
    let stableRounds = 0;
    const STABLE_BEFORE_STOP = 3;
    const WAIT_MS = 1200;

    for (let i = 0; i < maxRounds; i++) {
      const items = panel.querySelectorAll('a[href*="/maps/place/"]');
      const count = items.length;

      if (onProgress) onProgress(count);

      // Early stop: no new items for N rounds
      if (count === lastCount) {
        stableRounds++;
        if (stableRounds >= STABLE_BEFORE_STOP) break;
      } else {
        stableRounds = 0;
      }
      lastCount = count;

      // Early stop: Google says we've reached the end
      if (findEndMarker()) {
        log("end marker detected, stopping scroll");
        break;
      }

      // Trigger Google's lazy-load three different ways
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

    // Website (mandatory for email enrichment)
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

    // Location from card text
    const text = (card.innerText || card.textContent || "").trim();
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

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

  function readQuery() {
    const input = document.querySelector('input#searchboxinput, input[aria-label*="Search"]');
    if (input && input.value) return input.value;
    return document.title.replace(" - Google Maps", "").trim();
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
          "max-width:340px",
          "padding:14px 18px",
          "background:linear-gradient(180deg,rgba(11,13,22,0.96),rgba(10,12,18,0.96))",
          "border:1px solid rgba(134,229,255,0.25)",
          "border-radius:16px",
          "box-shadow:0 20px 40px -12px rgba(0,0,0,0.6),0 0 40px -8px rgba(134,229,255,0.25)",
          "color:#ededf0",
          "font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif",
          "font-size:13px",
          "line-height:1.45",
          "backdrop-filter:blur(16px)",
          "-webkit-backdrop-filter:blur(16px)",
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

  // ─────────── Main scrape ───────────

  async function scrapeMaps(sentWebsites, { withOverlay = false } = {}) {
    log("scrape requested");
    const panel = findResultsPanel();
    if (!panel) {
      if (withOverlay) showOverlay("No results panel found. Run a Maps search first.", "error");
      return {
        ok: false,
        error:
          "No results panel found. Make sure you're on a search results page (not a single business detail).",
      };
    }

    if (withOverlay) showOverlay("Scraping Maps · 0 found");

    const finalCount = await scrollResults(panel, (count) => {
      if (withOverlay) showOverlay(`Scraping Maps · ${count} found`);
    });

    log("scrolled to", finalCount, "results");

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

    log(
      "extracted leads:",
      leads.length,
      "dropped (no website):",
      droppedNoWebsite,
      "duplicates skipped:",
      duplicates
    );

    if (withOverlay) {
      showOverlay(`Scraped ${leads.length} new · syncing to dashboard…`, "active");
    }

    return {
      ok: true,
      query: readQuery(),
      leads,
      droppedNoWebsite,
      duplicates,
    };
  }

  // ─────────── Auto-scrape on page load ───────────

  async function checkAutoScrape() {
    const stored = await chrome.storage.local.get(["pendingAutoScrape", "sentWebsites"]);
    const flag = stored.pendingAutoScrape;
    if (!flag || !flag.timestamp) return;

    // Only trigger if the flag is fresh (< 3 minutes old)
    const age = Date.now() - flag.timestamp;
    if (age > 3 * 60 * 1000) {
      chrome.storage.local.remove(["pendingAutoScrape"]);
      return;
    }

    log("auto-scrape flag detected, waiting 4s for Maps to render…");
    showOverlay("Maps loaded · waiting for results to render…");

    // Clear flag immediately so a page reload doesn't re-trigger
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
      showOverlay(
        `No new leads (${result.duplicates ?? 0} dedup, ${result.droppedNoWebsite ?? 0} without website)`,
        "error"
      );
      hideOverlay(6000);
      return;
    }

    // Forward to background.js to POST
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
      showOverlay(
        `✓ ${syncResult.added} with email · ${syncResult.droppedNoEmail || 0} dropped`,
        "success"
      );
      hideOverlay(8000);

      // Update sent websites cache
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
    // Already loaded — Maps SPA loads content lazily so give it a tick
    setTimeout(() => checkAutoScrape(), 500);
  }

  log("content script loaded v3 (auto-scrape + overlay + better scroll)");
})();
