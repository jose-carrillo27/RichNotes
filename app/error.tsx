"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0912]">
      <div className="text-center">
        <h2 className="text-lg font-bold text-red-400 mb-2">Algo salió mal</h2>
        <p className="text-sm text-white/30 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-violet-600 rounded-xl text-sm font-medium text-white hover:bg-violet-500 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
