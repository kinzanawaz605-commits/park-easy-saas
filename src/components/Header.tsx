import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  MapPin,
  ChevronDown,
  Ticket,
  CheckCircle2,
  Building2,
  ShoppingBag,
  Hospital,
} from 'lucide-react';
import { LocationInfo, FloorPlan } from '../types';

interface HeaderProps {
  locations: (LocationInfo & { category?: string })[];
  selectedLocationId: string;
  selectedFloorId: string;
  onSelectLocation: (locId: string) => void;
  onSelectFloor: (floorId: string) => void;
  onCustomLocationSubmit: (locationName: string) => void;
  liveTrafficActive: boolean;
  onToggleLiveTraffic: () => void;
  onOpenAIModal: () => void;
  onOpenReservationsDrawer: () => void;
  activeReservationsCount: number;
  currentFloor: FloorPlan | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  locations,
  selectedLocationId,
  selectedFloorId,
  onSelectLocation,
  onSelectFloor,
  onCustomLocationSubmit,
  liveTrafficActive,
  onToggleLiveTraffic,
  onOpenAIModal,
  onOpenReservationsDrawer,
  activeReservationsCount,
  currentFloor,
  searchQuery,
  onSearchChange,
}) => {
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const currentLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.category && loc.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      loc.floors.some((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = ['Shopping', 'Hospitals', 'Commercial Hubs', 'Custom Venues'];

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'Hospitals':
        return Hospital;
      case 'Commercial Hubs':
        return Building2;
      default:
        return ShoppingBag;
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      const exactMatch = locations.find(
        (l) => l.name.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      if (exactMatch) {
        onSelectLocation(exactMatch.id);
        if (exactMatch.floors.length > 0) {
          onSelectFloor(exactMatch.floors[0].id);
        }
      } else {
        onCustomLocationSubmit(searchQuery.trim());
      }
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Navigation Row */}
      <div className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto w-full">
        {/* Brand & Search */}
        <div className="flex items-center gap-6 md:gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowLocDropdown(!showLocDropdown)}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ParkEasy</span>
          </div>

          {/* Search Input with Dynamic Hybrid Combobox / Type Anything */}
          <div className="relative hidden md:flex items-center w-80 lg:w-[420px]">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search or Type ANY venue (e.g., Sector F-7 Market)..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              className="w-full pl-10 pr-20 py-2 bg-slate-100 border-transparent rounded-full text-xs lg:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  const exactMatch = locations.find(
                    (l) => l.name.toLowerCase() === searchQuery.trim().toLowerCase()
                  );
                  if (exactMatch) {
                    onSelectLocation(exactMatch.id);
                    if (exactMatch.floors.length > 0) {
                      onSelectFloor(exactMatch.floors[0].id);
                    }
                  } else {
                    onCustomLocationSubmit(searchQuery.trim());
                  }
                  setShowSearchDropdown(false);
                }}
                className="absolute right-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all shadow-xs"
              >
                Go
              </button>
            )}

            {showSearchDropdown && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-2 max-h-80 overflow-y-auto">
                {/* Custom Venue Option (Type Anything) */}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onCustomLocationSubmit(searchQuery.trim());
                    setShowSearchDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 bg-indigo-50/70 hover:bg-indigo-100/80 border-b border-indigo-100 flex items-center justify-between text-indigo-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-indigo-950">
                        Load custom venue: &quot;{searchQuery.trim()}&quot;
                      </div>
                      <div className="text-[10px] text-indigo-600">
                        Generate fresh 2D floor grid layout & parking spots
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    Type Anything ↵
                  </span>
                </button>

                {filteredLocations.length > 0 && (
                  <div className="px-4 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Existing Matching Venues
                  </div>
                )}

                {filteredLocations.map((loc) => {
                  const CatIcon = getCategoryIcon(loc.category);
                  return (
                    <div key={loc.id} className="border-b border-slate-100 last:border-0">
                      <button
                        onMouseDown={() => {
                          onSelectLocation(loc.id);
                          if (loc.floors.length > 0) {
                            onSelectFloor(loc.floors[0].id);
                          }
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900">{loc.name}</div>
                            <div className="text-xs text-slate-400">
                              {loc.address}, {loc.city}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                          {loc.category || 'Venue'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Location Pill & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Categorized Location Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLocDropdown(!showLocDropdown)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full cursor-pointer transition-colors text-slate-800 text-sm font-semibold"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="max-w-[160px] sm:max-w-none truncate">
                {currentLocation?.name} - {currentFloor?.name || 'Floor B1'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showLocDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-2 max-h-[80vh] overflow-y-auto">
                {/* Custom Venue Inline Type & Apply Form */}
                <div className="px-3 py-2.5 bg-indigo-50/80 border-b border-indigo-100 mb-1">
                  <div className="text-[11px] font-extrabold text-indigo-950 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Add Custom Location</span>
                    <span className="text-[9px] text-indigo-600 font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                      Type Anything
                    </span>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = form.elements.namedItem('customVenueInput') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        onCustomLocationSubmit(input.value.trim());
                        input.value = '';
                        setShowLocDropdown(false);
                      }
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <input
                      name="customVenueInput"
                      type="text"
                      placeholder="e.g. Grand Plaza, Sector F-7..."
                      className="flex-1 px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 font-medium placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                </div>

                <div className="px-4 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Select Venue & Floor
                </div>

                {categories.map((cat) => {
                  const catLocations = locations.filter((l) => l.category === cat);
                  if (catLocations.length === 0) return null;
                  const CatIcon = getCategoryIcon(cat);

                  return (
                    <div key={cat} className="mt-2 border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                      <div className="px-4 py-1 text-xs font-bold text-indigo-600 flex items-center gap-1.5 bg-indigo-50/50">
                        <CatIcon className="w-3.5 h-3.5" />
                        <span>{cat}</span>
                      </div>

                      {catLocations.map((loc) => {
                        const isLocSelected = loc.id === selectedLocationId;
                        return (
                          <div key={loc.id} className="px-2 py-1">
                            <button
                              onClick={() => {
                                onSelectLocation(loc.id);
                                if (loc.floors.length > 0) {
                                  onSelectFloor(loc.floors[0].id);
                                }
                                setShowLocDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                isLocSelected
                                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                  : 'text-slate-800 hover:bg-slate-100 font-semibold'
                              }`}
                            >
                              <div>
                                <div>{loc.name}</div>
                                <div className={isLocSelected ? 'text-indigo-200 text-[10px]' : 'text-slate-400 text-[10px]'}>
                                  {loc.city} • {loc.floors.length} Floors
                                </div>
                              </div>
                              {isLocSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAIModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-200" />
            <span>AI Finder</span>
          </button>

          {/* Passes Drawer Button */}
          <button
            onClick={onOpenReservationsDrawer}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all"
          >
            <Ticket className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">My Passes</span>
            {activeReservationsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[10px] font-extrabold rounded-full">
                {activeReservationsCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-xs flex items-center justify-center text-xs font-bold text-slate-700">
            JD
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="h-12 flex items-center justify-center gap-4 sm:gap-8 lg:gap-12 bg-white border-t border-slate-100 px-6 text-xs sm:text-sm overflow-x-auto">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="font-bold text-slate-900">{currentFloor?.totalSpots || 40}</span> Total Spots
        </div>
        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{currentFloor?.availableSpots || 14}</span> Available
        </div>
        <div className="flex items-center gap-2 text-rose-500 font-semibold">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>{currentFloor?.occupiedSpots || 22}</span> Occupied
        </div>
        <div className="flex items-center gap-2 text-amber-500 font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>{currentFloor?.reservedSpots || 4}</span> Reserved
        </div>
        <div className="h-4 w-px bg-slate-200 shrink-0" />
        <button
          onClick={onToggleLiveTraffic}
          className={`text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            liveTrafficActive ? 'text-indigo-600 hover:text-indigo-700 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${liveTrafficActive ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
          {liveTrafficActive ? 'SIMULATING TRAFFIC' : 'SIMULATE TRAFFIC'}
        </button>
      </div>
    </header>
  );
};
