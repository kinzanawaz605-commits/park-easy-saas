import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Loader2, Zap, Accessibility, ShieldCheck } from 'lucide-react';
import { AISpotRecommendation } from '../types';

interface AISpotModalProps {
  floorId: string;
  onClose: () => void;
  onSelectRecommendedSpot: (spotId: string) => void;
}

export const AISpotModal: React.FC<AISpotModalProps> = ({
  floorId,
  onClose,
  onSelectRecommendedSpot,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AISpotRecommendation | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const quickPrompts = [
    'Find closest EV charger spot to elevator',
    'Find cheapest available spot on this floor',
    'Wheelchair accessible spot near entrance',
    'VIP spot for fast exit',
  ];

  const handleAskAI = async (userQuery: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floorId,
          userPreference: userQuery,
        }),
      });
      const data = await res.json();
      if (data.recommendation) {
        setRecommendation(data.recommendation);
      } else if (data.message) {
        setErrorMsg(data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to fetch AI recommendation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 fill-indigo-400" />
            <span className="font-bold text-sm tracking-wide">
              PARKEASY AI SPOT ASSISTANT
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-900">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              What kind of parking spot do you need?
            </h3>
            <p className="text-xs text-slate-500">
              Gemini AI analyzes sensor data, elevator distances, and rates in real-time.
            </p>
          </div>

          {/* Input field */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. I have a Tesla and want a charger near the elevator..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query.trim() && handleAskAI(query)}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => query.trim() && handleAskAI(query)}
                disabled={isLoading || !query.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask AI'}
              </button>
            </div>

            {/* Quick Prompts Chips */}
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp) => (
                <button
                  key={qp}
                  onClick={() => {
                    setQuery(qp);
                    handleAskAI(qp);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] rounded-lg font-medium transition-colors text-left"
                >
                  ✨ {qp}
                </button>
              ))}
            </div>
          </div>

          {/* AI Result Card */}
          {isLoading && (
            <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <div className="text-xs font-semibold text-slate-700">
                AI is scanning live ultrasonic sensors on Floor B1...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          {recommendation && !isLoading && (
            <div className="p-5 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Optimal Match
                </span>
                <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
                  {recommendation.matchScore}% Match
                </span>
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">
                  Recommended Spot {recommendation.spotCode}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {recommendation.keyFeatures.map((feat, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white text-slate-700 rounded text-[11px] font-semibold border border-indigo-100 shadow-2xs"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  onSelectRecommendedSpot(recommendation.recommendedSpotId);
                  onClose();
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Select Spot {recommendation.spotCode} on Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
