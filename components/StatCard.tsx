import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string; // e.g. 'text-green-600'
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass = 'text-slate-800', subtext }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-full bg-slate-50 ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};