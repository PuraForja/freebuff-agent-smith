/**
 * Tests for Pattern Library (Fase 6)
 */
import {
  InMemoryPatternStore,
  searchPatterns,
  getPattern,
  listPatterns,
  addPattern,
  updatePattern,
  removePattern,
  countPatterns,
} from '../.agents/types/pattern-library';
import type { Pattern, PatternCategory } from '../.agents/types/pattern-library';

function createTestPattern(overrides?: Partial<Pattern>): Omit<Pattern, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: 'Test Pattern',
    description: 'A test pattern for unit testing',
    concept: 'testing',
    origin: 'test',
    quality: 0.85,
    tags: ['test', 'unit'],
    categories: ['quality'],
    pattern: 'create → test → verify',
    applicableTo: ['any-language'],
    ...overrides,
  };
}

describe('Pattern Library', () => {
  describe('InMemoryPatternStore', () => {
    let store: InMemoryPatternStore;

    beforeEach(() => {
      store = new InMemoryPatternStore();
    });

    test('should start empty', () => {
      expect(store.count()).toBe(0);
      expect(store.listPatterns()).toHaveLength(0);
    });

    test('should add pattern and auto-generate ID', () => {
      const pattern = store.addPattern(createTestPattern({ title: 'My Pattern' }));
      expect(pattern.id).toMatch(/^smith-pattern-\d+$/);
      expect(pattern.title).toBe('My Pattern');
      expect(pattern.createdAt).toBeTruthy();
      expect(pattern.updatedAt).toBe(pattern.createdAt);
    });

    test('should get pattern by ID', () => {
      const added = store.addPattern(createTestPattern());
      const found = store.getPattern(added.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(added.id);
    });

    test('should return undefined for non-existent ID', () => {
      expect(store.getPattern('non-existent')).toBeUndefined();
    });

    test('should update pattern' , () => {
      jest.useFakeTimers()
      try {
        const added = store.addPattern(createTestPattern());
        jest.advanceTimersByTime(1)
        const updated = store.updatePattern(added.id, { title: 'Updated Title' , quality: 0.95 });
        expect(updated).toBeDefined();
        expect(updated!.title).toBe('Updated Title' );
        expect(updated!.quality).toBe(0.95);
        expect(updated!.updatedAt).not.toBe(added.createdAt);
      } finally {
        jest.useRealTimers();
      }
    });

    test('should return undefined when updating non-existent pattern', () => {
      expect(store.updatePattern('non-existent', { title: 'x' })).toBeUndefined();
    });

    test('should remove pattern', () => {
      const added = store.addPattern(createTestPattern());
      expect(store.removePattern(added.id)).toBe(true);
      expect(store.getPattern(added.id)).toBeUndefined();
    });

    test('should return false when removing non-existent pattern', () => {
      expect(store.removePattern('non-existent')).toBe(false);
    });
  });

  describe('listPatterns', () => {
    let store: InMemoryPatternStore;

    beforeEach(() => {
      store = new InMemoryPatternStore();
      store.addPattern(createTestPattern({ title: 'Alpha', quality: 0.9, categories: ['workflow'] }));
      store.addPattern(createTestPattern({ title: 'Beta', quality: 0.7, categories: ['security'] }));
      store.addPattern(createTestPattern({ title: 'Gamma', quality: 0.95, categories: ['workflow', 'security'] }));
    });

    test('should list all patterns', () => {
      expect(store.listPatterns()).toHaveLength(3);
    });

    test('should filter by category', () => {
      const workflow = store.listPatterns({ category: 'workflow' });
      expect(workflow).toHaveLength(2);
    });

    test('should filter by minQuality', () => {
      const high = store.listPatterns({ minQuality: 0.8 });
      expect(high).toHaveLength(2);
    });

    test('should sort by quality desc', () => {
      const sorted = store.listPatterns({ sortBy: 'quality', sortOrder: 'desc' });
      expect(sorted[0].quality).toBe(0.95);
      expect(sorted[2].quality).toBe(0.7);
    });

    test('should sort by title asc', () => {
      const sorted = store.listPatterns({ sortBy: 'title', sortOrder: 'asc' });
      expect(sorted[0].title).toBe('Alpha');
      expect(sorted[2].title).toBe('Gamma');
    });

    test('should apply limit', () => {
      const limited = store.listPatterns({ limit: 2 });
      expect(limited).toHaveLength(2);
    });
  });

  describe('searchPatterns', () => {
    let store: InMemoryPatternStore;

    beforeEach(() => {
      store = new InMemoryPatternStore();
      store.addPattern(createTestPattern({
        title: 'Planner Before Execute',
        concept: 'planning before execution',
        tags: ['planning', 'workflow'],
        quality: 0.92,
      }));
      store.addPattern(createTestPattern({
        title: 'Research First',
        concept: 'research before creation',
        tags: ['research', 'discovery'],
        quality: 0.88,
      }));
      store.addPattern(createTestPattern({
        title: 'Self Review',
        concept: 'self review before delivery',
        tags: ['review', 'quality'],
        quality: 0.90,
      }));
    });

    test('should find patterns by title', () => {
      const result = store.searchPatterns('planner');
      expect(result.total).toBeGreaterThan(0);
      expect(result.patterns[0].title).toBe('Planner Before Execute');
    });

    test('should find patterns by tag', () => {
      const result = store.searchPatterns('review');
      expect(result.total).toBeGreaterThan(0);
    });

    test('should respect minQuality filter', () => {
      const result = store.searchPatterns('planner', { minQuality: 0.95 });
      expect(result.total).toBe(0);
    });

    test('should respect limit', () => {
      const result = store.searchPatterns('e', { limit: 1 });
      expect(result.patterns).toHaveLength(1);
    });

    test('should return searchTimeMs', () => {
      const result = store.searchPatterns('test');
      expect(result.searchTimeMs).toBeGreaterThanOrEqual(0);
    });

    test('should return empty for no match', () => {
      const result = store.searchPatterns('xyznonexistent');
      expect(result.total).toBe(0);
      expect(result.patterns).toHaveLength(0);
    });

    test('should match multi-word queries', () => {
      const result = store.searchPatterns('planner before');
      expect(result.total).toBe(1);
    });
  });

  describe('convenience functions', () => {
    test('addPattern and countPatterns should work', () => {
      const before = countPatterns();
      addPattern(createTestPattern({ title: 'Convenience Test' }));
      expect(countPatterns()).toBe(before + 1);
    });

    test('getPattern should find added pattern', () => {
      const added = addPattern(createTestPattern({ title: 'Findable' }));
      const found = getPattern(added.id);
      expect(found).toBeDefined();
      expect(found!.title).toBe('Findable');
    });

    test('listPatterns should return patterns', () => {
      const patterns = listPatterns({ limit: 100 });
      expect(Array.isArray(patterns)).toBe(true);
    });
  });
});
