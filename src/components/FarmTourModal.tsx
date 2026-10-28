import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, Users } from 'lucide-react';

interface FarmTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmTourModal: React.FC<FarmTourModalProps> = ({ isOpen, onClose }) => {
  const [workshopType, setWorkshopType] = useState('soil-sourdough');
  const [selectedDate, setSelectedDate] = useState('2026-10-24');
  const [attendees, setAttendees] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  const resetAndClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#FBF9F5] rounded-2xl max-w-xl w-full border border-[#E6DFD3] shadow-2xl p-6 sm:p-8 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white text-stone-700 hover:text-stone-900 shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-1">
              <span>On-Farm Experience</span>
              <span aria-hidden="true">·</span>
              <span>Saturday Mornings</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-stone-900">
              Book a Farm Tour &amp; Tasting Walk
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Walk our 7-hectare family-owned farm in Balas, Bacolor, Pampanga with farm owner Patria Cruz, lead farmer Jerry Abello, and livestock caretaker Jay Abello. Sample vine-sweet cherry tomatoes and mulberries, learn about our living soil compost systems, and harvest fresh greens to bring home.
            </p>

            {/* Farm Location Card */}
            <div className="mt-3 p-3 bg-emerald-950/5 border border-stone-200/90 rounded-xl flex items-start gap-2.5 text-xs text-stone-700">
              <MapPin className="w-4 h-4 text-[#1B3523] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-900">
                  Grassroots &amp; Co. Farms · 7 Hectares Family-Owned Farm
                </p>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Address: <strong>2HWQ+MV4, Balas, Bacolor, Pampanga</strong>
                </p>
                <p className="text-[10px] text-emerald-800 font-medium tracking-wide uppercase mt-0.5">
                  Rooted Consciously
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Select Workshop Experience
                </label>
                <select
                  value={workshopType}
                  onChange={(e) => setWorkshopType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                >
                  <option value="soil-sourdough">Living Soil &amp; Organic Composting Walk (₱500 / guest)</option>
                  <option value="heirloom-tasting">Fresh Produce Harvest &amp; Tasting Tour (₱450 / guest)</option>
                  <option value="foraging-botanical">Herbal Floral Foraging &amp; Farm Tea (₱400 / guest)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Saturday Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                  >
                    <option value="2026-10-24">Sat, Oct 24 (10:00 AM)</option>
                    <option value="2026-10-31">Sat, Oct 31 (10:00 AM)</option>
                    <option value="2026-11-07">Sat, Nov 07 (10:00 AM)</option>
                    <option value="2026-11-14">Sat, Nov 14 (10:00 AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={attendees}
                    onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Smith"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email for Confirmation
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1B3523] hover:bg-[#122418] text-white text-xs font-medium rounded-xl transition-colors shadow-xs"
                >
                  Reserve Tour Pass ({attendees} Guest{attendees > 1 ? 's' : ''})
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-800 mx-auto" />
            <h3 className="font-serif font-bold text-2xl text-stone-900">
              Your Farm Tour is Reserved!
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              We look forward to welcoming you, <span className="font-semibold text-stone-900">{name}</span>. A calendar invitation and farm gate driving directions have been dispatched to <span className="font-semibold text-stone-900">{email}</span>.
            </p>
            <div className="bg-stone-100 p-4 rounded-xl text-xs text-stone-700 max-w-xs mx-auto text-left space-y-1">
              <p><strong>Tour: </strong>{workshopType.replace('-', ' ').toUpperCase()}</p>
              <p><strong>Date: </strong>{selectedDate} at 9:00 AM PHT</p>
              <p><strong>Location: </strong>2HWQ+MV4, Balas, Bacolor, Pampanga</p>
            </div>
            <button
              onClick={resetAndClose}
              className="mt-4 px-6 py-2.5 bg-[#1B3523] text-white text-xs font-medium rounded-lg hover:bg-[#122418]"
            >
              Return to Farm Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
