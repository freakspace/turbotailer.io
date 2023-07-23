"use client";

import { useRouter } from "next/navigation";
import { useEffect, useContext, useState } from "react";
import { UserContext, IContext } from "@/context/UserContext";
import { ICard, INavItem, IStore } from "../../../typings";
import Card from "../components/Card";
import Navigation from "./components/navigation";
import { motion } from "framer-motion";

import Overview from "./components/overview";
import Chat from "./components/chat";

export default function Dashboard() {
  const [notification, setNotification] = useState<string>("");
  const [activePage, setActivePage] = useState("chat");
  const [store, setStore] = useState<IStore | undefined>();
  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();

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
        setStore(data[0]); // Support only 1 store now -> add more later
      } else {
        // Some error here
      }
    };

    getUserStores();
  }, [token]);

  const navItems: Record<string, INavItem> = {
    overview: {
      name: "Overview",
      component: (
        <Overview
          token={token}
          storeId={store?.id}
          channels={store?.channels}
          setNotification={setNotification}
        />
      ),
    },
    chat: {
      name: "Chat",
      component: <Chat storeId={store?.id} setNotification={setNotification} />,
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification("");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // your component styles
  const notificationVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { duration: 0.5 } },
    exit: { y: "-100vh", opacity: 0, transition: { delay: 5, duration: 0.5 } },
  };

  return (
    <div className="relative md:w-1/3 mx-auto mt-10">
      {notification && (
        <motion.div
          className="absolute bg-amber-500 p-4 border rounded-xl shadow-md text-white font-bold w-full left-0 right-0"
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {notification}
        </motion.div>
      )}
      <Navigation
        navItems={navItems}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      {navItems[activePage].component}
    </div>
  );
}
