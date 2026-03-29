"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Navigation, Zap, ShieldCheck, Globe, 
  ChevronRight, Map, Sparkles, Heart 
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-white group"
  >
    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-2xl font-black mb-3 text-gray-900 tracking-tight">{title}</h3>
    <p className="text-gray-600 font-medium leading-relaxed">{description}</p>
  </motion.div>
);

export default function HomePage() {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden">
      {/* Parallax Background */}
      <div 
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80')",
          transform: `translateY(${offsetY * 0.2}px) scale(1.1)`
        }}
      />

      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-purple-900/40 to-indigo-50 z-10"></div>

      {/* Page content */}
      <div className="relative z-20">
        {/* Navigation */}
        <nav className="p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl">
            <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_15px_rgba(167,139,250,0.5)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif italic font-light tracking-wide">Celestia</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200 font-sans uppercase tracking-widest text-lg font-bold">Journey</span>
            </Link>
            <div className="flex items-center gap-8">
              <a href="#features" className="text-xs font-black text-white/70 hover:text-white transition-colors uppercase tracking-[0.2em] hidden md:block">The Magic</a>
              <Link href="/trip-planner">
                <button className="px-8 py-3 bg-white text-indigo-950 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95 border border-white/50">
                  Plan Trip
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="pt-24 pb-48 px-6 text-center max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-indigo-100 text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-8 animate-pulse">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              Heavenly Adventures
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.9] mb-8 drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]"
          >
            <span className="font-serif font-light italic text-indigo-200 block md:inline mr-4">Your</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200 filter drop-shadow-sm">
              Odyssey
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-white text-6xl md:text-8xl">
              Perfectly Designed.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-indigo-100/90 max-w-2xl mx-auto font-medium leading-relaxed mb-12"
          >
            CelestiaJourney fuses AI precision with the soul of exploration. Discover a world curated exactly for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/trip-planner" passHref>
              <button className="group relative px-14 py-7 text-lg font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-[0_20px_50px_rgba(124,58,237,0.5)] hover:shadow-[0_20px_60px_rgba(124,58,237,0.7)] hover:scale-105 transition-all duration-300 ring-4 ring-white/10 overflow-hidden">
                <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
                  Start The Magic <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-180 transition-transform duration-700" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
          </motion.div>
        </main>

        {/* How it Works Section */}
        <section className="py-32 bg-indigo-50/50 backdrop-blur-3xl px-6 rounded-t-[4rem] relative z-20 border-t border-white/50 shadow-[0_-20px_60px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black text-indigo-950 tracking-tight mb-20 font-serif italic">
              Three Steps to <span className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Paradise</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { icon: Map, step: "01", title: "Dream Destination", desc: "Choose where your heart desires to go." },
                { icon: Zap, step: "02", title: "Define Your Vibe", desc: "Select budget, style, and unique passions." },
                { icon: Sparkles, step: "03", title: "AI Magic", desc: "Watch your perfect journey unfold instantly." }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <span className="text-[12rem] font-serif font-black text-indigo-100 absolute -top-32 left-1/2 -translate-x-1/2 select-none group-hover:text-indigo-200 transition-colors duration-500 -z-10">
                    {item.step}
                  </span>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center mb-8 border-4 border-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <item.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-indigo-950 mb-4">{item.title}</h3>
                    <p className="text-gray-500 font-medium max-w-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
              <div className="max-w-2xl">
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-[0.9]">
                  Travel reimagined. <br/>
                  <span className="text-indigo-600 font-serif italic font-light">Effortlessly.</span>
                </h2>
                <p className="text-xl text-gray-500 font-medium border-l-4 border-indigo-200 pl-6 py-2">
                  We automate the logistics so you can focus on the wonder.
                </p>
              </div>
              <div className="pb-4">
                <Link href="/trip-planner" className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-sm hover:gap-4 transition-all group">
                  Begin Now <ChevronRight className="w-5 h-5 group-hover:text-purple-600" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Globe}
                delay={0.1}
                title="Global Mastery" 
                description="Instant expertise on 1,000+ cities. Local gems, hidden paths, and cultural highlights at your fingertips." 
              />
              <FeatureCard 
                icon={ShieldCheck}
                delay={0.2}
                title="Smart & Safe" 
                description="Intelligent safety advisories and family-friendly filters woven seamlessly into every plan." 
              />
              <FeatureCard 
                icon={Heart}
                delay={0.3}
                title="Deeply Personal" 
                description="Your passions aren't just tags—they are the DNA of your generated itinerary." 
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 bg-indigo-950 text-white px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
            <div className="text-center md:text-left">
              <Link href="/" className="text-3xl font-black tracking-tighter flex items-center justify-center md:justify-start gap-2 mb-4 group">
                <Sparkles className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
                <span className="font-serif italic font-light">Celestia</span>
                <span className="text-indigo-400 font-sans uppercase tracking-widest font-bold">Journey</span>
              </Link>
              <p className="text-indigo-300/60 font-medium text-sm max-w-sm">&copy; {new Date().getFullYear()} CelestiaJourney. Crafted with stardust & code for the modern dreamer.</p>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col gap-4">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-400">Explore</h4>
                <Link href="/trip-planner" className="text-indigo-200 hover:text-white font-medium transition-colors">Planner</Link>
                <a href="#features" className="text-indigo-200 hover:text-white font-medium transition-colors">Magic</a>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-400">Trust</h4>
                <a href="#" className="text-indigo-200 hover:text-white font-medium transition-colors">Privacy</a>
                <a href="#" className="text-indigo-200 hover:text-white font-medium transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
