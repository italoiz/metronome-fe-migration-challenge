# Migration Strategy: AngularJS 1.x → React + TypeScript

## Executive Summary

This document outlines an incremental migration strategy from a legacy AngularJS 1.x console to a modern stack based on React 18, TypeScript, and Vite. The approach prioritizes safety, coexistence, and continuous delivery, allowing both technologies to run side by side as we transition.

### Current Context

Legacy stack:
- AngularJS 1.8.3 with UI Router
- Redux (via ng-redux) for global state
- Angular Material 1.2.5 for UI components
- Webpack 5 (port 4200)
- 4 main screens: Overview, Metrics, Team, Settings

Key challenges:
- Increasing maintenance on an end-of-life framework
- Hiring and retention difficulties for AngularJS skills
- Performance and tooling limitations
- Need to keep delivering during the migration

---

## Migration Goals

1. Incremental migration: build new features in React while legacy remains operational
2. Zero downtime: users should not experience interruptions
3. Shared state: synchronize global state between AngularJS and React
4. Developer experience: TypeScript, modern tooling, and instant HMR
5. Safe rollback: toggle migrated routes if needed

---

## High-Level Approach

### Philosophy: Strangler Fig Pattern

We apply the Strangler Fig pattern: the new React app gradually “envelops” the legacy system, taking over responsibilities until AngularJS can be fully removed. In practice, React acts as the application shell, rendering AngularJS inside a controlled wrapper. With small adjustments in the AngularJS module (bootstrap, reducers, initial state) and navigation, we can run both the legacy app and the new app side by side using the same URLs (transparent routes).

### Phases

Phase 1: Foundation
- React + Vite + TypeScript setup
- React Router v6 shell
- LegacyAngularJSWrapper to render legacy routes
- State bridge with Zustand
- Tailwind CSS baseline

Phase 2: Proof of Concept
- Migrate one route (Settings) to React
- Validate bidirectional state sync
- Test navigation across React ↔ AngularJS
- Confirm CSS isolation

Phase 3: Shared Components
- Migrate TopBar and SideMenu to React
- Build base UI library (Button, Card, Input, etc.)
- Establish a design system with Tailwind

Phase 4: Screen Migration
- Migrate screens gradually
- Suggested order: Settings → Overview → Metrics → Team
- Each screen goes through build → QA → feature flag → gradual rollout

Phase 5: Consolidation
- Remove unused AngularJS code
- Optimize bundle splitting
- Move fully to Zustand
- Drop legacy deps

---

## Routing and Coexistence

### Architecture: React as the Main Shell

React is the single entry point, providing:
- Code splitting and lazy loading
- Unified navigation history
- Modern error boundaries
- SEO and future SSR readiness

### Routing Implementation

```
┌─────────────────────────────────────────────┐
│   React App (Vite - port 3000)              │
│   ├── React Router v6                       │
│   │   ├── /overview   → React or Legacy     │
│   │   ├── /metrics    → React or Legacy     │
│   │   ├── /team       → React or Legacy     │
│   │   └── /settings   → React or Legacy     │
│   │                                         │
│   └── LegacyAngularJSWrapper                │
│       └── Renders AngularJS when needed     │
└─────────────────────────────────────────────┘
```

### Transparent URLs

Principle: routes keep identical paths regardless of implementation.

We do not use:
```
/legacy/settings → AngularJS
/settings        → React
```

We do:
```
/settings → Render React if migrated
         → Otherwise render AngularJS
```

### LegacyAngularJSWrapper (key points)

- Bootstrap AngularJS once and keep it alive across navigations
- Immediately dispatch the current React (Zustand) state into AngularJS after bootstrap
- Bidirectional bridge prevents infinite loops with an isSyncing flag
- Use `$state.transitionTo(..., { location: false })` so AngularJS does not touch the browser URL
- Keep layout (TopBar and SideMenu) in React for full navigation control

---

## Shared State Management

### Decision: Zustand as the Single Source of Truth

Why Zustand?
- Minimal bundle size
- Simple API and great TypeScript support
- Easy to bridge with AngularJS

### Bridge Implementation (summary)

```
Zustand → AngularJS
  subscribe(state) → $ngRedux.dispatch({ type: 'SYNC_FROM_REACT', payload: state })

AngularJS → Zustand
  $ngRedux.subscribe() → useStore.setState(fromAngular)

Loop prevention
  isSyncing flag wraps both directions
```

---

## Styling and Isolation Strategy

### Tailwind as the Base + Layout in React

TopBar and SideMenu remain in React to ensure SPA navigation via History API. Angular Material styles are scoped to the legacy container to avoid conflicts with Tailwind.

---

## Risks and Mitigations (selection)

1) Bundle size: mitigate with route-based code splitting and lazy loading of the AngularJS bundle
2) State sync drift: Zustand as SSOT, tested bidirectional bridge, and E2E tests
3) CSS conflicts: scoped Angular Material styles, shared CSS variables, Tailwind base
4) Routing ownership: React Router as the single source of truth; AngularJS uses transition with `location: false`

---

## Rollout

- Start with Settings, then gradually migrate other screens
- Keep legacy screens running through the wrapper
- Maintain feature flags for safe rollout and quick rollback

---

## Best Practices (excerpt)

- Keep layout in React (TopBar/SideMenu)
- Bootstrap AngularJS once; avoid re-creating the root
- Dispatch React state to AngularJS immediately after bootstrap
- Use a loop guard for state sync
- Prefer SPA navigation; never trigger full page reloads

---

Author: Frontend Engineering Team
Date: October 2025
Version: 1.0.0


