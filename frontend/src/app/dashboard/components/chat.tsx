"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { UserContext, IContext } from "@/context/UserContext";
import Search from "@/app/components/Search";
import Message from "./message";

export default function Chat({ storeId }: { storeId: string | undefined }) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const getMessages = () => {
      const messages = ["Message 1", "Message 2"];
      setMessages(messages);
    };

    getMessages();
  }, []);

  return (
    <div className="bg-white flex flex-col flex-grow border border-gray-300 rounded-3xl p-4 md:p-8 shadow-xl shadow-gray-200">
      <div className="flex-grow rounded-3xl mb-6 text-gray-500 flex flex-col gap-4">
        {messages.map((message, key) => (
          <Message text={message} key={key} />
        ))}
      </div>
      <Search storeId={storeId} />
    </div>
  );
}
