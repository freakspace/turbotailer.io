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
let steps: IStep[] = [
  {
    is_finished: false,
    number: 1,
    description: "Store",
  },
  {
    is_finished: false,
    number: 2,
    description: "Channels",
  },
  {
    is_finished: false,
    number: 3,
    description: "Integration",
  },
  {
    is_finished: false,
    number: 4,
    description: "Connection",
  },
  {
    is_finished: false,
    number: 5,
    description: "Embedding",
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
  const [selectedChannels, setSelectedChannels] = useState<IChannel[]>([]);
  const [consumerKey, setConsumerKey] = useState<string>("");
  const [consumerSecret, setConsumerSecret] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [hasConnection, setHasConnection] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingSteps, setOnboardingSteps] = useState<IStep[]>(steps);
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
        selectedChannels={selectedChannels}
        setSelectedChannels={setSelectedChannels}
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
        connectionError={connectionError}
        setConnectionError={setConnectionError}
        setIsConnecting={setIsConnecting}
      />
    ),
    4: (
      <VerifyConnection
        token={token}
        storeId={storeId}
        hasConnection={hasConnection}
        setHasConnection={setHasConnection}
        setCurrentStep={setCurrentStep}
        connectionError={connectionError}
        setConnectionError={setConnectionError}
        setIsConnecting={setIsConnecting}
        isConnecting={isConnecting}
      />
    ),
    5: (
      <Embedding
        token={token}
        storeId={storeId}
        selectedChannels={selectedChannels}
      />
    ),
  };

  // Fetch Store and Prepare steps
  useEffect(() => {
    const getUserStores = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/get_user_stores/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
        }
      );

      let data = await response.json();

      if (data.length > 0) {
        let store: IStore = data[0];
        let updatedSteps = [...steps];

        let step = 1;
        // Check has a store
        if (store.store_type) {
          setStoreName(store.name);
          setStoreId(store.id);
          updatedSteps[0].is_finished = true;
          step++;
        }

        // Check has channels
        if (store.channels.length > 0) {
          setSelectedChannels(store.channels.map((channel) => channel) || []);
          updatedSteps[1].is_finished = true;
          step++;
        }

        // Check has connected store
        if (
          store.store_type.consumer_key &&
          store.store_type.consumer_secret &&
          store.store_type.base_url
        ) {
          setBaseUrl(store.store_type.base_url);
          setConsumerKey(store.store_type.consumer_key);
          setConsumerSecret(store.store_type.consumer_secret);
          updatedSteps[2].is_finished = true;
          step++;
        }

        if (hasConnection) {
          updatedSteps[3].is_finished = true;
          step++;
        }

        setCurrentStep(step);
        setOnboardingSteps(updatedSteps);
      }

      setIsLoading(false);
    };

    getUserStores();
  }, [currentStep]);

  // Check if user is logged in
  useEffect(() => {
    if (!token) {
      push("login/");
    }
  }, [push, token]);
  console.log(onboardingSteps);
  return (
    <div className="md:w-1/3 mx-auto mt-10 p-5">
      <div className="">
        <div className="mb-5 flex gap-4">
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
              <Step key={id} step={step} currentStep={currentStep} />
            ))
          )}
        </div>
        <div className="">
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
  );
}
