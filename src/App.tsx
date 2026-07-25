import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ParkingLotGrid } from './components/ParkingLotGrid';
import { BookingPanel } from './components/BookingPanel';
import { QRPassModal } from './components/QRPassModal';
import { AISpotModal } from './components/AISpotModal';
import { ReservationsDrawer } from './components/ReservationsDrawer';
import { WayfindingModal } from './components/WayfindingModal';
import { LocationInfo, ParkingSpot, ParkingPass, VehicleType } from './types';
import { INITIAL_LOCATIONS, INITIAL_SPOTS_B1 } from './data/initialData';

export default function App() {
  const [locations, setLocations] = useState<LocationInfo[]>(INITIAL_LOCATIONS);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('loc-centaurus');
  const [selectedFloorId, setSelectedFloorId] = useState<string>('floor-b1');
  const [spots, setSpots] = useState<ParkingSpot[]>(INITIAL_SPOTS_B1);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [activePasses, setActivePasses] = useState<ParkingPass[]>([]);
  const [activeModalPass, setActiveModalPass] = useState<ParkingPass | null>(null);
  const [liveTrafficActive, setLiveTrafficActive] = useState<boolean>(true);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [showReservationsDrawer, setShowReservationsDrawer] = useState<boolean>(false);
  const [highlightedWayfindingSpotCode, setHighlightedWayfindingSpotCode] = useState<string | null>(null);
  const [wayfindingModalSpotCode, setWayfindingModalSpotCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch locations
  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch('/api/locations');
      if (res.ok) {
        const data = await res.json();
        if (data.locations && data.locations.length > 0) {
          setLocations(data.locations);
        }
      }
    } catch (err) {
      console.warn('API fetch locations error, fallback initialized:', err);
    }
  }, []);

  // Fetch spots for selected floor
  const fetchSpots = useCallback(async (floorId: string) => {
    try {
      const res = await fetch(`/api/spots?floorId=${floorId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.spots) {
          setSpots(data.spots);
        }
      }
    } catch (err) {
      console.warn('API fetch spots error:', err);
    }
  }, []);

  // Fetch active bookings
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (data.bookings) {
          setActivePasses(data.bookings);
        }
      }
    } catch (err) {
      console.warn('API fetch bookings error:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLocations();
    fetchSpots(selectedFloorId);
    fetchBookings();
  }, [fetchLocations, fetchSpots, fetchBookings, selectedFloorId]);

  // Handle Live Traffic Simulation interval (every 5s)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (liveTrafficActive) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/spots/toggle-traffic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ floorId: selectedFloorId }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.spots) {
              setSpots(data.spots);
              fetchLocations(); // refresh metric counts
            }
          }
        } catch (err) {
          console.error('Traffic simulation error:', err);
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveTrafficActive, selectedFloorId, fetchLocations]);

  const currentLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];
  const currentFloors = currentLocation ? currentLocation.floors : [];
  const currentFloor = currentFloors.find((f) => f.id === selectedFloorId) || currentFloors[0] || null;

  // Handle Spot Selection
  const handleSelectSpot = (spot: ParkingSpot) => {
    setSelectedSpot((prev) => (prev?.id === spot.id ? null : spot));
  };

  // Handle Location Selection
  const handleSelectLocation = (locId: string) => {
    setSelectedLocationId(locId);
    setSelectedSpot(null);
    const targetLoc = locations.find((l) => l.id === locId);
    if (targetLoc && targetLoc.floors.length > 0) {
      const firstFloorId = targetLoc.floors[0].id;
      setSelectedFloorId(firstFloorId);
      fetchSpots(firstFloorId);
    }
  };

  // Select floor
  const handleSelectFloor = (floorId: string) => {
    setSelectedFloorId(floorId);
    setSelectedSpot(null);
    fetchSpots(floorId);
  };

  // Dynamic Custom Location Creation (Type Anything)
  const handleCustomLocationSubmit = async (locationName: string) => {
    if (!locationName.trim()) return;
    try {
      const res = await fetch('/api/locations/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: locationName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.location) {
          const newLoc = data.location;
          setLocations((prev) => {
            const exists = prev.some((l) => l.id === newLoc.id);
            return exists ? prev : [newLoc, ...prev];
          });
          setSelectedLocationId(newLoc.id);
          setSelectedSpot(null);
          if (newLoc.floors && newLoc.floors.length > 0) {
            const firstFloorId = newLoc.floors[0].id;
            setSelectedFloorId(firstFloorId);
            fetchSpots(firstFloorId);
          }
          setSearchQuery('');
        }
      }
    } catch (err) {
      console.error('Custom location error:', err);
    }
  };

  // Handle Confirm Booking
  const handleConfirmBooking = async (bookingData: {
    spotId: string;
    durationMinutes: number;
    vehiclePlate: string;
    vehicleType: VehicleType;
    needEVCharging: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Failed to book spot.');
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      if (data.pass) {
        setActiveModalPass(data.pass);
        setSelectedSpot(null);
        await fetchSpots(selectedFloorId);
        await fetchLocations();
        await fetchBookings();
      }
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel reservation
  const handleCancelReservation = async (passId: string) => {
    try {
      const res = await fetch(`/api/bookings/${passId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchSpots(selectedFloorId);
        await fetchLocations();
        await fetchBookings();
        if (activeModalPass?.id === passId) {
          setActiveModalPass(null);
        }
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
    }
  };

  // Select recommended spot from AI
  const handleSelectRecommendedSpot = (spotId: string) => {
    const recSpot = spots.find((s) => s.id === spotId);
    if (recSpot && recSpot.status === 'available') {
      setSelectedSpot(recSpot);
    }
  };

  const handleTriggerWayfinding = (spotCode: string) => {
    setHighlightedWayfindingSpotCode(spotCode);
    setWayfindingModalSpotCode(spotCode);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header Navbar */}
      <Header
        locations={locations}
        selectedLocationId={selectedLocationId}
        selectedFloorId={selectedFloorId}
        onSelectLocation={handleSelectLocation}
        onSelectFloor={handleSelectFloor}
        onCustomLocationSubmit={handleCustomLocationSubmit}
        liveTrafficActive={liveTrafficActive}
        onToggleLiveTraffic={() => setLiveTrafficActive(!liveTrafficActive)}
        onOpenAIModal={() => setShowAIModal(true)}
        onOpenReservationsDrawer={() => setShowReservationsDrawer(true)}
        activeReservationsCount={activePasses.filter((p) => p.status === 'active').length}
        currentFloor={currentFloor}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row shadow-xs">
        {/* Left 2D Interactive Parking Lot Canvas */}
        <ParkingLotGrid
          key={`${selectedLocationId}-${selectedFloorId}`}
          floors={currentFloors}
          selectedFloorId={selectedFloorId}
          onSelectFloor={handleSelectFloor}
          spots={spots}
          selectedSpotId={selectedSpot?.id || null}
          onSelectSpot={handleSelectSpot}
          highlightedWayfindingSpotCode={highlightedWayfindingSpotCode}
          onClearWayfinding={() => setHighlightedWayfindingSpotCode(null)}
        />

        {/* Right Dynamic Booking & Pass Panel */}
        <BookingPanel
          selectedSpot={selectedSpot}
          onConfirmBooking={handleConfirmBooking}
          onOpenAIModal={() => setShowAIModal(true)}
          isSubmitting={isSubmitting}
        />
      </main>

      {/* Digital QR Code Parking Pass Modal */}
      {activeModalPass && (
        <QRPassModal
          pass={activeModalPass}
          onClose={() => setActiveModalPass(null)}
          onCancelReservation={handleCancelReservation}
          onShowDirections={(spotCode) => handleTriggerWayfinding(spotCode)}
        />
      )}

      {/* Indoor Spot Navigation & Wayfinding Modal */}
      {wayfindingModalSpotCode && (
        <WayfindingModal
          pass={activeModalPass}
          spotCode={wayfindingModalSpotCode}
          locationName={currentLocation?.name}
          gateName={currentLocation?.gateName}
          floorName={currentFloor?.name}
          onClose={() => setWayfindingModalSpotCode(null)}
          onBackToPass={() => {
            setWayfindingModalSpotCode(null);
            if (!activeModalPass && activePasses.length > 0) {
              setActiveModalPass(activePasses[0]);
            }
          }}
        />
      )}

      {/* AI Assistant Modal */}
      {showAIModal && (
        <AISpotModal
          floorId={selectedFloorId}
          onClose={() => setShowAIModal(false)}
          onSelectRecommendedSpot={handleSelectRecommendedSpot}
        />
      )}

      {/* User Reservations Slide-Over Drawer */}
      {showReservationsDrawer && (
        <ReservationsDrawer
          passes={activePasses}
          onClose={() => setShowReservationsDrawer(false)}
          onOpenPassModal={(pass) => {
            setActiveModalPass(pass);
            setShowReservationsDrawer(false);
          }}
          onCancelPass={handleCancelReservation}
          onShowDirections={(spotCode) => {
            handleTriggerWayfinding(spotCode);
            setShowReservationsDrawer(false);
          }}
        />
      )}
    </div>
  );
}
