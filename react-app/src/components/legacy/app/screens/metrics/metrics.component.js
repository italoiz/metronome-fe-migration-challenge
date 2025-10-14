import template from './metrics.template.html?raw';
import { incrementWins } from '../../store';

export class MetricsController {
  static $inject = ['$ngRedux', '$scope'];

  constructor($ngRedux, $scope) {
    this.$ngRedux = $ngRedux;
    this.$scope = $scope;

    this.wins = 0;
    this.openIncidentCount = 0;
    this.maintenanceMode = false;
    this.disconnect = null;
  }

  $onInit() {
    this.disconnect = this.$ngRedux.connect((state) => ({
      wins: state.workspace.wins,
      openIncidentCount: state.workspace.openIncidentCount,
      maintenanceMode: state.workspace.maintenanceMode
    }))(this);

    this.$scope.$on('$destroy', () => this.$onDestroy());
  }

  $onDestroy() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  increment() {
    this.$ngRedux.dispatch(incrementWins(1));
  }
}

export const MetricsComponent = {
  controller: MetricsController,
  template
};
