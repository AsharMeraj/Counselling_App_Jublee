"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { workStressQuestions } from "@/app/_utils/scales/workStressQuestions";
import { urduWorkStressQuestions } from "@/app/_utils/scales/workStressQuestions";
import Button from "../../_components/Button";

const WorkStressForm = () => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isUrdu, setIsUrdu] = useState(false);
  const router = useRouter();

  const currentQuestions = isUrdu
    ? urduWorkStressQuestions.questions
    : workStressQuestions.questions;

  const handleSelect = (index: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < currentQuestions.length) {
      alert(isUrdu ? "برائے مہربانی تمام سوالات کے جواب دیں" : "Please answer all questions.");
      return;
    }

    const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);

    const demographicStr = localStorage.getItem("demographicData");
    if (!demographicStr) {
      alert(isUrdu ? "ڈیٹا موجود نہیں۔ پہلے فارم مکمل کریں۔" : "Demographic missing.");
      return;
    }

    const { entryId } = JSON.parse(demographicStr);

    try {
      await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId,
          questionnaireType: isUrdu
            ? urduWorkStressQuestions.type
            : workStressQuestions.type,
          totalScore,
        }),
      });

      localStorage.setItem("entryId", entryId.toString());
      router.push("/result");
    } catch (err) {
      console.error(err);
      alert(isUrdu ? "سرور میں خرابی — دوبارہ کوشش کریں" : "Server error — try again.");
    }
  };

  const progress = Math.round(
    (Object.keys(answers).length / currentQuestions.length) * 100
  );

  return (
    <div className="bg-primary/5 pb-10 px-6 md:px-12 pt-10 md:pt-10">

      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-[#F2F9FA] md:px-12 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-primary font-semibold">
            {isUrdu ? "باقی سوالات:" : "Questions left:"}{" "}
            <span className="text-secondary">
              {currentQuestions.length - Object.keys(answers).length}
            </span>
          </span>

          <span className="text-primary font-semibold">
            <span className="text-secondary">{progress}%</span>{" "}
            {isUrdu ? "مکمل" : "completed"}
          </span>
        </div>

        <div className="w-full bg-gray-300 rounded-full h-3">
          <div
            className="bg-secondary h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Title + Language toggle */}
      <div className="text-center my-10 flex flex-col md:flex-row justify-center items-center gap-4">
        <h1 className="text-[20px] md:text-[25px] font-bold text-secondary">
          {isUrdu ?" کام کی جگہ کے دباؤ کا سوالنامہ" : "WorkSpace Stress Scale"}
        </h1>

        <button
          type="button"
          onClick={() => setIsUrdu((prev) => !prev)}
          className="px-4 py-2 rounded bg-secondary text-white hover:opacity-90 transition"
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
                <div className="h-[25px] w-[25px] rounded-full border-2 border-primary flex items-center justify-center mr-3">
                  {answers[i] === opt.value && (
                    <div className="h-3.5 w-3.5 rounded-full bg-secondary" />
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
        submit form
      </Button>
    </div>
  );
};

export default WorkStressForm;
