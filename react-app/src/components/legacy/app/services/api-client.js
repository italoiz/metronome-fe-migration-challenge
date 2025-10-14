import mockData from './mock-data.json';

export class ApiClient {
  static $inject = ['$timeout'];

  constructor($timeout) {
    this.$timeout = $timeout;
  }

  fetchWorkspaceSnapshot() {
    return new Promise((resolve) => {
      this.$timeout(
        () => {
          const clone = JSON.parse(JSON.stringify(mockData));
          resolve(clone);
        },
        650,
        false
      );
    });
  }
}
