import template from './side-menu.template.html?raw';

export class SideMenuController {
  static $inject = [];

  constructor() {
    this.items = [];
    this.selected = null;
    this.onSelect = null;
  }

  $onChanges(changes) {
    if (changes.items) {
      this.items = changes.items.currentValue || [];
    }
    if (changes.selected) {
      this.selected = changes.selected.currentValue;
    }
    if (changes.onSelect) {
      this.onSelect = changes.onSelect.currentValue;
    }
  }

  handleSelect(menu) {
    if (this.onSelect) {
      this.onSelect({ menuKey: menu });
    }
  }
}

export const SideMenuComponent = {
  controller: SideMenuController,
  template,
  bindings: {
    items: '<',
    selected: '<',
    onSelect: '&'
  }
};
