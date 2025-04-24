import React from "react";
import Image from "next/image";
import Header from "@/components/header";

function About() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="w-full h-screen flex flex-row">
        <div className="w-1/2 flex flex-col items-center justify-center space-y-4">
          <h1 className="font-bold text-4xl">About</h1>
          <p className="text-red-500 text-xl font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id eum
            porro placeat, harum corrupti saepe! Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Id eum porro placeat, harum corrupti
            saepe!
          </p>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <Image
            src="/image/hero.jpg"
            width={300}
            height={100}
            alt="hero"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
