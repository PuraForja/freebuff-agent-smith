/**
 * Tests for Auto Ingest (Fase 6)
 */
import {
  InMemoryAutoIngestStore,
  extractPatternsFromReadme,
  validateReferenceRepo,
  generateIngestReport,
  DEFAULT_REFERENCE_REPOS,
  DEFAULT_AUTO_INGEST_CONFIG,
  getAutoIngestConfig,
  updateAutoIngestConfig,
} from '../.agents/types/auto-ingest';
import type { ReferenceRepo, IngestResult } from '../.agents/types/auto-ingest';

const MOCK_REPO: ReferenceRepo = {
  name: 'TestRepo',
  url: 'https://github.com/test/repo',
  owner: 'test',
  repo: 'repo',
  stars: 1500,
  expectedCategories: ['workflow', 'quality'],
  tags: ['agents', 'test'],
};

describe('Auto Ingest', () => {
  describe('extractPatternsFromReadme', () => {
    test('should extract patterns from README with headers', () => {
      const readme = `# Test Repo

## Planning Pattern

Before executing any task, create a structured plan. The plan should be reviewed and approved.

### Steps

1. Analyze the requirement
2. Create a plan
3. Get approval
4. Execute the plan
5. Review results

## Research Pattern

Always research before creating new code. Check if similar solutions exist.

- Search existing codebase
- Check GitHub for similar projects
- Evaluate options
- Make informed decision
`;

      const patterns = extractPatternsFromReadme(readme, MOCK_REPO, 10);
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.length).toBeLessThanOrEqual(10);

      // First pattern should be about Planning
      const planning = patterns.find(p => p.title.includes('Planning'));
      expect(planning).toBeDefined();
      expect(planning!.origin).toBe('TestRepo');
      expect(planning!.quality).toBeGreaterThan(0);
      expect(planning!.categories.length).toBeGreaterThan(0);
    });

    test('should skip short sections', () => {
      const readme = `# Repo

## Short

Too short.

## Substantial Pattern

This is a much longer description that should be extracted as a pattern because it has enough content to be meaningful and provide value to the library.`;

      const patterns = extractPatternsFromReadme(readme, MOCK_REPO, 10);
      expect(patterns.length).toBe(1);
    });

    test('should respect maxPatterns limit', () => {
      const readme = `# Repo

## Pattern 1

Description one with enough content to pass the minimum length filter for extraction.

## Pattern 2

Description two with enough content to pass the minimum length filter for extraction.

## Pattern 3

Description three with enough content to pass the minimum length filter for extraction.`;

      const patterns = extractPatternsFromReadme(readme, MOCK_REPO, 2);
      expect(patterns.length).toBeLessThanOrEqual(2);
    });

    test('should handle README with no extractable patterns', () => {
      const readme = '# Repo\n\nJust a title with no content.';
      const patterns = extractPatternsFromReadme(readme, MOCK_REPO, 10);
      expect(patterns).toHaveLength(0);
    });

    test('should extract tags from content', () => {
      const readme = `# Repo

## Testing Pattern

This pattern involves testing and verification of all components before deployment.`;

      const patterns = extractPatternsFromReadme(readme, MOCK_REPO, 10);
      if (patterns.length > 0) {
        expect(patterns[0].tags).toContain('test');
      }
    });
  });

  describe('validateReferenceRepo', () => {
    test('should validate a correct repo', () => {
      const result = validateReferenceRepo(MOCK_REPO);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    test('should reject repo without name', () => {
      const result = validateReferenceRepo({ ...MOCK_REPO, name: '' });
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Name is required');
    });

    test('should reject repo with invalid URL', () => {
      const result = validateReferenceRepo({ ...MOCK_REPO, url: 'not-a-url' });
      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.includes('URL'))).toBe(true);
    });

    test('should reject repo without owner', () => {
      const result = validateReferenceRepo({ ...MOCK_REPO, owner: '' });
      expect(result.valid).toBe(false);
    });

    test('should reject repo without expected categories', () => {
      const result = validateReferenceRepo({ ...MOCK_REPO, expectedCategories: [] });
      expect(result.valid).toBe(false);
    });

    test('should reject repo without repo name', () => {
      const result = validateReferenceRepo({ ...MOCK_REPO, repo: '' });
      expect(result.valid).toBe(false);
    });
  });

  describe('InMemoryAutoIngestStore', () => {
    let store: InMemoryAutoIngestStore;

    beforeEach(() => {
      store = new InMemoryAutoIngestStore();
    });

    test('should have default config', () => {
      const config = store.getConfig();
      expect(config.referenceRepos.length).toBe(DEFAULT_REFERENCE_REPOS.length);
      expect(config.scanIntervalMs).toBe(24 * 60 * 60 * 1000);
      expect(config.maxPatternsPerRepo).toBe(10);
      expect(config.minQualityThreshold).toBe(0.7);
    });

    test('should update config', () => {
      store.updateConfig({ maxPatternsPerRepo: 5 });
      expect(store.getConfig().maxPatternsPerRepo).toBe(5);
    });

    test('should track history', () => {
      const result: IngestResult = {
        repo: MOCK_REPO,
        patternsExtracted: [],
        errors: [],
        durationMs: 100,
        scannedAt: new Date().toISOString(),
      };
      store.addResult(result);
      expect(store.getHistory()).toHaveLength(1);
    });

    test('should trim history', () => {
      for (let i = 0; i < 5; i++) {
        store.addResult({
          repo: MOCK_REPO,
          patternsExtracted: [],
          errors: [],
          durationMs: 100,
          scannedAt: new Date().toISOString(),
        });
      }
      store.trimHistory(3);
      expect(store.getHistory()).toHaveLength(3);
    });
  });

  describe('generateIngestReport', () => {
    test('should generate report from results', () => {
      const results: IngestResult[] = [
        {
          repo: MOCK_REPO,
          patternsExtracted: [{} as any, {} as any],
          errors: [],
          durationMs: 1500,
          scannedAt: new Date().toISOString(),
        },
      ];
      const report = generateIngestReport(results);
      expect(report).toContain('Auto-Ingest Report');
      expect(report).toContain('TestRepo');
      expect(report).toContain('2');
    });

    test('should include errors section when errors exist', () => {
      const results: IngestResult[] = [
        {
          repo: MOCK_REPO,
          patternsExtracted: [],
          errors: ['Failed to fetch README'],
          durationMs: 500,
          scannedAt: new Date().toISOString(),
        },
      ];
      const report = generateIngestReport(results);
      expect(report).toContain('Errors');
      expect(report).toContain('Failed to fetch README');
    });
  });

  describe('DEFAULT_REFERENCE_REPOS', () => {
    test('should have 5 default repos', () => {
      expect(DEFAULT_REFERENCE_REPOS).toHaveLength(5);
    });

    test('each repo should have required fields', () => {
      for (const repo of DEFAULT_REFERENCE_REPOS) {
        expect(repo.name).toBeTruthy();
        expect(repo.url).toContain('https://github.com/');
        expect(repo.owner).toBeTruthy();
        expect(repo.repo).toBeTruthy();
        expect(repo.expectedCategories.length).toBeGreaterThan(0);
        expect(repo.tags.length).toBeGreaterThan(0);
      }
    });
  });

  describe('convenience functions', () => {
    test('getAutoIngestConfig should return config', () => {
      const config = getAutoIngestConfig();
      expect(config).toBeDefined();
      expect(config.scanIntervalMs).toBeGreaterThan(0);
    });

    test('updateAutoIngestConfig should update', () => {
      updateAutoIngestConfig({ maxPatternsPerRepo: 3 });
      expect(getAutoIngestConfig().maxPatternsPerRepo).toBe(3);
    });
  });
});
