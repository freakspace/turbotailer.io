"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { UserContext, IContext } from "@/context/UserContext";
import Search from "@/app/components/Search";
import Message from "./message";
import { IMessage } from "../../../../typings";

export default function Chat({
  storeId,
  setNotification,
}: {
  storeId: string | undefined;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* useEffect(() => {
    const getMessages = () => {
      const messages = ["Message 1", "Message 2"];
      setMessages(messages);
    };

    getMessages();
  }, []); */
  console.log(messageHistory);
  return (
    <div className="bg-white flex flex-col flex-grow border border-gray-300 rounded-3xl p-4 md:p-8 shadow-xl shadow-gray-200 overflow-y-auto max-h-1/2">
      <div className="flex-grow rounded-3xl mb-6 text-gray-500 flex flex-col gap-4">
        {messageHistory.map((message, key) => (
          <Message message={message} key={key} />
        ))}
        {isLoading && <p>Loading..</p>}
      </div>
      <Search
        storeId={storeId}
        setMessageHistory={setMessageHistory}
        setNotification={setNotification}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
