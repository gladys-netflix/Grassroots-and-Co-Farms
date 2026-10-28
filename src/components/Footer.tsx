import React, { useState } from 'react';
import { Sprout, MapPin, Mail, Phone, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenTour: () => void;
  onOpenAnalytics?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTour, onOpenAnalytics }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1B3523] text-stone-300 border-t border-emerald-950/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Mission: 4 cols */}
          <div className="lg:col-span-4 space-y-4">
            <Logo inverted={true} className="h-11 sm:h-12" />
            <p className="text-xs text-amber-200/90 font-medium tracking-wide uppercase mt-1">
              Rooted Consciously
            </p>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Cultivating living soils, fresh heirloom vegetables, and human-scale agriculture across 7 hectares in Balas, Bacolor, Pampanga. Delivering sunrise-harvested produce straight from our fields to your table.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p>7 Hectares Family-Owned Organic Farm · Balas, Bacolor, Pampanga</p>
              <p>Natural Soil Regeneration &amp; Zero Synthetic Inputs</p>
            </div>
          </div>

          {/* Quick Nav: 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Farm &amp; Shop
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#shop" className="hover:text-white transition-colors">Today's Produce</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">Living Soil Practice</a>
              </li>
              <li>
                <a href="#calendar" className="hover:text-white transition-colors">Crop Calendar</a>
              </li>
              <li>
                <a href="#recipes" className="hover:text-white transition-colors">Kitchen Recipes</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">Customer &amp; Google Reviews</a>
              </li>
              {onOpenAnalytics && (
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenAnalytics}
                    className="text-amber-300 hover:text-amber-200 transition-colors font-medium cursor-pointer flex items-center gap-1"
                  >
                    <span>📊 Website Traffic &amp; Visits</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Farmstand & Hours: 3 cols */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Visit The Farm
            </h4>
            <div className="text-xs text-stone-300 space-y-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  2HWQ+MV4, Balas, Bacolor, Pampanga
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Farm Gate: Tue – Sun, 7:00 AM – 4:00 PM</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Farm Hotline / Inquiries Available</span>
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenTour}
                className="text-xs text-emerald-300 hover:text-white underline underline-offset-4"
              >
                Schedule Farm Tour &amp; Tasting
              </button>
            </div>
          </div>

          {/* Harvest Drop Newsletter: 3 cols */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Weekly Harvest Drops
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Get notified the evening before harvest when rare heirlooms and fresh honey become available.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-3 py-2 text-xs bg-emerald-950/60 border border-emerald-900 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="w-full py-2 bg-stone-100 hover:bg-white text-stone-900 text-xs font-semibold rounded-lg transition-colors"
              >
                {subscribed ? 'Subscribed!' : 'Join Harvest List'}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Quiet Copyright & Standards */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Grassroots &amp; Co. Family-Owned Farm. All rights reserved.</p>
          <div className="flex items-center gap-4 text-stone-400">
            {onOpenAnalytics && (
              <button
                type="button"
                onClick={onOpenAnalytics}
                className="hover:text-amber-300 transition-colors underline underline-offset-2 cursor-pointer"
              >
                Owner Analytics
              </button>
            )}
            <span>Non-GMO Lineages</span>
            <span aria-hidden="true">·</span>
            <span>Salmon-Safe Watershed</span>
            <span aria-hidden="true">·</span>
            <span>Zero Synthetic Inputs</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
