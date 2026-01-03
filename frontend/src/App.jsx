import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 p-4">

      {/* Tailwind Test */}
      <h1 className="text-4xl font-bold text-blue-500">
        Tailwind CSS is working!
      </h1>

      {/* DaisyUI Button Test */}
      <button className="btn btn-primary">
        DaisyUI Button
      </button>

      {/* DaisyUI Card Test */}
      <div className="card w-80 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">DaisyUI Card</h2>
          <p>This card proves DaisyUI + Tailwind are working together.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-accent">Click Me</button>
          </div>
        </div>
      </div>

      {/* Tailwind + DaisyUI Theme Test */}
      <div data-theme="dark" className="p-4 rounded-lg">
        <button className="btn btn-secondary">Dark Theme Button</button>
      </div>
      

    </div>
  );
}

export default App;
