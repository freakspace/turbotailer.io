export default function Message({ text }: { text: string }) {
  return (
    <div className="block self-end">
      <div className="border border-gray-300 p-4 md:px-5 md:py-4 rounded-3xl">
        <p>{text}</p>
      </div>
    </div>
  );
}
