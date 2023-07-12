"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const testResponse = async () => {
    const response = await fetch(`http://127.0.0.1:8000/api/prompts/test/`);

    const data = await response.json();

    console.log(data);
  };

  const prompt = async () => {
    console.log("Calling endpoint");
    const response = await fetch(`http://127.0.0.1:8000/api/prompts/prompt/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        namespace: "433e5f40-8058-41fe-b481-fb1f3b62f74d",
        query: "Test",
      }),
    });

    const promptResponse = await response.json();

    console.log(promptResponse);
  };

  useEffect(() => {
    testResponse();
  }, []);

  return (
    <main className="">
      <div className="">
        <h1>Tester 4</h1>
        <button className="" onClick={prompt}>
          Prompt here
        </button>
      </div>
    </main>
  );
}
