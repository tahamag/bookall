import React from "react";
import hotel1 from "@/public/sliders/hotel1.jpg";
import hotel2 from "@/public/sliders/hotel2.jpg";
import appar1 from "@/public/sliders/appar1.jpg";
import appar2 from "@/public/sliders/appar2.jpg";
import cars1 from "@/public/sliders/cars1.jpg";
import cars2 from "@/public/sliders/cars2.jpeg";
import Image from "next/image";

export function Sliders() {
  return (
    <div>
      <div className="carousel w-full h-[850px]">
        <div id="item1" className="carousel-item w-full">
          <Image src={hotel1} className="w-full" />
        </div>
        <div id="item2" className="carousel-item w-full">
          <Image src={cars1} className="w-full" />
        </div>
        <div id="item3" className="carousel-item w-full">
          <Image src={appar1} className="w-full" />
        </div>
        <div id="item4" className="carousel-item w-full">
          <Image src={appar2} className="w-full" />
        </div>
        <div id="item5" className="carousel-item w-full">
          <Image src={hotel2} className="w-full" />
        </div>
        <div id="item6" className="carousel-item w-full">
          <Image src={cars2} className="w-full" />
        </div>
      </div>
      <div className="flex w-full justify-center gap-2 py-2">
        <a href="#item1" className="btn btn-xs">
          1
        </a>
        <a href="#item2" className="btn btn-xs">
          2
        </a>
        <a href="#item3" className="btn btn-xs">
          3
        </a>
        <a href="#item4" className="btn btn-xs">
          4
        </a>
        <a href="#item5" className="btn btn-xs">
          5
        </a>
        <a href="#item6" className="btn btn-xs">
          6
        </a>
      </div>
    </div>
  );
}
