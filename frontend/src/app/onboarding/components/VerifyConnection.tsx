import StepWrapper from "./StepWrapper";

export default function VerifyConnection({
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
        <h3 className="text-xl font-bold mb-5">Verify Connection</h3>
        <p className="text-lg mb-5">
          We'll ping your API to check if there is a connection
        </p>

        <div className="">
          <button
            onClick={() => verifyConnection()}
            className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xl"
          >
            Verify
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
