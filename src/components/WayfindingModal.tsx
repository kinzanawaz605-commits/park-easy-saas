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
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  LocateFixed,
} from 'lucide-react';
import { ParkingPass } from '../types';

interface WayfindingModalProps {
  pass?: ParkingPass | null;
  spotCode: string;
  locationName?: string;
  gateName?: string;
  floorName?: string;
  onClose: () => void;
  onBackToPass?: () => void;
}

export const WayfindingModal: React.FC<WayfindingModalProps> = ({
  pass,
  spotCode,
  locationName,
  gateName,
  floorName,
  onClose,
  onBackToPass,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showStepsList, setShowStepsList] = useState<boolean>(true);
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite'>('standard');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Dynamic context normalization
  const locName = pass?.locationName || locationName || 'Centaurus Mall';
  const gName = gateName || 'Main Entrance Gate';
  const flName = pass?.floorName || floorName || 'Level 1 Express';
  const targetCode = spotCode || 'A-01';

  // Parse spot code prefix and number
  const codeParts = targetCode.split('-');
  const prefix = codeParts.length > 1 ? codeParts[0] : targetCode.replace(/[0-9]/g, '') || 'A';
  const numVal = parseInt(codeParts[codeParts.length - 1] || targetCode.replace(/\D/g, '') || '1', 10);

  // Dynamic row spot code arrays for 2D map
  const topRowSpots = Array.from({ length: 6 }, (_, i) => `${prefix}-${String(i + 1).padStart(2, '0')}`);
  const bottomRowSpots = Array.from({ length: 6 }, (_, i) => `${prefix}-${String(i + 7).padStart(2, '0')}`);

  let isTopRow = topRowSpots.includes(targetCode);
  let spotIndex = isTopRow ? topRowSpots.indexOf(targetCode) : bottomRowSpots.indexOf(targetCode);

  if (spotIndex === -1) {
    if (numVal <= 6) {
      isTopRow = true;
      spotIndex = Math.max(0, Math.min(5, numVal - 1));
    } else {
      isTopRow = false;
      spotIndex = Math.max(0, Math.min(5, numVal - 7));
    }
  }

  // Target coordinates on 800x420 SVG Canvas
  const targetX = 165 + spotIndex * 100;
  const targetY = isTopRow ? 100 : 310;

  // Turn-by-turn steps
  const steps = [
    {
      id: 1,
      title: `${gName}`,
      desc: `Approach ${gName} at ${locName}. Scan pass or auto-detect vehicle plate at barrier.`,
      icon: ShieldCheck,
      dist: '0m',
    },
    {
      id: 2,
      title: `${flName} Central Driving Lane`,
      desc: 'Drive 20m straight following green overhead LED directional displays.',
      icon: ArrowRight,
      dist: '20m',
    },
    {
      id: 3,
      title: `Turn into Aisle Corridor (Pillar P-${spotIndex + 1})`,
      desc: `Take a smooth turn into Aisle Corridor past Pillar P-${spotIndex + 1}.`,
      icon: CornerDownRight,
      dist: '35m',
    },
    {
      id: 4,
      title: `Park in Reserved Spot ${targetCode}`,
      desc: `Pull forward into Spot ${targetCode}. Overhead ultrasonic sensor turns BLUE upon parking.`,
      icon: MapPin,
      dist: '45m',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* GOOGLE MAPS STYLE GREEN TURN BANNER */}
        <div className="bg-[#137333] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-lg shrink-0 border-b border-[#0f5132] z-20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 bg-white text-[#137333] rounded-2xl flex items-center justify-center shadow-md font-black shrink-0">
              <CornerDownRight className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-wide text-white">
                  In 20 m, turn into Aisle Corridor
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 bg-emerald-800/90 text-emerald-200 text-[10px] font-black uppercase rounded-full tracking-wider border border-emerald-500/30">
                  GPS Live • 0.2m Acc.
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5 font-medium truncate">
                <span className="hidden sm:inline">{locName} •</span>
                <span>Destination Spot</span>
                <span className="font-black text-amber-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-amber-400/50">
                  {targetCode}
                </span>
                <span>will be on your right</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer shrink-0"
            title="Close Navigation"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* MAIN SCROLLABLE CONTENT / MAP CONTAINER */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-slate-950 relative">
          {/* MAP CANVAS CONTAINER (Guaranteed 380px - 420px height) */}
          <div className="relative w-full h-[380px] sm:h-[420px] bg-[#1e293b] shrink-0 overflow-hidden border-b border-slate-800 select-none">
            {/* Floating Top Controls Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
              {/* Route Summary Badge */}
              <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 text-xs text-white pointer-events-auto max-w-[70%] sm:max-w-none truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping shrink-0" />
                <span className="font-bold truncate">{gName}</span>
                <span className="text-slate-400 font-mono shrink-0">➔</span>
                <span className="text-amber-300 font-black shrink-0">Spot {targetCode}</span>
              </div>

              {/* Layer Switcher */}
              <button
                onClick={() =>
                  setMapLayer((prev) => (prev === 'standard' ? 'satellite' : 'standard'))
                }
                className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl shadow-xl transition-all flex items-center gap-1.5 text-xs font-extrabold cursor-pointer pointer-events-auto shrink-0"
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="capitalize">{mapLayer}</span>
              </button>
            </div>

            {/* Floating Bottom Right Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-30">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.3))}
                className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white rounded-xl shadow-xl transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
                className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white rounded-xl shadow-xl transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl transition-colors cursor-pointer"
                title="Re-center Map"
              >
                <LocateFixed className="w-4 h-4" />
              </button>
            </div>

            {/* REAL VECTOR SVG MAP CANVAS */}
            <div
              className="w-full h-full transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            >
              <svg
                viewBox="0 0 800 420"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Grid pattern */}
                  <pattern
                    id="gridPattern"
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 30 0 L 0 0 0 30"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.5"
                      strokeOpacity="0.08"
                    />
                  </pattern>

                  {/* Cyan Blue Route Glow */}
                  <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Route Gradient */}
                  <linearGradient id="cyanBlueGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Map Base Canvas */}
                <rect width="800" height="420" fill={mapLayer === 'satellite' ? '#0b1329' : '#1e293b'} />
                <rect width="800" height="420" fill="url(#gridPattern)" />

                {/* Concourse / Elevator Lobby Deck */}
                <rect
                  x="40"
                  y="15"
                  width="720"
                  height="42"
                  rx="12"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <text
                  x="400"
                  y="41"
                  fill="#94a3b8"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                  letterSpacing="1.5"
                >
                  {locName.toUpperCase()} • {flName.toUpperCase()} DECK
                </text>

                {/* Main Dark Asphalt Roadway */}
                <rect
                  x="40"
                  y="170"
                  width="720"
                  height="80"
                  rx="10"
                  fill="#020617"
                  stroke="#1e293b"
                  strokeWidth="2"
                />

                {/* White Road Lane Edge Lines */}
                <line x1="50" y1="172" x2="750" y2="172" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.6" />
                <line x1="50" y1="248" x2="750" y2="248" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.6" />

                {/* Yellow Center Dashed Road Line */}
                <line
                  x1="120"
                  y1="210"
                  x2="740"
                  y2="210"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="10 8"
                  strokeOpacity="0.8"
                />

                {/* Road Arrow & Text */}
                <text x="380" y="193" fill="#fbbf24" fontSize="10" fontWeight="800" textAnchor="middle">
                  MAIN DRIVING AISLE • ONE WAY ➔
                </text>

                {/* Pillar Markers */}
                <rect x="260" y="198" width="50" height="24" rx="6" fill="#1e293b" stroke="#475569" />
                <text x="285" y="214" fill="#e2e8f0" fontSize="10" fontWeight="800" textAnchor="middle">
                  P-1
                </text>

                <rect x="460" y="198" width="50" height="24" rx="6" fill="#1e293b" stroke="#475569" />
                <text x="485" y="214" fill="#e2e8f0" fontSize="10" fontWeight="800" textAnchor="middle">
                  P-2
                </text>

                {/* NORTH PARKING BAY ROW (ZONE A) */}
                <text x="50" y="72" fill="#64748b" fontSize="10" fontWeight="800" letterSpacing="1">
                  ZONE A - NORTH PARKING BAY
                </text>
                {topRowSpots.map((code, idx) => {
                  const xPos = 120 + idx * 100;
                  const isTarget = code === targetCode || (isTopRow && idx === spotIndex);
                  const displayCode = isTarget ? targetCode : code;
                  return (
                    <g key={code}>
                      <rect
                        x={xPos}
                        y={80}
                        width="90"
                        height="70"
                        rx="10"
                        fill={isTarget ? '#78350f' : '#0f172a'}
                        fillOpacity={isTarget ? 0.85 : 0.9}
                        stroke={isTarget ? '#fbbf24' : '#334155'}
                        strokeWidth={isTarget ? '3' : '1.5'}
                      />
                      <text
                        x={xPos + 45}
                        y={108}
                        fill={isTarget ? '#fef08a' : '#f8fafc'}
                        fontSize="14"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        {displayCode}
                      </text>
                      <text
                        x={xPos + 45}
                        y={130}
                        fill={isTarget ? '#fbbf24' : idx % 2 === 0 ? '#10b981' : '#64748b'}
                        fontSize="9"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {isTarget ? 'YOUR SPOT' : idx % 2 === 0 ? 'AVAILABLE' : 'OCCUPIED'}
                      </text>
                    </g>
                  );
                })}

                {/* SOUTH PARKING BAY ROW (ZONE B) */}
                <text x="50" y="278" fill="#64748b" fontSize="10" fontWeight="800" letterSpacing="1">
                  ZONE B - SOUTH PARKING BAY
                </text>
                {bottomRowSpots.map((code, idx) => {
                  const xPos = 120 + idx * 100;
                  const isTarget = code === targetCode || (!isTopRow && idx === spotIndex);
                  const displayCode = isTarget ? targetCode : code;
                  return (
                    <g key={code}>
                      <rect
                        x={xPos}
                        y={290}
                        width="90"
                        height="70"
                        rx="10"
                        fill={isTarget ? '#78350f' : '#0f172a'}
                        fillOpacity={isTarget ? 0.85 : 0.9}
                        stroke={isTarget ? '#fbbf24' : '#334155'}
                        strokeWidth={isTarget ? '3' : '1.5'}
                      />
                      <text
                        x={xPos + 45}
                        y={318}
                        fill={isTarget ? '#fef08a' : '#f8fafc'}
                        fontSize="14"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        {displayCode}
                      </text>
                      <text
                        x={xPos + 45}
                        y={340}
                        fill={isTarget ? '#fbbf24' : idx % 2 === 1 ? '#10b981' : '#64748b'}
                        fontSize="9"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {isTarget ? 'YOUR SPOT' : idx % 2 === 1 ? 'AVAILABLE' : 'OCCUPIED'}
                      </text>
                    </g>
                  );
                })}

                {/* GATE ENTRANCE ROAD (Bottom-Left) */}
                <rect x="50" y="365" width="130" height="42" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                <text x="115" y="384" fill="#34d399" fontSize="11" fontWeight="900" textAnchor="middle">
                  {gName.toUpperCase()}
                </text>
                <text x="115" y="398" fill="#a7f3d0" fontSize="9" fontWeight="700" textAnchor="middle">
                  Vehicle Start Point
                </text>

                {/* BRIGHT CYAN/BLUE GOOGLE MAPS ROUTE LINE */}
                <path
                  d={`M 115,365 L 115,210 L ${targetX},210 L ${targetX},${targetY}`}
                  fill="none"
                  stroke="url(#cyanBlueGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#routeGlow)"
                />
                {/* White Inner Dashed Animation Line */}
                <path
                  d={`M 115,365 L 115,210 L ${targetX},210 L ${targetX},${targetY}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />

                {/* START MARKER: BLUE GPS DOT (GATE) */}
                <g transform="translate(115, 365)">
                  <circle r="18" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                  <circle r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="3" />
                  <circle r="4" fill="#ffffff" />
                </g>

                {/* END MARKER: RED DESTINATION GOOGLE MAPS PIN (TARGET SPOT) */}
                <g transform={`translate(${targetX}, ${targetY})`}>
                  {/* Pulsing Target Ring */}
                  <circle r="22" fill="#ef4444" fillOpacity="0.35" className="animate-ping" />
                  {/* Red Teardrop Marker Pin */}
                  <path
                    d="M 0 -26 C -10 -26 -16 -18 -16 -8 C -16 6 0 20 0 20 C 0 20 16 6 16 -8 C 16 -18 10 -26 0 -26 Z"
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  <circle cx="0" cy="-12" r="6" fill="#ffffff" />

                  {/* Destination Label Box */}
                  <rect x="-45" y="-48" width="90" height="18" rx="6" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
                  <text x="0" y="-35" fill="#fef08a" fontSize="10" fontWeight="900" textAnchor="middle">
                    SPOT {targetCode}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* BOTTOM GOOGLE MAPS NAVIGATION STEP & ETA PANEL */}
          <div className="bg-slate-900 border-t border-slate-800 text-white shrink-0">
            {/* ETA Primary Summary Bar */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-800 gap-4">
              <div className="flex items-center gap-3 sm:gap-6">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-baseline gap-1.5">
                    <span>35 sec</span>
                    <span className="text-xs text-slate-400 font-bold">
                      (~1 min drive)
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-bold flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      45 meters total
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-extrabold">Fastest Route</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowStepsList(!showStepsList)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Directions</span>
                  {showStepsList ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5" />
                  )}
                </button>

                {onBackToPass && (
                  <button
                    onClick={onBackToPass}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    Back to Pass
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#137333] hover:bg-[#0f5132] text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
                >
                  Close Map
                </button>
              </div>
            </div>

            {/* Expandable Turn-By-Turn Steps Sheet */}
            {showStepsList && (
              <div className="p-4 bg-slate-950 max-h-48 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2.5 border-t border-slate-800">
                {steps.map((s) => {
                  const IconComp = s.icon;
                  const isCurrent = activeStep === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveStep(s.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isCurrent
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 font-bold shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isCurrent
                            ? 'bg-[#137333] text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-black truncate text-white">
                            {s.id}. {s.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {s.dist}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {s.desc}
                        </p>
                      </div>
                      {isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
