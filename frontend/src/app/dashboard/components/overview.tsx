export default function Overview() {
  return (
    <div className="border border-2 border-solid border-gray-200 rounded-xl bg-white shadow-xl">
      <div className="grid grid-cols-1 p-8 gap-8">
        <div className="">
          <h1 className="text-2xl font-bold">Welcome!</h1>
        </div>
        <div className="">
          <div className="p-4 border rounded-xl shadow-md">
            <div className="mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                <p className="h-4 text-gray-800 text-lg mb-3 text-green-700 font-bold">
                  Operational
                </p>
              </div>
              <p className="text-gray-500 text-xs">Last update 2 hours ago</p>
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
