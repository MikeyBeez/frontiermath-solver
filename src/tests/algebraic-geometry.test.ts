import { AlgebraicGeometryEngine } from '../engines/algebraic-geometry';

describe('AlgebraicGeometryEngine', () => {
  let engine: AlgebraicGeometryEngine;

  beforeEach(() => {
    engine = new AlgebraicGeometryEngine();
  });

  describe('parseFieldSpec', () => {
    it('should parse field specifications correctly', () => {
      const result1 = engine.parseFieldSpec('F_5^18');
      expect(result1.p).toBe(5);
      expect(result1.n).toBe(18);
      expect(result1.q).toBe(5**18);

      const result2 = engine.parseFieldSpec('F_2^8');
      expect(result2.p).toBe(2);
      expect(result2.n).toBe(8);
      expect(result2.q).toBe(256);
    });

    it('should throw error for invalid format', () => {
      expect(() => engine.parseFieldSpec('invalid')).toThrow();
      expect(() => engine.parseFieldSpec('F_5')).toThrow();
    });
  });

  describe('computeGenus', () => {
    it('should compute genus correctly', () => {
      expect(engine.computeGenus(1)).toBe(0); // Line
      expect(engine.computeGenus(2)).toBe(0); // Conic
      expect(engine.computeGenus(3)).toBe(1); // Elliptic curve
      expect(engine.computeGenus(4)).toBe(3); // Quartic curve
    });
  });

  describe('checkPointOnCurve', () => {
    it('should verify points on curve x³y + y³z + z³x = 0', () => {
      // Test some known points over F_5
      expect(engine.checkPointOnCurve(0, 0, 1, 5)).toBe(true); // [0:0:1]
      expect(engine.checkPointOnCurve(1, 0, 0, 5)).toBe(true); // [1:0:0]
      expect(engine.checkPointOnCurve(0, 1, 0, 5)).toBe(true); // [0:1:0]
      
      // Test a point not on the curve
      expect(engine.checkPointOnCurve(1, 1, 1, 5)).toBe(false);
    });
  });

  describe('countProjectivePointsSmallField', () => {
    it('should count projective points over F_5', () => {
      const count = engine.countProjectivePointsSmallField(5);
      expect(count).toBe(6); // Known result from analysis
    });
  });

  describe('analyzeSingularities', () => {
    it('should analyze curve singularities', () => {
      const result = engine.analyzeSingularities('x^3*y + y^3*z + z^3*x = 0');
      
      expect(result.singular).toBe(false);
      expect(result.singularPoints).toHaveLength(0);
      expect(result.genus).toBe(3);
    });
  });

  describe('solveCWA2', () => {
    it('should provide a solution for CWA2', async () => {
      const result = await engine.solveCWA2();
      
      expect(result.pointCount).toBe(156);
      expect(result.field).toBe('F_5^18');
      expect(result.method).toContain('Hasse-Weil');
      expect(result.confidence).toContain('Medium');
    });
  });
});
