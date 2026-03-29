// app/trip-planner/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, Navigation } from "lucide-react";
import TripForm, { TripFormData } from "@/app/components/TripForm";
import TripResult from "@/app/components/TripResult";
import { sendTripRequest } from "@/app/api/tripApi";

export default function Page() {
  const [form, setForm] = useState<TripFormData>({
    origin: "",
    destination: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 4);
      return d.toISOString().split("T")[0];
    })(),
    interests: "",
    budget: "Standard",
    travelers: "Couple",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [itineraryRaw, setItineraryRaw] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(payload: TripFormData) {
    setStatus("loading");
    setItineraryRaw(null);
    setErrorMessage(null);

    try {
      const result = await sendTripRequest(payload);
      setItineraryRaw(result.itinerary || "");
      setStatus("success");
    } catch (err: any) {
      console.error("❌ Error in handleSubmit:", err);
      setErrorMessage(err?.message || "Unexpected error occurred");
      setStatus("error");
    }
  }

  function handleReset() {
    setForm({
      origin: "",
      destination: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 4);
        return d.toISOString().split("T")[0];
      })(),
      interests: "",
      budget: "Standard",
      travelers: "Couple",
    });
    setItineraryRaw(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  useEffect(() => {
    if ((status === "success" || status === "error" || status === "loading") && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  return (
    <main className="min-h-screen font-sans bg-gray-50/50 pb-32">
      {/* Professional Header */}
      <header className="bg-indigo-950 text-white pt-12 pb-24 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <Link href="/" className="group">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] shadow-[0_0_30px_rgba(99,102,241,0.4)] group-hover:rotate-6 transition-all duration-500">
                <Navigation className="w-10 h-10 text-white rotate-45" />
              </div>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                  <span className="font-serif italic font-light text-indigo-200">Celestia</span>
                  <span className="uppercase tracking-widest text-2xl font-bold ml-2">Journey</span>
                </h1>
              </div>
              <p className="text-indigo-300 font-medium tracking-wide flex items-center gap-2 text-sm md:text-base">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Heavenly Adventures, Perfectly Designed.
              </p>
            </div>
          </div>

          <Link href="/" passHref>
            <button className="group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest text-white hover:bg-white hover:text-indigo-950 transition-all duration-300 shadow-xl">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Return to Port
            </button>
          </Link>
        </div>
      </header>

      {/* Vertical Sequential Layout */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-12 relative z-20 flex flex-col gap-16">
        
        {/* Step 1: The Planning Wizard */}
        <section className="w-full">
          <TripForm
            formData={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            onReset={handleReset}
            loading={status === "loading"}
          />
        </section>

        {/* Step 2: The Results (Shown sequentially after/during planning) */}
        <section ref={resultRef} className="w-full scroll-mt-10">
          <AnimatePresence mode="wait">
            {(status !== "idle") && (
              <motion.div
                key="result-view"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-gray-100">
                  <TripResult
                    result={itineraryRaw}
                    isLoading={status === "loading"}
                    statusLog={[]}
                    error={errorMessage}
                    formData={form}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </main>
  );
}
