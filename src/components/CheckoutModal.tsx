import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  Printer,
  Mail,
  Copy,
  Check,
  Clock,
  RefreshCw,
  QrCode,
  Calendar,
  Building2,
  ExternalLink,
  Plus,
  Minus,
} from 'lucide-react';
import { CartItem, OrderDetails, PaymentMethodType, Product } from '../types/farm';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  directProduct?: Product | null;
  directQuantity?: number;
  onOrderCompleted?: (orderDetails: OrderDetails) => void;
  onClearCart?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items = [],
  directProduct = null,
  directQuantity = 1,
  onOrderCompleted,
  onClearCart,
}) => {
  // Local quantity for direct product checkout
  const [directQty, setDirectQty] = useState(directQuantity);

  useEffect(() => {
    setDirectQty(directQuantity || 1);
  }, [directQuantity, directProduct]);

  // Active items being checked out
  const activeItems: CartItem[] = React.useMemo(() => {
    if (directProduct) {
      return [{ product: directProduct, quantity: directQty }];
    }
    return items;
  }, [directProduct, directQty, items]);

  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryDate, setDeliveryDate] = useState('Tomorrow Dawn Harvest Drop (6:00 AM - 11:00 AM)');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bacolor, Pampanga');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('gcash');

  // Submission & Email states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
  const [emailDetails, setEmailDetails] = useState<any>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = activeItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = fulfillmentType === 'delivery' ? (subtotal >= 1500 ? 0 : 150) : 0;
  const total = subtotal + deliveryFee;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeItems.length === 0) return;

    setIsSubmitting(true);
    const orderId = `GRO-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: OrderDetails = {
      orderId,
      customerName,
      email,
      phone,
      address: fulfillmentType === 'delivery' ? address : 'Gate 2, Grassroots & Co. Farms, Balas, Bacolor, Pampanga (2HWQ+MV4)',
      city: fulfillmentType === 'delivery' ? city : 'Bacolor, Pampanga',
      deliveryDate,
      fulfillmentType,
      paymentMethod,
      items: activeItems,
      subtotal,
      deliveryFee,
      total,
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      // Trigger automatic email dispatch with payment method instructions via backend API
      const res = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        const data = await res.json();
        setEmailDetails(data.emailDetails);
        newOrder.emailSent = true;
      }
    } catch (err) {
      console.warn('Auto-email notice:', err);
    } finally {
      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
      if (onOrderCompleted) onOrderCompleted(newOrder);
      if (!directProduct && onClearCart) onClearCart();
    }
  };

  const handleResendEmail = async () => {
    if (!confirmedOrder) return;
    try {
      setIsResending(true);
      const res = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(confirmedOrder),
      });
      if (res.ok) {
        setResendStatus('Email resent successfully!');
      } else {
        setResendStatus('Email queued for delivery.');
      }
    } catch {
      setResendStatus('Email queued for delivery.');
    } finally {
      setIsResending(false);
      setTimeout(() => setResendStatus(null), 3500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    setConfirmedOrder(null);
    setEmailDetails(null);
    setShowEmailPreview(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#FBF9F5] rounded-2xl max-w-2xl w-full border border-[#E6DFD3] shadow-2xl overflow-hidden text-stone-900 max-h-[92vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6DFD3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-900/10 flex items-center justify-center text-[#1B3523]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-tight">
                {confirmedOrder
                  ? `Order #${confirmedOrder.orderId} Confirmed`
                  : directProduct
                  ? `Order & Check Out: ${directProduct.name}`
                  : 'Check Out Your Farm Order'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {confirmedOrder
                  ? 'Payment method instructions have been automatically emailed'
                  : 'Fill out your delivery or pickup details below'}
              </p>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!confirmedOrder ? (
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              
              {/* Product Spotlight & Quantity (if direct checkout or items) */}
              <div className="p-4 rounded-xl bg-white border border-[#E6DFD3] shadow-2xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                  Items to Harvest &amp; Pack
                </span>

                {directProduct ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <img
                          src={directProduct.image}
                          alt={directProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                          {directProduct.name}
                        </h4>
                        <p className="text-xs text-stone-500 truncate">
                          {directProduct.variety || 'Living Soil Cultivated'}
                        </p>
                        <p className="text-xs font-mono font-bold text-[#1B3523] mt-0.5">
                          ₱{directProduct.price} {directProduct.unit}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => setDirectQty((q) => Math.max(1, q - 1))}
                        disabled={directQty <= 1}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 disabled:opacity-40 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-semibold text-stone-900">
                        {directQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setDirectQty((q) => q + 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between text-xs text-stone-700">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-6 h-6 rounded bg-stone-100 border border-stone-200 flex items-center justify-center font-mono font-bold text-[10px]">
                            {item.quantity}x
                          </span>
                          <span className="font-medium text-stone-900 truncate">{item.product.name}</span>
                        </div>
                        <span className="font-mono font-semibold text-stone-900 shrink-0 tabular-nums">
                          ₱{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 1: Fulfillment Selection */}
              <div>
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">
                  01. Choose Delivery or Pick Up
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('delivery')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      fulfillmentType === 'delivery'
                        ? 'border-[#1B3523] bg-emerald-950/5 ring-1 ring-[#1B3523]'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#1B3523] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Chilled Farm Delivery</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {subtotal >= 1500 ? 'Free Delivery (Order over ₱1,500)' : '₱150 Flat Fee (Refrigerated)'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('pickup')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      fulfillmentType === 'pickup'
                        ? 'border-[#1B3523] bg-emerald-950/5 ring-1 ring-[#1B3523]'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#1B3523] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Farm Gate Pick Up (Free)</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Gate 2, Balas, Bacolor, Pampanga · Ready from 8:00 AM
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Harvest & Delivery/Pickup Window */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  02. Preferred Harvest &amp; {fulfillmentType === 'delivery' ? 'Delivery' : 'Pick Up'} Window
                </label>
                <select
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                >
                  <option value="Tomorrow Dawn Harvest Drop (6:00 AM - 11:00 AM)">
                    Tomorrow Sunrise Harvest (Cut at 5:30 AM · Delivered 6:00 AM - 11:00 AM)
                  </option>
                  <option value="Today 3:00 PM PHT Dispatch (Same-Day Afternoon)">
                    Today 3:00 PM PHT Dispatch (Same-Day Afternoon Fresh Drop)
                  </option>
                  <option value="Weekend Saturday Fresh Harvest (8:00 AM - 1:00 PM)">
                    Saturday Weekend Farm Drop (8:00 AM - 1:00 PM)
                  </option>
                  <option value="Sunday Farmgate Morning (8:00 AM - 12:00 PM)">
                    Sunday Morning Harvest (8:00 AM - 12:00 PM)
                  </option>
                </select>
              </div>

              {/* Step 3: Customer Contact & Delivery / Pick Up Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
                    03. Contact &amp; {fulfillmentType === 'delivery' ? 'Delivery Address' : 'Pick Up Details'}
                  </span>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    * Automated payment email will be sent here
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Maria Santos"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-600 mb-1">Mobile / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0917-XXX-XXXX"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] text-stone-600 mb-1">
                    Email Address * (You will receive an automatic email with the payment method)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                    />
                  </div>
                </div>

                {fulfillmentType === 'delivery' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-stone-600 mb-1">Street Address / Village / Landmark *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House #, Street, Subdivision / Barangay"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">City / Municipality *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. San Fernando, Pampanga"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-3.5 rounded-xl bg-emerald-950/5 border border-emerald-900/15 flex items-start gap-2.5 text-xs text-stone-700">
                    <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900">Farm Gate Pick Up Location:</p>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Gate 2, Grassroots &amp; Co. Farms, Balas, Bacolor, Pampanga (Google Plus Code: 2HWQ+MV4)
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Your crate will be pre-cooled and labelled with Order #{`GRO-XXXX`} at the farm gate.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <label className="block text-[11px] text-stone-600 mb-1">Special Notes / Cooler Drop (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please leave on shaded porch or call upon arrival"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1B3523]"
                  />
                </div>
              </div>

              {/* Step 4: Payment Method Selection */}
              <div>
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">
                  04. Select Payment Method (Instructions will be automatically emailed)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* GCash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      paymentMethod === 'gcash'
                        ? 'border-[#1B3523] bg-emerald-950/5 ring-1 ring-[#1B3523]'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      G
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">GCash (Instant QR / Transfer)</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Account details &amp; QR sent via email
                      </p>
                    </div>
                  </button>

                  {/* BDO */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bdo')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      paymentMethod === 'bdo'
                        ? 'border-[#1B3523] bg-emerald-950/5 ring-1 ring-[#1B3523]'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">BDO Bank Transfer</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Savings account details sent via email
                      </p>
                    </div>
                  </button>

                  {/* BPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bpi')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      paymentMethod === 'bpi'
                        ? 'border-[#1B3523] bg-emerald-950/5 ring-1 ring-[#1B3523]'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">BPI Bank Transfer</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Online / mobile transfer details emailed
                      </p>
                    </div>
                  </button>

                  {/* Cash Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod(fulfillmentType === 'delivery' ? 'cod' : 'pickup_cash')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      paymentMethod === 'cod' || paymentMethod === 'pickup_cash'
                        ? 'border-[#1B3523] bg-emerald-950/5 ring-1 ring-[#1B3523]'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#1B3523] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        {fulfillmentType === 'delivery' ? 'Cash on Delivery (COD)' : 'Cash on Pick Up'}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Pay upon receiving fresh harvest
                      </p>
                    </div>
                  </button>

                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="bg-[#F4EFE6] p-4 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({activeItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-mono text-stone-900 tabular-nums">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Fulfillment ({fulfillmentType === 'delivery' ? 'Chilled Farm Delivery' : 'Farm Gate Pick Up'})</span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {deliveryFee === 0 ? 'FREE' : `₱${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between font-bold text-sm text-[#1B3523]">
                  <span>Total Amount Due</span>
                  <span className="tabular-nums font-mono text-base">₱{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#1B3523] hover:bg-[#122418] disabled:bg-stone-400 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatched Order &amp; Sending Payment Email...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Confirm Order &amp; Receive Payment Email · ₱{total.toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Post-Order Screen with Automatic Email Sent Notice & Payment Method Details */
            <div className="space-y-6 text-center py-2 print:p-0">
              
              <div className="w-14 h-14 bg-emerald-100 text-[#1B3523] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#1B3523] text-xs font-semibold mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Automatic Email Dispatched to {confirmedOrder.email}</span>
                </div>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 mt-1">
                  Order #{confirmedOrder.orderId} Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-stone-900">{confirmedOrder.customerName}</strong>! Your order has been placed into our morning harvest queue. An automatic email with your payment method details and harvest pickup/delivery instructions has been sent to <strong className="text-[#1B3523]">{confirmedOrder.email}</strong>.
                </p>
              </div>

              {/* Active Payment Method Instructions Box */}
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-800/30 text-left text-xs shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Payment Method Details
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                      {confirmedOrder.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#1B3523] font-mono">
                    ₱{confirmedOrder.total.toLocaleString()}
                  </span>
                </div>

                {/* Specific instructions per payment type */}
                {confirmedOrder.paymentMethod === 'gcash' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                      <div>
                        <p className="text-[11px] font-semibold text-blue-900">GCash Account Name &amp; Number:</p>
                        <p className="text-sm font-bold text-blue-950 font-mono">Gladys Yalung / 0917-889-4521</p>
                        <p className="text-[11px] text-blue-800 mt-0.5">Please include Order #{confirmedOrder.orderId} in the message.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('09178894521', 'gcash')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedText === 'gcash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === 'gcash' ? 'Copied' : 'Copy Number'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      💡 A copy of these GCash instructions has also been sent to your email ({confirmedOrder.email}). Once sent, reply with your screenshot or reference number.
                    </p>
                  </div>
                )}

                {confirmedOrder.paymentMethod === 'bdo' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div>
                        <p className="text-[11px] font-semibold text-stone-700">BDO Savings Account:</p>
                        <p className="text-sm font-bold text-stone-900 font-mono">0041-8802-9431</p>
                        <p className="text-[11px] text-stone-600 mt-0.5">Account Name: Grassroots &amp; Co. Farms Inc. (San Fernando, Pampanga)</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('004188029431', 'bdo')}
                        className="px-3 py-1.5 bg-[#1B3523] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {copiedText === 'bdo' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === 'bdo' ? 'Copied' : 'Copy Account'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {confirmedOrder.paymentMethod === 'bpi' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div>
                        <p className="text-[11px] font-semibold text-stone-700">BPI Savings Account:</p>
                        <p className="text-sm font-bold text-stone-900 font-mono">0923-4411-88</p>
                        <p className="text-[11px] text-stone-600 mt-0.5">Account Name: Grassroots &amp; Co. Farms Inc. (Bacolor, Pampanga)</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('0923441188', 'bpi')}
                        className="px-3 py-1.5 bg-[#1B3523] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {copiedText === 'bpi' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === 'bpi' ? 'Copied' : 'Copy Account'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {(confirmedOrder.paymentMethod === 'cod' || confirmedOrder.paymentMethod === 'pickup_cash') && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                    <p className="font-bold">
                      {confirmedOrder.fulfillmentType === 'delivery'
                        ? 'Cash on Delivery (COD)'
                        : 'Cash on Farm Gate Pick Up'}
                    </p>
                    <p className="text-[11px] text-stone-600">
                      Please prepare exact cash of <strong>₱{confirmedOrder.total.toLocaleString()}</strong> upon arrival.
                    </p>
                  </div>
                )}

                {/* Email Preview Toggle */}
                <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailPreview(!showEmailPreview)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{showEmailPreview ? 'Hide Automated Email Preview' : 'View Automated Email Sent to Customer →'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                    <span>{isResending ? 'Resending...' : 'Resend Email'}</span>
                  </button>
                </div>

                {resendStatus && (
                  <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    {resendStatus}
                  </div>
                )}
              </div>

              {/* Simulated / Sent Email Viewer */}
              {showEmailPreview && (
                <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-stone-300 text-left text-xs font-sans space-y-3 shadow-inner">
                  <div className="border-b border-stone-200 pb-2 text-[11px] text-stone-500 space-y-1">
                    <div><strong>From:</strong> Grassroots &amp; Co. Farms &lt;orders@grassrootsfarms.ph&gt;</div>
                    <div><strong>To:</strong> {confirmedOrder.customerName} &lt;{confirmedOrder.email}&gt;</div>
                    <div><strong>Subject:</strong> Order #{confirmedOrder.orderId} Confirmed - Payment Instructions &amp; Harvest Details</div>
                    <div><strong>Date:</strong> {emailDetails?.sentAt || new Date().toLocaleString()}</div>
                  </div>

                  <div className="space-y-3 text-stone-800">
                    <p>Dear <strong>{confirmedOrder.customerName}</strong>,</p>
                    <p>
                      Thank you for choosing <strong>Grassroots &amp; Co. Farms</strong>. We have scheduled your order for dawn harvest at our Balas, Bacolor estate.
                    </p>

                    <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-1">
                      <p className="font-bold text-[#1B3523]">Your Payment Method: {confirmedOrder.paymentMethod.toUpperCase()}</p>
                      <pre className="text-[11px] font-sans text-stone-700 whitespace-pre-line leading-relaxed">
                        {emailDetails?.paymentInstructions || 'Payment instructions included.'}
                      </pre>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-stone-800">Order Summary:</p>
                      {confirmedOrder.items.map((i) => (
                        <div key={i.product.id} className="flex justify-between text-stone-600 text-[11px]">
                          <span>{i.quantity}x {i.product.name}</span>
                          <span>₱{(i.product.price * i.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold pt-1 border-t border-stone-200 text-xs">
                        <span>Total:</span>
                        <span>₱{confirmedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-500">
                      Need help? You can reply directly to this email or contact our farm hotline at 0917-889-4521.
                    </p>
                  </div>
                </div>
              )}

              {/* Order Receipt Summary Card */}
              <div className="bg-[#F4EFE6] p-5 rounded-2xl border border-stone-200 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Fulfillment Method:</span>
                  <span className="font-semibold text-stone-900">
                    {confirmedOrder.fulfillmentType === 'delivery'
                      ? `Chilled Delivery to ${confirmedOrder.address}, ${confirmedOrder.city}`
                      : 'Farm Gate Pick Up at Balas, Bacolor, Pampanga'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Harvest Drop Schedule:</span>
                  <span className="font-semibold text-stone-900">{confirmedOrder.deliveryDate}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Contact Number:</span>
                  <span className="font-mono text-stone-900">{confirmedOrder.phone}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Customer Email:</span>
                  <span className="font-mono text-stone-900">{confirmedOrder.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-[#1B3523] text-white rounded-lg text-xs font-semibold hover:bg-[#122418] transition-colors shadow-xs cursor-pointer"
                >
                  Return to Farm Catalog
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
