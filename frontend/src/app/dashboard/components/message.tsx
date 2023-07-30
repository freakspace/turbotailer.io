import { IMessage } from "../../../../typings";

export default function Message({ message }: { message: IMessage }) {
  console.log("Test");
  return (
    <div className="block self-end">
      <div
        className={`relative border border-gray-300 p-4 md:px-5 md:py-4 rounded-3xl ${
          message.type === "ai" && "bg-gray-50"
        }`}
      >
        {/* {message.products && message.products.length > 0 && (
          <div className="flex overflow-x-scroll space-x-4 mb-4 pb-4">
            {message.products.map((product, key) => (
              <div
                key={key}
                className="border border-gray-200 p-4 rounded-3xl bg-white w-9/12 md:w-5/12 flex-shrink-0"
              >
                <p className="text-black font-bold">{product.name}</p>
                {product.price && <p>{product.price}</p>}
                {product.image && (
                  <img className="h-auto w-full" src={product.image} />
                )}
              </div>
            ))}
          </div>
        )} */}
        <p>{message.data.content}</p>
      </div>
    </div>
  );
}
