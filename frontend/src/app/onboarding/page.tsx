"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { UserContext, IContext } from "@/context/UserContext";
import { motion, useAnimation } from "framer-motion";
import { IStore, IWooCommerceType, IStep, IChannel } from "../../../typings";
import SelectStore from "./components/SelectStore";
import SelectChannels from "./components/SelectChannels";
import IntegrateWooCommerce from "./components/IntegrateWooCommerce";
import VerifyConnection from "./components/VerifyConnection";
import Embedding from "./components/Embedding";
import Step from "./components/Step";
import { verifyConnection } from "./services";
let steps: IStep[] = [
  {
    is_finished: false,
    number: 1,
    description: "Select Store Type",
  },
  {
    is_finished: false,
    number: 2,
    description: "Select Channels",
  },
  {
    is_finished: false,
    number: 3,
    description: "Integrate your store",
  },
  {
    is_finished: false,
    number: 4,
    description: "Verify Connection",
  },
  {
    is_finished: false,
    number: 5,
    description: "Start Embedding",
  },
];

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

// TODO Prefill all state in case people refresh etc.
// TODO Add loading wheels

export default function Onboarding() {
  const [storeId, setStoreId] = useState<string>("");
  const [storeType, setStoreType] = useState<string>("WooCommerce");
  const [storeName, setStoreName] = useState<string>("");
  const [channels, setChannels] = useState<string[]>([]);
  const [consumerKey, setConsumerKey] = useState<string>("");
  const [consumerSecret, setConsumerSecret] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [hasConnection, setHasConnection] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingSteps, setOnboardingSteps] = useState<IStep[]>();
  const [isLoading, setIsLoading] = useState(true);
  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();

  const StepMapping: { [key: number]: React.ReactElement } = {
    1: (
      <SelectStore
        token={token}
        storeType={storeType}
        setStoreType={setStoreType}
        storeName={storeName}
        setStoreName={setStoreName}
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        storeId={storeId}
        setStoreId={setStoreId}
        setCurrentStep={setCurrentStep}
      />
    ),
    2: (
      <SelectChannels
        token={token}
        storeId={storeId}
        channels={channels}
        setChannels={setChannels}
        setCurrentStep={setCurrentStep}
      />
    ),
    3: (
      <IntegrateWooCommerce
        token={token}
        storeId={storeId}
        consumerKey={consumerKey}
        setConsumerKey={setConsumerKey}
        consumerSecret={consumerSecret}
        setConsumerSecret={setConsumerSecret}
        setCurrentStep={setCurrentStep}
      />
    ),
    4: (
      <VerifyConnection
        token={token}
        storeId={storeId}
        hasConnection={hasConnection}
        setHasConnection={setHasConnection}
        setCurrentStep={setCurrentStep}
      />
    ),
    5: <Embedding token={token} storeId={storeId} />,
  };

  // Fetch Store and Prepare steps
  useEffect(() => {
    const getUserStores = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/stores/get_user_stores/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
        }
      );

      let data = await response.json();

      let store: IStore = data[0];

      setStoreId(store.id);
      setStoreName(store.name);
      setBaseUrl(store.store_type.base_url);
      setConsumerKey(store.store_type.consumer_key);
      setConsumerSecret(store.store_type.consumer_secret);
      setChannels(store.channels.map((channel) => channel.channel) || []);

      let step = 1;
      // Check has a store
      if (store.store_type) {
        steps[0].is_finished = true;
        step++;
      }

      // Check has channels
      if (store.channels.length > 0) {
        steps[1].is_finished = true;
        step++;
      }

      // Check has connected store
      if (
        store.store_type.consumer_key &&
        store.store_type.consumer_secret &&
        store.store_type.base_url
      ) {
        steps[2].is_finished = true;
        step++;
      }

      if (hasConnection) {
        steps[3].is_finished = true;
        step++;
      } else {
        // Ping connection in case of page refresh by user
        if (token && store.id) {
          const response = await verifyConnection(token, store.id);
          if (response.ok) {
            steps[3].is_finished = true;
            step++;
          }
        }
      }

      setCurrentStep(step);
      setOnboardingSteps(steps);
      setIsLoading(false);
    };

    getUserStores();
  }, []);

  // Check if user is logged in
  useEffect(() => {
    if (!token) {
      push("login/");
    }
  }, [token]);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl text-pink-600 font-bold mb-6">Turbotailer</h1>
      <div className="">
        <div className="grid grid-cols-2 border border-solid border-gray-200 rounded-xl p-8 bg-white mb-10">
          <div className="">
            <h1 className="text-4xl font-bold mb-3">Turbocharge Your Store</h1>
            <p className="text-2xl">
              Setting up Turbotailer is easy, and takes only 2 minutes. <br />
              There are only 5 steps, and we'll guide you through all of them.
            </p>
          </div>
          <div className=""></div>
        </div>
        <div className="grid grid-cols-3 gap-8 items-start">
          <div className="grid grid-rows-1 gap-4 border border-solid border-gray-200 rounded-xl p-8 bg-white">
            <h2 className="text-xl font-bold mb-4">
              Follow These 5 Easy Steps
            </h2>
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 border-t-2 border-pink-600 rounded-full"
                  animate={spinner.animate}
                  transition={spinner.transition}
                />
              </div>
            ) : (
              onboardingSteps &&
              onboardingSteps.map((step, id) => (
                <Step
                  key={id}
                  step={step}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  isLoading={isLoading}
                />
              ))
            )}
          </div>
          <div className="col-span-2">
            {isLoading ? (
              <div className="h-full border border-solid border-gray-200 rounded-xl bg-white flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 border-t-2 border-pink-600 rounded-full"
                  animate={spinner.animate}
                  transition={spinner.transition}
                />
              </div>
            ) : (
              StepMapping[currentStep]
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
