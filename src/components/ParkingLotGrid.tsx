import React, { useState } from 'react';
import {
  Zap,
  Accessibility,
  Crown,
  Car,
  Compass,
  ArrowRight,
  Info,
  Check,
  Navigation,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ParkingSpot, FloorPlan } from '../types';

interface ParkingLotGridProps {
  floors: FloorPlan[];
  selectedFloorId: string;
  onSelectFloor: (floorId: string) => void;
  spots: ParkingSpot[];
  selectedSpotId: string | null;
  onSelectSpot: (spot: ParkingSpot) => void;
  highlightedWayfindingSpotCode?: string | null;
  onClearWayfinding?: () => void;
}

export const ParkingLotGrid: React.FC<ParkingLotGridProps> = ({
  floors,
  selectedFloorId,
  onSelectFloor,
  spots,
  selectedSpotId,
  onSelectSpot,
  highlightedWayfindingSpotCode,
  onClearWayfinding,
}) => {
  const [filterType, setFilterType] = useState<
    'all' | 'available' | 'ev' | 'accessible' | 'vip' | 'cheap'
  >('all');
  const [hoveredSpot, setHoveredSpot] = useState<ParkingSpot | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter spots
  const filteredSpots = spots.filter((spot) => {
    if (filterType === 'available') return spot.status === 'available';
    if (filterType === 'ev') return spot.isEV;
    if (filterType === 'accessible') return spot.isAccessible;
    if (filterType === 'vip') return spot.isVIP;
    if (filterType === 'cheap') return spot.pricePerHour <= 3.0;
    return true;
  });

  // Group by zone
  const zones = Array.from(new Set(spots.map((s) => s.zone)));

  const handleMouseEnter = (e: React.MouseEvent, spot: ParkingSpot) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    setHoveredSpot(spot);
  };

  const handleMouseLeave = () => {
    setHoveredSpot(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 p-6 overflow-hidden min-h-[600px]">
      {/* Floor Plan Selector Tabs & Map Info Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-1 p-1 bg-slate-200 rounded-lg">
          {floors.map((floor) => {
            const isActive = floor.id === selectedFloorId;
            return (
              <button
                key={floor.id}
                onClick={() => onSelectFloor(floor.id)}
                className={`px-4 py-1.5 text-sm rounded-md transition-all font-semibold flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{floor.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {floor.availableSpots} Free
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('available')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterType === 'available'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Available Only
          </button>
          <button
            onClick={() => setFilterType('ev')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
              filterType === 'ev'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
            EV Charger
          </button>
          <button
            onClick={() => setFilterType('accessible')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterType === 'accessible'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            Accessible
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold tracking-wider">
          <Info className="w-4 h-4 text-slate-400" />
          MAP VIEW (SCALE 1:25)
        </div>
      </div>

      {/* Active Wayfinding Banner */}
      {highlightedWayfindingSpotCode && (
        <div className="mb-3 bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center justify-between text-xs font-medium shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>
              Wayfinding Navigation Active to Spot <strong>{highlightedWayfindingSpotCode}</strong>
            </span>
          </div>
          <button
            onClick={onClearWayfinding}
            className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-800 rounded-lg text-indigo-100 text-[11px] font-bold"
          >
            Clear Route
          </button>
        </div>
      )}

      {/* Geometric Balance Canvas Card */}
      <div className="flex-1 relative bg-white border border-slate-200 rounded-2xl shadow-inner flex flex-col items-center justify-start p-6 md:p-8 overflow-auto">
        {/* Lane Divider & Grid Layout */}
        <div className="w-full max-w-4xl space-y-8 relative my-auto">
          {zones.map((zoneName) => {
            const zoneSpots = filteredSpots.filter((s) => s.zone === zoneName);
            if (zoneSpots.length === 0) return null;

            return (
              <div key={zoneName} className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                  <span>{zoneName}</span>
                  <span className="text-emerald-600">
                    {zoneSpots.filter((s) => s.status === 'available').length} Free
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 relative">
                  {/* Central Driving Lane Divider */}
                  <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 w-12 -ml-6 flex-col items-center justify-around pointer-events-none">
                    <div className="h-full w-0.5 border-r-2 border-dashed border-slate-200" />
                    <div className="absolute top-1/4 text-slate-300 text-2xl font-black rotate-180">↑</div>
                    <div className="absolute bottom-1/4 text-slate-300 text-2xl font-black">↑</div>
                  </div>

                  {/* Left Column Slots */}
                  <div className="grid grid-cols-2 gap-3">
                    {zoneSpots.slice(0, Math.ceil(zoneSpots.length / 2)).map((spot) => {
                      const isSelected = spot.id === selectedSpotId;
                      const isWayfinding = spot.code === highlightedWayfindingSpotCode;

                      // Geometric Balance Slot Card Styles
                      let cardStyle =
                        'bg-[#ecfdf5] border-[#10b98133] text-[#059669] hover:scale-105 hover:border-[#10b981]';
                      let dotColor = 'bg-emerald-500';

                      if (spot.status === 'occupied') {
                        cardStyle =
                          'bg-[#f1f5f9] border-[#e2e8f0] text-[#94a3b8] cursor-not-allowed';
                        dotColor = 'bg-slate-300';
                      } else if (spot.status === 'reserved') {
                        cardStyle =
                          'bg-[#fffbeb] border-[#f59e0b33] text-[#d97706]';
                        dotColor = 'bg-amber-500';
                      }

                      if (isSelected) {
                        cardStyle =
                          'bg-white border-2 border-indigo-600 text-indigo-600 shadow-md ring-2 ring-indigo-100 z-10 scale-105';
                        dotColor = 'bg-indigo-600';
                      }

                      if (isWayfinding) {
                        cardStyle += ' ring-4 ring-amber-400 animate-pulse';
                      }

                      return (
                        <div
                          key={spot.id}
                          onClick={() => {
                            if (spot.status === 'available') {
                              onSelectSpot(spot);
                            }
                          }}
                          onMouseEnter={(e) => handleMouseEnter(e, spot)}
                          onMouseLeave={handleMouseLeave}
                          className={`h-16 rounded-xl border p-2 flex flex-col items-center justify-between font-black text-xs transition-all cursor-pointer relative ${cardStyle}`}
                        >
                          <div className="w-full flex items-center justify-between text-[11px]">
                            <span>{spot.code}</span>
                            <div className="flex items-center gap-1">
                              {spot.isEV && <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />}
                              {spot.isAccessible && <Accessibility className="w-3 h-3 text-blue-500" />}
                              {spot.isVIP && <Crown className="w-3 h-3 text-purple-500" />}
                            </div>
                          </div>

                          <div className="flex items-center justify-between w-full text-[10px]">
                            <span className="font-semibold text-slate-500">${spot.pricePerHour.toFixed(2)}/h</span>
                            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column Slots */}
                  <div className="grid grid-cols-2 gap-3">
                    {zoneSpots.slice(Math.ceil(zoneSpots.length / 2)).map((spot) => {
                      const isSelected = spot.id === selectedSpotId;
                      const isWayfinding = spot.code === highlightedWayfindingSpotCode;

                      let cardStyle =
                        'bg-[#ecfdf5] border-[#10b98133] text-[#059669] hover:scale-105 hover:border-[#10b981]';
                      let dotColor = 'bg-emerald-500';

                      if (spot.status === 'occupied') {
                        cardStyle =
                          'bg-[#f1f5f9] border-[#e2e8f0] text-[#94a3b8] cursor-not-allowed';
                        dotColor = 'bg-slate-300';
                      } else if (spot.status === 'reserved') {
                        cardStyle =
                          'bg-[#fffbeb] border-[#f59e0b33] text-[#d97706]';
                        dotColor = 'bg-amber-500';
                      }

                      if (isSelected) {
                        cardStyle =
                          'bg-white border-2 border-indigo-600 text-indigo-600 shadow-md ring-2 ring-indigo-100 z-10 scale-105';
                        dotColor = 'bg-indigo-600';
                      }

                      if (isWayfinding) {
                        cardStyle += ' ring-4 ring-amber-400 animate-pulse';
                      }

                      return (
                        <div
                          key={spot.id}
                          onClick={() => {
                            if (spot.status === 'available') {
                              onSelectSpot(spot);
                            }
                          }}
                          onMouseEnter={(e) => handleMouseEnter(e, spot)}
                          onMouseLeave={handleMouseLeave}
                          className={`h-16 rounded-xl border p-2 flex flex-col items-center justify-between font-black text-xs transition-all cursor-pointer relative ${cardStyle}`}
                        >
                          <div className="w-full flex items-center justify-between text-[11px]">
                            <span>{spot.code}</span>
                            <div className="flex items-center gap-1">
                              {spot.isEV && <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />}
                              {spot.isAccessible && <Accessibility className="w-3 h-3 text-blue-500" />}
                              {spot.isVIP && <Crown className="w-3 h-3 text-purple-500" />}
                            </div>
                          </div>

                          <div className="flex items-center justify-between w-full text-[10px]">
                            <span className="font-semibold text-slate-500">${spot.pricePerHour.toFixed(2)}/h</span>
                            <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredSpot && (
        <div
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="fixed z-50 w-60 bg-slate-900 text-white p-3 rounded-2xl shadow-2xl pointer-events-none text-xs space-y-2 animate-fade-in border border-slate-700"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-slate-100">
              Spot {hoveredSpot.code} ({hoveredSpot.zone})
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                hoveredSpot.status === 'available'
                  ? 'bg-emerald-500 text-slate-950'
                  : hoveredSpot.status === 'occupied'
                  ? 'bg-slate-600 text-white'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              {hoveredSpot.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-slate-300">
            <div>Rate: <strong className="text-white">${hoveredSpot.pricePerHour.toFixed(2)}/hr</strong></div>
            <div>Elevator: <strong className="text-white">{hoveredSpot.distanceToElevator}m</strong></div>
            <div>EV Charger: <strong className={hoveredSpot.isEV ? 'text-amber-400 font-bold' : 'text-slate-400'}>{hoveredSpot.isEV ? 'Yes' : 'No'}</strong></div>
            <div>Accessible: <strong className={hoveredSpot.isAccessible ? 'text-blue-400 font-bold' : 'text-slate-400'}>{hoveredSpot.isAccessible ? 'Yes' : 'No'}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};
