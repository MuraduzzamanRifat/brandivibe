/* Brandivibe Maps Scraper — content script (v2, narrow)
   ─────────────────────────────────────────────────────
   Runs inside google.com/maps tabs. Listens for "scrapeMaps" messages
   from the popup, scrolls the results panel, and parses every business
   card from the live DOM.

   Fields collected per business (only 4):
     - name      (mandatory — drop if missing)
     - website   (mandatory — drop if missing, server needs it for email enrichment)
     - location  (address, optional)

   Email is intentionally NOT scraped here. Google Maps doesn't expose
   business emails in the listing card. Instead, the server-side ingest
   endpoint takes the website URL we send and runs its own scraper to
   extract emails from the live HTML before storing the lead.

   Selector strategy — resilient to Google's CSS class churn:
     - role="feed" element for the results panel
     - a[href*="/maps/place/"] for individual business cards
     - aria-label for business names
     - first non-google.com <a href> in the card for the website
*/

(() => {
  const log = (...args) => console.log("[Brandivibe Scraper]", ...args);

  // ─────────── Helpers ───────────

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /** Find the scrollable results panel (the left column of search results). */
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

  /** Scroll the results panel down until no new items are loaded for N rounds. */
  async function scrollResults(panel, maxRounds = 14) {
    let lastCount = 0;
    let stableRounds = 0;
    for (let i = 0; i < maxRounds; i++) {
      panel.scrollTop = panel.scrollHeight;
      await sleep(900);
      const items = panel.querySelectorAll('a[href*="/maps/place/"]');
      const count = items.length;
      if (count === lastCount) {
        stableRounds++;
        if (stableRounds >= 2) break;
      } else {
        stableRounds = 0;
      }
      lastCount = count;
    }
    return lastCount;
  }

  /** Walk up from the anchor to find the enclosing card container. */
  function findCardContainer(anchor) {
    let card = anchor;
    for (let i = 0; i < 6 && card.parentElement; i++) {
      card = card.parentElement;
      if (card.getAttribute("jsaction") || card.getAttribute("role") === "article") break;
    }
    return card;
  }

  /**
   * Extract the 4 fields we need from a single business card.
   * Returns null if mandatory fields (name, website) are missing.
   */
  function extractCard(anchor) {
    const card = findCardContainer(anchor);
    const ariaLabel = anchor.getAttribute("aria-label") || "";

    // ─── name (mandatory) ───
    const name = ariaLabel.trim() || anchor.textContent.trim().split("\n")[0].trim();
    if (!name) return null;

    // ─── website (mandatory) ───
    // The first <a> inside the card whose href is NOT google.com is the business website
    let website = "";
    const links = card.querySelectorAll('a[href]');
    for (const a of links) {
      const u = a.href;
      if (!u || !u.startsWith("http")) continue;
      if (u.includes("google.com")) continue;
      if (u.includes("googleusercontent.com")) continue;
      // Skip image / asset URLs
      if (/\.(jpg|jpeg|png|gif|svg|webp|ico)(\?|$)/i.test(u)) continue;
      website = u;
      break;
    }
    if (!website) return null;

    // ─── location (optional, helpful) ───
    // Address heuristic: text line containing a digit + comma OR street suffixes
    const text = (card.innerText || card.textContent || "").trim();
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    let location = "";
    for (const line of lines) {
      if (line === name) continue;
      // Skip rating-like lines: "4.8(123)" / "4.5 stars"
      if (/^\d\.\d/.test(line)) continue;
      // Skip phone-like lines (mostly digits)
      if (/^[\d\s().+-]+$/.test(line)) continue;
      // Look for an address signal: digit + comma, or street word
      if (
        /\d/.test(line) &&
        line.length > 5 &&
        line.length < 200 &&
        /[a-z]/i.test(line)
      ) {
        location = line.replace(/^[·•]\s*/, "").trim();
        break;
      }
    }

    return { name, website, location };
  }

  /** Read the current search query from the search box. */
  function readQuery() {
    const input = document.querySelector('input#searchboxinput, input[aria-label*="Search"]');
    if (input && input.value) return input.value;
    return document.title.replace(" - Google Maps", "").trim();
  }

  // ─────────── Main scrape ───────────

  async function scrapeMaps() {
    log("scrape requested");
    const panel = findResultsPanel();
    if (!panel) {
      return {
        ok: false,
        error:
          "No results panel found. Make sure you're on a search results page (not a single business detail).",
      };
    }

    const finalCount = await scrollResults(panel, 14);
    log("scrolled to", finalCount, "results");

    const anchors = Array.from(panel.querySelectorAll('a[href*="/maps/place/"]'));
    log("anchors found:", anchors.length);

    const seen = new Set();
    const leads = [];
    let droppedNoWebsite = 0;
    for (const a of anchors) {
      const card = extractCard(a);
      if (!card) {
        droppedNoWebsite++;
        continue;
      }
      const key = `${card.name}|${card.website}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      leads.push(card);
    }

    log("extracted leads with website:", leads.length, "dropped (no website):", droppedNoWebsite);

    return {
      ok: true,
      query: readQuery(),
      leads,
      droppedNoWebsite,
    };
  }

  // ─────────── Message bridge ───────────

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.action === "scrapeMaps") {
      scrapeMaps()
        .then((result) => sendResponse(result))
        .catch((err) =>
          sendResponse({ ok: false, error: String(err?.message || err) })
        );
      return true; // async response
    }
  });

  log("content script loaded (v2 narrow: name + website + location)");
})();
