import { LocationInfo, ParkingSpot } from '../types';

export const INITIAL_LOCATIONS: (LocationInfo & { category?: string })[] = [
  // Shopping
  {
    id: 'loc-centaurus',
    name: 'Centaurus Mall',
    city: 'Islamabad',
    address: 'Jinnah Avenue, F-8/4',
    rating: 4.9,
    category: 'Shopping',
    floors: [
      {
        id: 'floor-b1',
        name: 'Floor B1',
        description: 'Main Shopping & Hypermarket Access - Express Level',
        totalSpots: 40,
        availableSpots: 14,
        occupiedSpots: 22,
        reservedSpots: 4,
      },
      {
        id: 'floor-b2',
        name: 'Floor B2',
        description: 'Food Court & Cinema Direct Elevator Entrance',
        totalSpots: 36,
        availableSpots: 18,
        occupiedSpots: 15,
        reservedSpots: 3,
      },
      {
        id: 'vip-zone',
        name: 'VIP Zone',
        description: 'Valet Concierge, Supercharger Hub & Premium Suites',
        totalSpots: 20,
        availableSpots: 8,
        occupiedSpots: 10,
        reservedSpots: 2,
      },
    ],
  },
  {
    id: 'loc-emporium',
    name: 'Emporium Mall',
    city: 'Lahore',
    address: 'Abdul Haque Rd, Johar Town',
    rating: 4.9,
    category: 'Shopping',
    floors: [
      {
        id: 'emp-zc',
        name: 'Zone C - Level 1',
        description: 'Hyperstar & Fashion Promenade Deck',
        totalSpots: 32,
        availableSpots: 15,
        occupiedSpots: 14,
        reservedSpots: 3,
      },
      {
        id: 'emp-zd',
        name: 'Zone D - Level 2',
        description: 'Fun Factory & Multiplex Elevator Deck',
        totalSpots: 30,
        availableSpots: 12,
        occupiedSpots: 15,
        reservedSpots: 3,
      },
    ],
  },
  {
    id: 'loc-giga',
    name: 'Giga Mall',
    city: 'Islamabad',
    address: 'World Trade Center, DHA Phase 2',
    rating: 4.8,
    category: 'Shopping',
    floors: [
      {
        id: 'gig-l1',
        name: 'Level 1 - Express Deck',
        description: 'Main Concourse & Hypermarket Access',
        totalSpots: 32,
        availableSpots: 16,
        occupiedSpots: 12,
        reservedSpots: 4,
      },
      {
        id: 'gig-l2',
        name: 'Level 2 - Central Deck',
        description: 'Food Avenue & Atrium Elevators',
        totalSpots: 28,
        availableSpots: 10,
        occupiedSpots: 16,
        reservedSpots: 2,
      },
    ],
  },
  {
    id: 'loc-packages',
    name: 'Packages Mall',
    city: 'Lahore',
    address: 'Walton Road, Gulberg',
    rating: 4.8,
    category: 'Shopping',
    floors: [
      {
        id: 'pkg-p2',
        name: 'P2 Main Deck',
        description: 'Multiplex & Central Square Access',
        totalSpots: 32,
        availableSpots: 14,
        occupiedSpots: 15,
        reservedSpots: 3,
      },
      {
        id: 'pkg-p3',
        name: 'P3 Upper Deck',
        description: 'Rooftop & Fitness Zone Deck',
        totalSpots: 30,
        availableSpots: 15,
        occupiedSpots: 12,
        reservedSpots: 3,
      },
    ],
  },

  // Hospitals
  {
    id: 'loc-shifa',
    name: 'Shifa International Hospital',
    city: 'Islamabad',
    address: 'Pitras Bukhari Rd, H-8/4',
    rating: 4.9,
    category: 'Hospitals',
    floors: [
      {
        id: 'shf-opd',
        name: 'OPD Parking Bay',
        description: 'Outpatient Clinic & Pharmacy Entrance',
        totalSpots: 28,
        availableSpots: 12,
        occupiedSpots: 14,
        reservedSpots: 2,
      },
      {
        id: 'shf-er',
        name: 'ER Rapid Bay',
        description: 'Emergency & Ambulance Express Zone',
        totalSpots: 20,
        availableSpots: 8,
        occupiedSpots: 10,
        reservedSpots: 2,
      },
    ],
  },
  {
    id: 'loc-doctors',
    name: 'Doctors Hospital',
    city: 'Lahore',
    address: '152-G3 Johar Town, Canal Bank',
    rating: 4.7,
    category: 'Hospitals',
    floors: [
      {
        id: 'doc-er',
        name: 'Emergency Bay',
        description: 'Immediate Care & Trauma Center Access',
        totalSpots: 24,
        availableSpots: 10,
        occupiedSpots: 12,
        reservedSpots: 2,
      },
      {
        id: 'doc-spec',
        name: 'Specialist Deck',
        description: 'Consultant Suites & Diagnostics Wing',
        totalSpots: 28,
        availableSpots: 14,
        occupiedSpots: 11,
        reservedSpots: 3,
      },
    ],
  },
  {
    id: 'loc-agakhan',
    name: 'Aga Khan Hospital',
    city: 'Karachi',
    address: 'National Stadium Rd',
    rating: 4.9,
    category: 'Hospitals',
    floors: [
      {
        id: 'aga-a',
        name: 'Block A Parking',
        description: 'Main Inpatient & Surgery Wing',
        totalSpots: 32,
        availableSpots: 15,
        occupiedSpots: 14,
        reservedSpots: 3,
      },
      {
        id: 'aga-b',
        name: 'Block B Deck',
        description: 'Children & Maternity Complex',
        totalSpots: 30,
        availableSpots: 12,
        occupiedSpots: 15,
        reservedSpots: 3,
      },
    ],
  },

  // Commercial Hubs
  {
    id: 'loc-bluearea',
    name: 'Blue Area Tower 3',
    city: 'Islamabad',
    address: 'Jinnah Avenue, Blue Area',
    rating: 4.8,
    category: 'Commercial Hubs',
    floors: [
      {
        id: 'bat-u1',
        name: 'Underground B1',
        description: 'Executive Tower & Corporate Offices',
        totalSpots: 30,
        availableSpots: 14,
        occupiedSpots: 13,
        reservedSpots: 3,
      },
      {
        id: 'bat-u2',
        name: 'Underground B2',
        description: 'Long-term Corporate Fleet Deck',
        totalSpots: 30,
        availableSpots: 16,
        occupiedSpots: 12,
        reservedSpots: 2,
      },
    ],
  },
  {
    id: 'loc-gulberg',
    name: 'Gulberg Heights',
    city: 'Lahore',
    address: 'Main Boulevard, Gulberg III',
    rating: 4.7,
    category: 'Commercial Hubs',
    floors: [
      {
        id: 'gh-b2',
        name: 'Floor B2',
        description: 'Business Center & Tech Hub Deck',
        totalSpots: 28,
        availableSpots: 12,
        occupiedSpots: 14,
        reservedSpots: 2,
      },
      {
        id: 'gh-b3',
        name: 'Floor B3',
        description: 'Coworking & Conference Deck',
        totalSpots: 28,
        availableSpots: 15,
        occupiedSpots: 11,
        reservedSpots: 2,
      },
    ],
  },
  {
    id: 'loc-financial',
    name: 'Financial Center',
    city: 'Karachi',
    address: 'I.I. Chundrigar Road',
    rating: 4.8,
    category: 'Commercial Hubs',
    floors: [
      {
        id: 'fc-u1',
        name: 'Underground Deck',
        description: 'Banking Plaza & Stock Exchange Access',
        totalSpots: 32,
        availableSpots: 14,
        occupiedSpots: 15,
        reservedSpots: 3,
      },
      {
        id: 'fc-exec',
        name: 'Executive Suite Deck',
        description: 'Reserved VIP & Boardroom Suite Bay',
        totalSpots: 20,
        availableSpots: 9,
        occupiedSpots: 9,
        reservedSpots: 2,
      },
    ],
  },
];

// Helper to generate realistic spots for any floor ID
export function generateFloorSpots(floorId: string, count: number = 32): ParkingSpot[] {
  const prefix = floorId.split('-')[0].toUpperCase();
  return Array.from({ length: count }, (_, i) => {
    const num = i + 1;
    const isZoneA = num <= Math.ceil(count / 2);
    const zoneName = isZoneA ? 'Zone A' : 'Zone B';
    const code = `${isZoneA ? 'A' : 'B'}-${String(isZoneA ? num : num - Math.floor(count / 2)).padStart(2, '0')}`;

    let status: 'available' | 'occupied' | 'reserved' = 'available';
    if (num % 2 === 0 && num % 6 !== 0) status = 'occupied';
    if (num % 9 === 0) status = 'reserved';

    return {
      id: `${floorId}-${code.toLowerCase()}`,
      code,
      floorId,
      zone: zoneName,
      status,
      pricePerHour: 3.0 + (num % 3) * 0.5,
      isEV: num % 4 === 0,
      isAccessible: num % 7 === 0,
      isVIP: floorId.includes('vip') || floorId.includes('exec') || num === 1,
      distanceToElevator: (num * 2) + 5,
      sensorActive: true,
      occupiedVehicle:
        status === 'occupied'
          ? {
              plate: `${prefix}-${1000 + num * 43}`,
              model: num % 2 === 0 ? 'Honda Civic' : 'Toyota Corolla',
              parkedAt: '10:15 AM',
            }
          : undefined,
    };
  });
}

// Pre-generated Floor B1 deterministic spot dataset
export const INITIAL_SPOTS_B1: ParkingSpot[] = generateFloorSpots('floor-b1', 40);
export const INITIAL_SPOTS_B2: ParkingSpot[] = generateFloorSpots('floor-b2', 36);
export const INITIAL_SPOTS_VIP: ParkingSpot[] = generateFloorSpots('vip-zone', 20);
