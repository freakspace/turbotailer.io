import { useEffect, useState } from "react";

import StepWrapper from "./StepWrapper";

import Button from "@/app/components/Button";
import Toggle from "@/app/components/Toggle";

import { getAvailableChannelsAndFields } from "../services";

import { IChannel } from "../../../../typings";

export default function SelectChannels({
  token,
  storeId,
  selectedChannels,
  setSelectedChannels,
  setCurrentStep,
}: {
  token: string | null;
  storeId: string;
  selectedChannels: IChannel[];
  setSelectedChannels: React.Dispatch<React.SetStateAction<IChannel[]>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [error, setError] = useState("");
  const [availableChannels, setAvailableChannels] = useState<IChannel[]>();

  const createChannels = async () => {
    if (selectedChannels.length === 0) {
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/create_channel/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({
          store_id: storeId,
          channels: selectedChannels, // TODO Needs to be refactored in Django
        }),
      }
    );

    if (response.ok) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Error
    }
    const data = await response.json();
  };

  // This function will handle the field toggle for a specific channel
  const handleFieldToggle = (
    channelName: string,
    fieldName: string,
    checked: boolean
  ) => {
    setSelectedChannels((prev) => {
      return prev.map((channel) => {
        if (channel.channel === channelName) {
          if (checked) {
            // If the checkbox is checked, add the field to the channel
            return { ...channel, fields: [...channel.fields, fieldName] };
          } else {
            // If the checkbox is unchecked, remove the field from the channel
            return {
              ...channel,
              fields: channel.fields.filter((field) => field !== fieldName),
            };
          }
        } else {
          return channel;
        }
      });
    });
  };

  useEffect(() => {
    const prepareChannels = async () => {
      if (!token) return;

      const response = await getAvailableChannelsAndFields(token, storeId);

      if (response.ok) {
        const data = await response.json();
        setAvailableChannels(data);
      } else {
        // Show some error boi
      }
    };

    prepareChannels();
  }, [storeId, token]);

  const Channel = ({ availableChannel }: { availableChannel: IChannel }) => {
    return (
      <div className="border-y py-4 px-4 bg-gray-50">
        <div className="flex">
          <div className="grow">
            <h2
              className="text-2xl capitalize mb-2"
              id={availableChannel.channel}
            >
              {availableChannel.channel}
            </h2>
          </div>
          <Toggle
            name={availableChannel.channel}
            selectedChannels={selectedChannels}
            setSelectedChannels={setSelectedChannels}
          />
        </div>
        {selectedChannels.some(
          (selectedChannel) =>
            selectedChannel.channel === availableChannel.channel
        ) && (
          <div className="grid grid-cols-4 gap-2">
            {availableChannel.fields.map((field, key) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={field}
                  className="form-checkbox h-5 w-5 text-blue-600 cursor-pointer"
                  checked={selectedChannels
                    .find(
                      (channel) => channel.channel === availableChannel.channel
                    )
                    ?.fields.includes(field)}
                  onChange={(e) =>
                    handleFieldToggle(
                      availableChannel.channel,
                      field,
                      e.target.checked
                    )
                  }
                />
                <span className="ml-2 text-gray-700">{field}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <StepWrapper>
      <h3 className="text-2xl font-bold mb-3">Select Channels</h3>
      <p className="text-lg mb-5">
        These channels will be included and available from the chat. You can
        change these settings in your dashboard.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-10">
        {availableChannels &&
          availableChannels.map((channel, key) => (
            <Channel key={key} availableChannel={channel} />
          ))}
      </div>
      <div className="">
        <Button onClick={() => createChannels()}>Save & Continue</Button>
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </StepWrapper>
  );
}
