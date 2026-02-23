export default function Loading() {
  return (
    <div className="flex h-screen bg-[#0a0912]">
      {/* Sidebar skeleton */}
      <div className="w-56 border-r border-white/5 bg-[#0e0d18] p-4 space-y-3">
        <div className="h-8 w-24 bg-white/5 rounded-xl animate-pulse" />
        <div className="space-y-2 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 bg-white/[0.03] rounded-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>
      {/* Main skeleton */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-3 mt-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-white/[0.03] rounded-2xl animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
