# Solution: Incremental Migration AngularJS → React

## How to Run

Prereqs:
- Node.js 18+
- npm 9+

Legacy app (AngularJS):
```
cd legacy-app
npm install
npm start
```

React app:
```
cd react-app
npm install
npm run dev
```

Note: The React app is the entry point and renders legacy routes through `LegacyAngularJSWrapper`.

---

## Implemented Architecture

### Overview

```
┌─────────────────────────────────────────────┐
│   React App (Vite - port 3000)              │
│   ├── React Router v6                       │
│   │   ├── Layout (TopBar + SideMenu)        │
│   │   ├── /overview  → Legacy (AngularJS)   │
│   │   ├── /metrics   → Legacy (AngularJS)   │
│   │   ├── /team      → Legacy (AngularJS)   │
│   │   └── /settings  → React (migrated)     │
│   │                                         │
│   └── LegacyAngularJSWrapper                │
│       └── Bootstraps AngularJS per route    │
└─────────────────────────────────────────────┘
```

### Key Architectural Decisions

#### 1) React as the Primary Shell (Strangler Fig)

React is the entrypoint. AngularJS is rendered inside React when a route has not been migrated yet. This keeps URLs transparent while enabling gradual takeover.

Benefits:
- Code splitting and lazy loading
- Unified navigation via React Router
- Modern error boundaries
- Transparent URLs

#### 2) Zustand as SSOT + Bridge to AngularJS

Zustand is the single source of truth. A bidirectional bridge syncs AngularJS Redux with the React store. Immediately after AngularJS bootstrap, the current React state is dispatched to AngularJS. Reducers on the legacy side accept `SYNC_FROM_REACT` to apply React state. A small `isSyncing` flag prevents infinite loops.

#### 3) Transparent Routing + SPA Navigation

- React Router v6 owns the browser history
- AngularJS navigation uses `$state.transitionTo(..., { location: false })`
- The layout (TopBar/SideMenu) stays in React to guarantee SPA behavior

#### 4) Styling Isolation

Angular Material styles are scoped to the legacy container to avoid conflicts with Tailwind. The React layout follows the Material-inspired indigo palette.

---

## Shared State Flow (Summary)

```
Zustand → AngularJS
  subscribe(state) → $ngRedux.dispatch({ type: 'SYNC_FROM_REACT', payload: state })

AngularJS → Zustand
  $ngRedux.subscribe() → useStore.setState({ navigation, workspace, status })

Loop Prevention
  Guarded by an `isSyncing` flag in both directions
```

---

## POC Outcome

- React layout with `TopBar` and `SideMenu` reproducing legacy visuals
- Settings screen migrated to React with Tailwind
- Maintenance Mode toggle updates global state and TopBar
- "Reload from Mock API" button updates state and timestamp
- Legacy routes (Overview, Metrics, Team) render inside the wrapper
- Navigation remains SPA (no reloads)

---

## What We Would Improve With More Time

Performance
- More granular code splitting
- Lazy loading of the AngularJS bundle
- Service Worker cache

Testing
- Unit tests (Vitest) for React components
- Integration tests for the bridge
- E2E tests (Playwright/Cypress) across React ↔ AngularJS

DX
- Storybook for React components
- Pre-commit hooks (husky + lint-staged)
- CI/CD (GitHub Actions)

Observability
- Error tracking (Sentry)
- Feature flags (GrowthBook/LaunchDarkly)

---

References
- React Router v6
- Zustand Docs
- Tailwind CSS
- Vite Guide

Author: Italo Izaac
Date: October 2025
Version: 1.0.0 (POC)


