/* Brandivibe Maps Scraper — popup controller v2
   ───────────────────────────────────────────────
   Adds:
   - Category / Country / State / City form that builds a Google Maps
     search URL and opens it in a new tab
   - Dedupe history via chrome.storage.local (sentWebsites)
   - Reset dedupe button in the footer

   Imports BUSINESS_CATEGORIES, COUNTRIES, STATES_BY_COUNTRY from data.js
   (loaded as a separate <script> before this file in popup.html).
*/

const $ = (id) => document.getElementById(id);

const els = {
  selCategory: $("selCategory"),
  selCountry: $("selCountry"),
  selState: $("selState"),
  inpState: $("inpState"),
  inpCity: $("inpCity"),
  cityList: $("cityList"),
  btnOpenMaps: $("btnOpenMaps"),

  btnScrape: $("btnScrape"),
  btnScrapeLabel: $("btnScrapeLabel"),
  btnSync: $("btnSync"),
  status: $("status"),
  statusText: $("statusText"),
  preview: $("preview"),
  statFound: $("statFound"),
  statSynced: $("statSynced"),

  btnResetDedupe: $("btnResetDedupe"),
};

let scrapedLeads = [];
let scrapeQuery = "";

// ─────────── Populate dropdowns ───────────

function populateDropdowns() {
  // Categories
  for (const cat of BUSINESS_CATEGORIES) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    els.selCategory.appendChild(opt);
  }

  // Countries
  for (const country of COUNTRIES) {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    els.selCountry.appendChild(opt);
  }
}

function updateStateField() {
  const country = els.selCountry.value;
  const states = STATES_BY_COUNTRY[country];

  // Clear current state dropdown + text
  els.selState.innerHTML = '<option value="">— pick a state —</option>';
  els.inpState.value = "";

  if (states) {
    // Use dropdown for known countries
    for (const st of states) {
      const opt = document.createElement("option");
      opt.value = st;
      opt.textContent = st;
      els.selState.appendChild(opt);
    }
    els.selState.classList.remove("hidden-input");
    els.inpState.classList.add("hidden-input");
  } else if (country) {
    // Free-text for other countries
    els.selState.classList.add("hidden-input");
    els.inpState.classList.remove("hidden-input");
  } else {
    els.selState.classList.remove("hidden-input");
    els.inpState.classList.add("hidden-input");
  }
}

/**
 * Rebuild the city datalist based on the current country + state selection.
 * Falls back up the hierarchy:
 *   1. Exact "Country|State" match in CITIES_BY_STATE_KEY
 *   2. Country-level list in CITIES_BY_COUNTRY
 *   3. Empty list — the user types freely, no suggestions
 * The input always stays a free-text <input>, so any city works even if
 * it's not in the suggestion list.
 */
function updateCityList() {
  if (!els.cityList) return;
  const country = els.selCountry.value;
  const state = els.selState.value || els.inpState.value;

  let cities = [];
  if (country && state) {
    const key = `${country}|${state}`;
    cities = CITIES_BY_STATE_KEY[key] || [];
  }
  if (cities.length === 0 && country) {
    cities = CITIES_BY_COUNTRY[country] || [];
  }

  els.cityList.innerHTML = "";
  for (const city of cities) {
    const opt = document.createElement("option");
    opt.value = city;
    els.cityList.appendChild(opt);
  }
}

function updateOpenMapsButton() {
  const ready =
    els.selCategory.value &&
    els.selCountry.value &&
    els.inpCity.value.trim();
  els.btnOpenMaps.disabled = !ready;
}

// ─────────── Status helpers ───────────

function setStatus(text, mode = "idle") {
  els.statusText.textContent = text;
  els.status.classList.remove("is-active", "is-success", "is-error");
  if (mode === "active") els.status.classList.add("is-active");
  if (mode === "success") els.status.classList.add("is-success");
  if (mode === "error") els.status.classList.add("is-error");
}

// ─────────── Init ───────────

async function init() {
  populateDropdowns();
  updateStateField();
  updateCityList();
  updateOpenMapsButton();

  // Restore lifetime synced count
  chrome.storage.local.get(["lifetimeSynced"], (result) => {
    const n = result.lifetimeSynced || 0;
    els.statSynced.textContent = n.toLocaleString();
  });

  // Restore last form selection
  chrome.storage.local.get(["lastForm"], (result) => {
    const last = result.lastForm;
    if (!last) return;
    if (last.category) els.selCategory.value = last.category;
    if (last.country) {
      els.selCountry.value = last.country;
      updateStateField();
      if (last.state) {
        if (STATES_BY_COUNTRY[last.country]) {
          els.selState.value = last.state;
        } else {
          els.inpState.value = last.state;
        }
      }
    }
    if (last.city) els.inpCity.value = last.city;
    updateCityList();
    updateOpenMapsButton();
  });

  // Check if current tab is a Maps page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url && /^https:\/\/(www\.)?google\.com\/maps/.test(tab.url)) {
    setStatus("Ready. Click Scrape this page.", "active");
    els.btnScrape.disabled = false;
  } else {
    setStatus("Fill the form, open Maps, then scrape.", "idle");
    els.btnScrape.disabled = true;
  }
}

// ─────────── Form handlers ───────────

els.selCategory.addEventListener("change", () => {
  updateOpenMapsButton();
  saveFormState();
});
els.selCountry.addEventListener("change", () => {
  updateStateField();
  updateCityList();
  updateOpenMapsButton();
  saveFormState();
});
els.selState.addEventListener("change", () => {
  updateCityList();
  updateOpenMapsButton();
  saveFormState();
});
els.inpState.addEventListener("input", () => {
  updateCityList();
  updateOpenMapsButton();
  saveFormState();
});
els.inpCity.addEventListener("input", () => {
  updateOpenMapsButton();
  saveFormState();
});

function saveFormState() {
  chrome.storage.local.set({
    lastForm: {
      category: els.selCategory.value,
      country: els.selCountry.value,
      state: els.selState.value || els.inpState.value,
      city: els.inpCity.value,
    },
  });
}

// ─────────── Open Maps with search ───────────

els.btnOpenMaps.addEventListener("click", async () => {
  const parts = [
    els.selCategory.value,
    els.inpCity.value.trim(),
    els.selState.value || els.inpState.value,
    els.selCountry.value,
  ].filter(Boolean);

  const query = parts.join(" ");
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/`;

  await chrome.tabs.create({ url, active: true });
  setStatus("Google Maps opened — wait for results then re-click the extension icon.", "active");
});

// ─────────── Scrape button ───────────

els.btnScrape.addEventListener("click", async () => {
  els.btnScrape.disabled = true;
  setStatus("Scraping the results panel…", "active");
  els.btnScrapeLabel.textContent = "Scraping…";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab");

    // Pull dedupe list from storage, pass to content script
    const stored = await chrome.storage.local.get(["sentWebsites"]);
    const sentList = Array.isArray(stored.sentWebsites) ? stored.sentWebsites : [];

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "scrapeMaps",
      sentWebsites: sentList,
    });

    if (!response?.ok) {
      throw new Error(response?.error || "Scrape returned no data");
    }

    scrapedLeads = response.leads || [];
    scrapeQuery = response.query || "";

    const duplicates = response.duplicates ?? 0;
    const noWebsite = response.droppedNoWebsite ?? 0;

    els.statFound.textContent = scrapedLeads.length.toLocaleString();
    renderPreview(scrapedLeads);

    if (scrapedLeads.length === 0) {
      setStatus(
        `No new leads (${duplicates} duplicates, ${noWebsite} without website).`,
        "error"
      );
      els.btnSync.disabled = true;
    } else {
      setStatus(
        `Scraped ${scrapedLeads.length} new leads${duplicates > 0 ? ` (${duplicates} dedup skipped)` : ""}. Ready to sync.`,
        "success"
      );
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
  setStatus(
    `Server is scraping ${scrapedLeads.length} websites for emails… (10-60s)`,
    "active"
  );

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
      `+${response.added} with email · ${response.droppedNoEmail || 0} dropped no-email · ${response.deduped || 0} dedup`,
      "success"
    );

    // Bump lifetime counter
    chrome.storage.local.get(["lifetimeSynced"], (result) => {
      const newTotal = (result.lifetimeSynced || 0) + (response.added || 0);
      chrome.storage.local.set({ lifetimeSynced: newTotal });
      els.statSynced.textContent = newTotal.toLocaleString();
    });

    // Track the websites we just sent so we don't re-send them later
    const sentUrls = scrapedLeads.map((l) => (l.website || "").toLowerCase()).filter(Boolean);
    if (sentUrls.length > 0) {
      chrome.storage.local.get(["sentWebsites"], (result) => {
        const existing = new Set(Array.isArray(result.sentWebsites) ? result.sentWebsites : []);
        for (const u of sentUrls) existing.add(u);
        // Cap at 10k URLs to prevent unbounded growth
        const next = Array.from(existing).slice(-10000);
        chrome.storage.local.set({ sentWebsites: next });
      });
    }

    scrapedLeads = [];
    setTimeout(() => {
      els.statFound.textContent = "0";
      els.preview.innerHTML = "";
      setStatus("Ready for next scrape.", "active");
    }, 3500);
  } catch (err) {
    console.error("[Brandivibe] sync failed:", err);
    setStatus(`Sync failed: ${err.message || err}`, "error");
    els.btnSync.disabled = false;
  }
});

// ─────────── Reset dedupe history ───────────

els.btnResetDedupe.addEventListener("click", (e) => {
  e.preventDefault();
  if (!confirm("Reset dedupe history? Previously-scraped businesses will be scrapable again.")) return;
  chrome.storage.local.remove(["sentWebsites"], () => {
    setStatus("Dedupe history cleared.", "success");
  });
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
    li.innerHTML = `
      <strong></strong>
      <small></small>
    `;
    li.querySelector("strong").textContent = lead.name;
    const meta = [
      lead.website ? safeHostname(lead.website) : "",
      lead.location,
    ]
      .filter(Boolean)
      .join(" · ");
    li.querySelector("small").textContent = meta || "—";
    ul.appendChild(li);
  }
  els.preview.innerHTML = "";
  els.preview.appendChild(ul);
}

function safeHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// ─────────── Go ───────────

init();
