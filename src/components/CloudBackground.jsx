export function CloudBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-20 left-0 w-64 h-32 bg-white/20 rounded-full blur-3xl animate-cloud opacity-50 transition-opacity duration-1000"></div>
      <div className="absolute top-40 right-20 w-80 h-40 bg-white/15 rounded-full blur-3xl animate-cloud-slow opacity-40 transition-opacity duration-1000"></div>
      <div className="absolute top-60 left-1/4 w-72 h-36 bg-white/15 rounded-full blur-3xl animate-cloud opacity-35 transition-opacity duration-1000" style={{ animationDelay: '5s' }}></div>
      <div className="absolute bottom-40 right-1/3 w-96 h-48 bg-white/20 rounded-full blur-3xl animate-cloud-slow opacity-45 transition-opacity duration-1000" style={{ animationDelay: '10s' }}></div>
      <div className="absolute bottom-20 left-1/2 w-56 h-28 bg-white/15 rounded-full blur-3xl animate-cloud opacity-40 transition-opacity duration-1000" style={{ animationDelay: '15s' }}></div>
    </div>
  );
}

