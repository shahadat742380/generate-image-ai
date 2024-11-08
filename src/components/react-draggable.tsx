"use client";

import React, { useRef } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";

const ReactDraggable = () => {
  // Reference for draggable div
  const draggableRef = useRef(null);

  // Event logger for tracking drag events
  const eventLogger = (e: DraggableEvent, data: DraggableData) => {
    // console.log("Event: ", e);
    console.log("Data: ", data.x, data.y);
  };

  return (
    <main className="my-20 max-w-3xl mx-auto border h-80 relative overflow-hidden">
      <Draggable
        nodeRef={draggableRef} // Use ref for compatibility with React 18
        bounds="parent" // Restrict movement within the parent container
        defaultPosition={{ x: 0, y: 0 }}
        grid={[1, 1]}
        scale={1}
        onStart={eventLogger}
        onDrag={eventLogger}
        onStop={eventLogger}
      >
        {/* Ref applied to this div, allowing dragging from anywhere within */}
        <div
          ref={draggableRef}
          className="cursor-move bg-blue-600  p-4 h-20 w-20"
        >
          <div>Drag</div>
        </div>
      </Draggable>
    </main>
  );
};

export default ReactDraggable;
