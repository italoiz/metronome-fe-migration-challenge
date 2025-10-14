import { useStore } from './index';
 
let angularInjector: any = null;
let isSyncing = false;

export function setAngularInjector(injector: any) {
  angularInjector = injector;
  console.log('[Bridge] AngularJS injector set');
}

export function getAngularInjector() {
  return angularInjector;
}

// Sync Zustand → AngularJS
export function syncStateToAngular() {
  if (!angularInjector) {
    console.warn('[Bridge] Cannot sync to Angular: injector not set');
    return;
  }

  try {
    const $ngRedux = angularInjector.get('$ngRedux');

    const unsubscribe = useStore.subscribe((state) => {
      // 🔒 Loop guard: skip if already syncing
      if (isSyncing) {
        console.log('[Bridge] Skipping sync to Angular (already syncing)');
        return;
      }

      console.log('[Bridge] Syncing React state to AngularJS:', state);

      // Mark syncing phase
      isSyncing = true;

      try {
        // Dispatch action into AngularJS Redux
        $ngRedux.dispatch({
          type: 'SYNC_FROM_REACT',
          payload: state,
        });
      } finally {
        // Always release the flag, even on errors
        isSyncing = false;
      }
    });

    console.log('[Bridge] Sync to Angular established');
    return unsubscribe;
  } catch (error) {
    console.error('[Bridge] Error syncing to Angular:', error);
  }
}

// Sync AngularJS → Zustand
export function syncStateFromAngular() {
  if (!angularInjector) {
    console.warn('[Bridge] Cannot sync from Angular: injector not set');
    return;
  }

  try {
    const $ngRedux = angularInjector.get('$ngRedux');

    const unsubscribe = $ngRedux.subscribe(() => {
      // 🔒 Loop guard: skip if already syncing
      if (isSyncing) {
        console.log('[Bridge] Skipping sync from Angular (already syncing)');
        return;
      }

      const angularState = $ngRedux.getState();
      console.log('[Bridge] Syncing AngularJS state to React:', angularState);

      // Mark syncing phase
      isSyncing = true;

      try {
        // Update Zustand with data from AngularJS
        useStore.setState({
          navigation: angularState.navigation,
          workspace: angularState.workspace,
          status: angularState.status,
        });
      } finally {
        // Always release the flag, even on errors
        isSyncing = false;
      }
    });

    console.log('[Bridge] Sync from Angular established');
    return unsubscribe;
  } catch (error) {
    console.error('[Bridge] Error syncing from Angular:', error);
  }
}

// Initialize bidirectional bridge
export function initializeBridge() {
  console.log('[Bridge] Initializing bidirectional sync...');
  
  const unsubscribeToAngular = syncStateToAngular();
  const unsubscribeFromAngular = syncStateFromAngular();

  return () => {
    console.log('[Bridge] Destroying bridge');
    if (unsubscribeToAngular) unsubscribeToAngular();
    if (unsubscribeFromAngular) unsubscribeFromAngular();
  };
}