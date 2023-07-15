"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [serverErrors, setServerErrors] = useState([]);

  const handleSubmit = () => {};
  return (
    <div className="w-screen">
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <div className="w-1/2">
            <div className="bg-gray-50 rounded-2xl border border-solid border-gray-300 p-10 shadow-xl">
              <h2 className="text-5xl mb-3 text-pink-600 font-bold">
                Turbocharge Your Store
              </h2>
              <p className="text-lg mb-5 font-bold">
                Create an account to get started
              </p>
              {serverErrors &&
                serverErrors.map((error, id) => (
                  <span key={id} className="text-red-600">
                    {error}
                  </span>
                ))}
              <form onSubmit={handleSubmit}>
                <div className={"flex flex-col mb-4"}>
                  <label className="">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10 rounded-md border border-solid border-gray-300 focus:border-2 focus:border-pink-600 focus:outline-none"
                  />
                </div>
                <div
                  className={
                    (emailError ? "border-solid border-red-600 " : "") +
                    "flex flex-col mb-4"
                  }
                >
                  <label
                    htmlFor="email"
                    className={(emailError ? "text-red-600 " : "") + "mb-1"}
                  >
                    Your E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={
                      (emailError
                        ? "border-solid border border-red-600 "
                        : "border-solid border border-gray-300 ") +
                      "h-10 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
                    }
                    required
                  />
                  {emailError && (
                    <span className="text-sm text-red-600">{emailError}</span>
                  )}
                </div>

                <label
                  htmlFor="terms"
                  className="flex items-center space-x-3 mb-4"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    className="h-5 w-5 flex-shrink-0"
                    checked={consent}
                    onChange={() => setConsent(!consent)}
                  />
                  <span
                    className={
                      (consentError ? "text-red-600 " : "") + "text-sm"
                    }
                  >
                    I'd like to be notified as soon as Turbotailer launches
                  </span>
                </label>
                {consentError && (
                  <span className="text-sm text-red-600">{consentError}</span>
                )}

                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl mt-3 mb-5"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
