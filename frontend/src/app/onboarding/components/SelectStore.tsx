import { useState } from "react";

const storeTypes = ["WooCommerce", "Magento", "Prestashop", "Shopify"];

export default function SelectStore({ token }: { token: string | null }) {
  const [selected, setSelected] = useState("");
  const [storeName, setStoreName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

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

    if (!selected) {
      setStoreTypeError("You need to select a store type");
      return;
    } else {
      setStoreTypeError("");
    }

    if (selected === "WooCommerce") {
      console.log("Calling endpoint");
      const response = await fetch(
        `http://127.0.0.1:8000/api/stores/create_woocommerce/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
          body: JSON.stringify({
            store_name: storeName,
            base_url: baseUrl,
          }),
        }
      );

      const data = await response.json();

      console.log(data);
    }
  };

  const Card = ({ id }: { id: string }) => {
    return (
      <button
        className={`px-6 py-6 rounded-xl p-8 text-2xl ${
          id === selected
            ? "border border-solid border-pink-600"
            : "border border-solid border-gray-200"
        }`}
        id={id}
        onClick={(e) => setSelected((e.target as HTMLElement).id)}
      >
        {id}
      </button>
    );
  };

  return (
    <div className="border border-solid border-gray-200 rounded-xl p-8 bg-white">
      <h3 className="text-xl font-bold mb-5">Basic information</h3>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div
          className={
            (storeNameError ? "border-solid border-red-600 " : "") +
            "flex flex-col mb-4"
          }
        >
          <label className="">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className={
              (storeNameError
                ? "border-solid border border-red-600 "
                : "border-solid border border-gray-300 ") +
              "h-10 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
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
          <label className="">Store URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            required
            className={
              (baseUrlError
                ? "border-solid border border-red-600 "
                : "border-solid border border-gray-300 ") +
              "h-10 rounded-md focus:border-2 focus:border-pink-600 focus:outline-none"
            }
          />
          {baseUrlError && (
            <span className="text-sm text-red-600">{baseUrlError}</span>
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-5">Select your store type</h3>
      <div className="grid grid-cols-2 gap-4 mb-10">
        {storeTypes.map((store, key) => (
          <Card key={key} id={store} />
        ))}
      </div>
      <div className="">
        <button
          onClick={() => createStore()}
          className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl"
        >
          Continue
        </button>
      </div>
      {storeTypeError && (
        <span className="text-sm text-red-600">{storeTypeError}</span>
      )}
    </div>
  );
}
