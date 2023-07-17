"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

import Image from "next/image";

import Input from "./components/Input";
import Button from "./components/Button";

import Search from "./components/Search";
export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

  // Animation subscription
  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.25 },
    });
  });

  const messageOne = useAnimation();
  useEffect(() => {
    messageOne.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, delay: 0.75 },
    });
  });

  const messageTwo = useAnimation();
  useEffect(() => {
    messageTwo.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, delay: 1.5 },
    });
  });

  const messageThree = useAnimation();
  useEffect(() => {
    messageThree.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, delay: 2.25 },
    });
  });

  const messageFour = useAnimation();
  useEffect(() => {
    messageFour.start({
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, delay: 3 },
    });
  });

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-center items-center md:h-screen md:p-10 p-6">
        <div className="md:w-1/2 ">
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
              <Button type="submit">Subscribe</Button>
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
          <div className="bg-white flex flex-col flex-grow border border-gray-300 rounded-3xl p-4 md:p-8 shadow-xl shadow-gray-200">
            <div className="flex-grow rounded-3xl mb-6 text-gray-500 flex flex-col gap-4">
              <div className="block self-end">
                <motion.div
                  animate={messageOne}
                  initial={{ opacity: 0, x: 100 }}
                  className="border border-gray-300 p-4 md:px-5 md:py-4 rounded-3xl"
                >
                  <p>Which shoes are great for hiking?</p>
                </motion.div>
              </div>
              <motion.div
                animate={messageTwo}
                initial={{ opacity: 0, x: -100 }}
                className="block self-start"
              >
                <div className="border border-gray-300 p-4 md:px-5 md:py-4 md:p-5 rounded-3xl bg-gray-50">
                  <p className="mb-3">
                    Certainly! We got a few different options in stock:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="border border-gray-200 p-4 rounded-3xl bg-white">
                      <p className="text-black font-bold">
                        Salomon Quest 4 Gore-Tex
                      </p>
                      <p>$ 230</p>
                      <img
                        className="h-auto"
                        src="https://u7q2x7c9.stackpathcdn.com/photos/23/79/359440_28754_L.jpg"
                      />
                    </div>
                    <div className="border border-gray-200 p-4 rounded-3xl bg-white">
                      <p className="text-black font-bold">
                        Merrell Moab 3 Mid Waterproof
                      </p>
                      <p>$ 145</p>
                      <img
                        className="h-auto"
                        src="https://u7q2x7c9.stackpathcdn.com/photos/26/40/385539_11557_XL.webp"
                      />
                    </div>
                  </div>
                  <p className="mb-3">
                    Noticable differences between the two is Salomon having
                    built-in Gore-Tex material for better breathability, however
                    Merrell is completely waterproof and has a lower price point
                    than Salomon.
                  </p>
                  <p className="flex font-bold text-blue-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="mr-2 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                      />
                    </svg>
                    Show more
                  </p>
                </div>
              </motion.div>
              <motion.div
                animate={messageThree}
                initial={{ opacity: 0, x: 100 }}
                className="block self-end"
              >
                <div className="border border-gray-300 p-4 md:px-5 md:py-4 rounded-3xl">
                  <p>Thank you! What's the return policy at this store?</p>
                </div>
              </motion.div>
              <motion.div
                animate={messageFour}
                initial={{ opacity: 0, x: -100 }}
                className="block self-start"
              >
                <div className="border border-gray-300 p-4 md:px-5 md:py-4 rounded-3xl bg-gray-50">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400  rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-600"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            <Search />
          </div>
        </div>
      </div>
    </div>
  );
}
