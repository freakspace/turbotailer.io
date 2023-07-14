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
  /* const controls = useAnimation();

  useEffect(() => {
    if (!isLoading) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.75 },
      });
    }
  }, [isLoading, controls]); */

  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.25 },
    });
  });

  const itemVariants = {
    normal: { flexGrow: 0, transition: { duration: 0.25 } },
    active: { flexGrow: 1, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      onClick={() => setCurrentStep((prev) => prev + 1)}
      className={`flex items-center justify-between border border-2 px-4 py-2 rounded-xl flex-none bg-white ${
        step.number === currentStep
          ? "border border-2 border-solid border-pink-600 text-pink-600"
          : ``
      }`}
      variants={itemVariants} // set the variants
      initial="normal" // set the initial state
      animate={step.number === currentStep ? "active" : "normal"} // animate depending on the state
    >
      {step.is_finished ? (
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
      ) : step.number === currentStep ? (
        <span className="w-full ml-4 font-bold text-center text-lg">
          {step.description}
        </span>
      ) : (
        <span className="text-lg text-center  ">{step.number}</span>
      )}
    </motion.div>
  );
}
