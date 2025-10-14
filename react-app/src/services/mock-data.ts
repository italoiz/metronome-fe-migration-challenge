export interface MockWorkspaceData {
  summary: string;
  wins: number;
  openIncidentCount: number;
  teamMood: 'positive' | 'neutral' | 'negative';
  blockers: string[];
  maintenanceMode: boolean;
  lastUpdated: string;
}

export const mockWorkspaceData: MockWorkspaceData = {
  summary: 'Legacy migration workstream health snapshot for the interview exercise.',
  wins: 7,
  openIncidentCount: 3,
  teamMood: 'neutral',
  blockers: [
    'Shared component API mismatch in settings modal',
    'Route parameter encoding differs between UI Router and React Router',
    'State synchronization lag during rapid navigation'
  ],
  maintenanceMode: false,
  lastUpdated: new Date().toISOString()
};

