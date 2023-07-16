import { useState } from "react";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

import Link from "next/link";

import { updateWooCommerce } from "../services";

import StepWrapper from "./StepWrapper";

export default function IntegrateWooCommerce({
  token,
  storeId,
  consumerKey,
  consumerSecret,
  connectionError,
  setConsumerKey,
  setConsumerSecret,
  setCurrentStep,
  setIsConnecting,
  setConnectionError,
}: {
  token: string | null;
  storeId: string | undefined;
  consumerKey: string;
  consumerSecret: string;
  connectionError: string;
  setConsumerKey: React.Dispatch<React.SetStateAction<string>>;
  setConsumerSecret: React.Dispatch<React.SetStateAction<string>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  setConnectionError: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [consumerKeyError, setConsumerKeyError] = useState("");
  const [consumerSecretError, setConsumerSecretError] = useState("");

  const updateStore = async () => {
    if (!token) {
      // Show some error
      return;
    }

    if (!storeId) {
      // Show some error
      return;
    }

    if (!consumerKey) {
      setConsumerKeyError("You need to add a consumer key");
      return;
    } else {
      setConsumerKeyError("");
    }

    if (!consumerSecret) {
      setConsumerSecretError("You need to add a consumer secret");
      return;
    } else {
      setConsumerSecretError("");
    }

    const response = await updateWooCommerce(
      token,
      storeId,
      undefined,
      undefined,
      consumerKey,
      consumerSecret
    );

    if (response.ok) {
      setCurrentStep((prev) => prev + 1);
    }
    const data = await response.json();
  };

  return (
    <StepWrapper>
      <div className="">
        <div className="mb-12">
          {connectionError && (
            <div className="text-red-600 border border-2 border-solid border-red-700 rounded-xl py-2 px-4 mb-5">
              {connectionError}
            </div>
          )}
          <h3 className="text-2xl font-bold mb-5">
            Add your WooCommerce API keys
          </h3>
          <p className="text-lg mb-3">
            We&apos;ll need read access to your API, which we will parse with
            our robot and prepare your Turbotailer
          </p>
          <Input
            error={consumerKeyError}
            placeholder="Consumer Key"
            type="password"
            value={consumerKey}
            onChange={(e) => setConsumerKey(e.target.value)}
            required
          />
          <Input
            error={consumerSecretError}
            placeholder="Consumer Secret"
            type="password"
            value={consumerSecret}
            onChange={(e) => setConsumerSecret(e.target.value)}
            required
          />
          <span className="text-sm mt-2">
            Unsure where to find your API keys?{" "}
            <Link href="#" className="text-blue-800 font-bold">
              Follow this guide
            </Link>
          </span>
        </div>
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-5">
            Add two scripts to your website
          </h3>
          <p className="text-lg mb-3">
            1. Add this script just before your closing{" "}
            <strong>&lt;/head&gt;</strong> tag
          </p>
          <pre className="bg-gray-500 p-8 text-white rounded-xl border border-solid border-black mb-5 overflow-x-auto">
            <code>
              {
                "<script src=&apos;https://turbotailer.io/static/js/turbotailer.js&apos;></script>"
              }
            </code>
          </pre>
        </div>
        <div className="mb-12">
          <p className="text-lg mb-3">
            2. Add this script just before your closing{" "}
            <strong>&lt;/body&gt;</strong> tag
          </p>
          <pre className="bg-gray-500 p-8 text-white rounded-xl border border-solid border-black mb-5 overflow-x-auto">
            <code>
              {`<script>\n    window.addEventListener(&apos;DOMContentLoaded&apos;, () => {\n        initializeChatbot(&apos;${storeId}&apos;);\n    });\n</script>`}
            </code>
          </pre>
        </div>

        <div className="">
          <Button onClick={() => updateStore()}>Save & Continue</Button>
        </div>
      </div>
    </StepWrapper>
  );
}
