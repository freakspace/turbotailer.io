"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { UserContext, IContext } from "@/context/UserContext";
import { ICard } from "../../../typings";
import Card from "../components/Card";

const settings: ICard[] = [
  {
    title: "Site",
    subtitle: "https://www.somestore.com",
  },
  {
    title: "Language model",
    subtitle: "gpt-3.5-turbo",
  },
  {
    title: "Embedding model",
    subtitle: "text-embedding-ada-002",
  },
  {
    title: "Last update",
    subtitle: "4 hours ago",
  },
];

const channels: ICard[] = [
  {
    title: "Products",
    subtitle: "Enabled",
  },
  {
    title: "Categories",
    subtitle: "Disabled",
  },
  {
    title: "Pages",
    subtitle: "Disabled",
  },
  {
    title: "Orders",
    subtitle: "Disabled",
  },
];

export default function Dashboard() {
  const { token, setToken } = useContext(UserContext) as IContext;
  const [userName, setUserName] = useState<string>("");
  const { push } = useRouter();

  useEffect(() => {
    if (!token) {
      push("login/");
    }
  }, [push, token]);

  return (
    <div className="container mx-auto mt-10">
      <div className="">
        <h1 className="text-5xl text-pink-600 font-bold mb-10">Welcome</h1>
        <div className="grid grid-cols-1 gap-8">
          <div className="">
            <h2 className="text-4xl font-bold mb-3">Information</h2>
            <div className="grid grid-cols-2 gap-8 bg-gray-50 border border-solid border-gray-50 p-8 rounded-2xl shadow-lg">
              {settings.map((card, key) => (
                <Card key={key} card={card} />
              ))}
            </div>
          </div>
          <div className="">
            <h2 className="text-4xl font-bold mb-3">Channels</h2>
            <div className="grid grid-rows-1 gap-8 bg-gray-50 border border-solid border-gray-50 p-8 rounded-2xl shadow-lg">
              {channels.map((card, key) => (
                <Card key={key} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
