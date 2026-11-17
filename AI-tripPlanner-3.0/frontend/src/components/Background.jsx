import React from 'react';

const Background = () => {
  return (
    <div className='fixed inset-0 bg-gray-50 -z-10 overflow-hidden'>
      {/* Soft Gradients */}
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-float'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 blur-[150px] rounded-full' style={{ animationDelay: '2s' }}></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      {/* Moving Particles (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <circle cx="10%" cy="20%" r="2" fill="currentColor" className="text-blue-500 animate-pulse" />
        <circle cx="80%" cy="40%" r="1" fill="currentColor" className="text-purple-500 animate-pulse" />
        {/* Add more as needed */}
      </svg>
    </div>
  );
};

export default Background;