"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { demographic } from "@/app/_utils/demographic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FormState = Record<string, string>;

const DemographicForm = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({});

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Check for unanswered questions
    const unanswered = demographic.some((q) => !form[q.key]);
    if (unanswered) {
      alert("Please answer all demographic questions before continuing.");
      return;
    }

    // Build payload dynamically based on inputType
    const payload: Record<string, string | number> = {};
    demographic.forEach((q) => {
      const value = form[q.key];
      payload[q.key] =
        q.inputType === "number" && value ? Number(value) : value;
    });

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

      // Clear old data before saving new
      localStorage.removeItem("demographicData");
      localStorage.removeItem("entryId");
      localStorage.setItem(
        "demographicData",
        JSON.stringify({ ...payload, entryId: data.entryId })
      );

      router.push("/selection");
    } catch (error) {
      console.error(error);
      alert("Server error — try again.");
    }
  };

  return (
    <div className="h-fit bg-(--primary)/5 pb-10 px-6 md:px-12 pt-10">
      <h1 className="text-center text-[22px] md:text-[26px] font-bold text-secondary">
        Demographic Information
      </h1>

      {demographic.map((q) => (
        <div key={q.key} className="mb-6">
          <p className="font-semibold text-[17px] mb-3 text-primary">{q.question}</p>

          {/* TEXT / NUMBER INPUT */}
          {q.type === "text" && (
            <Input
              type={q.inputType || "text"}
              placeholder={q.placeHolder}
              value={form[q.key] || ""}
              onChange={(e) => handleChange(q.key, e.target.value)}
              onKeyDown={(e) => {
                if (q.inputType === "number" && !/[0-9]/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              className="w-full text-black placeholder:text-black/40 text-[17px] placeholder:text-[17px] border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary focus:ring-offset-1"
            />
          )}

          {/* RADIO BUTTONS */}
          {q.type === "radio" && q.options && (
            <RadioGroup
              className="flex gap-6 flex-wrap"
              value={form[q.key] || ""}
              onValueChange={(val) => handleChange(q.key, val)}
            >
              {q.options.map((opt, idx) => (
                <div key={`${q.key}-${idx}`} className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem
                    value={opt}
                    id={`${q.key}-${idx}`}
                    className="focus-visible:ring-secondary focus-visible:ring-2"
                  />
                  <label htmlFor={`${q.key}-${idx}`} className="text-[16px] text-black/80">
                    {opt}
                  </label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* SELECT DROPDOWN */}
          {q.type === "select" && q.options && (
            <Select
              value={form[q.key] || undefined}
              onValueChange={(val) => handleChange(q.key, val)}
            >
              <SelectTrigger
                id={`select-${q.key}`}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-[17px] outline-none focus:border-secondary focus:ring-2 focus:ring-secondary focus:ring-offset-1"
              >
                <SelectValue placeholder="Select one"/>
              </SelectTrigger>
              <SelectContent>
                {q.options.map((opt, idx) => (
                  <SelectItem key={`${q.key}-${idx}`} value={opt} className="text-[17px]">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}

      <Button type="button" onClick={handleSubmit}>
        Continue
      </Button>
    </div>
  );
};

export default DemographicForm;
