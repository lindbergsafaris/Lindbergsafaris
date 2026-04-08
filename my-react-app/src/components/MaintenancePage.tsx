// =============================================================
// TEMPORARY — MAINTENANCE MODE
// This component is a temporary overlay that replaces all
// user-facing routes while the site is under maintenance.
//
// TO RESTORE NORMAL ROUTING:
//   1. Open `src/App.tsx`
//   2. Remove the import for `MaintenancePage`
//   3. Delete the `<MaintenancePage />` early-return block
//      (the two lines marked with "// MAINTENANCE MODE")
//   That's it! All routes will resume working normally.
// =============================================================

import React from 'react';
import { ShieldAlert } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAF9] p-6 font-sans select-none">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-12 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-50 p-4 rounded-full">
            <ShieldAlert className="w-12 h-12 text-amber-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-stone-900 mb-4 tracking-tight">
          ⚡ Site Temporarily Paused
        </h1>
        
        <p className="text-lg text-stone-600 leading-relaxed mb-8">
          The site is temporarily under maintenance. 
          <span className="block mt-1">We'll be back shortly.</span>
        </p>
        
        <div className="w-12 h-1 bg-stone-200 mx-auto rounded-full mb-6" />
        
        <p className="text-sm font-medium text-stone-400 uppercase tracking-widest">
          Thank you for your patience
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
