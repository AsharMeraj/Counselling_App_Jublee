"use client";

import { useState } from "react";
import { demographic } from "@/app/_utils/demographic";
import { useRouter } from "next/navigation";
import Button from "./Button";

const DemographicForm = () => {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});

  const handleChange = (question: string, value: string) => {
    setForm((prev) => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async () => {
    const unanswered = demographic.some((q) => !form[q.question]);

    if (unanswered) {
      alert("Please answer all demographic questions before continuing.");
      return;
    }

    // -----------------------------
    // MAP QUESTIONS → DB FIELDS
    // -----------------------------
    const payload = {
      name: form["Name"],
      age: Number(form["Age"]),
      gender: form["Gender"],
      phoneNumber: form["Phone Number"],
    };

    try {
      const res = await fetch("/api/save-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error saving data");
        return;
      }

      // -----------------------------
      // 🔥 SAVE TO LOCAL STORAGE
      // -----------------------------
      localStorage.setItem(
        "demographicData",
        JSON.stringify({ ...payload, entryId: data.entryId }) // store entryId!
      );

      router.push("/selection");
    } catch (err) {
      console.error(err);
      alert("Server error — try again.");
    }
  };



  return (
    <div className="min-h-[calc(100vh-13.5rem)] bg-(--primary)/5 pb-10 px-6 md:px-12 pt-10">
      <h1 className="text-center text-[22px] md:text-[26px] font-bold text-(--secondary) mb-10">
        Demographic Information
      </h1>

      {demographic.map((q, index) => (
        <div key={index} className="mb-8">
          <p className="font-semibold text-[17px] mb-3 text-(--primary)">
            {q.question}
          </p>

          {q.options ? (
            <div className="space-y-3 ml-1">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChange(q.question, opt)}
                  className="flex items-center cursor-pointer"
                >
                  <div className="h-[22px] w-[22px] rounded-full border-2 border-gray-500 flex items-center justify-center mr-3">
                    {form[q.question] === opt && (
                      <div className="h-3 w-3 rounded-full bg-(--secondary)" />
                    )}
                  </div>
                  <span className="text-[16px] text-black">{opt}</span>
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder={q.placeHolder}
              className="w-full text-black placeholder:text-black/40 border border-gray-300 rounded-md px-4 py-3 outline-none text-[16px] focus:border-(--secondary) focus:ring-1 focus:ring-(--secondary)"
              value={form[q.question] || ""}
              onChange={(e) => handleChange(q.question, e.target.value)}
            />
          )}
        </div>
      ))}

      <Button onClick={handleSubmit}>Continue</Button>
    </div>
  );
};

export default DemographicForm;
