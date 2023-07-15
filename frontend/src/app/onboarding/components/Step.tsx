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
      variants={itemVariants} // set the variants
      initial="normal" // set the initial state
      animate={step.number === currentStep ? "active" : "normal"} // animate depending on the state
    >
      {step.is_finished ? (
        <div className="text-sm md:text-lg text-green-600 w-6 h-6 md:w-12 md:h-12 flex items-center justify-center border border-2 border-green-600 rounded-full bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
      ) : step.number === currentStep ? (
        <div
          className={`flex items-center justify-between border border-2 px-2 md:px-4 md:py-2 rounded-full flex-none bg-white ${
            step.number === currentStep
              ? "border border-2 border-solid border-pink-600 text-pink-600"
              : ``
          }`}
        >
          <span className="w-full font-bold text-center text-sm md:text-lg">
            {step.description}
          </span>
        </div>
      ) : (
        <div
          className={`w-6 h-6 md:w-12 md:h-12 flex items-center justify-between border border-2 px-2 md:px-4 md:py-2 rounded-full bg-white ${
            step.number === currentStep
              ? "border border-2 border-solid border-pink-600 text-pink-600"
              : ``
          }`}
        >
          <span className="text-sm md:text-lg"></span>
        </div>
      )}
    </motion.div>
  );
}
