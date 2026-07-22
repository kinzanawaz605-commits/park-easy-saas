import React, { useState } from 'react';
import {
  X,
  Navigation,
  ArrowRight,
  Compass,
  MapPin,
  CheckCircle2,
  CornerDownRight,
  ShieldCheck,
  Zap,
  Car,
  Clock,
  Building2,
} from 'lucide-react';
import { ParkingPass } from '../types';

interface WayfindingModalProps {
  pass?: ParkingPass | null;
  spotCode: string;
  onClose: () => void;
  onBackToPass?: () => void;
}

export const WayfindingModal: React.FC<WayfindingModalProps> = ({
  spotCode,
  onClose,
  onBackToPass,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Normalize spotCode display
  const targetCode = spotCode || 'A-01';

  // 2D Parking Grid Slot Layout Data for Mini-Map
  const topRowSpots = ['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-06'];
  const bottomRowSpots = ['A-07', 'A-08', 'A-09', 'A-10', 'A-11', 'A-12'];

  const isTopRow = topRowSpots.includes(targetCode);
  const spotIndex = isTopRow
    ? topRowSpots.indexOf(targetCode)
    : bottomRowSpots.indexOf(targetCode) !== -1
    ? bottomRowSpots.indexOf(targetCode)
    : 2; // default position

  const steps = [
    {
      id: 1,
      title: 'Entrance Gate A Barrier',
      desc: 'Approach Gate A on Main Boulevard. Scan your digital QR pass at the barrier optical scanner.',
      icon: ShieldCheck,
      dist: '0m',
    },
    {
      id: 2,
      title: 'Central Driving Lane',
      desc: 'Proceed 20 meters straight along the primary driving lane marked with green LED overhead guidance.',
      icon: ArrowRight,
      dist: '20m',
    },
    {
      id: 3,
      title: 'Turn into Corridor Bay',
      desc: `Take a smooth turn into Aisle Corridor near Pillar P-${spotIndex + 1}.`,
      icon: CornerDownRight,
      dist: '35m',
    },
    {
      id: 4,
      title: `Park in Reserved Spot ${targetCode}`,
      desc: `Pull forward into Spot ${targetCode}. The smart overhead ultrasonic sensor will lock to blue upon parking.`,
      icon: MapPin,
      dist: '45m',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-xs">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide text-white">
                INDOOR NAVIGATION & WAYFINDING
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                Turn-by-Turn 2D Mini-Map Guidance to Spot{' '}
                <span className="text-amber-300 font-bold px-1.5 py-0.2 bg-amber-400/20 rounded">
                  {targetCode}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-slate-50">
          {/* Quick Info Strip */}
          <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-2xl border border-slate-200 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-extrabold uppercase">
                  TOTAL DISTANCE
                </span>
                <span className="font-extrabold text-slate-900 text-xs">45 Meters</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-extrabold uppercase">
                  EST. DRIVE TIME
                </span>
                <span className="font-extrabold text-slate-900 text-xs">~35 Seconds</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-extrabold uppercase">
                  TARGET SLOT
                </span>
                <span className="font-extrabold text-indigo-600 text-xs">
                  Spot {targetCode}
                </span>
              </div>
            </div>
          </div>

          {/* REALISTIC 2D INDOOR NAVIGATION MINI-MAP CANVAS */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 relative overflow-hidden font-mono text-white shadow-2xl">
            {/* Top Concourse Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>2D LIVE FLOOR PLAN & ROUTE</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>MALL ELEVATOR LOBBY</span>
              </div>
            </div>

            {/* 2D Parking Floor Blueprint Grid */}
            <div className="relative bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-3 overflow-hidden">
              {/* Background Grid Accent Pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Elevator Concourse Pedestrian Deck */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-1.5 text-center text-[10px] font-bold text-indigo-300 tracking-wider flex items-center justify-center gap-2">
                <span>🚶 MAIN PEDESTRIAN CONCOURSE & ELEVATOR HUB</span>
              </div>

              {/* TOP PARKING ROW (Zone A) */}
              <div>
                <div className="text-[9px] font-bold text-slate-500 mb-1 tracking-widest uppercase">
                  NORTH PARKING ROW - ZONE A
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {topRowSpots.map((code) => {
                    const isTarget = code === targetCode;
                    return (
                      <div
                        key={code}
                        className={`h-12 rounded-lg border flex flex-col items-center justify-center p-1 transition-all relative ${
                          isTarget
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/60 shadow-lg animate-pulse'
                            : 'bg-slate-800/60 border-slate-700/70 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-extrabold">{code}</span>
                        {isTarget ? (
                          <div className="flex items-center gap-0.5 text-[8px] font-black text-amber-300 mt-0.5">
                            <Car className="w-2.5 h-2.5 fill-amber-300" />
                            <span>YOU</span>
                          </div>
                        ) : (
                          <span className="text-[8px] text-slate-500 font-semibold">
                            {code.endsWith('2') || code.endsWith('4')
                              ? 'OCCUPIED'
                              : 'FREE'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CENTRAL DRIVING AISLE & PILLARS */}
              <div className="relative py-2 px-2 bg-slate-950/80 border-y border-dashed border-amber-500/40 rounded-md flex items-center justify-between my-2">
                {/* Dashed Lane Center Line */}
                <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 border-t border-dashed border-amber-400/60" />

                {/* Driving Direction Arrow */}
                <div className="z-10 bg-slate-900 px-2 py-0.5 rounded text-[10px] text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1 animate-pulse">
                  <span>ONE WAY</span>
                  <span>➔</span>
                </div>

                {/* Pillars */}
                <div className="z-10 px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-[9px] text-slate-400 font-bold">
                  PILLAR P1
                </div>
                <div className="z-10 px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-[9px] text-slate-400 font-bold">
                  PILLAR P2
                </div>
              </div>

              {/* BOTTOM PARKING ROW (Zone B) */}
              <div>
                <div className="text-[9px] font-bold text-slate-500 mb-1 tracking-widest uppercase">
                  SOUTH PARKING ROW - ZONE B
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {bottomRowSpots.map((code) => {
                    const isTarget = code === targetCode;
                    return (
                      <div
                        key={code}
                        className={`h-12 rounded-lg border flex flex-col items-center justify-center p-1 transition-all relative ${
                          isTarget
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/60 shadow-lg animate-pulse'
                            : 'bg-slate-800/60 border-slate-700/70 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-extrabold">{code}</span>
                        {isTarget ? (
                          <div className="flex items-center gap-0.5 text-[8px] font-black text-amber-300 mt-0.5">
                            <Car className="w-2.5 h-2.5 fill-amber-300" />
                            <span>YOU</span>
                          </div>
                        ) : (
                          <span className="text-[8px] text-slate-500 font-semibold">
                            {code.endsWith('8') || code.endsWith('0')
                              ? 'OCCUPIED'
                              : 'FREE'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ENTRANCE GATE A (Bottom-Left Box) */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/60 px-3 py-1.5 rounded-xl shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-300 block">
                      GATE A - ENTRANCE BARRIER
                    </span>
                    <span className="text-[9px] text-emerald-400/80">
                      Optical QR Reader Active
                    </span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-400">
                  <span className="text-indigo-400 font-bold block">
                    DESTINATION ROUTE LOCKED
                  </span>
                  <span>Spot {targetCode} • Blue Sensor</span>
                </div>
              </div>

              {/* OVERLAY SVG DYNAMIC ANIMATED WAYFINDING ROUTE */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient
                    id="routeGradient"
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                {/* Dynamic Path starting from Gate A at bottom-left */}
                <path
                  d={`M 60,210 L 60,120 L ${100 + spotIndex * 70},120 L ${
                    100 + spotIndex * 70
                  },${isTopRow ? 60 : 170}`}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                {/* Destination Target Pulsing Ring */}
                <circle
                  cx={100 + spotIndex * 70}
                  cy={isTopRow ? 60 : 170}
                  r="10"
                  fill="#f59e0b"
                  fillOpacity="0.3"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  className="animate-ping"
                />
              </svg>
            </div>
          </div>

          {/* Turn-by-Turn Step Guidance List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Step-by-Step Directions
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {steps.map((s) => {
                const IconComponent = s.icon;
                const isCurrent = activeStep === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveStep(s.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                        : 'bg-white border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isCurrent
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">
                          Step {s.id}: {s.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">
                          {s.dist}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {s.desc}
                      </p>
                    </div>

                    {isCurrent && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 self-center" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
          {onBackToPass ? (
            <button
              onClick={onBackToPass}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-extrabold rounded-xl transition-colors cursor-pointer"
            >
              Back to Pass
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Close Navigation
          </button>
        </div>
      </div>
    </div>
  );
};
