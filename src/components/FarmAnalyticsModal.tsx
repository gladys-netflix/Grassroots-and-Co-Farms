import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  Users,
  Eye,
  ShoppingBag,
  Smartphone,
  Monitor,
  Share2,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import {
  getStoredAnalytics,
  AnalyticsStats,
  saveGoogleAnalyticsId,
  initGoogleAnalytics,
} from '../utils/analytics';

interface FarmAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmAnalyticsModal: React.FC<FarmAnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<AnalyticsStats>(getStoredAnalytics());
  const [gaInput, setGaInput] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'produce' | 'sources' | 'ga_setup'>('overview');

  useEffect(() => {
    if (isOpen) {
      const current = getStoredAnalytics();
      setStats(current);
      setGaInput(current.gaMeasurementId || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveGa = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoogleAnalyticsId(gaInput);
    initGoogleAnalytics(gaInput);
    setStats(getStoredAnalytics());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyLiveSiteUrl = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const conversionRate = stats.totalVisits > 0
    ? ((stats.totalOrdersPlaced / stats.totalVisits) * 100).toFixed(1)
    : '0';

  const totalDevices = (stats.devices.mobile || 0) + (stats.devices.desktop || 0) + (stats.devices.tablet || 0) || 1;
  const mobilePct = Math.round(((stats.devices.mobile || 0) / totalDevices) * 100);
  const desktopPct = Math.round(((stats.devices.desktop || 0) / totalDevices) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#FBF9F5] rounded-2xl max-w-4xl w-full border border-[#E6DFD3] shadow-2xl overflow-hidden text-stone-900 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E6DFD3] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B3523]">
                Grassroots Farm Traffic &amp; Visitor Insights
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Real-time monitoring of website visits, produce interest, and Google Analytics integration for Balas, Bacolor, Pampanga.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close analytics modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[#E6DFD3] bg-[#F7F4EC] text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#1B3523] text-[#1B3523]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Overview &amp; Key Metrics
          </button>
          <button
            onClick={() => setActiveTab('produce')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'produce'
                ? 'border-[#1B3523] text-[#1B3523]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Top Viewed Produce
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'sources'
                ? 'border-[#1B3523] text-[#1B3523]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Traffic Sources &amp; Devices
          </button>
          <button
            onClick={() => setActiveTab('ga_setup')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ga_setup'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-emerald-700 hover:text-emerald-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Google Analytics 4 (GA4)</span>
            {stats.gaMeasurementId && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
            )}
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Big KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#E6DFD3] shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-medium">Total Site Visits</span>
                    <Eye className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    {stats.totalVisits.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    +{stats.todayVisits} visits today
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E6DFD3] shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-medium">Unique Visitors</span>
                    <Users className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    {stats.uniqueVisitors.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Distinct customer devices
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E6DFD3] shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-medium">Orders Placed</span>
                    <ShoppingBag className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    {stats.totalOrdersPlaced.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    Direct harvest checkouts
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E6DFD3] shadow-2xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-medium">Order Conversion</span>
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    {conversionRate}%
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Visit-to-purchase rate
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Visitor Tracking Active
                    </h4>
                    <p className="text-xs text-emerald-900">
                      Website visits are actively logged automatically on your published URL.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyLiveSiteUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-950 transition-colors shadow-2xs cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>{copiedLink ? 'Copied Site Link!' : 'Copy Published URL'}</span>
                </button>
              </div>

              {/* Page Views Breakdown */}
              <div className="p-5 bg-white rounded-xl border border-[#E6DFD3]">
                <h3 className="text-sm font-serif font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1B3523]" />
                  <span>Most Visited Farm Sections</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.pages).map(([page, views]) => {
                    const pct = Math.round((views / (stats.totalVisits || 1)) * 100);
                    return (
                      <div key={page} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-stone-800">{page}</span>
                          <span className="font-mono text-stone-600">{views} views ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1B3523] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(6, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Visitor Activity Stream */}
              <div className="p-5 bg-white rounded-xl border border-[#E6DFD3]">
                <h3 className="text-sm font-serif font-bold text-stone-900 mb-3 flex items-center justify-between">
                  <span>Recent Visitor Activity Stream</span>
                  <span className="text-[11px] font-mono font-normal text-stone-500">Live feed</span>
                </h3>
                <div className="divide-y divide-stone-100">
                  {stats.recentVisits.slice(0, 6).map((visit, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span className="font-medium text-stone-800">{visit.page}</span>
                        <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                          {visit.device}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-stone-500">
                        <span>{visit.referrer}</span>
                        <span className="text-stone-400 ml-2">
                          {new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'produce' && (
            <div className="space-y-6">
              <div className="p-5 bg-white rounded-xl border border-[#E6DFD3]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      Produce Popularity &amp; Customer Interest Ranking
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Tracks which organic harvest items visitors click, view details for, or checkout.
                    </p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 rounded-full">
                    Arugula #1 Top Seller
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(stats.produceViews)
                    .sort(([, a], [, b]) => b - a)
                    .map(([produce, count], index) => {
                      const maxVal = Math.max(...Object.values(stats.produceViews), 1);
                      const barWidth = Math.round((count / maxVal) * 100);
                      const isTopSale = produce.toLowerCase().includes('arugula');

                      return (
                        <div key={produce} className="p-3 rounded-lg bg-[#FBF9F5] border border-stone-200 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                                index === 0 ? 'bg-[#984D2E] text-white' : index === 1 ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-700'
                              }`}>
                                {index + 1}
                              </span>
                              <span className="font-semibold text-stone-900">{produce}</span>
                              {isTopSale && (
                                <span className="text-[10px] font-mono uppercase bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                                  Top Seller
                                </span>
                              )}
                            </div>
                            <span className="font-mono font-bold text-[#1B3523]">{count} views</span>
                          </div>

                          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isTopSale ? 'bg-[#984D2E]' : 'bg-[#1B3523]'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Traffic Sources */}
                <div className="p-5 bg-white rounded-xl border border-[#E6DFD3] space-y-4">
                  <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#1B3523]" />
                    <span>How Visitors Find Grassroots</span>
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(stats.referrers).map(([source, count]) => {
                      const totalRef = Object.values(stats.referrers).reduce((a, b) => a + b, 0) || 1;
                      const pct = Math.round((count / totalRef) * 100);

                      return (
                        <div key={source} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-stone-800">{source}</span>
                            <span className="font-mono text-stone-600">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-700 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    Share your published site link on Facebook, Instagram, and Viber to increase organic visits!
                  </p>
                </div>

                {/* Device Breakdown */}
                <div className="p-5 bg-white rounded-xl border border-[#E6DFD3] space-y-4">
                  <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#1B3523]" />
                    <span>Customer Device Breakdown</span>
                  </h3>

                  <div className="space-y-4 pt-2">
                    <div className="p-3 bg-stone-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-emerald-800" />
                        <div>
                          <p className="text-xs font-bold text-stone-900">Mobile Phones</p>
                          <p className="text-[11px] text-stone-500">Android &amp; iPhones</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-stone-900">{mobilePct}%</span>
                        <p className="text-[10px] text-stone-500 font-mono">{stats.devices.mobile} visits</p>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-stone-700" />
                        <div>
                          <p className="text-xs font-bold text-stone-900">Desktop / Laptops</p>
                          <p className="text-[11px] text-stone-500">Mac &amp; Windows PCs</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-stone-900">{desktopPct}%</span>
                        <p className="text-[10px] text-stone-500 font-mono">{stats.devices.desktop} visits</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    The Grassroots store is fully responsive and tuned for instant mobile checkout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ga_setup' && (
            <div className="space-y-6">
              <div className="p-5 bg-white rounded-xl border border-[#E6DFD3] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      Connect Official Google Analytics 4 (Free)
                    </h3>
                    <p className="text-xs text-stone-600 mt-1">
                      Want detailed graphs, live user locations across Pampanga/Metro Manila, and search keywords? Connect Google Analytics 4 for free in 2 minutes.
                    </p>
                  </div>
                  <span className="shrink-0 p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold">
                    Official Google Tag
                  </span>
                </div>

                <form onSubmit={handleSaveGa} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                      Google Measurement ID (Starts with G-)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gaInput}
                        onChange={(e) => setGaInput(e.target.value)}
                        placeholder="e.g. G-XXXXXXXXXX"
                        className="flex-1 px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#1B3523] bg-stone-50 text-stone-900"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Save &amp; Activate
                      </button>
                    </div>
                  </div>

                  {savedSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Google Analytics Measurement ID saved! Visitor data will now stream to your Google Analytics dashboard.</span>
                    </div>
                  )}
                </form>

                {/* 3 Step Guide on getting free GA4 */}
                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    How to get your free Google Analytics ID:
                  </h4>
                  <ol className="text-xs text-stone-700 space-y-2 list-decimal list-inside">
                    <li>
                      Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline font-semibold inline-flex items-center gap-0.5">Google Analytics (analytics.google.com) <ExternalLink className="w-3 h-3 inline" /></a> and sign in with your Google account (<span className="font-mono text-stone-900">gladysyalung18@gmail.com</span>).
                    </li>
                    <li>
                      Click <strong>Admin</strong> (gear icon bottom-left) &rarr; <strong>Create Property</strong> &rarr; name it <em>Grassroots &amp; Co. Farms</em>.
                    </li>
                    <li>
                      Select <strong>Web</strong> and paste your published site URL.
                    </li>
                    <li>
                      Copy the <strong>Measurement ID</strong> that looks like <span className="font-mono bg-stone-200 px-1 py-0.5 rounded">G-XXXXXXXXXX</span>, paste it in the box above, and click <strong>Save &amp; Activate</strong>.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-[#E6DFD3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Automatic visitor tracking active for Grassroots &amp; Co. Farms</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setStats(getStoredAnalytics());
              }}
              className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Stats</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#1B3523] text-white hover:bg-[#122418] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
