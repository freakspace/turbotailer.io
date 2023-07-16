"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useState, useContext, useEffect } from "react";

import { UserContext, IContext } from "@/context/UserContext";

import { getAuth } from "./services";

import Button from "../components/Button";
import Input from "../components/Input";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();

  const handleSubmit = async () => {
    const response = await getAuth(username, password);
    console.log(response);
    if (!response.ok) {
      // Show some error
      push("login/");
    } else {
      const data = await response.json();
      setToken(data.token);
    }
  };

  useEffect(() => {
    if (token) {
      push("dashboard/");
    }
  }, [push, token]);
  return (
    <div className="w-screen">
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-screen">
          <div className="mx-4 md:w-1/2 grid grid-cols-1">
            <div className="bg-white border border-1 border-solid border-gray-200 rounded-xl md:p-10 p-6 shadow-xl">
              <h1 className="text-4xl md:text-7xl font-bold mb-8 text-gray-800">
                Login
              </h1>
              <p className="text-gray-800 mb-5">
                Don&apos;t remember your password?{" "}
                <Link href={"register/"} className="text-blue-800 font-bold">
                  Reset your password
                </Link>
              </p>
              <div className="flex flex-col mb-5">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-5">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <Button onClick={() => handleSubmit()}>Log In</Button>
              </div>
              <p className="text-gray-800 mt-5">
                Don&apos;t have an account?{" "}
                <Link href={"register/"} className="text-blue-800 font-bold">
                  Create an account
                </Link>
              </p>
            </div>
            <div className="div text-center mt-5">
              <p className="text-xl font-bold">Turbotailer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
