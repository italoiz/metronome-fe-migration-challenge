import {
  loadDataFailure,
  loadDataRequest,
  loadDataSuccess
} from '../store';

export class StateBootstrapService {
  static $inject = ['$ngRedux', 'ApiClient'];

  constructor($ngRedux, apiClient) {
    this.$ngRedux = $ngRedux;
    this.apiClient = apiClient;
  }

  init() {
    this.$ngRedux.dispatch(loadDataRequest());

    this.apiClient
      .fetchWorkspaceSnapshot()
      .then((payload) => {
        this.$ngRedux.dispatch(loadDataSuccess(payload));
      })
      .catch((error) => {
        const message = error?.message || 'Unable to load workspace';
        this.$ngRedux.dispatch(loadDataFailure(message));
      });
  }
}
