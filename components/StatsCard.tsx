
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold mt-2 text-slate-800">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 font-semibold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
            <i className={`fas fa-arrow-${trend.startsWith('+') ? 'up' : 'down'} mr-1`}></i>
            {trend} from yesterday
          </p>
        )}
      </div>
      <div className={`${color} p-3 rounded-lg text-white shadow-lg`}>
        <i className={`fas ${icon} text-xl`}></i>
      </div>
    </div>
  );
};

export default StatsCard;
