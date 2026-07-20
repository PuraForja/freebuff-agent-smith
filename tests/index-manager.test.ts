/**
 * Tests for Index Manager (Fase 6)
 */
import {
  InMemoryIndexManagerStore,
  createEmptyIndex,
  rebuildIndex,
  validateIndex,
  createInitialPatterns,
  generateValidationReport,
  rebuildKnowledgeIndex,
  validateKnowledgeIndex,
  getCurrentIndex,
} from '../.agents/types/index-manager';
import type { KnowledgeIndex, Pattern } from '../.agents/types/index-manager';

function createTestPattern(id: string, title: string, categories: string[], quality = 0.85): Pattern {
  return {
    id,
    title,
    description: `Description for ${title}`,
    concept: title.toLowerCase(),
    origin: 'test',
    quality,
    tags: ['test'],
    categories: categories as any,
    pattern: 'step 1 → step 2',
    applicableTo: ['any-language'],
    createdAt: '2026-07-19T00:00:00.000Z',
    updatedAt: '2026-07-19T00:00:00.000Z',
  };
}

describe('Index Manager', () => {
  describe('createEmptyIndex', () => {
    test('should create empty index with correct defaults', () => {
      const index = createEmptyIndex();
      expect(index.version).toBe('1.0.0');
      expect(index.totalArtifacts).toBe(0);
      expect(Object.keys(index.categories)).toHaveLength(0);
      expect(Object.keys(index.searchTerms)).toHaveLength(0);
    });
  });

  describe('rebuildIndex', () => {
    test('should rebuild index from patterns', () => {
      const patterns = [
        createTestPattern('p1', 'Pattern One', ['workflow']),
        createTestPattern('p2', 'Pattern Two', ['security', 'quality']),
        createTestPattern('p3', 'Pattern Three', ['workflow']),
      ];

      const index = rebuildIndex(patterns);
      expect(index.totalArtifacts).toBe(3);
      expect(index.categories['workflow']).toBeDefined();
      expect(index.categories['workflow'].count).toBe(2);
      expect(index.categories['security']).toBeDefined();
      expect(index.categories['security'].count).toBe(1);
    });

    test('should populate searchTerms', () => {
      const patterns = [
        createTestPattern('p1', 'Planner Before Execute', ['workflow']),
      ];
      const index = rebuildIndex(patterns);
      expect(Object.keys(index.searchTerms).length).toBeGreaterThan(0);
    });

    test('should handle empty patterns', () => {
      const index = rebuildIndex([]);
      expect(index.totalArtifacts).toBe(0);
      expect(Object.keys(index.categories)).toHaveLength(0);
    });

    test('should set updatedAt', () => {
      const before = new Date().toISOString();
      const index = rebuildIndex([createTestPattern('p1', 'Test', ['workflow'])]);
      expect(index.updatedAt >= before).toBe(true);
    });
  });

  describe('validateIndex', () => {
    test('should validate a correct index', () => {
      const patterns = [
        createTestPattern('p1', 'Pattern One', ['workflow']),
      ];
      const index = rebuildIndex(patterns);
      const result = validateIndex(index, ['patterns/p1.json']);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect missing files', () => {
      const patterns = [
        createTestPattern('p1', 'Pattern One', ['workflow']),
      ];
      const index = rebuildIndex(patterns);
      const result = validateIndex(index, []);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.type === 'missing_file')).toBe(true);
    });

    test('should detect duplicate IDs', () => {
      const index = createEmptyIndex();
      index.totalArtifacts = 2;
      index.categories['workflow'] = {
        label: 'Workflow',
        count: 2,
        artifacts: [
          { id: 'dup', title: 'A', path: 'a.json', type: 'pattern', quality: 0.8, tags: [] },
          { id: 'dup', title: 'B', path: 'b.json', type: 'pattern', quality: 0.9, tags: [] },
        ],
      };
      const result = validateIndex(index, []);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.type === 'duplicate_id')).toBe(true);
    });

    test('should detect quality out of range', () => {
      const index = createEmptyIndex();
      index.totalArtifacts = 1;
      index.categories['workflow'] = {
        label: 'Workflow',
        count: 1,
        artifacts: [
          { id: 'p1', title: 'A', path: 'a.json', type: 'pattern', quality: 1.5, tags: [] },
        ],
      };
      const result = validateIndex(index, []);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.type === 'quality_out_of_range')).toBe(true);
    });

    test('should detect unindexed files', () => {
      const index = createEmptyIndex();
      index.totalArtifacts = 0;
      const result = validateIndex(index, ['patterns/new-pattern.json']);
      expect(result.unindexedFiles).toContain('patterns/new-pattern.json');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should warn about totalArtifacts mismatch', () => {
      const index = createEmptyIndex();
      index.totalArtifacts = 5;
      index.categories['workflow'] = {
        label: 'Workflow',
        count: 2,
        artifacts: [
          { id: 'p1', title: 'A', path: 'a.json', type: 'pattern', quality: 0.8, tags: [] },
          { id: 'p2', title: 'B', path: 'b.json', type: 'pattern', quality: 0.9, tags: [] },
        ],
      };
      const result = validateIndex(index, ['a.json', 'b.json']);
      expect(result.warnings.some(w => w.includes('totalArtifacts'))).toBe(true);
    });
  });

  describe('createInitialPatterns', () => {
    test('should return 8 initial patterns', () => {
      const patterns = createInitialPatterns();
      expect(patterns).toHaveLength(8);
    });

    test('each pattern should have required fields', () => {
      const patterns = createInitialPatterns();
      for (const p of patterns) {
        expect(p.title).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.concept).toBeTruthy();
        expect(p.origin).toBeTruthy();
        expect(p.quality).toBeGreaterThan(0);
        expect(p.quality).toBeLessThanOrEqual(1);
        expect(p.tags.length).toBeGreaterThan(0);
        expect(p.categories.length).toBeGreaterThan(0);
      }
    });

    test('should include known patterns', () => {
      const patterns = createInitialPatterns();
      const titles = patterns.map(p => p.title);
      expect(titles).toContain('Planner Before Execute');
      expect(titles).toContain('Research First');
      expect(titles).toContain('Grounding First');
      expect(titles).toContain('Read Only Source');
      expect(titles).toContain('Lineage Tracking');
    });
  });

  describe('generateValidationReport', () => {
    test('should generate valid report', () => {
      const report = generateValidationReport({
        valid: true,
        errors: [],
        warnings: [],
        orphanEntries: [],
        unindexedFiles: [],
      });
      expect(report).toContain('Valid');
      expect(report).toContain('0');
    });

    test('should include errors in report', () => {
      const report = generateValidationReport({
        valid: false,
        errors: [{ type: 'missing_file', message: 'File not found', path: 'x.json' }],
        warnings: [],
        orphanEntries: [],
        unindexedFiles: [],
      });
      expect(report).toContain('Invalid');
      expect(report).toContain('File not found');
    });

    test('should include warnings in report', () => {
      const report = generateValidationReport({
        valid: true,
        errors: [],
        warnings: ['Something looks off'],
        orphanEntries: [],
        unindexedFiles: [],
      });
      expect(report).toContain('Something looks off');
    });
  });

  describe('InMemoryIndexManagerStore', () => {
    let store: InMemoryIndexManagerStore;

    beforeEach(() => {
      store = new InMemoryIndexManagerStore();
    });

    test('should start with empty index', () => {
      const index = store.getIndex();
      expect(index.totalArtifacts).toBe(0);
    });

    test('should save and retrieve index', () => {
      const index = createEmptyIndex();
      index.totalArtifacts = 5;
      store.saveIndex(index);
      expect(store.getIndex().totalArtifacts).toBe(5);
    });

    test('should list knowledge files', () => {
      store.addMockFile('patterns/p1.json');
      store.addMockFile('patterns/p2.json');
      expect(store.listKnowledgeFiles()).toHaveLength(2);
    });

    test('should check file existence', () => {
      store.addMockFile('patterns/p1.json');
      expect(store.fileExists('patterns/p1.json')).toBe(true);
      expect(store.fileExists('patterns/missing.json')).toBe(false);
    });
  });

  describe('convenience functions', () => {
    test('rebuildKnowledgeIndex should work', () => {
      const patterns = [createTestPattern('p1', 'Test', ['workflow'])];
      const index = rebuildKnowledgeIndex(patterns);
      expect(index.totalArtifacts).toBe(1);
    });

    test('getCurrentIndex should return current index', () => {
      const index = getCurrentIndex();
      expect(index).toBeDefined();
    });

    test('validateKnowledgeIndex should work', () => {
      const result = validateKnowledgeIndex(createEmptyIndex());
      expect(result).toBeDefined();
      expect(typeof result.valid).toBe('boolean');
    });
  });
});
