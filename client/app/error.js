"use client";

export default function Error({ error, reset }) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-red-600 text-xl font-bold">Something went wrong</h1>

      <p className="text-gray-500 mt-2">{error.message}</p>

      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
