import React, { useState } from 'react';
import { Calendar as CalendarIcon, Sun, CloudRain, Snowflake, Leaf, Bell } from 'lucide-react';
import { SEASONAL_CALENDAR } from '../data/products';

export const SeasonalCalendar: React.FC = () => {
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(2); // Default to Autumn
  const activeSeason = SEASONAL_CALENDAR[activeSeasonIdx];

  const seasonIcons = [
    <Leaf key="spring" className="w-4 h-4 text-emerald-700" />,
    <Sun key="summer" className="w-4 h-4 text-amber-600" />,
    <CloudRain key="autumn" className="w-4 h-4 text-amber-800" />,
    <Snowflake key="winter" className="w-4 h-4 text-blue-700" />,
  ];

  return (
    <section id="calendar" className="py-16 lg:py-24 bg-[#F4EFE6]/70 border-t border-[#E6DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">
              <span>Seasonal Transparency</span>
              <span aria-hidden="true">·</span>
              <span>Year-Round Harvest Rotation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3523] tracking-tight">
              What’s Growing in the Valley
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              We farm with nature’s true seasons rather than artificially heating commercial greenhouses. Here is what is in peak harvest, transitioning, or resting.
            </p>
          </div>

          {/* Season Segmented Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl">
            {SEASONAL_CALENDAR.map((item, idx) => {
              const nameOnly = item.season.split(' ')[0];
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSeasonIdx(idx)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all ${
                    activeSeasonIdx === idx
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {seasonIcons[idx]}
                  <span>{nameOnly}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar Display Card */}
        <div className="bg-[#FBF9F5] rounded-2xl border border-[#E6DFD3] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h3 className="font-serif font-bold text-2xl text-stone-900">
                {activeSeason.season}
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Status: <span className="font-semibold text-emerald-900">{activeSeason.status}</span>
              </p>
            </div>
            <div className="text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
              Harvested in morning coastal microclimate
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Crops list (7 cols) */}
            <div className="md:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-3">
                Peak Field Crops Available:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeSeason.crops.map((crop, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 font-medium flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
                    <span>{crop}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-600 leading-relaxed">
                <strong className="text-stone-900 font-medium">Farm Activity: </strong>
                {activeSeason.farmFocus}
              </div>
            </div>

            {/* Field Guide Tip (5 cols) */}
            <div className="md:col-span-5 bg-[#F4EFE6] p-5 rounded-xl border border-stone-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1B3523]">
                <Bell className="w-4 h-4 text-emerald-800" />
                <span>Next Seasonal Transition Alert</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Want to know when winter sweet brassicas or spring wild ramps become harvestable? Join our weekly harvest text &amp; email dispatch.
              </p>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you! You are subscribed to our seasonal harvest drops.');
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#1B3523] text-white text-xs font-medium rounded-lg hover:bg-[#122418] transition-colors whitespace-nowrap"
                >
                  Notify Me
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
