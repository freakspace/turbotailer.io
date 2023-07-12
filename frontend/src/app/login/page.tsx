"use client";

import { useRouter } from "next/navigation";

import { FormEvent, useState, useContext, useEffect } from "react";

import { UserContext, IContext } from "@/context/UserContext";

import { getAuth } from "./services";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { token, setToken } = useContext(UserContext) as IContext;
  const { push } = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await getAuth(username, password);

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
  }, [token]);

  return (
    <main className="">
      <div className="">
        <form onSubmit={handleSubmit}>
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
          <input type="submit" value="Submit" />
        </form>
      </div>
    </main>
  );
}
