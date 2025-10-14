import { mockWorkspaceData } from './mock-data';
import type { MockWorkspaceData } from './mock-data';

/**
 * API client to simulate calls to the legacy backend
 */
export class ApiClient {
  /**
   * Simulates fetching workspace data with an artificial delay
   * @param delay Delay in ms (default: 650ms to simulate network)
   */
  static async fetchWorkspaceSnapshot(delay: number = 650): Promise<MockWorkspaceData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Shallow clone to simulate an API response payload
        const data = {
          ...mockWorkspaceData,
          lastUpdated: new Date().toISOString()
        };
        resolve(data);
      }, delay);
    });
  }
}

