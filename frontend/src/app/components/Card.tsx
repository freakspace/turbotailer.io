import { ICard } from "../../../typings";

export default function Card({ card }: { card: ICard }) {
  return (
    <div className="bg-white rounded-lg px-10 py-6 border border-solid border-gray-100 shadow-lg">
      <p className="font-bold">{card.title}</p>
      <p className="text-2xl">{card.subtitle}</p>
    </div>
  );
}
