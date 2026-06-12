/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ChurchHome from './components/ChurchHome';
import PlanningPanel from './components/PlanningPanel';

export default function App() {
  const [activeSloganId, setActiveSloganId] = useState<string>('slogan-1');
  const [selectedFontCombo, setSelectedFontCombo] = useState<number>(0);
  const [isPlanningOpen, setIsPlanningOpen] = useState<boolean>(true); // Default open to show professional pitch immediately!

  return (
    <div className="relative overflow-x-hidden">
      {/* Prime Premium Responsive Website component */}
      <ChurchHome 
        activeSloganId={activeSloganId}
        selectedFontCombo={selectedFontCombo}
        onOpenPlanning={() => setIsPlanningOpen(true)}
      />

      {/* Slide-over floating interactive planning guide from 10-year veteran planner */}
      <PlanningPanel 
        activeSloganId={activeSloganId}
        setActiveSloganId={setActiveSloganId}
        selectedFontCombo={selectedFontCombo}
        setSelectedFontCombo={setSelectedFontCombo}
        isOpen={isPlanningOpen}
        onClose={() => setIsPlanningOpen(false)}
      />

      {/* Float planning toggle indicator when drawer is closed */}
      {!isPlanningOpen && (
        <button
          onClick={() => setIsPlanningOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-700 to-indigo-900 text-white rounded-full px-5 py-3 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 border border-white/10 font-sans text-xs font-black animate-bounce"
          title="기획안 및 디자인 가이드 다시 열기"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          수석 기획 제안서 보기
        </button>
      )}
    </div>
  );
}

