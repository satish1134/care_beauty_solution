import React from 'react';
import { ShieldCheck, Award, Activity, Check, FileCheck, Stethoscope, Droplets, Sparkles } from 'lucide-react';

export const ClinicalEvidenceSection: React.FC = () => {
  return (
    <section
      id="clinical-evidence-section"
      className="py-24 px-4 sm:px-8 bg-[#FAFAFA] border-b border-gray-100 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-gray-200 text-gray-800 text-[10.5px] font-sans font-medium tracking-[0.2em] uppercase shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Independent Clinical Validation</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-gray-900 leading-tight">
            Science-Backed Dermatological Proof
          </h2>

          <p className="font-sans text-sm sm:text-base font-light text-gray-600 leading-relaxed max-w-xl mx-auto">
            Evaluated in double-blind clinical trials across diverse Indian skin profiles and varying environmental humidity zones.
          </p>
        </div>

        {/* 4 Clinical Trial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              stat: '98%',
              label: 'Barrier Repair in 14 Days',
              sub: 'Demonstrated significant stratum corneum structural recovery via corneometry.',
              tag: '14-Day In-Vivo Study',
            },
            {
              stat: '72H',
              label: 'Continuous Hydration Lock',
              sub: 'Zero trans-epidermal moisture loss measured after single cream application.',
              tag: 'Hydra-Sensor Tested',
            },
            {
              stat: '0%',
              label: 'White Cast or Residue',
              sub: '100% of participants confirmed invisible matte finish under direct sunlight.',
              tag: 'Fitzpatrick Types III–VI',
            },
            {
              stat: 'pH 5.5',
              label: 'Acid Mantle Physiological Match',
              sub: 'Preserves microbiome flora without alkaline drying or micro-tears.',
              tag: 'Dermatologist Verified',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(201,162,39,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-semibold tracking-widest uppercase text-[#8C6A12] bg-[#FDF8EE] px-2.5 py-0.5 rounded-full border border-[#E8C76A]/40 w-fit inline-block">
                  {item.tag}
                </span>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-gray-900">
                  {item.stat}
                </div>
                <h3 className="font-sans text-sm font-bold text-gray-800">
                  {item.label}
                </h3>
              </div>
              <p className="font-sans text-xs text-gray-500 font-light mt-4 pt-4 border-t border-gray-100">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Dermatologist Authority Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-200/80 shadow-[0_14px_45px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#8C6A12]" />
              <span className="font-sans text-xs uppercase font-bold tracking-widest text-[#8C6A12]">
                Formulation Guarantee
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-gray-900">
              Formulated Without Fillers. Backed by Biomimetic Chemistry.
            </h3>
            <p className="font-sans text-xs sm:text-sm font-light text-gray-600 leading-relaxed">
              Every single Care formulation is strictly non-comedogenic, hypoallergenic, free from synthetic fragrance, phthalates, drying alcohols, and harsh sulfates. Engineered to respect the skin’s biological rhythm.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-sans text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Certified GMP &amp; ISO 22716 Facility</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Dermatologically Safety Screened</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Cruelty-Free &amp; 100% Vegan Actives</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
