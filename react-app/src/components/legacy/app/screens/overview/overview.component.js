import template from './overview.template.html?raw';
import { updateSummary } from '../../store';

export class OverviewController {
  static $inject = ['$ngRedux', '$scope'];

  constructor($ngRedux, $scope) {
    this.$ngRedux = $ngRedux;
    this.$scope = $scope;

    this.summary = '';
    this.lastUpdated = null;
    this.wins = 0;
    this.openIncidentCount = 0;
    this.disconnect = null;
  }

  $onInit() {
    this.disconnect = this.$ngRedux.connect((state) => ({
      summary: state.workspace.summary,
      lastUpdated: state.workspace.lastUpdated,
      wins: state.workspace.wins,
      openIncidentCount: state.workspace.openIncidentCount
    }))(this);

    this.$scope.$on('$destroy', () => this.$onDestroy());
  }

  $onDestroy() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleSummaryUpdate() {
    this.$ngRedux.dispatch(updateSummary(this.summary || ''));
  }
}

export const OverviewComponent = {
  controller: OverviewController,
  template
};
