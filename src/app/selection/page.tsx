"use client";

import { useEffect, useState } from "react";
import { ScaleItem, scales } from "@/app/_utils/scales/scales";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [submittedTypes, setSubmittedTypes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const entryId = localStorage.getItem("entryId");
    if (!entryId) return;

    const check = async () => {
      try {
        const res = await fetch(`/api/check-submissions?entryId=${entryId}`);
        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        console.log("Fetched submittedTypes:", data.submittedTypes); // debug
        setSubmittedTypes(data.submittedTypes || {});
      } catch (e) {
        console.error("Error checking submission:", e);
      }
    };

    check();
  }, []);


  return (
    <div className="min-h-[calc(100vh-13.5rem)] bg-(--primary)/5 px-6 md:px-12 py-16">
      <h1 className="text-center text-[26px] md:text-[32px] font-bold text-(--primary)">
        Mental Health Screening Tools
      </h1>

      <p className="text-center text-gray-700 mt-2 mb-10 text-[16px]">
        Select a scale below to begin the assessment.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {scales.map((s: ScaleItem) => {
          const isSubmitted = submittedTypes[s.title]; // check by type

          return (
            <div
              key={s.route}
              onClick={() => router.push(s.route)}
              className="
                cursor-pointer bg-white rounded-xl p-6 shadow-sm 
                hover:shadow-md hover:-translate-y-1 transition-all duration-300
                border border-gray-200 relative
              "
            >
              {isSubmitted && (
                <span
                  className="
                    absolute top-3 right-3 bg-green-600 text-white text-xs 
                    px-3 py-1 rounded-full font-semibold
                  "
                >
                  Submitted
                </span>
              )}

              <h2 className="text-xl font-bold text-(--primary)">{s.title}</h2>
              <p className="text-gray-700 mt-2">{s.description}</p>

              <button
                className={`
                  mt-6 inline-block px-4 py-2 rounded-md text-sm font-semibold transition
                  bg-(--secondary) text-white hover:bg-(--primary)"}
                `}
              // optional: disable button if already submitted
              >
                {isSubmitted ? "Submit Again" : "Start Assessment →"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
