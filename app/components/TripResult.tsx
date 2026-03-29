"use client";
import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, ClipboardCopy, Navigation, Calendar, 
  Users, TrendingUp, Sparkles, Map as MapIcon, 
  Ticket, Info, Briefcase, Zap, Wallet, Lightbulb,
  Coffee, Sun, Moon, Star, MapPin, Plane, ArrowRight,
  Utensils, Heart, ShoppingBag, Landmark
} from "lucide-react";
import { TripFormData } from "./TripForm";

interface TripResultProps {
  result: string | null;
  isLoading: boolean;
  statusLog: any[];
  error: string | null;
  formData?: TripFormData;
}

// Helper to extract text from React children (recursively)
const getTextFromChildren = (children: any): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getTextFromChildren).join('');
  if (children?.props?.children) return getTextFromChildren(children.props.children);
  return '';
};

export default function TripResult({ result, isLoading, error, formData }: TripResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Extract meta-data from the very first few lines for the hero
  const meta = useMemo(() => {
    if (!result) return null;
    const lines = result.split("\n").filter(l => l.trim().length > 0);
    return {
      title: lines[0].replace(/[#🌸\s]+/g, ""),
      tags: lines[1]?.includes("•") ? lines[1].split("•").map(t => t.trim()) : [],
      description: lines.find(l => l.length > 50 && !l.startsWith("#") && !l.includes("Route:")) || "A curated expedition designed for the modern voyager."
    };
  }, [result]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="relative w-32 h-32 mb-10">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 border-[4px] border-blue-50 border-t-blue-600 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center"><Navigation className="w-10 h-10 text-blue-600 animate-pulse" /></div>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Designing Your Odyssey</h2>
        <p className="text-gray-500 text-lg font-medium">Securing live market rates and hidden gems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-600 mb-8"><Info className="w-12 h-12" /></div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Voyage Interrupted</h2>
        <p className="text-gray-500 text-lg font-medium max-w-md mb-8 italic">"{error}"</p>
        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black hover:bg-black transition-all shadow-xl">Retry Connection</button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-24 font-sans animate-in fade-in duration-1000">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-indigo-950 rounded-[3.5rem] p-10 md:p-20 text-white shadow-3xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/60 to-transparent" />
        
        <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap gap-2">
                {meta?.tags.map((tag, i) => (
                    <span key={i} className="px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-200">
                        {tag}
                    </span>
                ))}
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] italic font-serif">
                {meta?.title || formData?.destination.split(',')[0]}
            </h1>
            <p className="text-gray-300 text-lg md:text-2xl font-medium max-w-3xl leading-relaxed italic">
                "{meta?.description.replace(/\*\*/g, "")}"
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold tracking-wide">{formData?.start_date} → {formData?.end_date}</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                    <Navigation className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold tracking-wide">{formData?.origin.split(',')[0]} → {formData?.destination.split(',')[0]}</span>
                </div>
            </div>
        </div>
      </section>

      {/* 2. THE MAIN REPORT CONTENT */}
      <article className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-[0_20px_100px_rgba(0,0,0,0.03)] border border-gray-50 prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:font-medium prose-p:text-gray-600 prose-p:leading-relaxed">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom Table Styles
            table: ({ children }) => (
              <div className="overflow-x-auto my-12 rounded-[2rem] border border-gray-100 shadow-sm bg-gray-50/50">
                <table className="w-full text-left border-collapse m-0">{children}</table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-indigo-50/50 text-indigo-600 font-black uppercase text-[10px] tracking-widest">{children}</thead>,
            th: ({ children }) => <th className="px-6 py-4 border-b border-gray-100">{children}</th>,
            td: ({ children }) => <td className="px-6 py-4 border-b border-gray-50 text-sm font-bold text-gray-700">{children}</td>,
            
            // Custom Header Styles (The "Section" Look)
            h2: ({ children }) => {
                const text = getTextFromChildren(children);
                let icon = <Info className="w-8 h-8" />;
                if (text.includes("Arrival")) icon = <Briefcase className="w-8 h-8 text-purple-600" />;
                if (text.includes("Day")) icon = <Calendar className="w-8 h-8 text-blue-600" />;
                if (text.includes("Paid")) icon = <Zap className="w-8 h-8 text-amber-600" />;
                if (text.includes("Budget")) icon = <Wallet className="w-8 h-8 text-emerald-600" />;
                if (text.includes("Tips")) icon = <Lightbulb className="w-8 h-8 text-yellow-600" />;

                return (
                    <div className="flex items-center gap-6 mt-24 mb-10 pb-6 border-b border-gray-100 first:mt-0">
                        <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-gray-50 flex items-center justify-center shrink-0">
                            {icon}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 m-0 tracking-tight">{children}</h2>
                    </div>
                );
            },
            h3: ({ children }) => <h3 className="text-2xl font-black text-indigo-950 mt-12 mb-6 flex items-center gap-3"><span className="w-1.5 h-8 bg-indigo-500 rounded-full" /> {children}</h3>,
            
            // Custom List Item Styles (The "Card" Look for Schedule items)
            li: ({ children }) => {
                const text = getTextFromChildren(children);
                
                // 1. Time-Blocks (Morning/Afternoon/Evening)
                const timeMatch = text.match(/^(🌅|☀️|🌙)?\s*(Morning|Afternoon|Evening)/i);
                if (timeMatch) {
                    const type = timeMatch[2].toLowerCase();
                    let icon = <Coffee className="w-6 h-6" />;
                    if (type === 'afternoon') icon = <Sun className="w-6 h-6" />;
                    if (type === 'evening') icon = <Moon className="w-6 h-6" />;

                    return (
                        <div className="group flex gap-4 md:gap-8 p-6 md:p-10 bg-gray-50/50 rounded-[2.5rem] border border-transparent hover:border-blue-100 hover:bg-white transition-all my-6 shadow-sm hover:shadow-md">
                            <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {icon}
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{type}</span>
                                <div className="text-xl md:text-2xl font-black text-gray-900 leading-tight italic m-0 p-0">{children}</div>
                            </div>
                        </div>
                    );
                }

                // 2. Recommended Dish (The "Gourmet" Card)
                if (text.includes("Recommended Dish") || text.includes("🥘") || text.includes("🍤") || text.includes("🦞")) {
                    return (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-[2.5rem] p-8 my-10 flex items-center gap-8 shadow-sm group">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-inner shrink-0 group-hover:rotate-6 transition-transform">🥘</div>
                            <div>
                                <span className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em] mb-1 block font-sans">Signature Taste</span>
                                <div className="text-gray-900 font-black text-xl md:text-2xl leading-tight m-0 p-0 italic">{children}</div>
                            </div>
                        </div>
                    );
                }

                // 3. Pro Tips
                if (text.includes("✔") || text.includes("✅")) {
                    return (
                        <div className="flex items-center gap-4 p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl my-3 shadow-sm">
                            <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                            <div className="text-emerald-900 font-bold text-sm md:text-base m-0 p-0">{children}</div>
                        </div>
                    );
                }

                // 4. Default List Item
                return (
                    <li className="flex gap-4 items-start pl-4 my-4 group">
                        <div className="mt-2.5 w-2 h-2 bg-blue-400 rounded-full shrink-0 group-hover:scale-125 transition-all shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                        <div className="text-gray-800 font-bold text-base md:text-lg leading-relaxed">{children}</div>
                    </li>
                );
            },
            
            // Standard Overrides
            ul: ({ children }) => <ul className="space-y-4 my-8 list-none p-0">{children}</ul>,
            strong: ({ children }) => <strong className="font-black text-indigo-950 underline decoration-blue-500/20 decoration-4 underline-offset-4">{children}</strong>,
            blockquote: ({ children }) => <div className="border-l-4 border-blue-500 pl-8 my-8 italic text-2xl font-serif text-gray-800">{children}</div>,
          }}
        >
          {result}
        </ReactMarkdown>
      </article>

      {/* 3. STICKY FOOTER ACTION BAR */}
      <div className="sticky bottom-8 z-50 px-4">
        <div className="max-w-3xl mx-auto bg-gray-900/90 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between gap-6">
          <div className="hidden sm:block pl-6">
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Celestial Blueprint</p>
            <p className="text-white text-xs font-bold tracking-wide">Your odyssey is ready for export.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={handleCopy} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-3xl font-black text-sm transition-all ${copied ? "bg-emerald-500 text-white" : "bg-white text-gray-900 hover:bg-blue-50"}`}>
              {copied ? <CheckCircle className="w-5 h-5" /> : <ClipboardCopy className="w-5 h-5" />} {copied ? "Copied" : "Copy Dossier"}
            </button>
            
          </div>
        </div>
      </div>

    </div>
  );
}
