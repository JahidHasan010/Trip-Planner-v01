"use client";
import React, { useState, useRef, useEffect } from "react";
import { MapPin, Calendar, Users, Send, Loader2, RefreshCw, X, Plus, ChevronRight, ChevronLeft, Wallet, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { customCities } from "@/app/data/customCities";

export type TripFormData = {
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  interests: string;
  budget: string;
  travelers: string;
};

type Props = {
  formData: TripFormData;
  onChange: (s: TripFormData) => void;
  onSubmit: (payload: TripFormData) => Promise<void>;
  onReset: () => void;
  loading?: boolean;
};

// ------------------ Fuse.js for cities ------------------
const fuseCities = new Fuse(customCities, {
  keys: ["city", "country"],
  threshold: 0.3,
  includeScore: true,
});

// ------------------ Interests list & Fuse ------------------
const allInterests = [
  "Adventure", "Cultural / Heritage", "Nature & Wildlife", "Beach & Seaside",
  "Wellness & Spa", "Food & Culinary", "Photography", "History & Archaeology",
  "Luxury & High-end Travel", "Budget / Backpacking", "Family Travel",
  "Romance & Couples", "Eco / Sustainable Travel", "Nightlife & Party",
  "Sports & Adventure Sports", "Festival & Events Travel", "Roadtrip & Overlanding",
  "Wildlife Safaris", "Hidden Gems", "Shopping", "Architecture"
];

const fuseInterests = new Fuse(allInterests, {
  threshold: 0.3,
  includeScore: true,
});

export default function TripForm({
  formData,
  onChange,
  onSubmit,
  onReset,
  loading,
}: Props) {
  const [step, setStep] = useState(1);
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
  const [interestSuggestions, setInterestSuggestions] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [typingField, setTypingField] = useState<"origin" | "destination" | "interests" | null>(null);
  
  const interestInputRef = useRef<HTMLInputElement>(null);

  const selectedInterests = formData.interests
    ? formData.interests.split(",").map(i => i.trim()).filter(i => i !== "")
    : [];

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // ------------------ City fuzzy search ------------------
  function filterCitiesFuzzy(query: string): string[] {
    if (!query.trim()) return [];
    const results = fuseCities.search(query);
    return results.slice(0, 8).map((r) => `${r.item.city}, ${r.item.country}`);
  }

  let debounceTimer: NodeJS.Timeout;
  function debounceFilter(value: string, field: "origin" | "destination") {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const suggestions = filterCitiesFuzzy(value);
      if (field === "origin") setOriginSuggestions(suggestions);
      else setDestSuggestions(suggestions);
    }, 250);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });

    if (name === "origin" || name === "destination") {
      setTypingField(name as any);
      debounceFilter(value, name as "origin" | "destination");
    }
  }

  function handleInterestInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInterestInput(value);
    const results = fuseInterests.search(value).map(r => r.item);
    setInterestSuggestions(results.filter(item => !selectedInterests.includes(item)).slice(0, 5));
    setTypingField("interests");
  }

  function addInterest(interest: string) {
    const trimmed = interest.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      const newInterests = [...selectedInterests, trimmed].join(", ");
      onChange({ ...formData, interests: newInterests });
    }
    setInterestInput("");
    setInterestSuggestions([]);
  }

  function removeInterest(interest: string) {
    const newInterests = selectedInterests.filter(i => i !== interest).join(", ");
    onChange({ ...formData, interests: newInterests });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) return nextStep();
    await onSubmit(formData);
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 flex flex-col h-fit lg:sticky lg:top-8 overflow-hidden">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-lg ${
                step >= s ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 text-gray-400'
              }`}>
                {s === 1 ? <MapPin className="w-5 h-5" /> : s === 2 ? <Users className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] mt-2 font-bold uppercase tracking-wider ${step >= s ? 'text-blue-600' : 'text-gray-400'}`}>
                {s === 1 ? 'Route' : s === 2 ? 'Vibe' : 'Soul'}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 min-h-[380px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Where are we going?</h3>
                <p className="text-gray-500 text-sm">Tell us about your starting point and dream destination.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">🌍 From</label>
                  <input
                    name="origin"
                    value={formData.origin}
                    onChange={handleInput}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-800"
                    placeholder="E.g. London, UK"
                    autoComplete="off"
                  />
                  <MapPin className="absolute left-4 top-[2.7rem] w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  {originSuggestions.length > 0 && typingField === "origin" && (
                    <ul className="absolute z-50 w-full bg-white border border-gray-100 mt-2 rounded-2xl shadow-2xl max-h-48 overflow-y-auto">
                      {originSuggestions.map((city, idx) => (
                        <li key={idx} onClick={() => { onChange({ ...formData, origin: city }); setOriginSuggestions([]); }} className="px-5 py-3 cursor-pointer hover:bg-blue-50 transition-colors font-medium text-gray-700 border-b border-gray-50 last:border-0">{city}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="relative group">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">🗺️ To</label>
                  <input
                    name="destination"
                    value={formData.destination}
                    onChange={handleInput}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-800"
                    placeholder="E.g. Tokyo, Japan"
                    autoComplete="off"
                  />
                  <MapPin className="absolute left-4 top-[2.7rem] w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  {destSuggestions.length > 0 && typingField === "destination" && (
                    <ul className="absolute z-50 w-full bg-white border border-gray-100 mt-2 rounded-2xl shadow-2xl max-h-48 overflow-y-auto">
                      {destSuggestions.map((city, idx) => (
                        <li key={idx} onClick={() => { onChange({ ...formData, destination: city }); setDestSuggestions([]); }} className="px-5 py-3 cursor-pointer hover:bg-blue-50 transition-colors font-medium text-gray-700 border-b border-gray-50 last:border-0">{city}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="relative">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">📅 Departure</label>
                  <input name="start_date" type="date" value={formData.start_date} onChange={handleInput} min={new Date().toISOString().split("T")[0]} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-medium text-gray-800" />
                </div>
                <div className="relative">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">📅 Return</label>
                  <input name="end_date" type="date" value={formData.end_date} onChange={handleInput} min={formData.start_date} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-medium text-gray-800" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Set the vibe.</h3>
                <p className="text-gray-500 text-sm">How do you like to travel? Choose your budget and company.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">💎 Budget Level</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['Economy', 'Standard', 'Luxury'].map((b) => (
                      <button
                        key={b} type="button"
                        onClick={() => onChange({...formData, budget: b})}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          formData.budget === b ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${formData.budget === b ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Wallet className="w-5 h-5" />
                        </div>
                        <span className={`font-bold ${formData.budget === b ? 'text-blue-700' : 'text-gray-600'}`}>{b}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">👥 Travelers</label>
                  <div className="grid grid-cols-1 gap-3">
                    {['Solo', 'Couple', 'Family', 'Friends Group'].map((t) => (
                      <button
                        key={t} type="button"
                        onClick={() => onChange({...formData, travelers: t})}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          formData.travelers === t ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${formData.travelers === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <UserCircle className="w-5 h-5" />
                        </div>
                        <span className={`font-bold ${formData.travelers === t ? 'text-blue-700' : 'text-gray-600'}`}>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Tailor your soul.</h3>
                <p className="text-gray-500 text-sm">Select interests to craft your perfect itinerary.</p>
              </div>

              <div className="space-y-4">
                <div 
                  className={`min-h-[160px] p-4 rounded-2xl border-2 ${typingField === 'interests' ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100'} bg-gray-50/50 transition-all flex flex-wrap gap-2 content-start cursor-text`}
                  onClick={() => interestInputRef.current?.focus()}
                >
                  {selectedInterests.map((interest, idx) => (
                    <motion.span 
                      key={idx} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl text-sm font-black shadow-sm border border-blue-50"
                    >
                      {interest}
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeInterest(interest); }} className="hover:text-red-500 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                  <input
                    ref={interestInputRef} type="text" value={interestInput}
                    onChange={handleInterestInputChange}
                    onFocus={() => setTypingField("interests")}
                    onBlur={() => setTimeout(() => setTypingField(null), 200)}
                    disabled={loading}
                    className="flex-1 min-w-[150px] outline-none py-1 font-medium text-gray-700 bg-transparent"
                    placeholder={selectedInterests.length === 0 ? "E.g. Adventure, Foodie, History..." : "What else?"}
                    autoComplete="off"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {interestSuggestions.length > 0 && typingField === "interests" ? (
                    interestSuggestions.map((interest, idx) => (
                      <button key={idx} type="button" onClick={() => addInterest(interest)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black hover:bg-blue-100 transition-colors flex items-center gap-1">
                        <Plus className="w-3 h-3" /> {interest}
                      </button>
                    ))
                  ) : (
                    <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Popular: Adventure, Hidden Gems, Architecture</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button" onClick={prevStep} disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          ) : (
            <button
              type="button" onClick={onReset} disabled={loading}
              className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
            >
              Reset All
            </button>
          )}

          <button
            type="submit"
            disabled={loading || (step === 1 && (!formData.origin || !formData.destination)) || (step === 3 && selectedInterests.length === 0)}
            className={`px-10 py-4 rounded-2xl font-black text-white transition-all flex items-center gap-3 shadow-[0_10px_20px_rgba(37,99,235,0.3)] ${
              loading ? 'bg-gray-400 scale-95' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {step === 3 ? 'Launch Journey 🚀' : 'Continue'}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
