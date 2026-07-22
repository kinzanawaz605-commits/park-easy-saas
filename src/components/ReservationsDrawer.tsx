import React from 'react';
import { X, Ticket, Clock, Navigation, Trash2, CheckCircle2 } from 'lucide-react';
import { ParkingPass } from '../types';

interface ReservationsDrawerProps {
  passes: ParkingPass[];
  onClose: () => void;
  onOpenPassModal: (pass: ParkingPass) => void;
  onCancelPass: (passId: string) => Promise<void>;
  onShowDirections: (spotCode: string) => void;
}

export const ReservationsDrawer: React.FC<ReservationsDrawerProps> = ({
  passes,
  onClose,
  onOpenPassModal,
  onCancelPass,
  onShowDirections,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm tracking-wide">
              MY PARKING PASSES ({passes.filter((p) => p.status === 'active').length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {passes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Active Parking Passes</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Select an available green slot on the map to reserve a spot and generate an entry pass.
              </p>
            </div>
          ) : (
            passes.map((pass) => {
              const isActive = pass.status === 'active';
              return (
                <div
                  key={pass.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-white border-indigo-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono font-bold text-xs text-indigo-600">
                      #{pass.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pass.status}
                    </span>
                  </div>

                  <div className="py-2 flex justify-between items-baseline">
                    <div>
                      <div className="text-lg font-black text-slate-900">
                        Spot {pass.spotCode}
                      </div>
                      <div className="text-xs text-slate-500">
                        {pass.locationName} • {pass.floorName} ({pass.zone})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-indigo-600">
                        ${pass.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Plate: {pass.vehiclePlate}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-xs">
                      <button
                        onClick={() => onOpenPassModal(pass)}
                        className="py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                      >
                        View Pass
                      </button>
                      <button
                        onClick={() => {
                          onShowDirections(pass.spotCode);
                          onClose();
                        }}
                        className="py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
                      >
                        <Navigation className="w-3 h-3 text-indigo-600" />
                        Navigate
                      </button>
                      <button
                        onClick={() => onCancelPass(pass.id)}
                        className="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-[11px] transition-colors border border-rose-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400">
          ParkEasy Real-Time Ticket Manager
        </div>
      </div>
    </div>
  );
};
