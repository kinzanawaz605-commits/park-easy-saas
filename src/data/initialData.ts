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
    gateName: 'Gate A - Jinnah Avenue Entrance',
    basePrice: 3.5,
    floors: [
      {
        id: 'floor-b1',
        name: 'Floor B1',
        description: 'Main Shopping & Hypermarket Access - Express Level',
        totalSpots: 40,
        availableSpots: 18,
        occupiedSpots: 18,
        reservedSpots: 4,
      },
      {
        id: 'floor-b2',
        name: 'Floor B2',
        description: 'Food Court & Cinema Direct Elevator Entrance',
        totalSpots: 36,
        availableSpots: 16,
        occupiedSpots: 17,
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
    gateName: 'North Gate - Johar Town Blvd',
    basePrice: 4.0,
    floors: [
      {
        id: 'emp-zc',
        name: 'Zone C - Level 1',
        description: 'Hyperstar & Fashion Promenade Deck',
        totalSpots: 48,
        availableSpots: 22,
        occupiedSpots: 22,
        reservedSpots: 4,
      },
      {
        id: 'emp-zd',
        name: 'Zone D - Level 2',
        description: 'Fun Factory & Multiplex Elevator Deck',
        totalSpots: 40,
        availableSpots: 18,
        occupiedSpots: 18,
        reservedSpots: 4,
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
    gateName: 'South Gate - WTC Plaza Deck',
    basePrice: 3.0,
    floors: [
      {
        id: 'gig-l1',
        name: 'Level 1 - Express Deck',
        description: 'Main Concourse & Hypermarket Access',
        totalSpots: 36,
        availableSpots: 18,
        occupiedSpots: 14,
        reservedSpots: 4,
      },
      {
        id: 'gig-l2',
        name: 'Level 2 - Central Deck',
        description: 'Food Avenue & Atrium Elevators',
        totalSpots: 32,
        availableSpots: 14,
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
    gateName: 'Gate 2 - Walton Express Ramp',
    basePrice: 3.5,
    floors: [
      {
        id: 'pkg-p2',
        name: 'P2 Main Deck',
        description: 'Multiplex & Central Square Access',
        totalSpots: 36,
        availableSpots: 16,
        occupiedSpots: 16,
        reservedSpots: 4,
      },
      {
        id: 'pkg-p1',
        name: 'Hypermarket Deck Level 1',
        description: 'Carrefour Direct Loading & Express Bay',
        totalSpots: 32,
        availableSpots: 15,
        occupiedSpots: 13,
        reservedSpots: 4,
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
    gateName: 'OPD Gate 1 - Emergency Ramp',
    basePrice: 2.5,
    floors: [
      {
        id: 'shf-opd',
        name: 'OPD Parking Bay',
        description: 'Outpatient Clinic & Pharmacy Entrance',
        totalSpots: 24,
        availableSpots: 11,
        occupiedSpots: 10,
        reservedSpots: 3,
      },
      {
        id: 'shf-er',
        name: 'ER Rapid Bay',
        description: 'Emergency & Ambulance Express Zone',
        totalSpots: 20,
        availableSpots: 9,
        occupiedSpots: 9,
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
    gateName: 'Trauma Entrance Gate 3',
    basePrice: 2.0,
    floors: [
      {
        id: 'doc-er',
        name: 'Emergency Bay',
        description: 'Immediate Care & Trauma Center Access',
        totalSpots: 24,
        availableSpots: 12,
        occupiedSpots: 10,
        reservedSpots: 2,
      },
      {
        id: 'doc-spec',
        name: 'Specialist Deck',
        description: 'Consultant Suites & Diagnostics Wing',
        totalSpots: 24,
        availableSpots: 11,
        occupiedSpots: 11,
        reservedSpots: 2,
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
    gateName: 'Main Gate - Stadium Road Ramp',
    basePrice: 2.5,
    floors: [
      {
        id: 'aga-a',
        name: 'Block A Parking',
        description: 'Main Inpatient & Surgery Wing',
        totalSpots: 28,
        availableSpots: 13,
        occupiedSpots: 12,
        reservedSpots: 3,
      },
      {
        id: 'aga-b',
        name: 'Block B Deck',
        description: 'Children & Maternity Complex',
        totalSpots: 28,
        availableSpots: 14,
        occupiedSpots: 11,
        reservedSpots: 3,
      },
    ],
  },

  // Commercial Hubs
  {
    id: 'loc-bata',
    name: 'Centaurus Corporate Towers',
    city: 'Islamabad',
    address: 'Jinnah Avenue, Blue Area',
    rating: 4.8,
    category: 'Commercial Hubs',
    gateName: 'Underground Ramp 1 - Executive Bay',
    basePrice: 5.0,
    floors: [
      {
        id: 'bat-u1',
        name: 'Underground B1',
        description: 'Executive Tower & Corporate Offices',
        totalSpots: 36,
        availableSpots: 16,
        occupiedSpots: 16,
        reservedSpots: 4,
      },
      {
        id: 'bat-u2',
        name: 'Underground B2',
        description: 'Long-term Corporate Fleet Deck',
        totalSpots: 30,
        availableSpots: 14,
        occupiedSpots: 14,
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
    gateName: 'Plaza Gate B - Main Boulevard',
    basePrice: 4.5,
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
    gateName: 'Basement Ramp A - Chundrigar Rd',
    basePrice: 5.0,
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

// Helper to generate realistic, location-specific spots for any floor ID
export function generateFloorSpots(
  floorId: string,
  count: number = 32,
  overrideBasePrice?: number,
  overridePrefix?: string
): ParkingSpot[] {
  // Determine a unique spot prefix letter based on floorId or location
  let prefixLetter = overridePrefix || '';
  if (!prefixLetter) {
    if (floorId === 'floor-b1') prefixLetter = 'B1';
    else if (floorId === 'floor-b2') prefixLetter = 'B2';
    else if (floorId === 'floor-b3') prefixLetter = 'B3';
    else if (floorId === 'vip-zone') prefixLetter = 'VIP';
    else if (floorId.includes('gig')) prefixLetter = floorId.includes('2') ? 'GM2' : 'GM1';
    else if (floorId.includes('emp')) prefixLetter = floorId.includes('2') ? 'EM2' : 'EM1';
    else if (floorId.includes('pkg')) prefixLetter = floorId.includes('2') ? 'PM2' : 'PM1';
    else if (floorId.includes('shf')) prefixLetter = floorId.includes('2') ? 'PH2' : 'PH1';
    else if (floorId.includes('doc')) prefixLetter = floorId.includes('2') ? 'DH2' : 'DH1';
    else if (floorId.includes('aga')) prefixLetter = floorId.includes('b') ? 'AK2' : 'AK1';
    else if (floorId.includes('bat')) prefixLetter = floorId.includes('2') ? 'BA2' : 'BA1';
    else if (floorId.includes('gh')) prefixLetter = floorId.includes('3') ? 'GH3' : 'GH2';
    else if (floorId.includes('fc')) prefixLetter = floorId.includes('exec') ? 'FC-VIP' : 'FC1';
    else if (floorId.includes('centaurus') || floorId.includes('floor')) {
      prefixLetter = floorId.includes('2') ? 'C2' : 'C1';
    } else {
      const clean = floorId.replace(/^fl-loc-custom-/, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      prefixLetter = clean.substring(0, 3) || 'A';
    }
  }

  // Base price calculation
  const basePrice = overrideBasePrice || (floorId.includes('vip') ? 8.0 : floorId.includes('bat') || floorId.includes('fc') ? 5.0 : 3.0);

  // Deterministic seed based on floorId string length & characters
  let seed = 0;
  for (let c = 0; c < floorId.length; c++) {
    seed += floorId.charCodeAt(c);
  }

  return Array.from({ length: count }, (_, i) => {
    const num = i + 1;
    const isZoneA = num <= Math.ceil(count / 2);
    const zoneName = isZoneA ? 'Zone A' : 'Zone B';
    const numInZone = isZoneA ? num : num - Math.floor(count / 2);
    const code = `${prefixLetter}-${String(numInZone).padStart(2, '0')}`;

    // Calculate unique status pattern for this floorId
    const pseudoRand = (seed + num * 17) % 100;
    let status: 'available' | 'occupied' | 'reserved' = 'available';
    if (pseudoRand < 48) {
      status = 'occupied';
    } else if (pseudoRand > 88) {
      status = 'reserved';
    }

    const price = Number((basePrice + (num % 3) * 0.50).toFixed(2));

    return {
      id: `${floorId}-${code.toLowerCase()}`,
      code,
      floorId,
      zone: zoneName,
      status,
      pricePerHour: price,
      isEV: (num + seed) % 5 === 0,
      isAccessible: (num + seed) % 7 === 0,
      isVIP: floorId.includes('vip') || floorId.includes('exec') || num === 1,
      distanceToElevator: (num * 2) + ((seed % 5) + 3),
      sensorActive: true,
      occupiedVehicle:
        status === 'occupied'
          ? {
              plate: `${prefixLetter}-${1000 + ((seed * 7 + num * 43) % 8999)}`,
              model: (num + seed) % 2 === 0 ? 'Tesla Model Y' : (num + seed) % 3 === 0 ? 'BMW i4' : 'Honda Civic',
              parkedAt: `${8 + (num % 4)}:${(num * 7) % 60 < 10 ? '0' : ''}${(num * 7) % 60} AM`,
            }
          : undefined,
    };
  });
}

// Pre-generated Floor B1 deterministic spot dataset
export const INITIAL_SPOTS_B1: ParkingSpot[] = generateFloorSpots('floor-b1', 40);
export const INITIAL_SPOTS_B2: ParkingSpot[] = generateFloorSpots('floor-b2', 36);
export const INITIAL_SPOTS_VIP: ParkingSpot[] = generateFloorSpots('vip-zone', 20);
