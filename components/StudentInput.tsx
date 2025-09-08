
import React, { useState, useRef } from 'react';
import { ArrowRightIcon, UsersIcon } from './icons';

interface StudentInputProps {
  onStudentsSubmit: (students: string[]) => void;
}

const StudentInput: React.FC<StudentInputProps> = ({ onStudentsSubmit }) => {
  const [studentList, setStudentList] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setStudentList(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const students = studentList
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (students.length < 2) {
      setError('Пожалуйста, введите как минимум двух учеников.');
      return;
    }
    setError('');
    onStudentsSubmit(students);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
                <div className="bg-sky-100 text-sky-600 p-3 rounded-full">
                    <UsersIcon className="w-8 h-8"/>
                </div>
            </div>
          <h1 className="text-3xl font-bold text-slate-800">1. Введите список учеников</h1>
          <p className="text-slate-500 mt-2">Вставьте список, где каждый ученик на новой строке или через запятую.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
            placeholder="Иван Петров&#10;Мария Сидорова&#10;Алексей Иванов&#10;..."
            value={studentList}
            onChange={(e) => setStudentList(e.target.value)}
          />
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <input
              type="file"
              accept=".csv,.txt"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors duration-200"
            >
              Загрузить из файла (.txt, .csv)
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span>Далее</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentInput;
