import React, { useState } from 'react';
import ChurchHome from './components/ChurchHome';

export default function App() {
  const [activeSloganId] = useState<string>('slogan-1');
  const [selectedFontCombo] = useState<number>(0);

  return (
    <div className="relative overflow-x-hidden">
      {/* Prime Premium Responsive Website component */}
      <ChurchHome 
        activeSloganId={activeSloganId}
        selectedFontCombo={selectedFontCombo}
        onOpenPlanning={() => {}}
      />
    </div>
  );
}

