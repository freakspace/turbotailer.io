"use client";

import { useState, useRef, useEffect } from "react";

export default function Search({ storeId }: { storeId: string | undefined }) {
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState("");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namespace: storeId,
          query: message,
        }),
      }
    );

    return response;
  };

  const submitChat = async () => {
    const response = await prompt();
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      // Some error
    }
    setMessage("");
  };

  useEffect(() => {
    // Attach the listeners on component mount.
    document.addEventListener("mousedown", handleClickOutside);
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
