import { IMessage, IProduct } from "../../../../typings";

import ProductSlider from "./productSlider";

const products: IProduct[] = [
  {
    name: "Salomon Quest 4 Gore-Tex",
    price: 230,
    image: "https://u7q2x7c9.stackpathcdn.com/photos/23/79/359440_28754_L.jpg",
    link: "test",
  },
  {
    name: "Merrell Moab 3 Mid Waterproof",
    price: 145,
    image:
      "https://u7q2x7c9.stackpathcdn.com/photos/26/40/385539_11557_XL.webp",
    link: "test",
  },
  {
    name: "Merrell Moab 3 Mid Waterproof",
    price: 145,
    image:
      "https://u7q2x7c9.stackpathcdn.com/photos/26/40/385539_11557_XL.webp",
    link: "test",
  },
  {
    name: "Merrell Moab 3 Mid Waterproof",
    price: 145,
    image:
      "https://u7q2x7c9.stackpathcdn.com/photos/26/40/385539_11557_XL.webp",
    link: "test",
  },
];

export default function Message({ message }: { message: IMessage }) {
  return (
    <div className="block self-end">
      <div className="relative border border-gray-300 p-4 md:px-5 md:py-4 rounded-3xl">
        <p>{message.text}</p>
        <ProductSlider products={products} />
      </div>
    </div>
  );
}
