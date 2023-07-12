import { useEffect } from "react";

import { motion, useAnimation } from "framer-motion";

import { IStep } from "../../../../typings";

export default function Step({
  step,
  currentStep,
  setCurrentStep,
  isLoading,
}: {
  step: IStep;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
}) {
  const controls = useAnimation();

  useEffect(() => {
    if (!isLoading) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.75 },
      });
    }
  }, [isLoading, controls]);

  return (
    <motion.button
      animate={controls}
      initial={{ opacity: 0, x: -100 }}
      onClick={() => setCurrentStep(step.number)}
      className={`flex items-center justify-between border px-4 py-2 rounded-lg text-left ${
        step.number === currentStep ? "border border-solid border-pink-600" : ``
      }`}
    >
      <div className="flex items-center justify-center h-8 w-8 rounded-full border border-solid border-pink-600">
        <span className="text-lg">{step.number}</span>
      </div>
      <span className={(step.is_finished ? "line-through " : "") + "ml-4 grow"}>
        {step.description}
      </span>
      {step.is_finished && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-green-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
    </motion.button>
  );
}
