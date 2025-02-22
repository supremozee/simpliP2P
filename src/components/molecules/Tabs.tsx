import React from 'react';

interface TabsProps {
  tabNames: string[];
  active: string;
  setActive: (tab: string) => void;
  counts?: number[];
}

const Tabs: React.FC<TabsProps> = ({ tabNames, setActive, active, counts }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tabNames.map((tabName, index) => (
        <button
          className={`px-4 py-2 font-bold rounded-lg border text-[11px] transition z-20
            ${active === tabName
              ? 'bg-primary border-0 text-white'
              : 'border text-[#2D2D2D] bg-[#E5E5E5] hover:text-gray-900'}`}
          key={index}
          onClick={() => setActive(tabName)}
        >
          {tabName}
          {counts && <span>{` (${counts[index]})`}</span>}
        </button>
      ))}
    </div>
  );
};

export default Tabs;