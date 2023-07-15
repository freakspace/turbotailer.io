"use client";

import { useState, useRef, useEffect } from "react";

import Input from "./components/Input";

import Search from "./components/Search";
export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center md:h-screen p-6">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="">
              <span className="text-sm inline-block border px-3 py-2 bg-gray-100 rounded-full mb-4 text-gray-500">
                Subscribe and receive $20 worth of OpenAI creditstext
              </span>
              <h1 className="text-4xl md:text-7xl mb-3 md:mb-6">
                <span className="font-bold">Turbocharge</span> your store with{" "}
                <span className="font-bold">AI</span>
              </h1>
              <h2 className="text-xl md:text-3xl mb-6 md:mb-12">
                Let your customers chat with your products, categories, pages
                and orders, and give them the answers they need instantly.
              </h2>
              <div className="bg-gray-100 px-4 md:px-8 py-4 md:py-8 rounded-xl shadow-xl shadow-gray-200 border border-white">
                <h3 className="text-2xl text-gray-800 font-bold mb-3">
                  Get 20$ Worth of Credits
                </h3>
                <p className="mb-6 text-gray-800">
                  We&apos;ll notify you as soon as we launch, and credit you
                  with 20$ worth of embeddings and OpenAI queries to your
                  Turbotailer account.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <Input placeholder="Name" />
                  <Input placeholder="Email" />
                  <button className="bg-black text-white flex-1 rounded-lg text-lg font-bold">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-2xl text-center mb-6">Try it</h3>
              <div className="bg-white flex flex-col flex-grow border border-gray-300 rounded-3xl p-4 md:p-8">
                <div className="h-48 flex-grow border border-gray-300 rounded-3xl mb-6 py-3 px-4 text-gray-500"></div>
                <Search />
              </div>
              <p className="mt-2 text-gray-600 text-center italic">
                Try for example &apos;Which shoes are great for hiking?&apos;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
