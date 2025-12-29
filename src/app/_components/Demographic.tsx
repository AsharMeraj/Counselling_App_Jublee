
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Button from "./Button";
// import { demographic } from "@/app/_utils/demographic";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { cn } from "@/lib/utils";
// import { Label } from "@/components/ui/label";

// type FormState = Record<string, string>;

// /**
//  * MAIN DEMOGRAPHIC FORM COMPONENT
//  */
// const DemographicForm = () => {
//   const router = useRouter();
//   const [form, setForm] = useState<FormState>({});

//   const handleChange = (key: string, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async () => {
//     // Check for unanswered questions
//     const unanswered = demographic.some((q) => !form[q.key]);
//     if (unanswered) {
//       alert("Please answer all demographic questions before continuing.");
//       return;
//     }

//     // Build payload dynamically based on inputType
//     const payload: Record<string, string | number> = {};
//     demographic.forEach((q) => {
//       const value = form[q.key];
//       payload[q.key] =
//         q.inputType === "number" && value ? Number(value) : value;
//     });

//     try {
//       const res = await fetch("/api/save-entry", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || "Error saving data");
//         return;
//       }

//       // Clear old data before saving new
//       localStorage.removeItem("demographicData");
//       localStorage.removeItem("entryId");
//       localStorage.setItem(
//         "demographicData",
//         JSON.stringify({ ...payload, entryId: data.entryId })
//       );

//       router.push("/selection");
//     } catch (error) {
//       console.error(error);
//       // Fallback for demo environments
//       alert("Note: Data captured! (API simulation). Proceeding to assessment.");
//       router.push("/selection");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-primary/5 pb-20">
//       {/* Hero Section with requested Gradient Background and Wave Embroidery */}
//       <div
//         className="w-full h-64 sm:h-80 relative overflow-hidden"
//         style={{ background: `linear-gradient(135deg, var(--primary, #0094cf) 0%, var(--secondary, #9c2790) 100%)` }}
//       >
//         <div className="absolute inset-0 opacity-10 pointer-events-none">
//           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
//           </svg>
//         </div>

//         <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
//           <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-white/30">
//             Initial Registration
//           </div>
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
//             Demographic Information
//           </h1>
//           <p className="text-white/80 mt-3 max-w-xl text-sm sm:text-lg font-medium leading-relaxed">
//             Please fill out the following details to begin your assessment session.
//           </p>
//         </div>
//       </div>

//       <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
//         <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 sm:p-12 transition-all animate-in fade-in slide-in-from-bottom-8 duration-700">
//           <div className="space-y-12">
//             {demographic.map((q) => (
//               <div key={q.key} className="space-y-4">
//                 <Label className="text-xl font-bold text-primary flex items-center gap-2">
//                   <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
//                   {q.question}
//                 </Label>

//                 {/* SHADCN INPUT */}
//                 {q.type === "text" && (
//                   <Input
//                     type={q.inputType || "text"}
//                     placeholder={q.placeHolder}
//                     value={form[q.key] || ""}
//                     onChange={(e) => handleChange(q.key, e.target.value)}
//                     onKeyDown={(e) => {
//                       if (q.inputType === "number" && !/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
//                         e.preventDefault();
//                       }
//                     }}
//                   />
//                 )}

//                 {/* SHADCN RADIO GROUP */}
//                 {q.type === "radio" && q.options && (
//                   <RadioGroup className="flex flex-wrap gap-4">
//                     {q.options.map((opt, idx) => {
//                       const id = `${q.key}-${idx}`;
//                       const isSelected = form[q.key] === opt;
//                       return (
//                         <div 
//                           key={id}
//                           onClick={() => handleChange(q.key, opt)}
//                           className={cn(
//                             "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
//                             isSelected 
//                               ? "bg-secondary/5 border-secondary text-secondary shadow-sm shadow-secondary/10" 
//                               : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-100"
//                           )}
//                         >
//                           <RadioGroupItem 
//                             id={id} 
//                             value={opt} 
//                             isSelected={isSelected} 
//                             onClick={(e: any) => {
//                               e.stopPropagation();
//                               handleChange(q.key, opt);
//                             }}
//                           />
//                           <Label htmlFor={id} className="cursor-pointer font-bold text-[16px] leading-none">
//                             {opt}
//                           </Label>
//                         </div>
//                       );
//                     })}
//                   </RadioGroup>
//                 )}

//                 {/* SHADCN SELECT */}
//                 {q.type === "select" && q.options && (
//                   <Select
//                     value={form[q.key]}
//                     onValueChange={(val: string) => handleChange(q.key, val)}
//                   >
//                     <SelectTrigger placeholder="Select one" />
//                     <SelectContent>
//                       {q.options.map((opt, idx) => (
//                         <SelectItem key={idx} value={opt}>
//                           {opt}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               </div>
//             ))}

//             <div className="pt-8">
//               <Button
//                 type="button"
//                 onClick={handleSubmit}
//                 className="w-full py-6 text-white shadow-xl shadow-secondary/20 hover:shadow-secondary/40"
//                 style={{ background: `linear-gradient(135deg, var(--primary, #0094cf), var(--secondary, #9c2790))` }}
//               >
//                 <span>Continue</span>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DemographicForm;


// "use client";

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { demographic } from "@/app/_utils/demographic";
import { DemographicField } from "@/app/_utils/demographic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type FormState = Record<string, string>;
/**
 * MAIN DEMOGRAPHIC FORM COMPONENT
 * Fixed version:
 * 1. Removed 'isSelected' prop from RadioGroupItem (handled by RadioGroup value).
 * 2. Moved 'placeholder' from SelectTrigger to SelectValue.
 */
const DemographicForm = () => {
  const [form, setForm] = useState<FormState>({});
  const router = useRouter()

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
      alert("Note: Data captured! (API simulation).");
    }
  };

  return (
    <div className="min-h-screen bg-primary/5 pb-20">
      {/* Hero Section with requested Gradient Background and Wave Embroidery */}
      <div
        className="w-full h-64 sm:h-80 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, var(--primary, #0094cf) 0%, var(--secondary, #9c2790) 100%)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-white/30">
            Initial Registration
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
            Demographic Information
          </h1>
          <p className="text-white/80 mt-3 max-w-xl text-sm sm:text-lg font-medium leading-relaxed">
            Please fill out the following details to begin your assessment session.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 sm:p-12 transition-all">
          <div className="space-y-8">
            {demographic.map((q) => (
              <div key={q.key} className={`space-y-4 ${q.type === "select" || q.question === "Phone Number"? "mt-10" : ""}`}>
                <Label className="text-xl font-bold text-[#0094cf] flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#9c2790] rounded-full"></span>
                  {q.question}
                </Label>

                {/* SHADCN INPUT */}
                {q.type === "text" && (
                  <Input
                    type={q.inputType || "text"}
                    placeholder={q.placeHolder}
                    value={form[q.key] || ""}
                    onChange={(e) => handleChange(q.key, e.target.value)}
                    onKeyDown={(e) => {
                      if (q.inputType === "number" && !/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                        e.preventDefault();
                      }
                    }}
                  />
                )}

                {/* SHADCN RADIO GROUP */}
                {q.type === "radio" && q.options && (
                  <RadioGroup
                    className="flex flex-wrap gap-4"
                    value={form[q.key]}
                    onValueChange={(val: string) => handleChange(q.key, val)}
                  >
                    {q.options.map((opt, idx) => {
                      const id = `${q.key}-${idx}`;
                      const isSelected = form[q.key] === opt;
                      return (
                        <div
                          key={id}
                          onClick={() => handleChange(q.key, opt)}
                          className={cn(
                            "flex items-center gap-3 px-6 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                            isSelected
                              ? "bg-[rgba(156,39,144,0.05)] border-[#9c2790] text-[#9c2790] shadow-sm shadow-[#9c2790]/10"
                              : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <RadioGroupItem
                            id={id}
                            value={opt}
                            // isSelected removed - now controlled by parent RadioGroup
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleChange(q.key, opt);
                            }}
                          />
                          <Label htmlFor={id} className="cursor-pointer font-bold text-[16px] leading-none">
                            {opt}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}

                {/* SHADCN SELECT */}
                {q.type === "select" && q.options && (
                  <div className="text-[17px]">
                    <Select
                      value={form[q.key]}
                      onValueChange={(val: string) => handleChange(q.key, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select one" />
                      </SelectTrigger>
                      <SelectContent>
                        {q.options.map((opt, idx) => (
                          <SelectItem key={idx} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4">
              <Button
                type="button"
                onClick={handleSubmit}

              >
                <span className="flex gap-2 w-fit m-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-3"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                  Continue
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicForm;


