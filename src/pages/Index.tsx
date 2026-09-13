import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FormWelcome } from "@/components/FormWelcome";
import { FormQuestionWithValidation } from "@/components/FormQuestionWithValidation";
import { FormRewards } from "@/components/FormRewards";
import { FormComplete } from "@/components/FormComplete";
import { SECTIONS } from "@/lib/sections";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "date" | "file" | "checkbox";
  title: string;
  subtitle?: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  groups?: { label: string; icon: string; options: string[]; benefits?: string[] }[];
}

const YES_NO = ["Yes", "No"];

const questions: Question[] = [
  /* ── Personal Details ─────────────────────────────────────────── */
  {
    id: "fullName",
    type: "text",
    title: "1. Full Name",
    subtitle: "Enter your full name.",
    required: true,
    placeholder: "Your full name",
  },
  {
    id: "email",
    type: "email",
    title: "2. Email ID",
    subtitle: "Enter your active email address.",
    required: true,
    placeholder: "your@email.com",
  },
  {
    id: "phone",
    type: "tel",
    title: "3. Phone Number",
    subtitle: "Enter your WhatsApp/contact number.",
    required: true,
    placeholder: "+91 00000 00000",
  },
  {
    id: "occupation",
    type: "text",
    title: "4. Occupation",
    subtitle: "What do you currently do?",
    required: true,
    placeholder: "e.g. Student, Business, IT Professional",
  },

  /* ── Trading Background ───────────────────────────────────────── */
  {
    id: "currentCourse",
    type: "select",
    title: "5. Which course are you currently enrolled in at Delta?",
    required: true,
    options: ["Basics (MBT)", "Intermediate (DWT)", "DSLP", "DQMP", "DGMP"],
  },
  {
    id: "readyForJourney",
    type: "select",
    title: "6. Are you ready for a 6-month journey?",
    required: true,
    options: YES_NO,
  },
  {
    id: "tradingDuration",
    type: "text",
    title: "7. How long have you been into Trading?",
    subtitle: "Short answer.",
    required: true,
    placeholder: "e.g. 8 months, 2 years",
  },
  {
    id: "expectations",
    type: "textarea",
    title: "8. What are you expecting from this 6-month journey?",
    subtitle: "Briefly share what you want to learn, improve, or achieve.",
    required: true,
    placeholder: "What do you want to learn, improve, or achieve?",
  },

  /* ── Commitment & Consistency ─────────────────────────────────── */
  {
    id: "sessionPreference",
    type: "select",
    title: "9. Which session are you most comfortable attending?",
    required: true,
    options: ["Morning", "Evening"],
  },
  {
    id: "willAttendConsistently",
    type: "select",
    title: "10. Will you consistently join the sessions throughout the 6-month journey?",
    required: true,
    options: YES_NO,
  },
  {
    id: "keptJournal",
    type: "select",
    title: "11. Have you ever maintained or followed a Trading Journal?",
    required: true,
    options: YES_NO,
  },

  /* ── The Final Check ──────────────────────────────────────────── */
  {
    id: "readyToBuild",
    type: "select",
    title: "12. Are you ready to move beyond just learning Trading and start building yourself as a disciplined Trader?",
    required: true,
    options: YES_NO,
  },
  {
    id: "seriousness",
    type: "text",
    title: "13. How serious are you about transforming your Trading over the next 6 months?",
    subtitle: "Short answer.",
    required: true,
    placeholder: "Be honest — how serious are you?",
  },
  {
    id: "oneThingToChange",
    type: "text",
    title: "14. What is ONE thing you are willing to change about yourself to become a better Trader?",
    subtitle: "Short answer.",
    required: true,
    placeholder: "The one thing you will change",
  },
  {
    id: "takeResponsibility",
    type: "select",
    title: "15. If you are given the right knowledge, structure, and guidance — are you ready to take complete responsibility for your execution?",
    required: true,
    options: YES_NO,
  },

  /* ── The Chief's Question ─────────────────────────────────────── */
  {
    id: "sixMonthsFromNow",
    type: "textarea",
    title: "16. Six months from now, what do you want to be able to say about yourself as a Trader?",
    subtitle: "Write it in one powerful sentence.",
    required: true,
    placeholder: "Six months from now, I am a trader who…",
  },
];

type Step = "welcome" | "questions" | "rewards" | "complete";

const STORAGE = {
  step:  "cbrCurrentStep",
  index: "cbrCurrentQuestionIndex",
  ans:   "cbrAnswers",
  sub:   "cbrSubmissionId",
};

/** Stable id per submission attempt — reused on retry so the script never writes a duplicate row. */
const getSubmissionId = () => {
  let id = localStorage.getItem(STORAGE.sub);
  if (!id) {
    id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE.sub, id);
  }
  return id;
};

const readJson = async (res: Response) => {
  try { return await res.json(); } catch { return null; }
};

// Deployed Chief's Blueprint Registration Apps Script (web app)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQ3EVCzu50svB52TKUW_pn3bqvFLFmFwgPfvQy3hsQzrwMdB8m7loVy2h9ZxvtW2QZfg/exec";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>(
    (localStorage.getItem(STORAGE.step) as Step) || "welcome",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    parseInt(localStorage.getItem(STORAGE.index) || "0"),
  );
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.ans) || "{}");
    } catch { return {}; }
  });
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Track whether the last action was navigating back — suppresses select auto-advance
  const navigatedBackRef = useRef(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE.step,  currentStep);
    localStorage.setItem(STORAGE.index, currentQuestionIndex.toString());
    localStorage.setItem(STORAGE.ans, JSON.stringify(answers));
  }, [currentStep, currentQuestionIndex, answers]);

  const clearStorage = () => {
    localStorage.removeItem(STORAGE.step);
    localStorage.removeItem(STORAGE.index);
    localStorage.removeItem(STORAGE.ans);
    localStorage.removeItem(STORAGE.sub);
  };

  const handleStart = () => { setCurrentStep("questions"); setCurrentQuestionIndex(0); };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const q   = questions[currentQuestionIndex];
    const ans = answers[q.id];
    if (q.required && (!ans || ans?.trim?.() === "")) return;

    if (currentQuestionIndex < questions.length - 1) {
      setDirection("left");
      setCurrentQuestionIndex(i => i + 1);
    } else {
      // Last question → Rewards page (second-last page)
      setDirection("left");
      setCurrentStep("rewards");
    }
  };

  const handlePrevious = () => {
    if (currentStep === "rewards") {
      navigatedBackRef.current = true;
      setDirection("right");
      setCurrentStep("questions");
      setCurrentQuestionIndex(questions.length - 1);
      return;
    }
    if (currentQuestionIndex > 0) {
      navigatedBackRef.current = true;
      setDirection("right");
      setCurrentQuestionIndex(i => i - 1);
    }
  };

  // Auto-advance for select — but NOT when navigating back
  useEffect(() => {
    if (currentStep !== "questions") return;
    if (navigatedBackRef.current) {
      navigatedBackRef.current = false;
      return;
    }
    const q = questions[currentQuestionIndex];
    if (q?.type === "select" && answers[q.id]) {
      const t = setTimeout(handleNext, 350);
      return () => clearTimeout(t);
    }
  }, [answers, currentQuestionIndex, currentStep]);   // eslint-disable-line

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const submissionId = getSubmissionId();
      const payload = {
        submissionId,
        fullName:               answers.fullName               || "",
        email:                  answers.email                  || "",
        phone:                  answers.phone                  || "",
        occupation:             answers.occupation             || "",
        currentCourse:          answers.currentCourse          || "",
        readyForJourney:        answers.readyForJourney        || "",
        tradingDuration:        answers.tradingDuration        || "",
        expectations:           answers.expectations           || "",
        sessionPreference:      answers.sessionPreference      || "",
        willAttendConsistently: answers.willAttendConsistently || "",
        keptJournal:            answers.keptJournal            || "",
        readyToBuild:           answers.readyToBuild           || "",
        seriousness:            answers.seriousness            || "",
        oneThingToChange:       answers.oneThingToChange       || "",
        takeResponsibility:     answers.takeResponsibility     || "",
        sixMonthsFromNow:       answers.sixMonthsFromNow       || "",
      };

      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      let result = await readJson(res);

      // Apps Script relays its response through script.googleusercontent.com, and that relay
      // sometimes returns a 404 HTML page even though the script already finished and wrote
      // the row. In that case, ask the script what happened to this submissionId.
      // The relay can fail on the check call too, so try it a few times.
      for (let attempt = 0; attempt < 4 && !result?.status; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1500));
        const check = await fetch(`${SCRIPT_URL}?check=${encodeURIComponent(submissionId)}`);
        result = await readJson(check);
        if (result?.status === "unknown") result = null;   // not cached (yet) → keep trying
      }

      if (result?.status === "success") {
        toast({ title: "Registration Submitted!", description: "Welcome to The Chief's Blueprint." });
        clearStorage();
        setCurrentStep("complete");
        return;
      }
      throw new Error(result?.message || "Submission failed — please try again.");
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to submit", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    clearStorage();
    setAnswers({});
    setCurrentQuestionIndex(0);
    setDirection("left");
    setCurrentStep("welcome");
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer   = currentQuestion ? answers[currentQuestion.id] ?? "" : "";

  const canGoNext = currentQuestion
    ? !currentQuestion.required || (currentAnswer && currentAnswer?.trim?.() !== "")
    : false;

  if (currentStep === "welcome")  return <FormWelcome onStart={handleStart} />;
  if (currentStep === "rewards")  return (
    <FormRewards onSubmit={handleSubmit} onPrevious={handlePrevious} isSubmitting={loading} sections={SECTIONS} />
  );
  if (currentStep === "complete") return <FormComplete onRegisterAnother={handleRegisterAnother} sections={SECTIONS} />;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <FormQuestionWithValidation
        key={currentQuestionIndex}
        question={currentQuestion as any}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        value={currentAnswer}
        onChange={v => handleAnswerChange(currentQuestion.id, v)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={canGoNext}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === questions.length - 1}
        allAnswers={answers}
        direction={direction}
        isSubmitting={loading}
      />
    </AnimatePresence>
  );
};

export default Index;
