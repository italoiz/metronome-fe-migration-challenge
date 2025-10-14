import template from './team.template.html?raw';
import { addBlocker, updateTeamMood } from '../../store';

export class TeamController {
  static $inject = ['$ngRedux', '$scope'];

  constructor($ngRedux, $scope) {
    this.$ngRedux = $ngRedux;
    this.$scope = $scope;

    this.teamMood = 'neutral';
    this.blockers = [];
    this.newBlocker = '';
    this.disconnect = null;
  }

  $onInit() {
    this.disconnect = this.$ngRedux.connect((state) => ({
      teamMood: state.workspace.teamMood,
      blockers: state.workspace.blockers
    }))(this);

    this.$scope.$on('$destroy', () => this.$onDestroy());
  }

  $onDestroy() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleMoodChange() {
    this.$ngRedux.dispatch(updateTeamMood(this.teamMood));
  }

  handleAddBlocker() {
    if (!this.newBlocker || !this.newBlocker.trim()) {
      return;
    }

  this.$ngRedux.dispatch(addBlocker(this.newBlocker.trim()));
    this.newBlocker = '';
  }
}

export const TeamComponent = {
  controller: TeamController,
  template
};
