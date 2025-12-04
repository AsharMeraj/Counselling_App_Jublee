"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ghqQuestions } from "@/app/_utils/scales/ghqQuestions";
import { urduGhqQuestions } from "@/app/_utils/scales/ghqQuestions";
import Button from "../../_components/Button";

const GHQForm = () => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isUrdu, setIsUrdu] = useState(false); // <-- language toggle
  const router = useRouter();

  const currentQuestions = isUrdu ? urduGhqQuestions.questions : ghqQuestions.questions;

  const handleSelect = (index: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < currentQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);

    const demographicStr = localStorage.getItem("demographicData");
    if (!demographicStr) {
      alert("Demographic missing. Please submit it first.");
      return;
    }
    const { entryId } = JSON.parse(demographicStr);

    try {
      await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          entryId, 
          questionnaireType: isUrdu ? urduGhqQuestions.type : ghqQuestions.type, 
          totalScore 
        }),
      });

      localStorage.setItem("entryId", entryId.toString());
      router.push("/result");
    } catch (err) {
      console.error(err);
      alert("Server error — try again.");
    }
  };

  const progress = Math.round(
    (Object.keys(answers).length / currentQuestions.length) * 100
  );

  return (
    <div className=" bg-(--primary)/5 pb-10 px-6 md:px-12 pt-10 md:pt-10">

      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-50 bg-[#F2F9FA] md:px-12 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-(--primary) font-semibold">
            {isUrdu ? "باقی سوالات:" : "Questions left:"}{" "}
            <span className="text-(--secondary)">
              {currentQuestions.length - Object.keys(answers).length}
            </span>
          </span>
          <span className="text-(--primary) font-semibold">
            <span className="text-(--secondary)">{progress}%</span> {isUrdu ? "مکمل" : "completed"}
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3">
          <div
            className="bg-(--secondary) h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Title and Language Toggle */}
      <div className="text-center my-10 flex flex-col md:flex-row justify-center items-center gap-4">
        <h1 className="text-[20px] md:text-[25px] font-bold text-(--secondary)">
          {isUrdu ? "جنرل ہیلتھ سوالنامہ" : "General Health Questionnaire"}
        </h1>
        <button
          type="button"
          onClick={() => setIsUrdu((prev) => !prev)}
          className="px-4 py-2 rounded bg-(--secondary) text-white hover:opacity-90 transition"
        >
          {isUrdu ? "English" : "اردو"}
        </button>
      </div>

      {/* Questions */}
      {currentQuestions.map((q, i) => (
        <div key={i} className="mb-10">
          <p className="md:text-[18px] font-bold mb-5 opacity-80 dark:text-black">
            {i + 1}. {q.question}
          </p>

          <div>
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(i, opt.value)}
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

      <Button type="button" onClick={handleSubmit}>
        SUBMIT FORM
      </Button>
    </div>
  );
};

export default GHQForm;
