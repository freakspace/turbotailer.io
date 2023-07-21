"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { UserContext, IContext } from "@/context/UserContext";
import { ICard, INavItem, IStore } from "../../../typings";
import Card from "../components/Card";
import Navigation from "./components/navigation";

import Overview from "./components/overview";
import Chat from "./components/chat";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("chat");
  const [store, setStore] = useState<IStore | undefined>();
  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();

  const navItems: Record<string, INavItem> = {
    overview: {
      name: "Overview",
      component: <Overview />,
    },
    chat: {
      name: "Chat",
      component: <Chat storeId={store?.id} />,
    },
  };

  useEffect(() => {
    if (!token) {
      push("login/");
    }
  }, [push, token]);

  useEffect(() => {
    const getUserStores = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/get_user_stores/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
        }
      );

      if (response.ok) {
        let data: IStore[] = await response.json();
        console.log(data);
        setStore(data[0]); // Support only 1 store now -> add more later
      } else {
        // Some error here
      }
    };

    getUserStores();
  }, [token]);
  console.log(store);
  return (
    <div className="md:w-1/3 mx-auto mt-10 p-5">
      <Navigation
        navItems={navItems}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      {navItems[activePage].component}
    </div>
  );
}
