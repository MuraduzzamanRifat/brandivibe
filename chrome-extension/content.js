/* Brandivibe Maps Scraper — content script
   ─────────────────────────────────────────────
   Runs inside google.com/maps tabs. Listens for "scrapeMaps" messages
   from the popup, then scrolls the results panel and parses every
   business card from the live DOM.

   Why a content script (not headless scraping or the Maps API):
   - Uses the user's real Chrome session, real cookies, real IP
   - Google can't fingerprint headless behavior because there is none
   - Free, no proxies, no captcha solving, no API costs
   - Works for any search query the user types in Maps

   The selector strategy is RESILIENT to Google's DOM updates:
     - We don't rely on css class names (those churn weekly)
     - We use ARIA roles + jsaction patterns + data-result-index attrs
     - We extract from aria-label fallback when text is hidden
*/

(() => {
  const log = (...args) => console.log("[Brandivibe Scraper]", ...args);

  // ─────────── Helpers ───────────

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /** Find the scrollable results panel (the left column of search results). */
  function findResultsPanel() {
    // Most resilient: the role="feed" element inside the side panel
    const feed = document.querySelector('[role="feed"]');
    if (feed) return feed;
    // Fallbacks
    const panels = document.querySelectorAll(
      'div[aria-label*="Results"], div[role="main"]'
    );
    for (const p of panels) {
      if (p.scrollHeight > p.clientHeight + 20) return p;
    }
    return null;
  }

  /** Scroll the results panel down until no new items are loaded for N rounds. */
  async function scrollResults(panel, maxRounds = 12) {
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

  /** Extract a place_id from a Google Maps place URL. */
  function placeIdFromUrl(url) {
    if (!url) return undefined;
    const m = url.match(/!1s([^!]+)!/);
    return m ? m[1] : undefined;
  }

  /** Extract lat/lng from a Google Maps place URL. */
  function latLngFromUrl(url) {
    if (!url) return {};
    const m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (!m) return {};
    return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  }

  /** Parse a number with optional comma. "1,234" -> 1234 */
  function parseNum(s) {
    if (!s) return undefined;
    const n = parseFloat(String(s).replace(/[,(]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }

  /** Extract a business card from a single anchor element. */
  function extractCard(anchor) {
    // The result card is the parent container with ARIA label
    let card = anchor;
    for (let i = 0; i < 6 && card.parentElement; i++) {
      card = card.parentElement;
      if (card.getAttribute("jsaction") || card.getAttribute("role") === "article") break;
    }

    const href = anchor.href || "";
    const ariaLabel = anchor.getAttribute("aria-label") || "";
    const placeId = placeIdFromUrl(href);
    const { lat, lng } = latLngFromUrl(href);

    // Name: from aria-label OR from the first line
    const name = ariaLabel.trim() || anchor.textContent.trim().split("\n")[0].trim();
    if (!name) return null;

    // Get the parent card text content for further parsing
    const text = card.innerText || card.textContent || "";

    // Rating + review count: pattern like "4.8(123)" or "4.8 stars 123 Reviews"
    let rating, reviewCount;
    const ratingMatch = text.match(/(\d\.\d)\s*(?:\(([\d,]+)\)|stars?[\s\S]{0,20}?([\d,]+)\s*review)/i);
    if (ratingMatch) {
      rating = parseFloat(ratingMatch[1]);
      reviewCount = parseNum(ratingMatch[2] || ratingMatch[3]);
    }

    // Category: usually the first short word/phrase before the address
    let category;
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    // The category line is short, no digits, comes after the name+rating
    for (const line of lines) {
      if (line === name) continue;
      if (/^\d/.test(line)) continue;
      if (line.length > 0 && line.length < 60 && !/[·•]/.test(line) && !/(Open|Closed|Closes|Opens)/i.test(line)) {
        category = line;
        break;
      }
    }

    // Address: line containing a digit (street number) or comma
    let address;
    for (const line of lines) {
      if (line === name || line === category) continue;
      if (/\d/.test(line) && line.length > 5 && line.length < 200) {
        address = line.replace(/^[·•]\s*/, "").trim();
        break;
      }
    }

    // Phone: pattern that matches international + national formats
    let phone;
    const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,18}\d)/);
    if (phoneMatch) {
      const candidate = phoneMatch[1].replace(/[^\d+\-() ]/g, "").trim();
      // Don't catch ratings or review counts
      if (!/^\d\.\d/.test(candidate)) phone = candidate;
    }

    // Website: an <a> with a non-google href inside the card
    let website;
    const links = card.querySelectorAll('a[href]');
    for (const a of links) {
      const u = a.href;
      if (!u) continue;
      if (u.includes("google.com")) continue;
      if (u.startsWith("http")) {
        website = u;
        break;
      }
    }

    // Hours: line containing "Open" / "Closed" / "Closes" / "Opens"
    let hours;
    for (const line of lines) {
      if (/(open|closed|closes|opens|24 hours)/i.test(line) && line.length < 100) {
        hours = line;
        break;
      }
    }

    return {
      placeId,
      name,
      address,
      phone,
      website,
      category,
      rating,
      reviewCount,
      lat,
      lng,
      hours,
    };
  }

  /** Read the current search query from the search box. */
  function readQuery() {
    const input = document.querySelector('input#searchboxinput, input[aria-label*="Search"]');
    if (input && input.value) return input.value;
    // Fallback: the page title often contains "Query - Google Maps"
    const title = document.title.replace(" - Google Maps", "").trim();
    return title;
  }

  // ─────────── Main scrape ───────────

  async function scrapeMaps() {
    log("scrape requested");
    const panel = findResultsPanel();
    if (!panel) {
      return {
        ok: false,
        error: "No results panel found. Make sure you're on a search results page (not a single business detail).",
      };
    }

    const finalCount = await scrollResults(panel, 12);
    log("scrolled to", finalCount, "results");

    const anchors = Array.from(panel.querySelectorAll('a[href*="/maps/place/"]'));
    log("anchors found:", anchors.length);

    const seen = new Set();
    const leads = [];
    for (const a of anchors) {
      const card = extractCard(a);
      if (!card) continue;
      const key = card.placeId || `${card.name}|${card.address || ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      leads.push(card);
    }

    log("extracted leads:", leads.length);

    return {
      ok: true,
      query: readQuery(),
      leads,
    };
  }

  // ─────────── Message bridge ───────────

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.action === "scrapeMaps") {
      scrapeMaps()
        .then((result) => sendResponse(result))
        .catch((err) => sendResponse({ ok: false, error: String(err?.message || err) }));
      return true; // async response
    }
  });

  log("content script loaded");
})();
