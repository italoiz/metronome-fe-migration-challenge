import { combineReducers } from 'redux';

export const SELECT_MENU = 'navigation/selectMenu';
export const LOAD_DATA_REQUEST = 'workspace/loadRequest';
export const LOAD_DATA_SUCCESS = 'workspace/loadSuccess';
export const LOAD_DATA_FAILURE = 'workspace/loadFailure';
export const UPDATE_SUMMARY = 'workspace/updateSummary';
export const INCREMENT_WINS = 'workspace/incrementWins';
export const ADD_BLOCKER = 'workspace/addBlocker';
export const TOGGLE_MAINTENANCE = 'workspace/toggleMaintenance';
export const UPDATE_TEAM_MOOD = 'workspace/updateTeamMood';
export const SYNC_FROM_REACT = 'SYNC_FROM_REACT';  // ✅ ADICIONAR

export const menuItems = [
  { key: 'overview', label: 'Overview', description: 'Executive summary and shared notes.' },
  { key: 'metrics', label: 'Metrics', description: 'Leading metrics and progress indicators.' },
  { key: 'team', label: 'Team', description: 'Collaboration status and open blockers.' },
  { key: 'settings', label: 'Settings', description: 'Operational toggles and migration helpers.' }
];

const workspaceDefaults = {
  summary: 'Loading shared context…',
  wins: 0,
  openIncidentCount: 0,
  teamMood: 'neutral',
  blockers: [],
  maintenanceMode: false,
  lastUpdated: new Date(0).toISOString()
};

const navigationDefaults = {
  selectedMenu: 'overview',
  menuItems
};

const statusDefaults = {
  isLoading: false,
  error: null
};

const workspaceReducer = (state = workspaceDefaults, action) => {
  switch (action.type) {
    case SYNC_FROM_REACT:  // ✅ ADICIONAR
      return {
        ...state,
        ...action.payload.workspace
      };
    case LOAD_DATA_SUCCESS:
      return { ...state, ...action.payload };
    case UPDATE_SUMMARY:
      return {
        ...state,
        summary: action.payload,
        lastUpdated: new Date().toISOString()
      };
    case INCREMENT_WINS:
      return {
        ...state,
        wins: state.wins + action.payload,
        lastUpdated: new Date().toISOString()
      };
    case ADD_BLOCKER: {
      const blocker = action.payload?.trim();
      if (!blocker || state.blockers.includes(blocker)) {
        return state;
      }
      return {
        ...state,
        blockers: [...state.blockers, blocker],
        lastUpdated: new Date().toISOString()
      };
    }
    case TOGGLE_MAINTENANCE:
      return {
        ...state,
        maintenanceMode: !state.maintenanceMode,
        lastUpdated: new Date().toISOString()
      };
    case UPDATE_TEAM_MOOD:
      return {
        ...state,
        teamMood: action.payload,
        lastUpdated: new Date().toISOString()
      };
    default:
      return state;
  }
};

const navigationReducer = (state = navigationDefaults, action) => {
  switch (action.type) {
    case SYNC_FROM_REACT:  // ✅ ADICIONAR
      return {
        ...state,
        ...action.payload.navigation
      };
    case SELECT_MENU:
      return { ...state, selectedMenu: action.payload };
    default:
      return state;
  }
};

const statusReducer = (state = statusDefaults, action) => {
  switch (action.type) {
    case SYNC_FROM_REACT:  // ✅ ADICIONAR
      return {
        ...state,
        ...action.payload.status
      };
    case LOAD_DATA_REQUEST:
      return { isLoading: true, error: null };
    case LOAD_DATA_SUCCESS:
      return { isLoading: false, error: null };
    case LOAD_DATA_FAILURE:
      return { isLoading: false, error: action.error || 'Unknown error' };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  navigation: navigationReducer,
  workspace: workspaceReducer,
  status: statusReducer
});

export const createInitialState = () => ({
  navigation: {
    selectedMenu: navigationDefaults.selectedMenu,
    menuItems: [...navigationDefaults.menuItems]
  },
  workspace: { ...workspaceDefaults },
  status: { ...statusDefaults }
});

export const selectMenu = (menu) => ({
  type: SELECT_MENU,
  payload: menu
});

export const loadDataRequest = () => ({
  type: LOAD_DATA_REQUEST
});

export const loadDataSuccess = (payload) => ({
  type: LOAD_DATA_SUCCESS,
  payload
});

export const loadDataFailure = (error) => ({
  type: LOAD_DATA_FAILURE,
  error
});

export const updateSummary = (summary) => ({
  type: UPDATE_SUMMARY,
  payload: summary
});

export const incrementWins = (amount) => ({
  type: INCREMENT_WINS,
  payload: amount
});

export const addBlocker = (blocker) => ({
  type: ADD_BLOCKER,
  payload: blocker
});

export const toggleMaintenance = () => ({
  type: TOGGLE_MAINTENANCE
});

export const updateTeamMood = (mood) => ({
  type: UPDATE_TEAM_MOOD,
  payload: mood
});