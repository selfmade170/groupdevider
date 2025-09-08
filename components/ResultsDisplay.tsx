
import React from 'react';
import { Group } from '../types';
import { RefreshIcon, DownloadIcon, HomeIcon, SparklesIcon, RoleIcon, UsersIcon } from './icons';

interface ResultsDisplayProps {
  groups: Group[];
  onShuffle: () => void;
  onStartOver: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ groups, onShuffle, onStartOver }) => {
    
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Группа,Ученик,Роль\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        const row = [group.name, member.name, member.role?.name || ''].join(',');
        csvContent += row + "\n";
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "groups_distribution.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
                    <SparklesIcon className="w-8 h-8"/>
                </div>
            </div>
          <h1 className="text-4xl font-bold text-slate-800">3. Результаты деления</h1>
          <p className="text-slate-500 mt-2">Группы сформированы! Вы можете перемешать их заново или начать с начала.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group, index) => (
          <div key={group.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-4 bg-gradient-to-r from-sky-500 to-indigo-500 text-white flex items-center gap-3`}>
                <UsersIcon className="w-6 h-6"/>
                <h3 className="text-xl font-bold">{group.name}</h3>
            </div>
            <ul className="p-4 space-y-3 flex-grow">
              {group.members.map(member => (
                <li key={member.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                  <span className="font-medium text-slate-800">{member.name}</span>
                  {member.role && (
                    <span className="flex items-center gap-1 text-sm bg-sky-100 text-sky-700 px-2 py-1 rounded-full">
                        <RoleIcon className="w-4 h-4"/>
                        {member.role.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onShuffle}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors shadow-md hover:shadow-lg"
        >
          <RefreshIcon className="w-5 h-5" />
          <span>Перемешать</span>
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Экспорт в CSV</span>
        </button>
        <button
          onClick={onStartOver}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Начать заново</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
