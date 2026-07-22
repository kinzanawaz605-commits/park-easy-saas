import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_LOCATIONS,
  INITIAL_SPOTS_B1,
  INITIAL_SPOTS_B2,
  INITIAL_SPOTS_VIP,
  generateFloorSpots,
} from './src/data/initialData';
import { ParkingSpot, ParkingPass, AISpotRecommendation } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
let locations = [...INITIAL_LOCATIONS];
let spotMap: Record<string, ParkingSpot[]> = {
  'floor-b1': [...INITIAL_SPOTS_B1],
  'floor-b2': [...INITIAL_SPOTS_B2],
  'vip-zone': [...INITIAL_SPOTS_VIP],
};

let activeBookings: ParkingPass[] = [];

// Utility: Recalculate floor metrics
function updateFloorMetrics(floorId: string) {
  const spots = spotMap[floorId] || [];
  const total = spots.length;
  const available = spots.filter((s) => s.status === 'available').length;
  const occupied = spots.filter((s) => s.status === 'occupied').length;
  const reserved = spots.filter((s) => s.status === 'reserved' || s.status === 'selected').length;

  for (const loc of locations) {
    const floor = loc.floors.find((f) => f.id === floorId);
    if (floor) {
      floor.totalSpots = total;
      floor.availableSpots = available;
      floor.occupiedSpots = occupied;
      floor.reservedSpots = reserved;
    }
  }
}

// Initialize floor metrics
Object.keys(spotMap).forEach(updateFloorMetrics);

// Gemini AI client initialization (lazy / server-side)
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/locations', (req, res) => {
  res.json({ locations });
});

app.post('/api/locations/custom', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Venue name is required' });
  }

  const cleanName = name.trim();
  const existing = locations.find((l) => l.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) {
    return res.json({ location: existing, isNew: false });
  }

  const locId = `loc-custom-${Date.now()}`;
  const floor1Id = `fl-${locId}-1`;
  const floor2Id = `fl-${locId}-2`;

  const newLoc = {
    id: locId,
    name: cleanName,
    city: 'Custom Venue',
    address: 'Main Concourse & Direct Deck',
    rating: 5.0,
    category: 'Custom Venues',
    floors: [
      {
        id: floor1Id,
        name: 'Level 1 - Express',
        description: 'Main Concourse Deck & Priority Slots',
        totalSpots: 32,
        availableSpots: 16,
        occupiedSpots: 12,
        reservedSpots: 4,
      },
      {
        id: floor2Id,
        name: 'Level 2 - Concourse',
        description: 'Elevator Lobby & EV Fast Charger Bay',
        totalSpots: 32,
        availableSpots: 18,
        occupiedSpots: 10,
        reservedSpots: 4,
      },
    ],
  };

  locations.unshift(newLoc);
  spotMap[floor1Id] = generateFloorSpots(floor1Id, 32);
  spotMap[floor2Id] = generateFloorSpots(floor2Id, 32);
  updateFloorMetrics(floor1Id);
  updateFloorMetrics(floor2Id);

  return res.json({ location: newLoc, isNew: true });
});

app.get('/api/spots', (req, res) => {
  const floorId = (req.query.floorId as string) || 'floor-b1';
  if (!spotMap[floorId]) {
    spotMap[floorId] = generateFloorSpots(floorId, 32);
  }
  const spots = spotMap[floorId];
  updateFloorMetrics(floorId);
  const floorInfo = locations
    .flatMap((l) => l.floors)
    .find((f) => f.id === floorId);

  res.json({
    floorId,
    floorInfo,
    spots,
  });
});

// Live Traffic Simulation: Randomly change 1-2 spots every call
app.post('/api/spots/toggle-traffic', (req, res) => {
  const floorId = (req.body.floorId as string) || 'floor-b1';
  if (!spotMap[floorId]) {
    spotMap[floorId] = generateFloorSpots(floorId, 32);
  }
  const spots = spotMap[floorId];

  if (spots.length === 0) {
    return res.json({ success: false, spots: [] });
  }

  // Pick 1 or 2 random non-selected spots
  const candidateIndices = spots
    .map((s, idx) => (s.status !== 'selected' ? idx : -1))
    .filter((idx) => idx !== -1);

  if (candidateIndices.length > 0) {
    const countToChange = Math.min(2, candidateIndices.length);
    for (let i = 0; i < countToChange; i++) {
      const randIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
      const spot = spots[randIndex];
      if (spot.status === 'available') {
        spot.status = 'occupied';
        spot.occupiedVehicle = {
          plate: `SIM-${Math.floor(1000 + Math.random() * 9000)}`,
          model: ['Tesla Model 3', 'BMW i4', 'Toyota RAV4', 'Mercedes E-Class'][
            Math.floor(Math.random() * 4)
          ],
          parkedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (spot.status === 'occupied') {
        spot.status = 'available';
        delete spot.occupiedVehicle;
      }
    }
  }

  updateFloorMetrics(floorId);
  res.json({ success: true, spots: spotMap[floorId] });
});

// Create Booking
app.post('/api/bookings', (req, res) => {
  const { spotId, durationMinutes, vehiclePlate, vehicleType, needEVCharging } = req.body;

  let foundSpot: ParkingSpot | null = null;
  let targetFloorId = '';

  for (const [fId, spots] of Object.entries(spotMap)) {
    const spot = spots.find((s) => s.id === spotId);
    if (spot) {
      foundSpot = spot;
      targetFloorId = fId;
      break;
    }
  }

  if (!foundSpot) {
    return res.status(404).json({ error: 'Spot not found' });
  }

  if (foundSpot.status === 'occupied') {
    return res.status(400).json({ error: 'This spot was recently occupied by another vehicle.' });
  }

  // Update spot status to reserved
  foundSpot.status = 'reserved';
  updateFloorMetrics(targetFloorId);

  const now = new Date();
  const endTime = new Date(now.getTime() + (durationMinutes || 60) * 60 * 1000);
  const hours = (durationMinutes || 60) / 60;
  const baseFee = Number((foundSpot.pricePerHour * hours).toFixed(2));
  const serviceFee = 0.5;
  const evFee = needEVCharging ? 2.0 : 0.0;
  const totalAmount = Number((baseFee + serviceFee + evFee).toFixed(2));

  const bookingId = `PK-${Math.floor(1000 + Math.random() * 9000)}`;
  const pin = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');

  const floorObj = locations.flatMap((l) => l.floors).find((f) => f.id === targetFloorId);
  const locObj = locations.find((l) => l.floors.some((f) => f.id === targetFloorId));

  const newPass: ParkingPass = {
    id: bookingId,
    spotId: foundSpot.id,
    spotCode: foundSpot.code,
    zone: foundSpot.zone,
    floorName: floorObj?.name || 'Floor B1',
    locationName: locObj?.name || 'Centaurus Mall',
    vehiclePlate: vehiclePlate || 'LEB-1234',
    vehicleType: vehicleType || 'sedan',
    durationMinutes: durationMinutes || 60,
    startTime: now.toISOString(),
    endTime: endTime.toISOString(),
    totalAmount,
    entryPin: pin,
    qrData: JSON.stringify({
      passId: bookingId,
      spot: foundSpot.code,
      plate: vehiclePlate || 'LEB-1234',
      pin,
      exp: endTime.toISOString(),
    }),
    status: 'active',
  };

  activeBookings.unshift(newPass);

  res.json({
    success: true,
    pass: newPass,
    updatedSpot: foundSpot,
  });
});

// List Bookings
app.get('/api/bookings', (req, res) => {
  res.json({ bookings: activeBookings });
});

// Cancel Booking
app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = req.params.id;
  const passIdx = activeBookings.findIndex((b) => b.id === bookingId);

  if (passIdx !== -1) {
    const pass = activeBookings[passIdx];
    pass.status = 'cancelled';

    // Free up spot
    for (const [fId, spots] of Object.entries(spotMap)) {
      const spot = spots.find((s) => s.id === pass.spotId);
      if (spot && (spot.status === 'reserved' || spot.status === 'selected')) {
        spot.status = 'available';
        updateFloorMetrics(fId);
        break;
      }
    }
  }

  res.json({ success: true });
});

// Gemini AI Smart Spot Recommendation
app.post('/api/ai/recommend', async (req, res) => {
  const { floorId, userPreference } = req.body;
  const currentSpots = spotMap[floorId || 'floor-b1'] || [];
  const availableSpots = currentSpots.filter((s) => s.status === 'available');

  if (availableSpots.length === 0) {
    return res.json({
      recommendation: null,
      message: 'No available spots on this floor currently.',
    });
  }

  const aiClient = getGenAIClient();

  if (!aiClient) {
    // High quality deterministic fallback recommendation algorithm
    let best = availableSpots[0];
    let score = 90;
    let reason = `Recommended Spot ${best.code} in ${best.zone} as it offers the best balance of proximity (${best.distanceToElevator}m to elevator) and value ($${best.pricePerHour}/hr).`;

    const pref = (userPreference || '').toLowerCase();
    if (pref.includes('ev') || pref.includes('charger') || pref.includes('tesla') || pref.includes('electric')) {
      const evSpot = availableSpots.find((s) => s.isEV);
      if (evSpot) {
        best = evSpot;
        score = 98;
        reason = `Selected Spot ${best.code} because it features an active Level 2 EV Fast Charging station located only ${best.distanceToElevator}m from the main entrance elevators.`;
      }
    } else if (pref.includes('cheap') || pref.includes('best value') || pref.includes('low cost')) {
      const cheapSpot = [...availableSpots].sort((a, b) => a.pricePerHour - b.pricePerHour)[0];
      if (cheapSpot) {
        best = cheapSpot;
        score = 95;
        reason = `Selected Spot ${best.code} as the lowest cost option ($${best.pricePerHour.toFixed(2)}/hr) with full active sensor coverage.`;
      }
    } else if (pref.includes('close') || pref.includes('elevator') || pref.includes('accessible') || pref.includes('wheelchair')) {
      const closeSpot = [...availableSpots].sort((a, b) => a.distanceToElevator - b.distanceToElevator)[0];
      if (closeSpot) {
        best = closeSpot;
        score = 99;
        reason = `Selected Spot ${best.code} because it is the closest available spot to the central elevators (only ${best.distanceToElevator}m away).`;
      }
    }

    const rec: AISpotRecommendation = {
      recommendedSpotId: best.id,
      spotCode: best.code,
      reasoning: reason,
      matchScore: score,
      keyFeatures: [
        `${best.distanceToElevator}m to Elevators`,
        best.isEV ? 'EV Charger Available' : 'Standard Parking',
        `$${best.pricePerHour.toFixed(2)}/hr`,
        'Active Sensor Verified',
      ],
    };

    return res.json({ recommendation: rec });
  }

  try {
    const prompt = `You are ParkEasy's AI Parking Assistant. Analyze these available parking spots on floor '${floorId}':
${JSON.stringify(
  availableSpots.map((s) => ({
    id: s.id,
    code: s.code,
    zone: s.zone,
    pricePerHour: s.pricePerHour,
    isEV: s.isEV,
    isAccessible: s.isAccessible,
    distanceToElevator: s.distanceToElevator,
  }))
)}

User Preference / Query: "${userPreference || 'Best overall spot for fast entry and exit'}"

Select the SINGLE best spot ID and return JSON adhering to this schema:
{
  "recommendedSpotId": "spot id string",
  "spotCode": "spot code string",
  "reasoning": "Clear concise 1-2 sentence explanation of why this spot is the optimal match",
  "matchScore": 95,
  "keyFeatures": ["feature 1", "feature 2", "feature 3"]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSpotId: { type: Type.STRING },
            spotCode: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            matchScore: { type: Type.INTEGER },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['recommendedSpotId', 'spotCode', 'reasoning', 'matchScore', 'keyFeatures'],
        },
      },
    });

    const jsonText = response.text || '';
    const parsed = JSON.parse(jsonText) as AISpotRecommendation;
    return res.json({ recommendation: parsed });
  } catch (err) {
    console.error('Gemini AI recommendation error:', err);
    // Fallback if AI call errors
    const best = availableSpots[0];
    return res.json({
      recommendation: {
        recommendedSpotId: best.id,
        spotCode: best.code,
        reasoning: `Recommended Spot ${best.code} as it offers direct elevator access (${best.distanceToElevator}m) at $${best.pricePerHour}/hr.`,
        matchScore: 92,
        keyFeatures: [
          `${best.distanceToElevator}m to Elevator`,
          `$${best.pricePerHour}/hr`,
          best.isEV ? 'EV Fast Charger' : 'Sensor Covered',
        ],
      },
    });
  }
});

// Start Express Server with Vite integration
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ParkEasy Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
