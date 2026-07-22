import React, { useState, useEffect } from 'react';
import {
  Car,
  Zap,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ParkingSpot, VehicleType } from '../types';

interface BookingPanelProps {
  selectedSpot: ParkingSpot | null;
  onConfirmBooking: (bookingData: {
    spotId: string;
    durationMinutes: number;
    vehiclePlate: string;
    vehicleType: VehicleType;
    needEVCharging: boolean;
  }) => Promise<void>;
  onOpenAIModal: () => void;
  isSubmitting: boolean;
}

export const BookingPanel: React.FC<BookingPanelProps> = ({
  selectedSpot,
  onConfirmBooking,
  onOpenAIModal,
  isSubmitting,
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [vehiclePlate, setVehiclePlate] = useState<string>('LEB-1234');
  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const [needEVCharging, setNeedEVCharging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Automatically enable EV charging toggle if spot is EV
  useEffect(() => {
    if (selectedSpot?.isEV) {
      setNeedEVCharging(true);
      setVehicleType('ev');
    } else {
      setNeedEVCharging(false);
    }
    setErrorMsg('');
  }, [selectedSpot]);

  if (!selectedSpot) {
    return (
      <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col justify-between min-h-[500px]">
        {/* State A: Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A2 2 0 013 15.485V5.515a2 2 0 011.553-1.943l1.943-0.556a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 012-2l1.943 0.556a2 2 0 011.553 1.943v9.97a2 2 0 01-0.553 1.291L15 20m-6 0l6-6" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Reserve a Spot</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Select an available green slot on the map to begin booking.
          </p>

          <button
            onClick={onOpenAIModal}
            className="mt-6 w-full py-2.5 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-200" />
            Ask AI to Recommend Best Spot
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          ParkEasy Smart Mobility
        </div>
      </aside>
    );
  }

  // Calculate pricing
  const hours = durationMinutes / 60;
  const basePrice = Number((selectedSpot.pricePerHour * hours).toFixed(2));
  const serviceFee = 0.5;
  const evFee = needEVCharging ? 2.0 : 0.0;
  const totalPrice = Number((basePrice + serviceFee + evFee).toFixed(2));

  const handleBook = async () => {
    if (!vehiclePlate.trim()) {
      setErrorMsg('Please enter a valid vehicle license plate number.');
      return;
    }
    setErrorMsg('');
    await onConfirmBooking({
      spotId: selectedSpot.id,
      durationMinutes,
      vehiclePlate: vehiclePlate.toUpperCase(),
      vehicleType,
      needEVCharging,
    });
  };

  return (
    <aside className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
            Slot Summary
          </span>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            AVAILABLE
          </span>
        </div>

        {/* Selected Slot Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {selectedSpot.zone} — Spot {selectedSpot.code}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Hourly Rate</span>
            <span className="font-bold text-indigo-600">${selectedSpot.pricePerHour.toFixed(2)}/hr</span>
          </div>
        </div>

        {/* Duration selector */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
            Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '30 Min', mins: 30 },
              { label: '1 Hour', mins: 60 },
              { label: '2 Hours', mins: 120 },
              { label: '4 Hours', mins: 240 },
              { label: '8 Hours', mins: 480 },
              { label: 'Full Day', mins: 1440 },
            ].map((opt) => (
              <button
                key={opt.mins}
                type="button"
                onClick={() => setDurationMinutes(opt.mins)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  durationMinutes === opt.mins
                    ? 'border-2 border-indigo-600 text-indigo-600 bg-indigo-50 font-bold'
                    : 'border border-slate-200 text-slate-700 hover:border-indigo-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* License Plate Number */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
            Vehicle Plate Number
          </label>
          <input
            type="text"
            placeholder="ABC-5678"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-100 outline-none"
          />
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
            <span>Presets:</span>
            {['ABC-5678', 'LEB-1234', 'ISB-5544'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setVehiclePlate(p)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* EV Option if applicable */}
        {selectedSpot.isEV && (
          <label className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={needEVCharging}
              onChange={(e) => setNeedEVCharging(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-amber-300 focus:ring-indigo-500"
            />
            <div className="text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                Include Level 2 EV Fast Charger
              </span>
              <span className="text-amber-700 block text-[11px]">+$2.00 session fee</span>
            </div>
          </label>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Base Fee ({durationMinutes} mins)</span>
            <span>${basePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Service & Sensor Tax</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          {needEVCharging && (
            <div className="flex justify-between text-amber-700">
              <span>EV Fast Charger</span>
              <span>${evFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 text-slate-900">
            <span>Total Due</span>
            <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-4 mt-6 border-t border-slate-100">
        <button
          onClick={handleBook}
          disabled={isSubmitting}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
        >
          {isSubmitting ? 'Booking...' : `Confirm & Book Spot ${selectedSpot.code}`}
        </button>
      </div>
    </aside>
  );
};
