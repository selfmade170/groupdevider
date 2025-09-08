
import React, { useState } from 'react';
import { DivisionMode, Role } from '../types';
import { ArrowLeftIcon, SparklesIcon, CogIcon } from './icons';
import RoleManager from './RoleManager';

interface SettingsProps {
  studentCount: number;
  onSettingsSubmit: (settings: { mode: DivisionMode; value: number }) => void;
  onBack: () => void;
  roles: Role[];
  setRoles: (roles: Role[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ studentCount, onSettingsSubmit, onBack, roles, setRoles }) => {
  const [mode, setMode] = useState<DivisionMode>('byGroupCount');
  const [value, setValue] = useState(2);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if(value < 1) {
        setError("Значение должно быть больше 0.");
        return;
    }

    if (mode === 'byGroupCount' && value > studentCount) {
        setError(`Количество групп (${value}) не может превышать количество учеников (${studentCount}).`);
        return;
    }
    
    if(mode === 'byMemberCount' && value > studentCount) {
        setError(`Размер группы (${value}) не может быть больше, чем общее количество учеников (${studentCount}).`);
        return;
    }

    onSettingsSubmit({ mode, value });
  };
  
  const getGroupInfoText = () => {
    if (value <= 0) return "";
    let groupCount = 0;
    let memberInfo = "";

    if (mode === 'byGroupCount') {
        groupCount = value;
        const baseSize = Math.floor(studentCount / groupCount);
        const remainder = studentCount % groupCount;
        if (remainder === 0) {
            memberInfo = `по ${baseSize} чел.`;
        } else {
            memberInfo = `${remainder} групп по ${baseSize + 1} чел., ${groupCount - remainder} по ${baseSize} чел.`
        }
    } else { // byMemberCount
        groupCount = Math.ceil(studentCount / value);
        const remainder = studentCount % value;
        if(remainder === 0) {
            memberInfo = `по ${value} чел.`;
        } else {
             memberInfo = `${groupCount - 1} групп по ${value} чел., 1 группа - ${remainder} чел.`
        }
    }
    
    return `Будет создано ${groupCount} групп. ${memberInfo}`;
  }


  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                    <CogIcon className="w-8 h-8"/>
                </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">2. Настройки деления</h1>
            <p className="text-slate-500 mt-2">Всего учеников: <span className="font-bold text-sky-600">{studentCount}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-700">Способ деления:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${mode === 'byGroupCount' ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500' : 'border-slate-300 bg-white'}`}>
                <input type="radio" name="mode" value="byGroupCount" checked={mode === 'byGroupCount'} onChange={() => setMode('byGroupCount')} className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500"/>
                <span className="ml-3 text-slate-700 font-medium">По количеству групп</span>
              </label>
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${mode === 'byMemberCount' ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500' : 'border-slate-300 bg-white'}`}>
                <input type="radio" name="mode" value="byMemberCount" checked={mode === 'byMemberCount'} onChange={() => setMode('byMemberCount')} className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500"/>
                <span className="ml-3 text-slate-700 font-medium">По кол-ву участников</span>
              </label>
            </div>
            <div>
              <input
                type="number"
                min="1"
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value) || 1)}
                className="w-full p-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
              />
               {value > 0 && <p className="text-sm text-slate-500 mt-2 h-5">{getGroupInfoText()}</p>}
            </div>
          </div>
          
          <RoleManager roles={roles} setRoles={setRoles} />
          
          {error && <p className="text-red-500 mt-4 text-sm text-center">{error}</p>}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Назад</span>
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span>Разделить</span>
              <SparklesIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
