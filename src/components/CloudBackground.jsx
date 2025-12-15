export function CloudBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 left-0 w-64 h-32 bg-white/30 rounded-full blur-2xl animate-cloud opacity-60"></div>
      <div className="absolute top-40 right-20 w-80 h-40 bg-white/25 rounded-full blur-3xl animate-cloud-slow opacity-50"></div>
      <div className="absolute top-60 left-1/4 w-72 h-36 bg-white/20 rounded-full blur-2xl animate-cloud opacity-40" style={{ animationDelay: '5s' }}></div>
      <div className="absolute bottom-40 right-1/3 w-96 h-48 bg-white/30 rounded-full blur-3xl animate-cloud-slow opacity-50" style={{ animationDelay: '10s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-56 h-28 bg-white/25 rounded-full blur-2xl animate-cloud opacity-45" style={{ animationDelay: '15s' }}></div>
    </div>
  );
}

