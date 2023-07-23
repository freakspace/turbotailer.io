import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { IProduct } from "../../../../typings";

/* const products = [
  {
    name: "Salomon Quest 4 Gore-Tex",
    price: "$230",
    img: "https://u7q2x7c9.stackpathcdn.com/photos/23/79/359440_28754_L.jpg",
  },
  {
    name: "Merrell Moab 3 Mid Waterproof",
    price: "$145",
    img: "https://u7q2x7c9.stackpathcdn.com/photos/26/40/385539_11557_XL.webp",
  },
  {
    name: "Merrell Moab 3 Mid Waterproof",
    price: "$145",
    img: "https://u7q2x7c9.stackpathcdn.com/photos/26/40/385539_11557_XL.webp",
  },
  {
    name: "Merrell Moab 3 Mid Waterproof",
    price: "$145",
    img: "https://u7q2x7c9.stackpathcdn.com/photos/26/40/385539_11557_XL.webp",
  },
]; */
function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "transparent",
        color: "black",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "transparent",
        color: "black",
      }}
      onClick={onClick}
    />
  );
}

function ProductSlider({ products }: { products: IProduct[] }) {
  var settings = {
    dots: false,
    arrow: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2.25,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="relative border border-gray-300 p-4 md:px-5 md:py-4 md:p-5 rounded-3xl bg-gray-50 mb-3">
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={index} className="flex flex-col">
            <div className="border border-gray-200 p-4 rounded-3xl bg-white w-full">
              <p className="text-black font-bold">{product.name}</p>
              <p>{product.price}</p>
              <img
                className="h-48 w-auto"
                src={product.image}
                alt={product.name}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ProductSlider;
