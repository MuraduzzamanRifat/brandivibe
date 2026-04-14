/* Brandivibe Maps Scraper — popup controller
   ─────────────────────────────────────────────
   Orchestrates the user flow:
     1. User clicks "Scrape this page" → message content script → returns leads
     2. Preview leads in the popup, enable "Send to dashboard"
     3. User clicks "Send to dashboard" → message background → POST to API
     4. Show success / error in status line
*/

const $ = (id) => document.getElementById(id);

const els = {
  btnScrape: $("btnScrape"),
  btnScrapeLabel: $("btnScrapeLabel"),
  btnSync: $("btnSync"),
  status: $("status"),
  statusText: $("statusText"),
  preview: $("preview"),
  statFound: $("statFound"),
  statSynced: $("statSynced"),
};

let scrapedLeads = [];
let scrapeQuery = "";

// ─────────── Status helpers ───────────

function setStatus(text, mode = "idle") {
  els.statusText.textContent = text;
  els.status.classList.remove("is-active", "is-success", "is-error");
  if (mode === "active") els.status.classList.add("is-active");
  if (mode === "success") els.status.classList.add("is-success");
  if (mode === "error") els.status.classList.add("is-error");
}

// ─────────── Restore last sync count from storage ───────────

chrome.storage.local.get(["lifetimeSynced"], (result) => {
  const n = result.lifetimeSynced || 0;
  els.statSynced.textContent = n.toLocaleString();
});

// ─────────── Detect if we're on Google Maps ───────────

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url || !/^https:\/\/(www\.)?google\.com\/maps/.test(tab.url)) {
    setStatus("Open Google Maps to begin", "idle");
    els.btnScrape.disabled = true;
    return;
  }
  setStatus("Ready. Search for businesses, then click scrape.", "active");
  els.btnScrape.disabled = false;
})();

// ─────────── Scrape button ───────────

els.btnScrape.addEventListener("click", async () => {
  els.btnScrape.disabled = true;
  setStatus("Scraping the results panel…", "active");
  els.btnScrapeLabel.textContent = "Scraping…";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab");

    const response = await chrome.tabs.sendMessage(tab.id, { action: "scrapeMaps" });
    if (!response?.ok) {
      throw new Error(response?.error || "Scrape returned no data");
    }

    scrapedLeads = response.leads || [];
    scrapeQuery = response.query || "";

    els.statFound.textContent = scrapedLeads.length.toLocaleString();
    renderPreview(scrapedLeads);

    if (scrapedLeads.length === 0) {
      setStatus("No leads found. Scroll the results panel and try again.", "error");
      els.btnSync.disabled = true;
    } else {
      setStatus(`Scraped ${scrapedLeads.length} leads. Ready to sync.`, "success");
      els.btnSync.disabled = false;
    }
  } catch (err) {
    console.error("[Brandivibe] scrape failed:", err);
    setStatus(`Scrape failed: ${err.message || err}`, "error");
    els.btnSync.disabled = true;
  } finally {
    els.btnScrape.disabled = false;
    els.btnScrapeLabel.textContent = "Scrape this page";
  }
});

// ─────────── Sync button ───────────

els.btnSync.addEventListener("click", async () => {
  if (scrapedLeads.length === 0) return;
  els.btnSync.disabled = true;
  setStatus(`Syncing ${scrapedLeads.length} leads to dashboard…`, "active");

  try {
    const response = await chrome.runtime.sendMessage({
      action: "ingestLeads",
      query: scrapeQuery,
      leads: scrapedLeads,
    });

    if (!response?.ok) {
      throw new Error(response?.error || "Dashboard returned an error");
    }

    setStatus(
      `Synced. +${response.added} new, ${response.deduped} dedup`,
      "success"
    );

    // Bump lifetime counter
    chrome.storage.local.get(["lifetimeSynced"], (result) => {
      const newTotal = (result.lifetimeSynced || 0) + (response.added || 0);
      chrome.storage.local.set({ lifetimeSynced: newTotal });
      els.statSynced.textContent = newTotal.toLocaleString();
    });

    // Clear the local scrape so the user can capture another page
    scrapedLeads = [];
    setTimeout(() => {
      els.statFound.textContent = "0";
      els.preview.innerHTML = "";
      setStatus("Ready for next scrape.", "active");
    }, 2400);
  } catch (err) {
    console.error("[Brandivibe] sync failed:", err);
    setStatus(`Sync failed: ${err.message || err}`, "error");
    els.btnSync.disabled = false;
  }
});

// ─────────── Preview renderer ───────────

function renderPreview(leads) {
  if (leads.length === 0) {
    els.preview.innerHTML = "";
    return;
  }
  const ul = document.createElement("ul");
  ul.className = "preview-list";
  for (const lead of leads.slice(0, 30)) {
    const li = document.createElement("li");
    li.className = "preview-item";
    const meta = [lead.category, lead.address].filter(Boolean).join(" · ");
    li.innerHTML = `
      <strong></strong>
      <small></small>
    `;
    li.querySelector("strong").textContent = lead.name;
    li.querySelector("small").textContent = meta || "—";
    ul.appendChild(li);
  }
  els.preview.innerHTML = "";
  els.preview.appendChild(ul);
}
