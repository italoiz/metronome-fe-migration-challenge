import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MenuItem {
  key: string;
  label: string;
  description: string;
}

interface NavigationState {
  selectedMenu: string;
  menuItems: MenuItem[];
}

interface WorkspaceState {
  summary: string;
  wins: number;
  openIncidentCount: number;
  teamMood: 'positive' | 'neutral' | 'negative';
  blockers: string[];
  maintenanceMode: boolean;
  lastUpdated: string;
}

interface StatusState {
  isLoading: boolean;
  error: string | null;
}

interface AppState {
  navigation: NavigationState;
  workspace: WorkspaceState;
  status: StatusState;

  // Actions
  selectMenu: (menu: string) => void;
  updateSummary: (summary: string) => void;
  incrementWins: (amount: number) => void;
  addBlocker: (blocker: string) => void;
  toggleMaintenance: () => void;
  updateTeamMood: (mood: WorkspaceState['teamMood']) => void;
  loadDataRequest: () => void;
  loadDataSuccess: (payload: Partial<WorkspaceState>) => void;
  loadDataFailure: (error: string) => void;
  reloadFromMockAPI: () => Promise<void>;
}

export const useStore = create<AppState>()(
  devtools(
    (set) => ({
      navigation: {
        selectedMenu: 'overview',
        menuItems: [
          {
            key: 'overview',
            label: 'Overview',
            description: 'Executive summary and shared notes.',
          },
          {
            key: 'metrics',
            label: 'Metrics',
            description: 'Leading metrics and progress indicators.',
          },
          {
            key: 'team',
            label: 'Team',
            description: 'Collaboration status and open blockers.',
          },
          {
            key: 'settings',
            label: 'Settings',
            description: 'Operational toggles and migration helpers.',
          },
        ],
      },
      workspace: {
        summary: 'Loading shared context…',
        wins: 0,
        openIncidentCount: 0,
        teamMood: 'neutral',
        blockers: [],
        maintenanceMode: false,
        lastUpdated: new Date(0).toISOString(),
      },
      status: {
        isLoading: false,
        error: null,
      },

      // Actions
      selectMenu: (menu) =>
        set((state) => ({
          navigation: { ...state.navigation, selectedMenu: menu },
        })),

      updateSummary: (summary) =>
        set((state) => ({
          workspace: {
            ...state.workspace,
            summary,
            lastUpdated: new Date().toISOString(),
          },
        })),

      incrementWins: (amount) =>
        set((state) => ({
          workspace: {
            ...state.workspace,
            wins: state.workspace.wins + amount,
            lastUpdated: new Date().toISOString(),
          },
        })),

      addBlocker: (blocker) =>
        set((state) => ({
          workspace: {
            ...state.workspace,
            blockers: [...state.workspace.blockers, blocker],
            lastUpdated: new Date().toISOString(),
          },
        })),

      toggleMaintenance: () =>
        set((state) => ({
          workspace: {
            ...state.workspace,
            maintenanceMode: !state.workspace.maintenanceMode,
            lastUpdated: new Date().toISOString(),
          },
        })),

      updateTeamMood: (mood) =>
        set((state) => ({
          workspace: {
            ...state.workspace,
            teamMood: mood,
            lastUpdated: new Date().toISOString(),
          },
        })),

      loadDataRequest: () =>
        set({
          status: { isLoading: true, error: null },
        }),

      loadDataSuccess: (payload) =>
        set((state) => ({
          workspace: {
            ...state.workspace,
            ...payload,
          },
          status: { isLoading: false, error: null },
        })),

      loadDataFailure: (error) =>
        set({
          status: { isLoading: false, error },
        }),

      reloadFromMockAPI: async () => {
        // Disparar loading
        set({ status: { isLoading: true, error: null } });

        try {
          // Importar dinamicamente para evitar circular dependency
          const { ApiClient } = await import('../services/api-client');
          
          // Buscar dados
          const data = await ApiClient.fetchWorkspaceSnapshot();

          // Atualizar store
          set((state) => ({
            workspace: {
              ...state.workspace,
              summary: data.summary,
              wins: data.wins,
              openIncidentCount: data.openIncidentCount,
              teamMood: data.teamMood,
              blockers: data.blockers,
              lastUpdated: data.lastUpdated,
            },
            status: { isLoading: false, error: null },
          }));
        } catch (error) {
          set({
            status: {
              isLoading: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          });
        }
      },
    }),
    { name: 'app-store' }
  )
);

export type { AppState, NavigationState, WorkspaceState, StatusState };

