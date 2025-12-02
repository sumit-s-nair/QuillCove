const Background = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Modern gradient background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-gradient" />
      
      {/* Subtle accent gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-purple-900/20 via-transparent to-transparent" />
      
      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-noise" />
    </div>
  );
};

export default Background;
