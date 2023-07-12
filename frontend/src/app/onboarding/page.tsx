"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { UserContext, IContext } from "@/context/UserContext";
import { IStore, IWooCommerceType, IStep, IChannel } from "../../../typings";
import SelectStore from "./components/SelectStore";
import SelectChannels from "./components/SelectChannels";
import IntegrateWooCommerce from "./components/IntegrateWooCommerce";
import Step from "./components/Step";
let steps: IStep[] = [
  {
    is_finished: false,
    number: 1,
    description: "Select Store Type",
    field: "store_type",
  },
  {
    is_finished: false,
    number: 2,
    description: "Select Channels",
    field: "channels",
  },
  {
    is_finished: false,
    number: 3,
    description: "Integrate your store",
    field: "store_type",
  },
  {
    is_finished: false,
    number: 4,
    description: "Verify Connection",
    field: "store_type",
  },
  {
    is_finished: false,
    number: 5,
    description: "Launch",
    field: "store_type",
  },
];

// TODO Prefill all state in case people refresh etc.
// TODO Add loading wheels

export default function Onboarding() {
  const [userStore, setUserStore] = useState<IStore>();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingSteps, setOnboardingSteps] = useState<IStep[]>();
  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();

  const StepMapping: { [key: number]: React.ReactElement } = {
    0: <p>Something</p>,
    1: <SelectStore token={token} />,
    2: <SelectChannels token={token} storeId={userStore?.id} />,
    3: <IntegrateWooCommerce token={token} storeId={userStore?.id} />,
    4: <p>Something</p>,
    5: <p>Something</p>,
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
      <div className="">
        <div className="border border-solid border-gray-200 rounded-xl p-8 bg-white mb-10">
          <h1 className="text-4xl text-pink-600 font-bold mb-3">
            Welcome To TurboTailer!
          </h1>
          <p className="text-2xl">
            Setting up your TurboTailer is easy, and takes only 2 minutes.{" "}
            <br />
            There are only 5 steps, and we'll guide you through all of them.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="grid grid-rows-1 gap-4 border border-solid border-gray-200 rounded-xl p-8 bg-white">
            <h2 className="text-xl font-bold mb-4">
              Turbocharge your store in 5 easy steps
            </h2>
            {onboardingSteps &&
              onboardingSteps.map((step, id) => (
                <Step
                  key={id}
                  step={step}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                />
              ))}
          </div>
          <div className="col-span-2">{StepMapping[currentStep]}</div>
        </div>
      </div>
    </div>
  );
}
