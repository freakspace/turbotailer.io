import { IChannel } from "../../../../typings";

export default function Overview({
  token,
  storeId,
  channels,
  setNotification,
}: {
  token: string | null;
  storeId: string | undefined;
  channels: IChannel[] | undefined;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}) {
  const createEmbeddingTask = async () => {
    // TODO Check for token, storeId and Channels
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
          channels: channels?.map((channel) => channel.id),
        }),
      }
    );
    return response;
  };

  const handleTask = async () => {
    const response = await createEmbeddingTask();
    const data = await response.json();
    if (response.ok) {
      setNotification(data.message);
    } else {
      setNotification(data.error);
    }
  };
  return (
    <div className="border border-2 border-solid border-gray-200 rounded-xl bg-white shadow-xl">
      <div className="grid grid-cols-1 p-8 gap-8">
        <div className="">
          <h1 className="text-2xl font-bold">Welcome!</h1>
        </div>
        <div className="">
          <div className="p-4 border rounded-xl shadow-md">
            <div className="flex justify-between mb-3">
              <div className="">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                  <p className="h-4 text-gray-800 text-lg mb-3 text-green-700 font-bold">
                    Operational
                  </p>
                </div>
                <p className="text-gray-500 text-xs">Last update 2 hours ago</p>
              </div>
              <button
                className="flex items-center"
                onClick={() => handleTask()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-800 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                  />
                </svg>
                <span className="text-gray-700 text-md">Update Embeddings</span>
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-gray-800 mb-1">Chat Model</p>
                <p className="border bg-gray-50 py-1 px-3 rounded-lg">
                  ada-003
                </p>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 mb-1">Embedding Model</p>
                <p className="border bg-gray-50 py-1 px-3 rounded-lg">
                  ada-003
                </p>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 mb-1">Temperature</p>
                <p className="border bg-gray-50 py-1 px-3 rounded-lg">0.8</p>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <p className="mb-3 text-gray-800 font-bold">Past 7 days</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-4 border rounded-xl shadow-md">
              <p className="text-gray-800">Spent</p>
              <p className="font-bold text-gray-800">$ 23,12</p>
            </div>
            <div className="p-4 border rounded-xl shadow-md">
              <p className="text-gray-800">Chats</p>
              <p className="font-bold text-gray-800">23</p>
            </div>
            <div className="p-4 border rounded-xl shadow-md">
              <p className="text-gray-800">Recs</p>
              <p className="font-bold text-gray-800">17</p>
            </div>
            <div className="p-4 border rounded-xl shadow-md">
              <p className="text-gray-800">Click-Through</p>
              <p className="font-bold text-gray-800">25%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
