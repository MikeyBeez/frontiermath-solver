import { RepresentationTheoryEngine } from '../engines/representation-theory';

describe('RepresentationTheoryEngine', () => {
  let engine: RepresentationTheoryEngine;

  beforeEach(() => {
    engine = new RepresentationTheoryEngine();
  });

  describe('analyzeCoxeterGroup', () => {
    it('should analyze Coxeter groups', async () => {
      const result = await engine.analyzeCoxeterGroup(1000);
      
      expect(result.groupType).toContain('A_3');
      expect(result.order).toBeGreaterThan(0);
      expect(result.irreps).toBeGreaterThan(0);
      expect(result.conjugacyClasses).toBeGreaterThan(0);
    });
  });

  describe('solveRAP1', () => {
    it('should provide a solution for RAP1', async () => {
      const result = await engine.solveRAP1();
      
      expect(result.orbits).toBe(32);
      expect(result.groupStructure).toContain('Coxeter-type');
      expect(result.method).toContain('Eigenspace analysis');
      expect(result.confidence).toContain('Medium-High');
    });
  });

  describe('countConjugacyClasses', () => {
    it('should count conjugacy classes correctly', () => {
      const result = engine.countConjugacyClasses(24, 1000);
      expect(result).toBe(32);
    });
  });

  describe('analyzeEigenspaceIntersections', () => {
    it('should analyze eigenspace intersections', () => {
      const result = engine.analyzeEigenspaceIntersections(1000);
      
      expect(result.constraints).toBe(4);
      expect(result.freeParameters).toBe(996);
    });
  });

  describe('generateEigenspaceConfigurations', () => {
    it('should generate valid configurations', () => {
      const configs = engine.generateEigenspaceConfigurations(4, 100);
      
      expect(configs.length).toBeGreaterThan(0);
      expect(configs.every(config => config.valid)).toBe(true);
      expect(configs.every(config => config.dimensions.length === 4)).toBe(true);
    });
  });
});
