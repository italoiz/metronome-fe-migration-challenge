import { useStore } from '@/stores';
import {
  Card,
  CardTitle,
  CardHeadline,
  CardSubhead,
  CardContent,
  CardDivider,
  CardCaption,
} from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';

export function SettingsScreen() {
  const { workspace, status, toggleMaintenance, reloadFromMockAPI } = useStore();

  const handleMaintenanceToggle = () => {
    toggleMaintenance();
  };

  const handleReload = async () => {
    await reloadFromMockAPI();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardTitle>
          <CardHeadline>Operations & Experiments</CardHeadline>
          <CardSubhead>Flip toggles to simulate migration scenarios.</CardSubhead>
        </CardTitle>

        <CardContent>
          {/* Toggle Maintenance Mode */}
          <div className="py-2">
            <Toggle
              checked={workspace.maintenanceMode}
              onChange={handleMaintenanceToggle}
              label={`Maintenance mode ${workspace.maintenanceMode ? 'enabled' : 'disabled'}`}
              disabled={status.isLoading}
            />
          </div>

          <CardDivider />

          {/* Reload Button */}
          <div className="space-y-2">
            <button
              onClick={handleReload}
              disabled={status.isLoading}
              className="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-sm font-medium uppercase text-white shadow transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status.isLoading ? 'Loading...' : 'Reload from mock API'}
            </button>
            <CardCaption>
              Simulates fetching shared state from the legacy API surface.
            </CardCaption>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
