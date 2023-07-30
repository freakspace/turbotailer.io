"use client";

import { useState, useRef, useEffect } from "react";
import { IMessage } from "../../../typings";

let defaultUserMessage: IMessage = {
  type: "human",
  data: {
    content: "",
    additional_kwargs: {},
    example: false,
  },
};

let defaultAIMessage: IMessage = {
  type: "ai",
  data: {
    content: "",
    additional_kwargs: {},
    example: false,
  },
};

export default function Search({
  storeId,
  setMessageHistory,
  setNotification,
  setIsLoading,
}: {
  storeId: string | undefined;
  setMessageHistory: React.Dispatch<
    React.SetStateAction<IMessage[] | undefined>
  >;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isActive, setIsActive] = useState(false);
  const [userMessage, setUserMessage] = useState<IMessage>(defaultUserMessage);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Element)
    ) {
      setIsActive(false);
    }
  };

  const prompt = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/prompts/prompt/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namespace: storeId,
          query: userMessage?.data.content,
        }),
      }
    );

    return response;
  };

  const submitChat = async () => {
    setIsLoading(true);
    if (!userMessage) {
      setNotification("You need to add a message");
      return;
    }

    // Add user message to history
    setMessageHistory((prev) => [...(prev || []), userMessage]);

    const response = await prompt();
    if (response.ok) {
      let data: IMessage = await response.json();
      console.log("Kig under");
      console.log(data);
      let message = defaultAIMessage;
      message.data.content = data;
      // Add AI message to history
      setMessageHistory((prev) => [...(prev || []), message]);

      // Reset users query
      setUserMessage(defaultUserMessage);
    } else {
      setNotification("error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Attach the listeners on component mount.
    document.addEventListener("mousedown", handleClickOutside);
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let userMessage: IMessage = {
      type: "human",
      data: {
        content: e.target.value,
        additional_kwargs: {},
        example: false,
      },
    };
    setUserMessage(userMessage);
  };
  console.log(userMessage);
  return (
    <div
      className={
        "flex items-center border border-gray-300 rounded-full py-2 px-4 " +
        (isActive ? "shadow-xl" : "")
      }
    >
      <input
        ref={inputRef}
        placeholder="Chat with 1,765 products"
        className="w-full focus:outline-none h-8 text-gray-500"
        onFocus={() => setIsActive(true)}
        value={userMessage?.data.content}
        onChange={(e) => handleUserMessage(e)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-blue-800"
        onClick={() => submitChat()}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    </div>
  );
}
