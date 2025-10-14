import template from './settings.template.html?raw';
import { toggleMaintenance } from '../../store';

export class SettingsController {
  static $inject = ['$ngRedux', '$scope', 'StateBootstrapService'];

  constructor($ngRedux, $scope, stateBootstrap) {
    this.$ngRedux = $ngRedux;
    this.$scope = $scope;
    this.stateBootstrap = stateBootstrap;

    this.maintenanceMode = false;
    this.isLoading = false;
    this.disconnect = null;
  }

  $onInit() {
    this.disconnect = this.$ngRedux.connect((state) => ({
      maintenanceMode: state.workspace.maintenanceMode,
      isLoading: state.status.isLoading
    }))(this);

    this.$scope.$on('$destroy', () => this.$onDestroy());
  }

  $onDestroy() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleMaintenanceToggle() {
    this.$ngRedux.dispatch(toggleMaintenance());
  }

  handleReload() {
    this.stateBootstrap.init();
  }
}

export const SettingsComponent = {
  controller: SettingsController,
  template
};
