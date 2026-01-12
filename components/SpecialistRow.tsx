
import React from 'react';
import { Specialist, SpecialistStatus } from '../types';

interface SpecialistRowProps {
  specialist: Specialist;
  onView: (s: Specialist) => void;
  onUpdateStatus: (id: string, status: SpecialistStatus) => void;
}

const SpecialistRow: React.FC<SpecialistRowProps> = ({ specialist, onView, onUpdateStatus }) => {
  const getStatusColor = (status: SpecialistStatus) => {
    switch (status) {
      case SpecialistStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case SpecialistStatus.CONTACTED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case SpecialistStatus.VERIFIED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case SpecialistStatus.REJECTED: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            {specialist.name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-slate-900">{specialist.name}</div>
            <div className="text-xs text-slate-500">{specialist.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-white text-slate-600">
          {specialist.specialization}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {new Date(specialist.registrationDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(specialist.status)}`}>
          {specialist.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => onView(specialist)}
          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-all group-hover:bg-indigo-600 group-hover:text-white"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

export default SpecialistRow;
