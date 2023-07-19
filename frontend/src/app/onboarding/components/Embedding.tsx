import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import StepWrapper from "./StepWrapper";
import Button from "@/app/components/Button";

import { IChannel } from "../../../../typings";

export default function Embedding({
  token,
  storeId,
  selectedChannels,
}: {
  token: string | null;
  storeId: string | undefined;
  selectedChannels: IChannel[];
}) {
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [isEstimating, setIsEstimating] = useState(false);
  const { push } = useRouter();
  const calculateTokens = async () => {
    setIsEstimating(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/embeddings/calculate_tokens/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({
          store_id: storeId,
        }),
      }
    );

    if (!response.body) {
      throw Error("ReadableStream not yet supported in this browser.");
    }

    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        let chunk = textDecoder.decode(value);
        let numbers = chunk.split(",").filter(Boolean);
        numbers.forEach((num) => setEstimatedTokens(parseInt(num)));
      }
    } finally {
      reader.releaseLock();
      setIsEstimating(false);
    }
  };

  const startEmbedding = async () => {
    const channels = selectedChannels.map((channel) => channel.channel);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/embeddings/create_task/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({
          store_id: storeId,
          channels: channels,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      push("dashboard/");
    }
  };

  useEffect(() => {
    setEstimatedPrice((estimatedTokens / 1000) * 0.0001);
  }, [estimatedTokens]);

  return (
    <StepWrapper>
      <div className="">
        <div className="mb-10">
          <h3 className="text-3xl font-bold mb-5">Start Embedding</h3>
          <p className="text-lg mb-3">
            The last step before you are ready to launch, is to create
            embeddings from all the channels you have selected. This is what
            powers the model to be able to find relevant content from queries
            provided by your users.
          </p>
          <div className="flex flex-col items-start">
            <label>Embedding LLM Model</label>
            <input
              type="text"
              disabled
              className="border-solid border border-gray-300 px-3 py-2 rounded-md bg-gray-50"
              value="text-embedding-ada-002"
            />
          </div>
        </div>
        <h4 className="text-2xl font-bold mb-5">Calculate Cost</h4>
        {isEstimating && <p>Estimating</p>}
        <p className="text-lg mb-3">
          To get an understanding of how much embedding will cost, you can use
          our calculater below. We&apos;ll crawl all of your content, so it
          might take a few minutes.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="flex items-end justify-end">
            <Button fullWidth={true} onClick={() => calculateTokens()}>
              Calculate
            </Button>
          </div>
          <div className="flex flex-col">
            <label className="">Tokens</label>
            <input
              type="text"
              value={estimatedTokens}
              disabled
              className="border-solid border border-gray-300 px-3 py-2 rounded-md bg-gray-50"
            />
          </div>
          <div className="flex flex-col">
            <label className="">Estimated Cost</label>
            <input
              type="text"
              value={`$ ${estimatedPrice}`}
              disabled
              className="border-solid border border-gray-300 px-3 py-2 rounded-md bg-gray-50"
            />
          </div>
        </div>
        <div className="">
          <h4 className="text-2xl font-bold mb-5">Start Embedding</h4>
          <p className="text-lg mb-5">
            If you are satisfied with the estimated token spent, you can start
            the embedding. Depending on the amount of products we need to crawl,
            embedding can take anywere from 5 minutes to an hour. Embeddings are
            updated daily, and only updated content will be embedded.
          </p>
          <div className="">
            <Button onClick={() => startEmbedding()}>Start Embedding</Button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
