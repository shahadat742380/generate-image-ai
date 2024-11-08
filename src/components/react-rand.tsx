"use client";
import { useState } from "react";
import { Rnd } from "react-rnd";
import Image from "next/image";
import img from "@/assets/logo.png";

const ReactRand = () => {
  // Initialize state for position and size
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 200, height: 200 });
  console.log(position, size);

  // Callback for resizing
  const handleResizeStop = (
    e: any,
    direction: any,
    ref: HTMLElement,
    delta: any,
    position: any
  ) => {
    const newWidth = ref.offsetWidth;
    const newHeight = ref.offsetHeight;
    setSize({ width: newWidth, height: newHeight });
    setPosition(position);
  };

  // Callback for dragging
  const handleDragStop = (e: any, d: any) => {
    setPosition({ x: d.x, y: d.y });
  };

  return (
    <main className="h-[654px] w-[572px] mx-auto border overflow-hidden relative">
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={{ x: position.x, y: position.y }}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop} // Set the resize callback
        className="border"
        bounds="parent" // Constrain the drag area to the parent container
      >
        <Image src={img} alt="Logo" className="object-contain h-full w-full" />
      </Rnd>
    </main>
  );
};

export default ReactRand;
