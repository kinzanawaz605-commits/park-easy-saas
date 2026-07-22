import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Download,
  Navigation,
  Trash2,
  Clock,
  Car,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ParkingPass } from '../types';

interface QRPassModalProps {
  pass: ParkingPass;
  onClose: () => void;
  onCancelReservation: (passId: string) => Promise<void>;
  onShowDirections: (spotCode: string) => void;
}

export const QRPassModal: React.FC<QRPassModalProps> = ({
  pass,
  onClose,
  onCancelReservation,
  onShowDirections,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: pass.durationMinutes,
    seconds: 0,
  });
  const [isCanceling, setIsCanceling] = useState(false);

  // Generate QR Code data URL
  useEffect(() => {
    QRCode.toDataURL(
      pass.qrData,
      {
        width: 240,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrUrl(url);
        }
      }
    );
  }, [pass]);

  // Live Countdown Timer
  useEffect(() => {
    const end = new Date(pass.endTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, end - now);

      const mins = Math.floor(diff / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ minutes: mins, seconds: secs });

      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pass]);

  const handleDownloadTicket = () => {
    const ticketText = `
========================================
PARKEASY DIGITAL PARKING TICKET
========================================
Booking ID: #${pass.id}
Location: ${pass.locationName}
Floor: ${pass.floorName}
Spot Code: ${pass.spotCode} (${pass.zone})
Vehicle Plate: ${pass.vehiclePlate}
Vehicle Type: ${pass.vehicleType.toUpperCase()}
Entry PIN: ${pass.entryPin}
Total Amount: $${pass.totalAmount.toFixed(2)}
Start Time: ${new Date(pass.startTime).toLocaleString()}
End Time: ${new Date(pass.endTime).toLocaleString()}
========================================
Thank you for choosing ParkEasy!
`;
    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ParkEasy-Ticket-${pass.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCancel = async () => {
    setIsCanceling(true);
    await onCancelReservation(pass.id);
    setIsCanceling(false);
    onClose();
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header Modal Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm tracking-wide">
              DIGITAL PARKING TICKET #{pass.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-900">
          {/* Top Pass Card Badge */}
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              CONFIRMED & ACTIVE
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              Spot {pass.spotCode}
            </h2>
            <p className="text-xs text-slate-500">
              {pass.locationName} • {pass.floorName} ({pass.zone})
            </p>
          </div>

          {/* QR Code Container */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="Parking Pass QR Code"
                className="w-48 h-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xs"
              />
            ) : (
              <div className="w-48 h-48 bg-slate-200 rounded-xl animate-pulse flex items-center justify-center text-xs text-slate-400">
                Generating QR Code...
              </div>
            )}
            <div className="text-center">
              <div className="text-[11px] text-slate-400 font-medium">SCAN AT BARRIER GATE</div>
              <div className="font-mono font-bold text-slate-800 text-sm tracking-widest mt-0.5">
                PIN: {pass.entryPin}
              </div>
            </div>
          </div>

          {/* Live Countdown Timer Bar */}
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 text-white rounded-xl">
                <Clock className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                  Pass Validity
                </div>
                <div className="text-xs text-indigo-700">
                  Valid until {new Date(pass.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black font-mono text-indigo-600">
                {pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
              </div>
              <div className="text-[10px] text-indigo-400 font-semibold">MINS REMAINING</div>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Plate</span>
              <strong className="text-slate-800 font-mono text-sm">{pass.vehiclePlate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Paid</span>
              <strong className="text-indigo-600 text-sm font-bold">${pass.totalAmount.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Start Time</span>
              <span className="text-slate-700 font-medium">
                {new Date(pass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">End Time</span>
              <span className="text-slate-700 font-medium">
                {new Date(pass.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => {
              onShowDirections(pass.spotCode);
              onClose();
            }}
            className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Directions to Spot
          </button>

          <button
            onClick={handleDownloadTicket}
            className="py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Download Pass
          </button>

          <button
            onClick={handleCancel}
            disabled={isCanceling}
            className="col-span-2 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors border border-rose-200 mt-1"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            {isCanceling ? 'Canceling Pass...' : 'Cancel Reservation'}
          </button>
        </div>
      </div>
    </div>
  );
};
