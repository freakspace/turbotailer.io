import { useState, useEffect } from "react";

import { motion, useAnimation } from "framer-motion";

import Button from "@/app/components/Button";

const storeTypes = ["WooCommerce", "Magento", "Prestashop", "Shopify"];

import { createWooCommerce, updateWooCommerce } from "../services";

import StepWrapper from "./StepWrapper";

interface SelectStoreStep {
  token: string | null;
  storeType: string;
  setStoreType: React.Dispatch<React.SetStateAction<string>>;
  storeName: string | undefined;
  setStoreName: React.Dispatch<React.SetStateAction<string>>;
  baseUrl: string | undefined;
  setBaseUrl: React.Dispatch<React.SetStateAction<string>>;
  storeId: string | undefined;
  setStoreId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

function SelectStore({
  token,
  storeType,
  setStoreType,
  storeName,
  setStoreName,
  baseUrl,
  setBaseUrl,
  storeId,
  setStoreId,
  setCurrentStep,
}: SelectStoreStep) {
  const [storeNameError, setStoreNameError] = useState("");
  const [baseUrlError, setBaseUrlError] = useState("");
  const [storeTypeError, setStoreTypeError] = useState("");

  const createStore = async () => {
    if (!token) {
      // Show some error
      return;
    }

    if (!storeName) {
      setStoreNameError("You need to add a store name");
      return;
    } else {
      setStoreNameError("");
    }

    if (!baseUrl) {
      setBaseUrlError("You need to add a store url");
      return;
    } else {
      setBaseUrlError("");
    }

    if (!storeType) {
      setStoreTypeError("You need to select a store type");
      return;
    } else {
      setStoreTypeError("");
    }

    // TODO Only call endpoint if data changed?
    if (storeType === "WooCommerce") {
      if (storeId) {
        console.log("TEST A");
        const response = await updateWooCommerce(
          token,
          storeId,
          storeName,
          baseUrl
        );

        if (response.ok) {
          setCurrentStep((prev) => prev + 1);
        }
      } else {
        console.log("TEST B");
        console.log(storeName);
        console.log(baseUrl);
        const response = await createWooCommerce(token, storeName, baseUrl);
        if (response.ok) {
          setCurrentStep((prev) => prev + 1);
        } else {
          // NEED ERROR HERE
        }
      }
    }
  };

  const Card = ({ id }: { id: string }) => {
    return (
      <button
        className={`px-6 py-6 rounded-xl p-8 text-2xl ${
          id === storeType
            ? "border border-solid border-pink-600"
            : "border border-solid border-gray-200"
        }`}
        id={id}
        onClick={(e) => setStoreType((e.target as HTMLElement).id)}
      >
        {id}
      </button>
    );
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
    <StepWrapper>
      <h3 className="text-2xl font-bold mb-5">Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div
          className={
            (storeNameError ? "border-solid border-red-600 " : "") +
            "flex flex-col mb-4"
          }
        >
          <label className="text-lg">Your store name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className={
              (storeNameError
                ? "border-solid border border-red-600 "
                : "border-solid border border-gray-300 ") +
              "px-3 py-2 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
            }
          />
          {storeNameError && (
            <span className="text-sm text-red-600">{storeNameError}</span>
          )}
        </div>
        <div
          className={
            (baseUrlError ? "border-solid border-red-600 " : "") +
            "flex flex-col mb-4"
          }
        >
          <label className="text-lg">Your store URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            required
            className={
              (baseUrlError
                ? "border-solid border border-red-600 "
                : "border-solid border border-gray-300 ") +
              "px-3 py-2 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
            }
          />
          <span className="text-sm">For example mydomain.com</span>
          {baseUrlError && (
            <span className="text-sm text-red-600">{baseUrlError}</span>
          )}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-5">Your store CMS</h3>
      <div className="grid grid-cols-2 gap-4 mb-10">
        {storeTypes.map((store, key) => (
          <Card key={key} id={store} />
        ))}
      </div>
      <div className="">
        <Button onClick={() => createStore()}>Save & Continue</Button>
      </div>
      {storeTypeError && (
        <span className="text-sm text-red-600">{storeTypeError}</span>
      )}
    </StepWrapper>
  );
}

export default SelectStore;
