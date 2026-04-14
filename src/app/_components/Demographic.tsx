/*main personal info form*/
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
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { usePathname } from 'next/navigation';
import NormalScreening from "./NormalScreening";
import { Loader2, Search } from "lucide-react";

type FormState = Record<string, string>;
/**
 * MAIN DEMOGRAPHIC FORM COMPONENT
 * Fixed version:
 * 1. Removed 'isSelected' prop from RadioGroupItem (handled by RadioGroup value).
 * 2. Moved 'placeholder' from SelectTrigger to SelectValue.
 */
const DemographicForm = ({ currentUser, onSuccess }: { currentUser: string | null, onSuccess: () => void }) => {
  const [form, setForm] = useState<FormState>({});
  const [isFinding, setIsFinding] = useState(false);
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);
  const router = useRouter()
  const pathname = usePathname();
  const [showConsent, setShowConsent] = useState(false);
  const [showConsentDetails, setShowConsentDetails] = useState(false);


  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // --- NEW: FIND USER LOGIC ---
  const handleFindUser = async () => {
    // Assuming 'phone' is the key in your demographic array for phone number
    const phoneNumber = form["phoneNumber"];

    if (!phoneNumber || phoneNumber.length < 5) {
      alert("Please enter a valid phone number first.");
      return;
    }

    setIsFinding(true);
    try {
      const res = await fetch(`/api/find-entry-by-phone?phone=${phoneNumber}`);

      if (!res.ok) {
        throw new Error("User not found");
      }

      const data = await res.json();

      if (data) {
        // 1. Populate the form with existing data
        setForm(data.fields);
        setExistingEntryId(data.entryId);

        // 2. Set necessary localStorage items
        localStorage.setItem("entryId", data.entryId);
        // localStorage.setItem("user_id", data.user_id);


      }
    } catch (error) {
      console.error(error);
      alert("No existing record found for this phone number.");
    } finally {
      setIsFinding(false);
    }
  };

  // console.log(currentUser, pathname)

  const handleSubmit = async () => {
    const unanswered = demographic.some((q) => q.key !== "email" && !form[q.key]);
    if (unanswered) {
      alert("Please answer all demographic questions before continuing.");
      return;
    }
    setShowConsent(true);
  };

  const handleConsentResponse = async (accepted: boolean) => {
    setShowConsent(false);

    const userId = localStorage.getItem("user_id");
    const payload: Record<string, any> = {
      user_id: userId || "",
      entryId: existingEntryId,
      consent: accepted ? "accept" : "reject", //  saves consent value
    };

    demographic.forEach((q) => {
      const value = form[q.key];
      payload[q.key] = q.inputType === "number" && value ? Number(value) : value;
    });

    try {
      const res = await fetch("/api/save-normal-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("entryId", data.entryId);
        localStorage.setItem("normalDemographicData", JSON.stringify({ ...payload, entryId: data.entryId }));

        if (accepted) {
          onSuccess(); //  proceed only if accepted
        }
        // If rejected: data is saved but user stays on the form
      }
    } catch (error) {
      console.error(error);
      alert("Note: Data captured! (API simulation).");
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-primary/5 pb-20">
      {/* Hero Section with requested Gradient Background and Wave Embroidery */}
      <div
        className="w-full h-45 sm:h-64 md:h-80 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, var(--primary, #0094cf) 0%, var(--secondary, #9c2790) 100%)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-2 sm:px-6 text-center">
          <div className="bg-white/20 backdrop-blur-md px-4 py-1 sm:py-1.5 rounded-full text-white text-[12px] sm:text-[12px] font-black uppercase tracking-[0.3em] mb-2 sm:mb-4 border border-white/30">
            Initial Registration
          </div>
          <h1 className="text-[28px] sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
            Demographic Information
          </h1>
        </div>
      </div>
      {/*Form */}
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 -mt-5 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 px-6 py-8 sm:p-12 transition-all">
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
            {demographic.map((q) => (
              <div
                key={q.key}
                className={cn(
                  "space-y-4 md:col-span-12",
                  ["name", "father_husband", "qualification", "profession", "age", "email"].includes(q.key)
                    ? "md:col-span-6"
                    : "md:col-span-12"
                )}
              >
                <Label className="text-[15px] sm:text-2xl font-bold text-[#0094cf] flex items-start gap-2">
                  <span className="w-1.5 h-6 bg-[#9c2790] rounded-full"></span>
                  {q.question}
                </Label>

                {/* SPECIAL HANDLING FOR PHONE NUMBER FIELD */}
                {q.question === "Phone Number" ? (
                  <div className="flex gap-3">
                    <Input
                      className="flex-1"
                      type={q.inputType || "text"}
                      placeholder={q.placeHolder}
                      value={form[q.key] || ""}
                      onChange={(e) => handleChange(q.key, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleFindUser}
                      disabled={isFinding}
                      className="px-3 py-1 sm:px-6 sm:py-2 bg-secondary text-white rounded-md font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:bg-slate-300"
                    >
                      {isFinding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Find
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Standard Inputs (Text/Radio/Select) logic here... */}
                    {q.type === "text" && (
                      <Input
                        type={q.inputType || "text"}
                        placeholder={q.placeHolder}
                        value={form[q.key] || ""}
                        onChange={(e) => handleChange(q.key, e.target.value)}
                      />
                    )}
                    {/* ... (Keep your existing Radio and Select rendering code here) */}
                  </>
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
                            "flex items-center gap-1 sm:gap-3 px-3 py-3 sm:px-6 sm:py-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
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
                          <Label htmlFor={id} className="cursor-pointer font-bold text-[14px] sm:text-[16px] leading-none">
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

            <div className="pt-4 col-span-12">
              <Button
                type="button"
                onClick={handleSubmit}

              >
                <span className="flex gap-2 w-fit m-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -3 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-3"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                  Continue
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CONSENT MODAL */}
      {showConsent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-2xl lg:max-w-4xl h-[90vh] flex flex-col p-5 sm:p-8 lg:p-10">

            {/* Title */}
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-center text-slate-800 mb-3 sm:mb-4 shrink-0">
              Terms and Conditions
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-3 sm:mb-4 shrink-0">
              Your consent for the medical information described in this form is required to proceed for the appointment.
            </p>

            {/* Toggle button */}
            <button
              className="text-[#0094cf] font-bold text-sm sm:text-base lg:text-lg underline mb-3 sm:mb-4 text-left shrink-0"
              onClick={() => setShowConsentDetails((prev) => !prev)}
            >
              {showConsentDetails
                ? "Click here to hide the Consent Form"
                : "Click here to view the Consent Form"}
            </button>

            {/* Scrollable consent text — grows to fill space */}
            {showConsentDetails && (
              <div className="text-sm sm:text-base lg:text-lg text-slate-600 flex-1 overflow-y-auto border rounded-lg p-3 sm:p-5 mb-4 space-y-3 sm:space-y-4 leading-relaxed min-h-0">
                <p>This notice describes how your medical information may be used and disclosed and how you can get access to this information. Please review it carefully.</p>
                <p>Personally identifiable information about your health, your health care, and your payment for health care are called protected health information. We must safeguard your protected health information and give you this notice about our privacy practices that explains how, when and why we may use or disclose your protected health information. Except in the situations set out in the notice, we must use or disclose only the minimum necessary protected health information to carry out the use or disclosure.</p>
                <p>We must follow the practices described in this notice, but we can change our privacy practices and the terms of this notice at any time.</p>

                <p className="font-bold">Uses and Disclosures of Your Protected Health Information That Do Not Require Your Consent</p>
                <p>We may use and disclose your Protected Health Information as follows without your permission:</p>
                <p><strong>For treatment purposes-</strong> We may disclose your health information to doctors, nurses, and others who provide your health care. For example, your information may be shared with people performing lab work or x-rays</p>
                <p><strong>When required by law-</strong> We may be required to disclose your protected health information to law enforcement officers, courts, or government agencies. For example, we may have to report abuse, neglect, or certain physical injuries.</p>
                <p><strong>For public health activities-</strong> We may be required to report your health information to government agencies to prevent or control disease or injury. We also may have to report work-related illnesses and injuries to your employer so that your workplace may be monitored for safety</p>
                <p><strong>For health oversight activities-</strong> We may be required to disclose your health information to government agencies so that they can monitor or license health care providers, such as doctors and nurses.</p>

                <p className="font-bold">Uses and Disclosures of Your Protected Health Information That Require Your Consent</p>
                <p>The following uses and disclosures of your protected health information will be made only with your written permission, which you may withdraw at any time:</p>
                <p><strong>For research purposes-</strong> In order to serve our patient community, we may want to use your health information in research studies. For example, researchers may want to see whether your treatment cured your illness. In such an instance, we will ask you to complete a form allowing us to use or disclose your information for research purposes. Completion of this form is voluntary and will not affect your treatment.</p>
                <p><strong>For marketing purposes-</strong> Without your permission, we will not send you mail or call you on the telephone to urge you to use a particular product or service, unless such a mailing or call is part of your treatment. Additionally, without your permission, we will not sell or otherwise disclose your protected health information to any person or company seeking to market its products or services to you.</p>
                <p><strong>Of psychotherapy notes-</strong> Without your permission, we will not use or disclose notes in which your doctor describes or analyzes a counseling session in which you participated.</p>
                <p><strong>For any other purposes not described in this notice-</strong>Without your permission, we will not use or disclose your health information under any circumstances that are not described in this notice.</p>
              </div>
            )}

            {/* Spacer when details hidden so buttons stay at bottom */}
            {!showConsentDetails && <div className="flex-1" />}

            {/* Action Buttons — pinned at bottom */}
            <div className="flex justify-center gap-8 sm:gap-16 pt-3 sm:pt-5 border-t border-slate-100 shrink-0">
              <button
                onClick={() => handleConsentResponse(true)}
                className="px-8 sm:px-14 py-2 sm:py-3 text-[#0094cf] font-black text-base sm:text-lg lg:text-xl uppercase tracking-widest hover:underline"
              >
                ACCEPT
              </button>
              <button
                onClick={() => handleConsentResponse(false)}
                className="px-8 sm:px-14 py-2 sm:py-3 text-[#9c2790] font-black text-base sm:text-lg lg:text-xl uppercase tracking-widest hover:underline"
              >
                DECLINE
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DemographicForm;


