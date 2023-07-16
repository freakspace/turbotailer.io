"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

import Input from "./components/Input";

import Search from "./components/Search";
export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [serverErrors, setServerErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting");
    setIsLoading(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/users/subscribe/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
        }),
      }
    );

    if (response.ok) {
      setIsSubscribed(true);
    }
    console.log(response);

    const data = await response.json();

    setIsLoading(false);
  };

  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.25 },
    });
  });

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-center items-center md:h-screen p-6">
        <div className="md:w-1/2 ">
          <span className="text-sm inline-block border border-gray-500 px-3 py-2 rounded-full mb-4 text-gray-700">
            Subscribe and receive $20 worth of OpenAI credits
          </span>
          <h1 className="text-gray-800 text-4xl md:text-7xl mb-3 md:mb-6">
            <span className="font-bold">Turbocharging</span> ecommerce with{" "}
            <span className="font-bold">AI</span>
          </h1>
          <h2 className="text-gray-700 text-xl md:text-3xl mb-6 md:mb-12">
            Let your customers chat with your products, categories, pages and
            orders.
            <br />
            <br />
            Instantly give them the answers they need.
          </h2>
          <div className="bg-gray-100 px-4 md:px-8 py-4 md:py-8 rounded-3xl shadow-xl shadow-gray-200 border border-white">
            <h3 className="text-xl md:text-3xl text-blue-800 font-bold mb-3">
              Get 20$ Worth of Credits
            </h3>
            <p className="mb-6 text-gray-800">
              We&apos;ll notify you as soon as we launch, and credit you with
              20$ worth of embeddings and OpenAI queries to your Turbotailer
              account.
            </p>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="relative flex flex-col md:flex-row gap-4"
            >
              {isSubscribed && (
                <motion.div
                  animate={controls}
                  initial={{ opacity: 0, x: -100 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-600 rounded-3xl text-xl text-white font-bold"
                >
                  Thanks!
                </motion.div>
              )}
              <Input
                placeholder="Name"
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email"
                required
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-800 text-white rounded-full text-lg font-bold border border-2 border-gray-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="px-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-blue-800 hidden md:block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="mt-4 mb-3 w-6 h-6 text-blue-800 md:hidden "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
            />
          </svg>
        </div>
        <div className="md:w-1/2 flex flex-col">
          <h3 className="font-bold text-2xl text-center mb-6">Try it</h3>
          <div className="bg-white flex flex-col flex-grow border border-gray-300 rounded-3xl p-4 md:p-8 shadow-xl shadow-gray-200">
            <div className="h-48 md:h-96 flex-grow border border-gray-300 rounded-3xl mb-6 py-3 px-4 text-gray-500"></div>
            <Search />
            <p className="mt-4 text-gray-600 text-center italic">
              Try for example &apos;Which shoes are great for hiking?&apos;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
