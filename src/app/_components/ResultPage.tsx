"use client";

import React, { useEffect, useState } from "react";
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
  if (!config) return { classification: "Unknown", color: "text-black" };

  const range = config.scoreRanges.find(r => score >= r.min && score <= r.max);
  if (!range) return { classification: "Unknown", color: "text-black" };

  return { classification: range.classification, color: range.color };
};

const ResultPage = () => {
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });

      const entryIdStr = localStorage.getItem("entryId");
      if (!entryIdStr) {
        setLoading(false);
        return;
      }

      const entryId = Number(entryIdStr);

      fetch(`/api/get-results?entryId=${entryId}`)
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            setResults([data.result]); // wrap in array so mapping still works
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
      <div className="min-h-[calc(100vh-13.5rem)] flex justify-center items-center">
        <p>Loading results...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="min-h-[calc(100vh-13.5rem)] flex justify-center items-center">
        <h1 className="text-2xl text-center text-gray-600">
          No results found. Please complete the test first.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-13.5rem)] bg-(--primary)/5 flex flex-col justify-center items-center px-4 space-y-4 py-10">
      <h1 className="text-2xl font-bold text-center text-black">Your Questionnaire Results</h1>
      {results.map(r => {
        const { classification, color } = getClassificationAndColor(r.questionnaireType, r.totalScore);
        return (
          <div key={r.id} className="text-lg text-center">
            <span className="font-semibold text-black">{r.questionnaireType}:</span>{" "}
            <span className={color}>{r.totalScore} &rarr; {classification}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ResultPage;
