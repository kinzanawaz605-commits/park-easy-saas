export type SpotStatus = 'available' | 'occupied' | 'reserved' | 'selected';

export type VehicleType = 'sedan' | 'suv' | 'ev' | 'motorcycle';

export interface ParkingSpot {
  id: string;
  code: string; // e.g. "A-12"
  floorId: string; // e.g. "floor-b1"
  zone: string; // e.g. "Zone A"
  status: SpotStatus;
  pricePerHour: number; // e.g. 3.50
  isEV: boolean;
  isAccessible: boolean;
  isVIP: boolean;
  distanceToElevator: number; // in meters, e.g. 15
  sensorActive: boolean;
  occupiedVehicle?: {
    plate: string;
    model: string;
    parkedAt: string;
  };
}

export interface FloorPlan {
  id: string;
  name: string; // e.g. "Floor B1"
  description: string;
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  reservedSpots: number;
}

export interface LocationInfo {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  floors: FloorPlan[];
}

export interface BookingRequest {
  spotId: string;
  durationMinutes: number;
  vehiclePlate: string;
  vehicleType: VehicleType;
  needEVCharging: boolean;
}

export interface ParkingPass {
  id: string; // e.g. "PK-8892"
  spotId: string;
  spotCode: string;
  zone: string;
  floorName: string;
  locationName: string;
  vehiclePlate: string;
  vehicleType: VehicleType;
  durationMinutes: number;
  startTime: string; // ISO string
  endTime: string; // ISO string
  totalAmount: number;
  entryPin: string;
  qrData: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface AISpotRecommendation {
  recommendedSpotId: string;
  spotCode: string;
  reasoning: string;
  matchScore: number; // 0-100
  keyFeatures: string[];
}
