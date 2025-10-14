import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LegacyRoute } from './LegacyRoute';
import { SettingsScreen } from '@/screens/Settings/Settings';
import LayoutRouter from '@/components/layout/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRouter />,
    children: [
      {
        index: true,
        element: <Navigate to="/overview" replace />,
      },
      {
        path: 'overview',
        element: <LegacyRoute screen="overview" />,
      },
      {
        path: 'metrics',
        element: <LegacyRoute screen="metrics" />,
      },
      {
        path: 'team',
        element: <LegacyRoute screen="team" />,
      },
      {
        path: 'settings',
        element:  <SettingsScreen />,
      },
    ],
  },
]);

