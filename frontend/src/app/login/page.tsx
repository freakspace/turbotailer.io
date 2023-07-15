"use client";

import { useRouter } from "next/navigation";

import { FormEvent, useState, useContext, useEffect } from "react";

import { UserContext, IContext } from "@/context/UserContext";

import { getAuth } from "./services";

import Button from "../components/Button";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();
  const [bla, setBla] = useState("");

  const handleSubmit = async () => {
    const response = await getAuth(username, password);
    setBla("Bad Response 2");
    /*
    if (!response.ok) {
      // Show some error
      setBla("Bad Response");
      push("login/");
    } else {
      const data = await response.json();
      setToken(data.token);
      setBla("Good Response");
    } */
  };

  useEffect(() => {
    if (token) {
      push("dashboard/");
    }
  }, [push, token]);

  return (
    <main className="">
      {bla}
      <div className="">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-slate-900"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-slate-900"
          />
        </label>
        <br />
        <Button onClick={() => handleSubmit()}>Submit</Button>
      </div>
    </main>
  );
}
