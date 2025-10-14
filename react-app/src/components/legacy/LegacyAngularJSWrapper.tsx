import { useEffect, useRef, useState } from 'react';
import { setAngularInjector, initializeBridge } from '@/stores/bridge';

// Import AngularJS and dependencies
import angular from 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-messages';
import 'angular-material';
import '@uirouter/angularjs';

// Import Angular Material CSS (scoped)
import './app/styles/angular-material-scoped.css';
import { useStore } from '@/stores/index.js';

interface LegacyAngularJSWrapperProps {
  screen: string;
}

// Global flags to avoid multiple bootstraps and keep references
let isAngularBootstrapped = false;
let globalAngularInjector: any = null;
let unsubscribeFromAngular: () => void = () => {};

export function LegacyAngularJSWrapper({ screen }: LegacyAngularJSWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Effect 1: Initialize AngularJS once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // If already bootstrapped, just reuse it
    if (isAngularBootstrapped && globalAngularInjector) {
      console.log('[LegacyWrapper] AngularJS already bootstrapped, reusing');
      setIsReady(true);
      return;
    }

    console.log('[LegacyWrapper] Initializing AngularJS (first time)');

    const initAngular = async () => {
      try {
        await import('./app/app.module.js');

        // Create AngularJS root element (once)
        const existingRoot = document.getElementById('legacy-angular-root');
        let angularElement: HTMLElement;

        if (existingRoot) {
          angularElement = existingRoot;
          console.log('[LegacyWrapper] Reusing existing Angular root');
        } else {
          angularElement = document.createElement('div');
          angularElement.setAttribute('id', 'legacy-angular-root');
          angularElement.innerHTML = '<layout-root></layout-root>';
          container.appendChild(angularElement);
        }

        // Bootstrap only if not done before
        if (!isAngularBootstrapped) {
          console.log('[LegacyWrapper] Bootstrapping AngularJS...');
          
          angular.bootstrap(angularElement, ['legacyApp'], {
            strictDi: false,
          });

          // Get injector
          globalAngularInjector = angular.element(angularElement).injector();

          // Configure state bridge
          setAngularInjector(globalAngularInjector);

          // ✅ Sync initial React state → AngularJS before starting the bridge
          console.log('[LegacyWrapper] Syncing initial React state to AngularJS');
          const currentReactState = useStore.getState();
          const $ngRedux = globalAngularInjector.get('$ngRedux');

          // Dispatch React initial state to AngularJS Redux
          $ngRedux.dispatch({
            type: 'SYNC_FROM_REACT',
            payload: currentReactState
          });

          console.log('[LegacyWrapper] Initial state synced:', currentReactState);

          // Now initialize bidirectional bridge
          unsubscribeFromAngular = initializeBridge();

          isAngularBootstrapped = true;
        }

        setIsReady(true);
      } catch (error) {
        console.error('[LegacyWrapper] Error initializing AngularJS:', error);
      }
    };

    initAngular();

    // Cleanup: do not destroy AngularJS, only clear local references
    return () => {
      console.log('[LegacyWrapper] Component unmounting (keeping Angular alive)');
      setIsReady(false);
      isAngularBootstrapped = false;
      globalAngularInjector = null; 
      unsubscribeFromAngular();
    };
  }, []);

  // Effect 2: Navigate to the correct legacy screen when `screen` changes
  useEffect(() => {
    if (!isReady || !globalAngularInjector) {
      console.log('[LegacyWrapper] Not ready yet, skipping navigation');
      return;
    }

    try {
      const $state = globalAngularInjector.get('$state');
      const currentState = $state.current.name;

      if (currentState !== screen) {
        console.log(`[LegacyWrapper] Navigating from ${currentState} to ${screen}`);

        $state.transitionTo(screen, {}, {
          location: false,  // ← do not update browser URL
          notify: true,
          reload: false
        });
      } else {
        console.log(`[LegacyWrapper] Already on ${screen}, skipping navigation`);
      }
    } catch (error) {
      console.error('[LegacyWrapper] Error navigating:', error);
    }
  }, [screen, isReady]);

  return (
    <div
      ref={containerRef}
      className="legacy-angular-container"
    />
  );
}