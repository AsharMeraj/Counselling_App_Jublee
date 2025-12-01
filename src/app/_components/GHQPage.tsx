"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ghqQuestions } from "@/app/_utils/scales/ghqQuestions";
import { useEPDSResult } from "@/app/_context/EPDSResult";
import Button from "./Button";

const GHQForm = () => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const router = useRouter();
  const { setScore } = useEPDSResult();

  const handleGHQSelect = (index: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleGHQSubmit = async () => {
    if (Object.keys(answers).length < ghqQuestions.length) {
      alert("Please answer all GHQ questions before submitting.");
      return;
    }

    const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);

    // Get stored demographic entryId from localStorage
    const demographicStr = localStorage.getItem("demographicData");
    if (!demographicStr) {
      alert("Demographic missing. Please submit it first.");
      return;
    }
    const { entryId } = JSON.parse(demographicStr);

    try {
      // Save GHQ result only
      await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, questionnaireType: "GHQ", totalScore }),
      });

      // Store entryId for ResultPage
      localStorage.setItem("entryId", entryId.toString());

      router.push("/result");
    } catch (err) {
      console.error(err);
      alert("Server error — try again.");
    }
  };



  const progress = Math.round(
    (Object.keys(answers).length / ghqQuestions.length) * 100
  );


  return (
    <div className="min-h-[calc(100vh-13.5rem)] bg-(--primary)/5 pb-10 px-6 md:px-12 pt-10 md:pt-18">

      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-50 bg-[#F2F9FA]  md:px-12 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-(--primary) font-semibold">
            Questions left: <span className="text-(--secondary)">{ghqQuestions.length - Object.keys(answers).length}</span>
          </span>
          <span className="text-(--primary) font-semibold">
            <span className="text-(--secondary)">{progress}%</span> completed
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3">
          <div
            className="bg-(--secondary) h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-center mb-8 pt-3 md:pt-6">
        <h1 className="text-[20px] md:text-[25px] font-bold text-(--secondary)">
          Short General Health Questionnaire
        </h1>
      </div>

      {ghqQuestions.map((q, i) => (
        <div key={i} className="mb-10">
          <p className="md:text-[18px] font-bold mb-5 opacity-80 dark:text-black">
            {i + 1}. {q.question}
          </p>

          <div>
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleGHQSelect(i, opt.value)}
                className="flex items-center mb-4 mr-6 cursor-pointer"
              >
                <div className="h-[25px] w-[25px] rounded-full border-2 border-(--primary) flex items-center justify-center mr-3">
                  {answers[i] === opt.value && (
                    <div className="h-3.5 w-3.5 rounded-full bg-(--secondary)" />
                  )}
                </div>
                <span className="md:text-[17px] opacity-80 dark:text-black">
                  {opt.Label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" onClick={handleGHQSubmit}>
        Submit FORM
      </Button>
    </div>
  );
};

export default GHQForm;
