/* Brandivibe Maps Scraper — popup controller v3
   ───────────────────────────────────────────────
   Fully auto-populated form via countriesnow.space API:
   - Industry: bundled static list (data.js)
   - Country: bundled static list (data.js)
   - State: fetched from API on country change, cached locally
   - City: fetched from API on state change, cached locally

   Every dropdown is a real <select> — no more free-text fallback.
   Caching in chrome.storage.local avoids re-fetching known countries.

   API: https://countriesnow.space — free, no key, unlimited.
*/

const $ = (id) => document.getElementById(id);

const els = {
  selCategory: $("selCategory"),
  selCountry: $("selCountry"),
  selState: $("selState"),
  selCity: $("selCity"),
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

const API_BASE = "https://countriesnow.space/api/v0.1";
const CACHE_KEY_STATES = "statesCache";
const CACHE_KEY_CITIES = "citiesCache";

// ─────────── Cache helpers ───────────

async function getCache(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (res) => resolve(res[key] || {}));
  });
}

async function setCache(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

// ─────────── API fetchers ───────────

async function fetchStatesForCountry(country) {
  if (!country) return [];

  // Check cache first
  const cache = await getCache(CACHE_KEY_STATES);
  if (cache[country]) {
    return cache[country];
  }

  // Fall back to bundled static data if available
  if (typeof STATES_BY_COUNTRY !== "undefined" && STATES_BY_COUNTRY[country]) {
    const states = STATES_BY_COUNTRY[country];
    cache[country] = states;
    await setCache(CACHE_KEY_STATES, cache);
    return states;
  }

  // Fetch from API
  try {
    const res = await fetch(`${API_BASE}/countries/states`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });
    if (!res.ok) throw new Error(`states ${res.status}`);
    const json = await res.json();
    const statesArr = (json?.data?.states || []).map((s) => s.name).filter(Boolean);
    cache[country] = statesArr;
    await setCache(CACHE_KEY_STATES, cache);
    return statesArr;
  } catch (err) {
    console.error("[Brandivibe] fetchStates failed:", err);
    return [];
  }
}

async function fetchCitiesForState(country, state) {
  if (!country || !state) return [];

  const cacheKey = `${country}|${state}`;

  // Check cache first
  const cache = await getCache(CACHE_KEY_CITIES);
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // Fall back to bundled static data
  if (typeof CITIES_BY_STATE_KEY !== "undefined" && CITIES_BY_STATE_KEY[cacheKey]) {
    const cities = CITIES_BY_STATE_KEY[cacheKey];
    cache[cacheKey] = cities;
    await setCache(CACHE_KEY_CITIES, cache);
    return cities;
  }

  // Fetch from API
  try {
    const res = await fetch(`${API_BASE}/countries/state/cities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state }),
    });
    if (!res.ok) throw new Error(`cities ${res.status}`);
    const json = await res.json();
    const citiesArr = (json?.data || []).filter(Boolean);
    cache[cacheKey] = citiesArr;
    await setCache(CACHE_KEY_CITIES, cache);
    return citiesArr;
  } catch (err) {
    console.error("[Brandivibe] fetchCities failed:", err);
    return [];
  }
}

// ─────────── Dropdown populators ───────────

function populateStaticDropdowns() {
  for (const cat of BUSINESS_CATEGORIES) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    els.selCategory.appendChild(opt);
  }
  for (const country of COUNTRIES) {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    els.selCountry.appendChild(opt);
  }
}

function fillSelect(selectEl, items, placeholder) {
  selectEl.innerHTML = "";
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = placeholder;
  selectEl.appendChild(blank);
  for (const item of items) {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    selectEl.appendChild(opt);
  }
}

async function loadStatesForSelectedCountry() {
  const country = els.selCountry.value;
  if (!country) {
    fillSelect(els.selState, [], "— pick a country first —");
    els.selState.disabled = true;
    fillSelect(els.selCity, [], "— pick a state first —");
    els.selCity.disabled = true;
    return;
  }

  fillSelect(els.selState, [], "Loading states…");
  els.selState.disabled = true;

  const states = await fetchStatesForCountry(country);

  if (states.length === 0) {
    fillSelect(els.selState, [], "No states found for this country");
    els.selState.disabled = true;
  } else {
    fillSelect(els.selState, states, "— pick a state —");
    els.selState.disabled = false;
  }

  fillSelect(els.selCity, [], "— pick a state first —");
  els.selCity.disabled = true;
}

async function loadCitiesForSelectedState() {
  const country = els.selCountry.value;
  const state = els.selState.value;
  if (!country || !state) {
    fillSelect(els.selCity, [], "— pick a state first —");
    els.selCity.disabled = true;
    return;
  }

  fillSelect(els.selCity, [], "Loading cities…");
  els.selCity.disabled = true;

  const cities = await fetchCitiesForState(country, state);

  if (cities.length === 0) {
    fillSelect(els.selCity, [], "No cities found");
    els.selCity.disabled = true;
  } else {
    fillSelect(els.selCity, cities, "— pick a city —");
    els.selCity.disabled = false;
  }
}

function updateOpenMapsButton() {
  const ready =
    els.selCategory.value &&
    els.selCountry.value &&
    els.selCity.value;
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
  populateStaticDropdowns();
  updateOpenMapsButton();

  chrome.storage.local.get(["lifetimeSynced"], (result) => {
    const n = result.lifetimeSynced || 0;
    els.statSynced.textContent = n.toLocaleString();
  });

  // Restore last form state — fetch cascading data as we go
  chrome.storage.local.get(["lastForm"], async (result) => {
    const last = result.lastForm;
    if (!last) return;
    if (last.category) els.selCategory.value = last.category;
    if (last.country) {
      els.selCountry.value = last.country;
      await loadStatesForSelectedCountry();
      if (last.state) {
        els.selState.value = last.state;
        await loadCitiesForSelectedState();
        if (last.city) {
          els.selCity.value = last.city;
        }
      }
    }
    updateOpenMapsButton();
  });

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

els.selCountry.addEventListener("change", async () => {
  await loadStatesForSelectedCountry();
  updateOpenMapsButton();
  saveFormState();
});

els.selState.addEventListener("change", async () => {
  await loadCitiesForSelectedState();
  updateOpenMapsButton();
  saveFormState();
});

els.selCity.addEventListener("change", () => {
  updateOpenMapsButton();
  saveFormState();
});

function saveFormState() {
  chrome.storage.local.set({
    lastForm: {
      category: els.selCategory.value,
      country: els.selCountry.value,
      state: els.selState.value,
      city: els.selCity.value,
    },
  });
}

// ─────────── Open Maps with search ───────────

els.btnOpenMaps.addEventListener("click", async () => {
  const parts = [
    els.selCategory.value,
    els.selCity.value,
    els.selState.value,
    els.selCountry.value,
  ].filter(Boolean);

  const query = parts.join(" ");
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/`;

  // Set auto-scrape flag so content.js auto-runs on page load (no second click needed)
  await new Promise((resolve) => {
    chrome.storage.local.set(
      { pendingAutoScrape: { query, timestamp: Date.now() } },
      resolve
    );
  });

  await chrome.tabs.create({ url, active: true });
  setStatus(
    "Google Maps opening — auto-scrape will run in a few seconds. Watch the overlay on the Maps page.",
    "success"
  );
});

// ─────────── Scrape button ───────────

els.btnScrape.addEventListener("click", async () => {
  els.btnScrape.disabled = true;
  setStatus("Scraping the results panel…", "active");
  els.btnScrapeLabel.textContent = "Scraping…";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab");

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

    chrome.storage.local.get(["lifetimeSynced"], (result) => {
      const newTotal = (result.lifetimeSynced || 0) + (response.added || 0);
      chrome.storage.local.set({ lifetimeSynced: newTotal });
      els.statSynced.textContent = newTotal.toLocaleString();
    });

    const sentUrls = scrapedLeads.map((l) => (l.website || "").toLowerCase()).filter(Boolean);
    if (sentUrls.length > 0) {
      chrome.storage.local.get(["sentWebsites"], (result) => {
        const existing = new Set(Array.isArray(result.sentWebsites) ? result.sentWebsites : []);
        for (const u of sentUrls) existing.add(u);
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

// ─────────── Reset dedupe ───────────

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
    li.innerHTML = `<strong></strong><small></small>`;
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

init();
