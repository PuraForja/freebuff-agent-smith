// Manual mock for @octokit/rest (ESM-only v22+)
// Jest cannot transform this package, so we provide a manual mock.

class MockOctokit {
  constructor() {}

  get repos() {
    return {
      getContent: jest.fn().mockResolvedValue({ data: {} }),
      createFork: jest.fn().mockResolvedValue({ data: { owner: { login: 'mock' }, name: 'repo' } }),
    }
  }

  get git() {
    return {
      getRef: jest.fn().mockResolvedValue({ data: { object: { sha: 'abc123' } } }),
      createRef: jest.fn().mockResolvedValue({}),
    }
  }

  get pulls() {
    return {
      create: jest.fn().mockResolvedValue({ data: { number: 1, html_url: 'https://github.com/mock/repo/pull/1' } }),
    }
  }

  get issues() {
    return {
      addLabels: jest.fn().mockResolvedValue({}),
    }
  }

  get users() {
    return {
      getAuthenticated: jest.fn().mockResolvedValue({ data: { login: 'mock-user' } }),
    }
  }
}

module.exports = { Octokit: MockOctokit }
