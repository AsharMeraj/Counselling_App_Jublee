'use client'
import Button from '@/app/_components/Button';
import { cn } from '@/app/_utils/cn/cn';
import { ScaleConfig, SCALES_MAP } from '@/app/_utils/scales/scales';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import React, { use, useEffect, useState } from 'react'

const DynamicAssessmentForm = ({params, currentUser}:{params: Promise<{ scaleType: string }>, currentUser: string | null}) => {
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [isUrdu, setIsUrdu] = useState(false);
    const resolvedParams = use(params);
    const scaleType = resolvedParams.scaleType;
    const router = useRouter();
    const pathname = usePathname(); // Helpful to determine if we are in /assessment/ (research) or /normalScreening/

    const scaleData: ScaleConfig = SCALES_MAP[scaleType];

    useEffect(() => {
        setAnswers({});
    }, [scaleType]);

    if (!scaleData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary/5 p-6">
                <div className="text-center bg-white p-10 rounded-[2.5rem] shadow-2xl">
                    <h2 className="text-2xl font-black text-red-500 mb-2 tracking-tight">Scale Not Found</h2>
                    <p className="text-slate-500 font-medium">The assessment type "{scaleType}" is invalid.</p>
                </div>
            </div>
        );
    }

    const currentQuestions = isUrdu ? scaleData.ur.questions : scaleData.en.questions;
    const currentTitle = isUrdu ? scaleData.title : scaleData.title;

    const handleSelect = (index: number, value: number) => {
        setAnswers((prev) => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async () => {
        // 1. Check if all questions are answered
        if (Object.keys(answers).length < currentQuestions.length) {
            alert(isUrdu ? "براہ کرم تمام سوالات کے جوابات دیں۔" : "Please answer all questions before submitting.");
            return;
        }

        const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);

        try {
            /**
             * Determine Context: 
             * We check if we're in the research flow (usually via pathname or Admin status)
             * to pull the correct entryId from the correct localStorage key.
             */
            const isResearch = pathname.includes('assessment/epds') || currentUser === "Admin";
            const storageKey = isResearch ? "researchDemographicData" : "normalDemographicData";
            const apiEndpoint = isResearch ? "/api/save-research-result" : "/api/save-result";

            const demographicStr = localStorage.getItem(storageKey);
            
            if (!demographicStr) {
                alert("Demographic session expired. Please restart the assessment.");
                router.push(isResearch ? "/researchCenter" : "/normalScreening");
                return;
            }

            const { entryId } = JSON.parse(demographicStr);

            const res = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    entryId,
                    questionnaireType: scaleData.title,
                    totalScore,
                    answers // Good practice to save individual answers too
                }),
            });

            if (res.ok) {
                // Store the entryId specifically for the result page to fetch the score
                localStorage.setItem("lastEntryId", entryId.toString());
                router.push("/result");
            } else {
                const errorData = await res.json();
                alert(errorData.error || "Failed to save results.");
            }

        } catch (err) {
            console.error(err);
            alert("Connection error — please check your internet and try again.");
        }
    };

    const progress = Math.round((Object.keys(answers).length / currentQuestions.length) * 100);

    return (
        <div className="min-h-screen bg-primary/5 pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <div
                className="w-full h-80 sm:h-96 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, #0094cf 0%, #9c2790 100%)` }}
            >
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-8">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-white/30">
                        {isUrdu ? "جائزہ کا عمل" : "Assessment in Progress"}
                    </div>
                    <h1 className={cn(
                        "text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm leading-tight max-w-2xl",
                        isUrdu && "urdu-text"
                    )}>
                        {currentTitle}
                    </h1>

                    <button
                        type="button"
                        onClick={() => setIsUrdu((prev) => !prev)}
                        className="mt-6 px-6 py-2 rounded-full bg-white text-secondary hover:bg-slate-50 transition-all font-bold text-sm shadow-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        {isUrdu ? "Switch to English" : "اردو میں دیکھیں"}
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 relative z-30">
                {/* Sticky Header Progress Bar */}
                <div className="sticky top-4 z-50 mb-8 transition-all duration-300">
                    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-4 px-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-primary font-black text-[10px] uppercase tracking-wider">
                                {isUrdu ? "باقی سوالات:" : "QUESTIONS LEFT"}{" "}
                                <span className="text-secondary text-sm ml-1">
                                    {currentQuestions.length - Object.keys(answers).length}
                                </span>
                            </span>
                            <span className="text-primary font-black text-[10px] uppercase tracking-wider">
                                <span className="text-secondary text-sm mr-1">{progress}%</span> {isUrdu ? "مکمل" : "COMPLETED"}
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-linear-to-r from-primary to-secondary h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 sm:p-12">
                    <div className="space-y-16">
                        {currentQuestions.map((q, i) => (
                            <div key={i} className="space-y-6">
                                <div className={cn("flex items-start gap-4", isUrdu && "flex-row-reverse")}>
                                    <span className="w-1.5 h-8 bg-secondary rounded-full mt-1 shrink-0"></span>
                                    <p className={cn(
                                        "text-xl font-bold text-primary",
                                        isUrdu && "text-right urdu-text"
                                    )}>
                                        {i + 1}. {q.question}
                                    </p>
                                </div>

                                <div className={cn("flex flex-col gap-2")}>
                                    {q.options.map((opt, idx) => {
                                        const isSelected = answers[i] === opt.value;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleSelect(i, opt.value)}
                                                className={cn(
                                                    "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-left",
                                                    isSelected
                                                        ? "bg-[rgba(156,39,144,0.05)] border-secondary text-secondary shadow-sm shadow-secondary/10"
                                                        : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-100",
                                                    isUrdu && "flex-row-reverse text-right"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                    isSelected ? "border-secondary" : "border-slate-300"
                                                )}>
                                                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-secondary" />}
                                                </div>
                                                <span className={cn(
                                                    "font-bold text-[16px] leading-tight",
                                                    isUrdu && "urdu-text text-[18px]"
                                                )}>
                                                    {opt.Label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 border-t border-slate-100">
                            <Button type="button" onClick={handleSubmit}>
                                <span className={cn(
                                    "flex items-center justify-center gap-3",
                                    isUrdu && "flex-row-reverse urdu-text text-xl"
                                )}>
                                    {isUrdu ? "فارم جمع کریں" : "SUBMIT ASSESSMENT"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={cn(isUrdu ? "rotate-180" : "")}>
                                        <path d="M5 12h14m-7-7 7 7-7 7" />
                                    </svg>
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DynamicAssessmentForm;