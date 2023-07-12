import StepWrapper from "./StepWrapper";

export default function Embedding({
  token,
  storeId,
}: {
  token: string | null;
  storeId: string | undefined;
}) {
  const verifyConnection = () => {
    console.log("VERIFYING");
  };

  return (
    <StepWrapper>
      <div className="">
        <h3 className="text-3xl font-bold mb-5">Embedding</h3>
        <div className="flex flex-col items-start mb-8">
          <label className="">Embedding LLM Model</label>
          <input
            type="text"
            disabled
            className="border-solid border border-gray-300 px-3 py-2 rounded-md bg-gray-50"
            value="003-ada-text-embeddings"
          />
        </div>
        <h4 className="text-xl font-bold mb-5">Calculate Cost</h4>
        <p className="text-lg mb-3">
          To get an understanding of how much embedding will cost, you can use
          our calculater below. We'll crawl all of your content, so it might
          take a few minutes.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex items-end justify-end">
            <button
              onClick={() => verifyConnection()}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl"
            >
              Calculate Tokens
            </button>
          </div>
          <div className="flex flex-col">
            <label className="">Tokens</label>
            <input
              type="text"
              disabled
              className="border-solid border border-gray-300 px-3 py-2 rounded-md bg-gray-50"
            />
          </div>
          <div className="flex flex-col">
            <label className="">Estimated Cost</label>
            <input
              type="text"
              disabled
              className="border-solid border border-gray-300 px-3 py-2 rounded-md bg-gray-50"
            />
          </div>
        </div>
        <h4 className="text-xl font-bold mb-5">Start Embedding</h4>
        <p className="text-lg mb-5">
          If you are satisfied with the estimated token spent, you can start the
          embedding. Depending on the amount of products we need to crawl,
          embedding can take anywere from 5 minutes to an hour. Embeddings are
          updated daily, and only updated content will be embedded.
        </p>
        <div className="">
          <button
            onClick={() => verifyConnection()}
            className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl"
          >
            Start Embedding
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
