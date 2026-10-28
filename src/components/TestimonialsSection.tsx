import React from 'react';
import { Quote, Star, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#F4EFE6]/60 border-t border-[#E6DFD3]" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B3523] mb-3">
            <span>Verified Customer &amp; Household Feedback</span>
            <span aria-hidden="true">·</span>
            <span>Balas, Bacolor, Pampanga</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3523] tracking-tight">
            Trusted by Cooks, Families &amp; Households
          </h2>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-1.5 bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#E6DFD3]">
              <span className="font-semibold text-stone-900 flex items-center gap-1">
                <span className="text-[#4285F4] font-bold">G</span>
                <span className="text-[#EA4335] font-bold">o</span>
                <span className="text-[#FBBC05] font-bold">o</span>
                <span className="text-[#4285F4] font-bold">g</span>
                <span className="text-[#34A853] font-bold">l</span>
                <span className="text-[#EA4335] font-bold">e</span>
                <span className="text-stone-800 ml-1">5.0</span>
              </span>
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-stone-500">· Google Reviews</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#E6DFD3]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-stone-700 font-medium">Verified Household Customers</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#E6DFD3]">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-stone-700 font-medium">Household Customer: Angie</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 lg:gap-8">
          {TESTIMONIALS.map((t) => {
            const isGoogle = t.source === 'google';

            return (
              <div
                key={t.id}
                className="bg-[#FBF9F5] p-7 sm:p-8 rounded-2xl border border-[#E6DFD3] flex flex-col justify-between shadow-xs hover:border-[#1B3523]/30 transition-colors"
              >
                <div>
                  {/* Card Header Badge & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200/60">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {isGoogle ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-white px-2.5 py-0.5 rounded-full border border-stone-200 shadow-2xs">
                        <span className="text-[#4285F4] font-bold">G</span>
                        <span>Google Review</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span>{t.badge || 'Household Customer'}</span>
                      </span>
                    )}
                  </div>

                  {/* Quote Body */}
                  <div className="relative">
                    <Quote className="w-7 h-7 text-[#1B3523]/15 mb-2 -ml-1" />
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-serif italic">
                      “{t.quote}”
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm text-white ${
                    isGoogle ? 'bg-[#1B3523]' : 'bg-[#3A5A40]'
                  }`}>
                    {t.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-stone-900">{t.name}</p>
                    <p className="text-[11px] text-stone-600 font-medium">
                      {t.role}
                    </p>
                    <p className="text-[10px] text-stone-500">
                      {t.organization}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiet footer reassurance */}
        <div className="mt-12 text-center text-xs text-stone-500">
          Fresh morning harvests delivered direct from Balas, Bacolor to local restaurants, culinary chefs, and households across Pampanga.
        </div>

      </div>
    </section>
  );
};
