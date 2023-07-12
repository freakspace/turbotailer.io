import { useState } from "react";

const storeTypes = ["WooCommerce", "Magento", "Prestashop", "Shopify"];

export default function IntegrateWooCommerce({
  token,
  storeId,
}: {
  token: string | null;
  storeId: string | undefined;
}) {
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");

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

    const response = await fetch(
      `http://127.0.0.1:8000/api/stores/update_woocommerce/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
          store_id: storeId,
        }),
      }
    );

    const data = await response.json();

    console.log(data);
  };

  return (
    <div className="grid grid-cols-2 gap-8 border border-solid border-gray-200 rounded-xl p-8 bg-white">
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
            value={consumerKey}
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
            "flex flex-col mb-4"
          }
        >
          <label className="">Consumer Secret</label>
          <input
            type="password"
            value={consumerSecret}
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
        <div className="">
          <button
            onClick={() => updateStore()}
            className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl"
          >
            Continue
          </button>
        </div>
      </div>
      <div className="">
        <p className="text-lg">This is a guide...</p>
      </div>
    </div>
  );
}
