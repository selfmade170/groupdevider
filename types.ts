
export interface Role {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
}

export interface GroupMember extends Student {
  role?: Role;
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
}

export type AppScreen = 'input' | 'settings' | 'results';

export type DivisionMode = 'byGroupCount' | 'byMemberCount';
