
import React, { useState, useCallback } from 'react';
import StudentInput from './components/StudentInput';
import Settings from './components/Settings';
import ResultsDisplay from './components/ResultsDisplay';
import { AppScreen, DivisionMode, Group, Role } from './types';
import { DEFAULT_ROLES } from './constants';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [screen, setScreen] = useState<AppScreen>('input');
  const [students, setStudents] = useState<string[]>([]);
  const [roles, setRoles] = useLocalStorage<Role[]>('class-divider-roles', DEFAULT_ROLES);
  const [groups, setGroups] = useState<Group[]>([]);
  const [lastSettings, setLastSettings] = useState<{ mode: DivisionMode; value: number } | null>(null);

  const handleStudentsSubmit = (studentList: string[]) => {
    setStudents(studentList);
    setScreen('settings');
  };

  const generateGroups = useCallback((settings: { mode: DivisionMode; value: number }) => {
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    const numStudents = shuffledStudents.length;

    let numGroups = 0;
    if (settings.mode === 'byGroupCount') {
      numGroups = Math.min(settings.value, numStudents);
    } else { // byMemberCount
      numGroups = Math.ceil(numStudents / settings.value);
    }

    if (numGroups <= 0) return;

    const newGroups: Group[] = Array.from({ length: numGroups }, (_, i) => ({
      id: `group-${Date.now()}-${i}`,
      name: `Группа ${i + 1}`,
      members: [],
    }));

    shuffledStudents.forEach((studentName, index) => {
      const groupIndex = index % numGroups;
      newGroups[groupIndex].members.push({
        id: `student-${Date.now()}-${index}`,
        name: studentName,
      });
    });

    newGroups.forEach(group => {
      const shuffledMembers = [...group.members].sort(() => Math.random() - 0.5);
      if (roles.length > 0) {
        const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);
        group.members = shuffledMembers.map((member, index) => {
          const role = shuffledRoles[index % shuffledRoles.length];
          return { ...member, role };
        });
      } else {
         group.members = shuffledMembers;
      }
    });

    setGroups(newGroups);
    setLastSettings(settings);
    setScreen('results');
  }, [students, roles]);

  const handleSettingsSubmit = (settings: { mode: DivisionMode; value: number }) => {
    generateGroups(settings);
  };
  
  const handleShuffle = () => {
    if (lastSettings) {
      generateGroups(lastSettings);
    }
  };

  const handleStartOver = () => {
    setStudents([]);
    setGroups([]);
    setLastSettings(null);
    setScreen('input');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'input':
        return <StudentInput onStudentsSubmit={handleStudentsSubmit} />;
      case 'settings':
        return (
          <Settings
            studentCount={students.length}
            onSettingsSubmit={handleSettingsSubmit}
            onBack={() => setScreen('input')}
            roles={roles}
            setRoles={setRoles}
          />
        );
      case 'results':
        return <ResultsDisplay groups={groups} onShuffle={handleShuffle} onStartOver={handleStartOver} />;
      default:
        return <StudentInput onStudentsSubmit={handleStudentsSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full transition-all duration-500">
        {renderScreen()}
      </main>
      <footer className="mt-8 text-center text-slate-400 text-sm">
        <p>Инструмент «Делитель класса на группы» &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
