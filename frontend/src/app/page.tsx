"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

import Image from "next/image";

import Input from "./components/Input";
import Button from "./components/Button";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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
      setErrors([]);
    } else {
      const data = await response.json();
      if (data) {
        if ("error" in data) {
          setErrors((prev) => [...prev, data.error]);
        } else {
          for (let field in data) {
            for (let error of data[field]) {
              setErrors((prev) => [...prev, error]);
            }
          }
        }
      } else {
        setErrors((prev) => [...prev, "An unknown error happened"]);
      }
    }

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
  const messageTwo = useAnimation();
  const messageThree = useAnimation();
  const messageFour = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await messageOne.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.5 },
      });
      await messageTwo.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.25, delay: 0.5 },
      });
      await messageThree.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.25, delay: 0.5 },
      });
      await messageFour.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.25, delay: 0.5 },
      });

      // Resetting states back to original
      await messageOne.start({
        opacity: 0,
        x: -100,
        transition: { duration: 0.25, delay: 5.75 },
      });
      await messageTwo.start({
        opacity: 0,
        x: -100,
        transition: { duration: 0.25 },
      });
      await messageThree.start({
        opacity: 0,
        x: -100,
        transition: { duration: 0.25 },
      });
      await messageFour.start({
        opacity: 0,
        x: -100,
        transition: { duration: 0.25 },
      });
      setTimeout(sequence, 500);
    };

    sequence();
  }, [messageFour, messageOne, messageThree, messageTwo]);

  return (
    <div className="container mx-auto mt-20">
      <div className="flex flex-col md:flex-row justify-center items-center md:p-10 p-6 mb-20">
        <div className="md:w-1/2 ">
          <h1 className="text-gray-800 text-4xl md:text-7xl mb-3 md:mb-6">
            <span className="font-bold">Turbocharging</span> WooCommerce
            <br />
            <span className="font-bold">with AI</span>
          </h1>
          <h2 className="text-gray-700 text-xl md:text-3xl mb-6 md:mb-12">
            Let your customers chat with your products, categories, pages and
            orders and Instantly give them the answers they need
          </h2>
          <div className="bg-gray-100 px-4 md:px-8 py-4 md:py-8 rounded-3xl shadow-xl shadow-gray-200 border border-white">
            <h3 className="text-xl md:text-3xl text-blue-800 font-bold mb-3">
              Get Early Access + 3 Months Free Access
            </h3>
            <p className="mb-6 text-gray-800">
              Sign up today, and gain early access when we launch TurboTailer.
              In addition to early access, you will also receive 3 months free
              usage.
            </p>
            <form onSubmit={(e) => handleSubmit(e)} className="">
              <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-4 mb-4">
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
              </div>
              <Button type="submit" fullWidth={true}>Get Early Access</Button>
              {errors.length > 0 &&
                errors.map((error, id) => (
                  <p className="text-red-600" key={id}>
                    {error}
                  </p>
                ))}
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
                    Here is a few great options for hiking shoes:
                  </p>
                  <div className="flex overflow-x-hidden space-x-4 mb-3">
                    <div className="border border-gray-200 p-4 rounded-3xl bg-white w-9/12 md:w-2/3 flex-shrink-0">
                      <p className="text-black font-bold">
                        Salomon Quest 4 Gore-Tex
                      </p>
                      <p>$ 230</p>
                      <img
                        className="h-auto w-full"
                        src="https://u7q2x7c9.stackpathcdn.com/photos/23/79/359440_28754_L.jpg"
                      />
                    </div>
                    <div className="border border-gray-200 p-4 rounded-3xl bg-white w-9/12 md:w-2/3 flex-shrink-0">
                      <p className="text-black font-bold">
                        Merrell Moab 3 Mid Waterproof
                      </p>
                      <p>$ 145</p>
                      <img
                        className="h-auto w-full"
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
                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046-2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
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
                  <p>Thank you! What&apos;s the return policy at this store?</p>
                </div>
              </motion.div>
              <motion.div
                animate={messageFour}
                initial={{ opacity: 0, x: -100 }}
                className="block self-start"
              >
                <div className="border border-gray-300 p-4 md:px-5 md:py-4 rounded-3xl bg-gray-50">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-40 mb-20 w-1/2">
        <h2 className="text-5xl text-center font-bold text-blue-800">Turbotailer saves you money on customer support & increases your conversion rate</h2>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center md:p-10 p-6 mb-20">
          <div className="md:w-1/2">
            <h3 className="text-2xl text-blue-800 font-bold mb-3">
              Save time & money on customer service
            </h3>
            <h2 className="text-5xl font-bold mb-6">
              Give your customers instant answers to any questions
            </h2>
            <p className="text-2xl">
              By utilizing sophisticated AI, TurboTailer can answer
              questions about on-going orders, your store policy, terms and
              conditions or anything in between.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/qa5.png"
              width={600}
              height={600}
              alt=""
              className="mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row-reverse md:flex-row justify-center items-center md:p-10 p-6 mb-20">
          <div className="md:w-1/2">
            <h3 className="text-2xl text-blue-800 font-bold mb-3">
              Increase your conversion rate
            </h3>
            <h2 className="text-5xl font-bold mb-6">
              Intelligent Product Recs
            </h2>
            <p className="text-2xl">
              Make your WooCommerce feel like a physical store-front and give
              your customers instant product recommendations. By utilizing a
              sophisticated  embedding strategy, our AI can quorate
              relevant products instantly based on your customers inquiries.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/recsfinal.png"
              width={600}
              height={600}
              alt=""
              className="mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center md:p-10 p-6 mb-20">
          <div className="md:w-1/2">
            <h3 className="text-2xl text-blue-800 font-bold mb-3">
              Add to cart
            </h3>
            <h2 className="text-5xl font-bold mb-6">
              Convert your chats to sales
            </h2>
            <p className="text-2xl">
              Give your customers the option to add any product recommendation
              to the basket, directly from the chat window. Go directly to
              checkout or continue exactly where they left off.{" "}
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/addtocart3.png"
              width={600}
              height={600}
              alt=""
              className="mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row-reverse md:flex-row justify-center items-center md:p-10 p-6 mb-20">
          <div className="md:w-1/2">
            <h3 className="text-2xl text-blue-800 font-bold mb-3">
              Don&apos;t leave your customers behind
            </h3>
            <h2 className="text-5xl font-bold mb-6">
              Switch to agent
            </h2>
            <p className="text-2xl">
              We all know how frustrating it can be not being able to connect directly to an agent, so we have made it super easy to connect directly to one of your available agents. 
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/switch-agent3.png"
              width={600}
              height={600}
              alt=""
              className="mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center md:p-10 p-6 mb-20">
          <div className="md:w-1/2">
            <h3 className="text-2xl text-blue-800 font-bold mb-3">
              Grow your e-mail list
            </h3>
            <h2 className="text-5xl font-bold mb-6">
              Collect leads
            </h2>
            <p className="text-2xl">
              Grow your e-mail list by collecting leads directly from the chat widget. Collect leads when your customer switches to an agent, or simply just show a custom message prompting the user to sign up for your newsletter.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/leads2.png"
              width={600}
              height={600}
              alt=""
              className="mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row-reverse md:flex-row justify-center items-center md:p-10 p-6 mb-20">
          <div className="md:w-1/2">
            <h3 className="text-2xl text-blue-800 font-bold mb-3">
              Flawless integration
            </h3>
            <h2 className="text-5xl font-bold mb-6">
              Integrates easily with WooCommerce
            </h2>
            <p className="text-2xl">
              We have worked tirelessly to make it a breeze integrating with
              your existing WooCommerce store. Just add your API keys, and
              implement a lightweight script, and you are good to go.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/WooCommerce_logo.png"
              width={300}
              height={300}
              alt=""
              className="mx-auto"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto bg-gray-100 px-4 md:px-8 py-4 md:py-8 rounded-3xl shadow-xl shadow-gray-200 border border-white mb-20 text-center">
        <div className="md:w-1/2 mx-auto">
        <h3 className="text-xl md:text-3xl text-blue-800 font-bold mb-3">
          Get Early Access
        </h3>
        <p className="mb-6 text-gray-800">
          Sign up today, and gain early access when we launch TurboTailer. In
          addition to early access, you will also receive 3 months free usage.
        </p>
        <form onSubmit={(e) => handleSubmit(e)} className="">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 mb-1">
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
            <Button type="submit">Get Early Access</Button>
          </div>
          {errors.length > 0 &&
            errors.map((error, id) => (
              <p className="text-red-600" key={id}>
                {error}
              </p>
            ))}
        </form>
        </div>
      </div>
    </div>
  );
}
