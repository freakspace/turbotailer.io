import { useState } from "react";

const storeTypes = ["WooCommerce", "Magento", "Prestashop", "Shopify"];

import { updateWooCommerce } from "../services";

import StepWrapper from "./StepWrapper";

export default function IntegrateWooCommerce({
  token,
  storeId,
  consumerKey,
  setConsumerKey,
  consumerSecret,
  setConsumerSecret,
  setCurrentStep,
}: {
  token: string | null;
  storeId: string | undefined;
  consumerKey: string;
  setConsumerKey: React.Dispatch<React.SetStateAction<string>>;
  consumerSecret: string;
  setConsumerSecret: React.Dispatch<React.SetStateAction<string>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
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
        <h3 className="text-xl font-bold mb-5">
          Create and add your WooCommerce API keys
        </h3>
        <p className="text-lg mb-3">
          We'll need read access to your API, which we will parse with our robot
          and prepare your Turbotailer
        </p>
        <div
          className={
            (consumerKeyError ? "border-solid border-red-600 " : "") +
            "flex flex-col mb-4"
          }
        >
          <label className="">Consumer Key</label>
          <input
            type="password"
            value={consumerKey.substring(0, 10)}
            onChange={(e) => setConsumerKey(e.target.value)}
            required
            className={
              (consumerKeyError
                ? "border-solid border border-red-600 "
                : "border-solid border border-gray-300 ") +
              "h-10 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
            }
          />
          {consumerKeyError && (
            <span className="text-sm text-red-600">{consumerKeyError}</span>
          )}
        </div>
        <div
          className={
            (consumerSecretError ? "border-solid border-red-600 " : "") +
            "flex flex-col mb-8"
          }
        >
          <label className="">Consumer Secret</label>
          <input
            type="password"
            value={consumerSecret.substring(0, 10)}
            onChange={(e) => setConsumerSecret(e.target.value)}
            required
            className={
              (consumerSecretError
                ? "border-solid border border-red-600 "
                : "border-solid border border-gray-300 ") +
              "h-10 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
            }
          />
          {consumerSecretError && (
            <span className="text-sm text-red-600">{consumerSecretError}</span>
          )}
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-5">
            Add this script just before your closing &lt;/head&gt; tag
          </h3>
          <pre className="bg-gray-600 p-8 text-white rounded-xl border border-solid border-black mb-5">
            <code>
              {
                "<script src='https://turbotailer.io/static/js/turbotailer.js'></script>"
              }
            </code>
          </pre>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-5">
            Add this script just before your closing &lt;/body&gt; tag
          </h3>
          <pre className="bg-gray-600 p-8 text-white rounded-xl border border-solid border-black mb-5">
            <code>
              {`<script>\n    window.addEventListener('DOMContentLoaded', () => {\n        initializeChatbot('${storeId}');\n    });\n</script>`}
            </code>
          </pre>
        </div>

        <div className="">
          <button
            onClick={() => updateStore()}
            className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
