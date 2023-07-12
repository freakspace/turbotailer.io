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
  const [userStore, setUserStore] = useState<IStore>();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingSteps, setOnboardingSteps] = useState<IStep[]>();
  const [isLoading, setIsLoading] = useState(true);
  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();

  const StepMapping: { [key: number]: React.ReactElement } = {
    1: (
      <SelectStore
        token={token}
        selectedProp="WooCommerce"
        storeNameProp={userStore?.name}
        baseUrlProp={userStore?.store_type.base_url}
        storeIdProp={userStore?.id}
        setCurrentStep={setCurrentStep}
      />
    ),
    2: (
      <SelectChannels
        token={token}
        storeId={userStore?.id}
        channels={userStore?.channels.map((channel) => channel.channel) || []}
      />
    ),
    3: <IntegrateWooCommerce token={token} storeId={userStore?.id} />,
    4: <VerifyConnection token={token} storeId={userStore?.id} />,
    5: <Embedding token={token} storeId={userStore?.id} />,
  };

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

    const data = await response.json();

    setUserStore(data[0]);
  };

  // Prepare steps
  useEffect(() => {
    // Check has a store
    if (userStore && "store_type" in userStore) {
      steps[0].is_finished = true;
      setCurrentStep((prev) => prev + 1);
    }

    // Check has channels
    if (userStore && userStore.channels.length > 0) {
      steps[1].is_finished = true;
      setCurrentStep((prev) => prev + 1);
    }

    // Check has connected store
    if (
      userStore &&
      userStore.store_type.consumer_key &&
      userStore.store_type.consumer_secret &&
      userStore.store_type.base_url
    ) {
      steps[2].is_finished = true;
      setCurrentStep((prev) => prev + 1);
    }

    setOnboardingSteps(steps);

    setIsLoading(false);
  }, [userStore]);

  // Fetch the store
  useEffect(() => {
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
          <div className="h-48">VIDEO</div>
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
