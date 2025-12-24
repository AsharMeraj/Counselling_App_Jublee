
"use client";

import React, { useEffect, useState } from "react";
// Import from local constants
import { questionnairesConfig } from "../_utils/questionnairesConfig";

// Type for result fetched from API
type Result = {
  id: number;
  questionnaireType: string;
  totalScore: number;
};

// Utility function to get classification and color dynamically
const getClassificationAndColor = (questionnaireType: string, score: number) => {
  const config = questionnairesConfig[questionnaireType];
  if (!config) return { classification: "Unknown", color: "text-gray-500" };

  const range = config.scoreRanges.find((r: any) => score >= r.min && score <= r.max);
  if (!range) return { classification: "Unknown", color: "text-gray-500" };

  return { classification: range.classification, color: range.color };
};

const getScoreMeta = (questionnaireType: string, score: number) => {
  const config = questionnairesConfig[questionnaireType];
  if (!config) return null;

  const percentage = Math.min(100, (score / config.maxScore) * 100);

  return {
    maxScore: config.maxScore,
    percentage,
    ranges: config.scoreRanges
  };
};

const ResultPage = () => {
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });

      const entryIdStr = localStorage.getItem("entryId");

      // FOR DEMO/DEVELOPMENT: If no entryId, we simulate finding multiple results
      if (!entryIdStr && !results) {
        setTimeout(() => {
          setResults([
            { id: 1, questionnaireType: "GAD-7", totalScore: 12 },
            { id: 2, questionnaireType: "Work-Stress", totalScore: 22 },
            { id: 3, questionnaireType: "EPDS", totalScore: 8 }
          ]);
          setLoading(false);
        }, 1000);
        return;
      }

      const entryId = Number(entryIdStr);
      fetch(`/api/get-results?entryId=${entryId}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && Array.isArray(data.results)) {
            setResults(data.results);
          } else if (data.result) {
            setResults(Array.isArray(data.result) ? data.result : [data.result]);
          } else {
            setResults([]);
          }
        })
        .catch(err => {
          console.error(err);
          setResults([]);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "var(--primary)", borderTopColor: 'transparent' }}
          ></div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse tracking-wide uppercase text-xs">Analyzing all assessments...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200 border border-gray-100 text-center max-w-lg">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">No results found</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">We couldn't find any completed assessments for this session.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-105"
            style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))` }}
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div
        className="w-full h-80 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-10 text-center">
          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-white/30">
            Comprehensive Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Assessment Results
          </h1>
          <p className="text-white/80 mt-4 max-w-xl text-lg font-medium leading-relaxed">
            A complete overview of all assessments completed for this entry.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
        <div className="space-y-8">
          {results.map((r, index) => {
            const { classification, color } = getClassificationAndColor(r.questionnaireType, r.totalScore);
            const meta = getScoreMeta(r.questionnaireType, r.totalScore);
            
            // Convert text-color-500 to stroke-color-500 for SVGs to ensure visibility

            return (
              <div
                key={r.id}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-8 md:p-12 transition-all animate-in slide-in-from-bottom-10 fade-in duration-700 fill-mode-both overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                  <div className="relative shrink-0 w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={439.8}
                        strokeDashoffset={439.8 - (439.8 * (meta?.percentage || 0)) / 100}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${color}`}

                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl font-black text-gray-800 leading-none tracking-tight">{r.totalScore}</span>
                      {meta && (
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                          Score
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grow text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{r.questionnaireType}</h2>
                      <span className={`px-4 py-1.5 rounded-full bg-white border shadow-sm text-xs font-bold ${color}`}>
                        {classification}
                      </span>
                    </div>

                    <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                      This assessment indicates a <span className={`${color} font-bold`}>{classification.toLowerCase()}</span> status based on your responses.
                    </p>

                    <div className="mt-6 mb-4">
                      <div className="flex justify-between items-end mb-3 px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score Spectrum</span>
                        <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">Scale: 0 - {meta?.maxScore}</span>
                      </div>

                      <div className="relative h-12 w-full flex items-center">
                        <div className="absolute inset-0 h-4 my-auto bg-gray-100 rounded-full overflow-hidden flex">
                          {meta?.ranges.map((range: any, idx: number) => {
                            const rangeWidth = ((range.max - range.min + 1) / meta.maxScore) * 100;
                            const getHex = (cls: string) => {
                              if (cls.includes('green')) return '#10b981';
                              if (cls.includes('yellow')) return '#ca8a04';
                              if (cls.includes('orange')) return '#f97316';
                              if (cls.includes('red')) return '#ef4444';
                              return '#94a3b8';
                            };
                            return (
                              <div
                                key={idx}
                                className="h-full border-r border-white/40 last:border-r-0 opacity-30 transition-all"
                                style={{
                                  width: `${rangeWidth}%`,
                                  backgroundColor: getHex(range.color)
                                }}
                              />
                            );
                          })}
                        </div>

                        <div
                          className="absolute h-full z-10 flex flex-col items-center transition-all duration-1000 ease-out"
                          style={{ left: `${meta?.percentage}%`, transform: 'translateX(-50%)' }}
                        >
                          <div className="w-1 h-[60%] rounded-full  relative" style={{ backgroundColor: "var(--secondary)" }}>
                            <div className="absolute inset-0 animate-pulse  rounded-full"></div>
                          </div>

                          <div
                            className="absolute -top-10 text-white text-[10px] font-bold px-2.5 py-1.5 rounded shadow-xl whitespace-nowrap transition-transform scale-110"
                            style={{ background: "var(--secondary)" }}
                          >
                            You: {r.totalScore}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-purple-600" style={{ borderTopColor: "var(--secondary)" }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-2 px-1">
                        <span>MIN</span>
                        <div className="flex gap-4">
                          {meta?.ranges.map((range: any, idx: number) => (
                            <span key={idx} className={`${range.color} opacity-80 hidden md:inline`}>{range.classification}</span>
                          ))}
                        </div>
                        <span>MAX ({meta?.maxScore})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
