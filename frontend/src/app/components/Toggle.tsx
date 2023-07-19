import React from "react";

import { IChannel } from "../../../typings";

function Toggle({
  name,
  selectedChannels,
  setSelectedChannels,
}: {
  name: string;
  selectedChannels: IChannel[] | undefined;
  setSelectedChannels: React.Dispatch<React.SetStateAction<IChannel[]>>;
}) {
  const isOn = () => {
    // Check this one, not sure if good
    if (!selectedChannels) return;
    return selectedChannels.some((channel) => channel.channel === name);
  };

  const handleChannelToggle = (name: string) => {
    setSelectedChannels((prev) => {
      const index = prev.findIndex((channel) => channel.channel === name);

      if (index > -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      } else {
        const newChannel: IChannel = {
          channel: name,
          fields: [],
          id: undefined,
          store: undefined,
        };
        return [...prev, newChannel];
      }
    });
  };

  return (
    <div className="flex items-center justify-center">
      <label
        htmlFor={`toggle-${name}`}
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input
            type="checkbox"
            id={`toggle-${name}`}
            className="sr-only"
            checked={isOn()}
            onChange={() => handleChannelToggle(name)}
          />
          <div
            className={`block w-14 h-8 rounded-full ${
              isOn() ? "bg-blue-800 shadow-glow" : "bg-gray-400"
            }`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
              isOn() ? "transform translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
}

export default Toggle;
