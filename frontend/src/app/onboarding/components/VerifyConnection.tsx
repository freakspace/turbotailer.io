import { useState, useEffect } from "react";

import StepWrapper from "./StepWrapper";
import { motion, useAnimation } from "framer-motion";

import { verifyConnection } from "../services";

export default function VerifyConnection({
  token,
  storeId,
  hasConnection,
  isConnecting,
  connectionError,
  setIsConnecting,
  setHasConnection,
  setCurrentStep,
  setConnectionError,
}: {
  token: string | null;
  storeId: string | undefined;
  hasConnection: boolean;
  isConnecting: boolean;
  connectionError: string;
  setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  setHasConnection: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setConnectionError: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleVerification = async () => {
    if (!token || !storeId) {
      setConnectionError("You need to be logged in");
      return;
    }

    setIsConnecting(true);

    const response = await verifyConnection(token, storeId);

    if (response.ok) {
      setHasConnection(true);
      setIsConnecting(false);
      setConnectionError("");
      // Wait 3 seconds before next step
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2000);
    } else {
      setConnectionError("We can't establish a connection");
    }
  };

  console.log(hasConnection);

  const spinner = {
    animate: {
      rotate: 360,
    },
    transition: {
      repeat: Infinity,
      ease: "linear",
      duration: 1,
    },
  };

  return (
    <StepWrapper>
      <div className="">
        <h3 className="text-xl font-bold mb-5">Verifying Connection</h3>
        <p className="text-lg mb-5">
          We'll ping your API to check if there is a connection
        </p>

        <div className="">
          {hasConnection ? (
            <button className="inline-flex items-center px-6 py-2 rounded-xl font-bold text-xl border border-2 border-solid border-green-600 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-green-600 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Connected
            </button>
          ) : isConnecting ? (
            <button className="inline-flex items-center px-6 py-2 rounded-xl font-bold text-xl border border-2 border-solid border-pink-600">
              <motion.div
                className="w-6 h-6 border-t-2 border-pink-600 rounded-full mr-2"
                animate={spinner.animate}
                transition={spinner.transition}
              />
              Connecting
            </button>
          ) : (
            <button
              onClick={() => handleVerification()}
              className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl"
            >
              Verify
            </button>
          )}
        </div>
        {connectionError && (
          <span className="text-sm text-red-600">{connectionError}</span>
        )}
      </div>
    </StepWrapper>
  );
}
