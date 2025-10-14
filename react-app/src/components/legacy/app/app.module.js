import angular from 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-messages';
import '@uirouter/angularjs';
import ngRedux from 'ng-redux';

import './styles/global.css';

import { LayoutRootComponent } from './components/layout-root/layout-root.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { OverviewComponent } from './screens/overview/overview.component';
import { MetricsComponent } from './screens/metrics/metrics.component';
import { TeamComponent } from './screens/team/team.component';
import { SettingsComponent } from './screens/settings/settings.component';
import { ApiClient } from './services/api-client';
import { StateBootstrapService } from './services/state-bootstrap.service';
import { rootReducer } from './store';

let isStateInitialized = false;

angular
  .module('legacyApp', ['ngMaterial', 'ngMessages', 'ngAnimate', 'ngAria', 'ui.router', ngRedux])
  .component('layoutRoot', LayoutRootComponent)
  .component('sideMenu', SideMenuComponent)
  .component('topBar', TopBarComponent)
  .component('overviewScreen', OverviewComponent)
  .component('metricsScreen', MetricsComponent)
  .component('teamScreen', TeamComponent)
  .component('settingsScreen', SettingsComponent)
  .service('ApiClient', ApiClient)
  .service('StateBootstrapService', StateBootstrapService)
  .config([
    '$ngReduxProvider',
    '$mdThemingProvider',
    '$stateProvider',
    '$urlRouterProvider',
    ($ngReduxProvider, $mdThemingProvider, $stateProvider, $urlRouterProvider) => {
      $ngReduxProvider.createStoreWith(rootReducer, [], []);

      $mdThemingProvider
        .theme('default')
        .primaryPalette('indigo')
        .accentPalette('amber')
        .backgroundPalette('grey', { default: '50' });

      $stateProvider
        .state('overview', {
          url: '/overview',
          component: 'overviewScreen'
        })
        .state('metrics', {
          url: '/metrics',
          component: 'metricsScreen'
        })
        .state('team', {
          url: '/team',
          component: 'teamScreen'
        })
        .state('settings', {
          url: '/settings',
          component: 'settingsScreen'
        });

      // $urlRouterProvider.otherwise('/overview');
      $urlRouterProvider.deferIntercept();
    }
  ])
  .run([
    'StateBootstrapService',
    (stateBootstrap) => {
      if (!isStateInitialized) {
        console.log('[AngularJS] First bootstrap - loading initial state');
        stateBootstrap.init();
        isStateInitialized = true;
      } else {
        console.log('[AngularJS] Already initialized - state from React bridge');
      }
    }
  ]);
