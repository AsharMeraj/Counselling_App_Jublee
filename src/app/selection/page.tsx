"use client";

import { ScaleItem, scales } from "@/app/_utils/scales/scales";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-13.5rem)] bg-(--primary)/5 px-6 md:px-12 py-16">
      <h1 className="text-center text-[26px] md:text-[32px] font-bold text-(--primary)">
        Mental Health Screening Tools
      </h1>

      <p className="text-center text-gray-700 mt-2 mb-10 text-[16px]">
        Select a scale below to begin the assessment.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {scales.map((s: ScaleItem) => (
          <div
            key={s.route}
            onClick={() => router.push(s.route)}
            className="
              cursor-pointer bg-white rounded-xl p-6 shadow-sm 
              hover:shadow-md hover:-translate-y-1 transition-all duration-300
              border border-gray-200
            "
          >
            <h2 className="text-xl font-bold text-(--primary)">{s.title}</h2>
            <p className="text-gray-700 mt-2">{s.description}</p>

            <button
              className="
                mt-6 inline-block bg-(--secondary) text-white px-4 py-2 
                rounded-md text-sm font-semibold transition 
                hover:bg-(--primary)
              "
            >
              Start Assessment →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
