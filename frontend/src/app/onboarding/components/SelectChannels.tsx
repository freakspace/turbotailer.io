import { useState } from "react";

import StepWrapper from "./StepWrapper";

import Button from "@/app/components/Button";

const availableChannels = ["products", "categories", "pages", "orders"];

export default function SelectChannels({
  token,
  storeId,
  channels,
  setChannels,
  setCurrentStep,
}: {
  token: string | null;
  storeId: string | undefined;
  channels: string[];
  setChannels: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [error, setError] = useState("");

  const createChannels = async () => {
    if (channels.length === 0) {
      // Show error
      console.log("Missing Channels");
      return;
    }
    if (!token) {
      // Show some error
      console.log("Missing Token");
      return;
    }

    if (!storeId) {
      // Show some error
      console.log("Missing Store");
      return;
    }

    if (channels.length === 0) {
      setError("You need to select at least 1 channel");
      return;
    } else {
      setError("");
    }

    const response = await fetch(
      `http://127.0.0.1:8000/api/stores/create_channel/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({
          store_id: storeId,
          channels: channels,
        }),
      }
    );

    if (response.ok) {
      setCurrentStep((prev) => prev + 1);
    }
    const data = await response.json();
  };

  const handleClick = (id: string) => {
    setChannels((prev) => {
      const index = prev.indexOf(id);

      if (index > -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      } else {
        return [...prev, id];
      }
    });
  };

  const Card = ({ id }: { id: string }) => {
    return (
      <button
        className={`px-6 py-6 rounded-xl p-8 text-2xl capitalize border border-2 border-solid ${
          channels && channels.includes(id)
            ? "border-pink-600"
            : "border-gray-200"
        }`}
        id={id}
        onClick={(e) => handleClick((e.target as HTMLElement).id)}
      >
        {id}
      </button>
    );
  };

  console.log(storeId);
  return (
    <StepWrapper>
      <h3 className="text-2xl font-bold mb-3">Select Channels</h3>
      <p className="text-lg mb-5">
        These channels will be included and available from the chat. You can
        change these settings in your dashboard.
      </p>
      <div className="grid grid-cols-2 gap-4 mb-10">
        {availableChannels.map((channel, key) => (
          <Card key={key} id={channel} />
        ))}
      </div>
      <div className="">
        <Button onClick={() => createChannels()}>Save & Continue</Button>
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </StepWrapper>
  );
}
