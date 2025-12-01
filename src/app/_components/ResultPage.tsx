"use client";

import React, { useEffect, useState } from "react";

type Result = {
  id: number;
  questionnaireType: string;
  totalScore: number;
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
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
        })
        .catch((err) => {
          console.error(err);
          setResults([]);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 0 && score <= 11) return "text-green-500"; // Normal
    if (score >= 12 && score <= 19) return "text-yellow-800"; // Mild distress
    if (score >= 20 && score <= 27) return "text-orange-500"; // Moderate distress
    if (score >= 28) return "text-red-500"; // Severe distress
    return "text-black";
  };

   const getClassification = (score: number) => {
    if (score >= 0 && score <= 11) return "Normal / No distress";
    if (score >= 12 && score <= 19) return "Mild distress";
    if (score >= 20 && score <= 27) return "Moderate distress";
    if (score >= 28) return "Severe distress";
    return "Unknown";
  };

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
      {results.map((r) => (
        <div key={r.id} className="text-lg text-center">
          <span className="font-semibold text-black">{r.questionnaireType}:</span>{" "}
          <span className={getScoreColor(r.totalScore)}>{r.totalScore} &rarr; {getClassification(r.totalScore)}</span>
        </div>
      ))}
    </div>
  );
};

export default ResultPage;
