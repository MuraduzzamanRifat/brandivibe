"use client";

import { motion } from "framer-motion";
import { Heart, Stethoscope, FileCheck, Users, Brain, Clock } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Patient-first UX",
    desc: "A calm interface that respects the anxiety of being sick. No flashing buttons, no dark patterns.",
  },
  {
    icon: Stethoscope,
    title: "Evidence-based workflows",
    desc: "Clinical pathways co-designed with 40+ practicing physicians from top academic centers.",
  },
  {
    icon: Brain,
    title: "FDA-cleared AI triage",
    desc: "De novo 510(k) cleared. 96.4% concordance with expert physician triage across 18 specialties.",
  },
  {
    icon: FileCheck,
    title: "Ambient documentation",
    desc: "Notes write themselves during the visit. Providers leave their laptops closed and see the patient.",
  },
  {
    icon: Users,
    title: "Care team routing",
    desc: "Intelligent escalation between MAs, NPs, physicians, and specialists — based on acuity, not availability.",
  },
  {
    icon: Clock,
    title: "Same-day appointments",
    desc: "Average wait time: 47 minutes. Not a typo. Not a premium feature — the default.",
  },
];

export function Features() {
  return (
    <section id="providers" className="relative py-32 px-6 bg-white border-t border-pulse-faint">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-20"
        >
          <div className="text-[11px] font-medium text-pulse-sage uppercase tracking-[0.2em] mb-4">
            FOR PROVIDERS · 02
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-normal tracking-[-0.015em] leading-[1.05] text-balance text-pulse-fg">
            The platform clinicians
            <br />
            <span className="serif-italic text-pulse-sage">actually enjoy using.</span>
          </h2>
          <p className="mt-6 text-lg text-pulse-muted max-w-xl leading-relaxed">
            Built alongside physicians, not against them. Every feature is
            grounded in clinical reality and real workflow research.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card-soft p-7 hover:soft-elevate transition-all bg-white"
            >
              <div className="w-11 h-11 rounded-full bg-[#f0fdfa] border border-[#99f6e4] grid place-items-center mb-5">
                <f.icon className="w-5 h-5 text-pulse-sage" />
              </div>
              <h3 className="font-serif text-xl text-pulse-fg mb-2">{f.title}</h3>
              <p className="text-sm text-pulse-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
