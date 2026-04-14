/* Brandivibe Maps Scraper — background service worker
   ─────────────────────────────────────────────────────
   Forwards lead batches from the popup to the Brandivibe dashboard
   via POST /api/leads/ingest.

   The shared secret lives in chrome.storage.local under "ingestSecret".
   Set it once via the popup options or by running the snippet below
   in the extension's service worker DevTools:

     chrome.storage.local.set({
       ingestSecret: "YOUR_BRAIN_CRON_SECRET",
       endpoint: "https://brandivibe.com/api/leads/ingest"
     });

   Defaults bake in the production endpoint and a dev placeholder.
*/

const DEFAULT_ENDPOINT = "https://brandivibe.com/api/leads/ingest";

async function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["ingestSecret", "endpoint"], (result) => {
      resolve({
        endpoint: result.endpoint || DEFAULT_ENDPOINT,
        secret: result.ingestSecret || "",
      });
    });
  });
}

async function ingestLeads({ query, leads }) {
  const { endpoint, secret } = await getConfig();
  if (!leads || leads.length === 0) {
    return { ok: false, error: "No leads to send" };
  }

  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-leads-secret": secret,
      },
      body: JSON.stringify({ query, leads }),
    });
  } catch (err) {
    return { ok: false, error: `Network error: ${err.message || err}` };
  }

  let body = {};
  try {
    body = await res.json();
  } catch {
    // Non-JSON response, fall through
  }

  if (!res.ok) {
    return {
      ok: false,
      error: body?.error || `Dashboard returned HTTP ${res.status}`,
    };
  }

  return {
    ok: true,
    added: body.added ?? 0,
    deduped: body.deduped ?? 0,
    query: body.query ?? query,
  };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.action === "ingestLeads") {
    ingestLeads(msg)
      .then((result) => sendResponse(result))
      .catch((err) => sendResponse({ ok: false, error: String(err?.message || err) }));
    return true; // async response
  }
});

// On install, prompt the user to set their secret if it's not already there.
chrome.runtime.onInstalled.addListener(async () => {
  const { secret } = await getConfig();
  if (!secret) {
    console.log(
      "%c[Brandivibe] Set your ingest secret with:\n%cchrome.storage.local.set({ ingestSecret: 'YOUR_BRAIN_CRON_SECRET' })",
      "color:#86e5ff;font-weight:bold",
      "color:#fff"
    );
  }
});
