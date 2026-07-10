"use client";

import { motion } from "framer-motion";

const codeHtml = `<span class="k-com">// Define tools as normal TypeScript functions</span>
<span class="k-kw">import</span> { <span class="k-fn">defineAgent</span>, <span class="k-fn">tool</span> } <span class="k-kw">from</span> <span class="k-str">"@neuron/sdk"</span>;

<span class="k-kw">const</span> <span class="k-var">searchWeb</span> = <span class="k-fn">tool</span>({
  <span class="k-var">name</span>: <span class="k-str">"search_web"</span>,
  <span class="k-var">description</span>: <span class="k-str">"Search the public web"</span>,
  <span class="k-fn">execute</span>: <span class="k-kw">async</span> ({ <span class="k-var">query</span> }) =&gt; {
    <span class="k-kw">return await</span> <span class="k-fn">fetch</span>(\`https://api.neuron.ai/search?q=\${<span class="k-var">query</span>}\`);
  },
});

<span class="k-kw">export default</span> <span class="k-fn">defineAgent</span>({
  <span class="k-var">model</span>: <span class="k-str">"claude-sonnet-4.6"</span>,
  <span class="k-var">tools</span>: [<span class="k-var">searchWeb</span>],
  <span class="k-var">maxSteps</span>: <span class="k-num">10</span>,
});`;

const outputHtml = `<span class="k-str">✓</span> Compiling agent.ts
<span class="k-str">✓</span> Generating tool manifest
<span class="k-str">✓</span> Uploading to 312 edge nodes
<span class="k-str">✓</span> Live at <span class="k-fn">https://api.neuron.ai/v1/agents/web-search</span>
<span class="k-com">•</span> p95 latency: <span class="k-num">47ms</span> · region: global`;

export function CodeDemo() {
  return (
    <section id="code" className="py-32 px-6 lg:px-8 bg-white border-y border-border-soft">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <div className="text-xs font-mono text-[#0369a1] uppercase tracking-widest mb-4">
              DX · 03
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-balance">
              From zero to agent
              <br />
              <span className="italic text-foreground-muted">in eight lines.</span>
            </h2>
            <p className="mt-6 text-lg text-foreground-muted leading-relaxed">
              Define tools as functions, compose them into an agent, and deploy
              with a single command. No YAML, no prompt files to manage.
            </p>
            <div className="mt-8 space-y-3 text-sm text-foreground-muted">
              {[
                "Type-safe tool signatures auto-generated from your code",
                "Built-in retries, fallbacks, and token budget management",
                "Deploy to production with `neuron deploy`",
              ].map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1 h-1 rounded-full bg-[#0369a1] flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="code-block rounded-2xl overflow-hidden elevated">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-soft bg-[#fafafa]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]/40" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]/40" />
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]/40" />
                </div>
                <div className="text-xs text-foreground-soft font-mono">agent.ts</div>
                <div className="text-xs text-foreground-soft font-mono">TS</div>
              </div>
              <pre
                className="p-6 text-[13px] leading-relaxed overflow-x-auto whitespace-pre"
                dangerouslySetInnerHTML={{ __html: codeHtml }}
              />
            </div>

            <div className="mt-4 code-block rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border-soft bg-[#fafafa] flex items-center justify-between">
                <span className="text-xs text-foreground-soft font-mono">→ neuron deploy</span>
                <span className="text-xs text-[#059669] font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                  running
                </span>
              </div>
              <pre
                className="p-5 text-[12px] leading-relaxed text-foreground-muted whitespace-pre"
                dangerouslySetInnerHTML={{ __html: outputHtml }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
