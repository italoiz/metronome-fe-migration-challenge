import template from './top-bar.template.html?raw';

export class TopBarController {
  static $inject = [];

  constructor() {
    this.selectedMenu = '';
    this.lastUpdated = null;
    this.maintenanceMode = false;
    this.isLoading = false;
  }

  $onChanges(changes) {
    if (changes.selectedMenu && changes.selectedMenu.currentValue !== undefined) {
      this.selectedMenu = changes.selectedMenu.currentValue;
    }
    if (changes.lastUpdated) {
      this.lastUpdated = changes.lastUpdated.currentValue;
    }
    if (changes.maintenanceMode) {
      this.maintenanceMode = Boolean(changes.maintenanceMode.currentValue);
    }
    if (changes.isLoading) {
      this.isLoading = Boolean(changes.isLoading.currentValue);
    }
  }
}

export const TopBarComponent = {
  controller: TopBarController,
  template,
  bindings: {
    selectedMenu: '<',
    lastUpdated: '<',
    maintenanceMode: '<',
    isLoading: '<',
    onToggle: '&?'
  }
};
