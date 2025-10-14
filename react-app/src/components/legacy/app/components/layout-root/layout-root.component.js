import template from './layout-root.template.html?raw';
import { selectMenu } from '../../store';

export class LayoutRootController {
  static $inject = ['$ngRedux', '$scope', '$state', '$transitions'];

  constructor($ngRedux, $scope, $state, $transitions) {
    this.$ngRedux = $ngRedux;
    this.$scope = $scope;
    this.$state = $state;
    this.$transitions = $transitions;

    this.menuItems = [];
    this.selectedMenu = 'overview';
    this.lastUpdated = null;
    this.maintenanceMode = false;
    this.isLoading = false;
    this.disconnect = null;
    this.deregisterTransition = null;
  }

  $onInit() {
    this.disconnect = this.$ngRedux.connect((state) => ({
      menuItems: state.navigation.menuItems,
      selectedMenu: state.navigation.selectedMenu,
      lastUpdated: state.workspace.lastUpdated,
      maintenanceMode: state.workspace.maintenanceMode,
      isLoading: state.status.isLoading
    }))(this);

    this.$scope.$on('$destroy', () => this.$onDestroy());

    const initial = this.$state.current?.name;
    if (initial) {
      this.$ngRedux.dispatch(selectMenu(initial));
    }

    this.deregisterTransition = this.$transitions.onSuccess({}, (transition) => {
      const targetState = transition.to()?.name;
      if (targetState) {
        this.$ngRedux.dispatch(selectMenu(targetState));
      }
    });
  }

  $onDestroy() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
    if (this.deregisterTransition) {
      this.deregisterTransition();
      this.deregisterTransition = null;
    }
  }

  handleMenuSelect(menuKey) {
    if (!menuKey || menuKey === this.$state.current?.name) {
      return;
    }
    this.$state.go(menuKey);
  }
}

export const LayoutRootComponent = {
  controller: LayoutRootController,
  template
};
