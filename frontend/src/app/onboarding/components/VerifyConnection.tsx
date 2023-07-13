import { useState } from "react";

import StepWrapper from "./StepWrapper";

import { verifyConnection } from "../services";

export default function VerifyConnection({
  token,
  storeId,
  hasConnection,
  setHasConnection,
  setCurrentStep,
}: {
  token: string | null;
  storeId: string | undefined;
  hasConnection: boolean;
  setHasConnection: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [connectionError, setConnectionError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerification = async () => {
    if (!token || !storeId) {
      setConnectionError("You need to be logged in");
      return;
    }

    const response = await verifyConnection(token, storeId);

    if (response.ok) {
      setHasConnection(true);
      setConnectionError("");
      setCurrentStep((prev) => prev + 1);
    } else {
      setConnectionError("We can't establish a connection");
    }
  };

  console.log(hasConnection);
  return (
    <StepWrapper>
      <div className="">
        <h3 className="text-xl font-bold mb-5">Verify Connection</h3>
        {hasConnection && (
          <div className="inline-flex items-center rounded-full border border-2 border-solid border-green-600 pl-2 pr-4 py-2 mb-5">
            <span>
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
            </span>
            <span className="font-bold text-green-600">Connected</span>
          </div>
        )}
        <p className="text-lg mb-5">
          We'll ping your API to check if there is a connection
        </p>

        <div className="">
          <button
            onClick={() => handleVerification()}
            className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl"
          >
            Verify
          </button>
        </div>
        {connectionError && (
          <span className="text-sm text-red-600">{connectionError}</span>
        )}
      </div>
    </StepWrapper>
  );
}
