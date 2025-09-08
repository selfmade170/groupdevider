
import React, { useState } from 'react';
import { Role } from '../types';
import { TrashIcon, PlusIcon, RoleIcon } from './icons';

interface RoleManagerProps {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
}

const RoleManager: React.FC<RoleManagerProps> = ({ roles, setRoles }) => {
  const [newRoleName, setNewRoleName] = useState('');

  const handleAddRole = () => {
    if (newRoleName.trim() && !roles.find(r => r.name === newRoleName.trim())) {
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name: newRoleName.trim(),
      };
      setRoles([...roles, newRole]);
      setNewRoleName('');
    }
  };

  const handleRemoveRole = (id: string) => {
    setRoles(roles.filter(role => role.id !== id));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRole();
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
        <RoleIcon className="w-6 h-6 text-sky-500" />
        <span>Управление ролями</span>
      </h3>
      <div className="mt-4 space-y-2">
        {roles.map(role => (
          <div key={role.id} className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
            <span className="text-slate-800">{role.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveRole(role.id)}
              className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Название новой роли"
          className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
        />
        <button
          type="button"
          onClick={handleAddRole}
          className="flex-shrink-0 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-300"
          disabled={!newRoleName.trim()}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default RoleManager;
