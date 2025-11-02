'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to home if logged in
      window.location.replace('/home');
    } else {
      // Redirect to start if not logged in
      window.location.replace('/start');
    }
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-cyan-400 mb-4">RecruitAI</div>
        <p className="text-slate-300">Redirection en cours...</p>
      </div>
    </div>
  );
}
