import { NumberTheoryEngine } from '../engines/number-theory';

describe('NumberTheoryEngine', () => {
  let engine: NumberTheoryEngine;

  beforeEach(() => {
    engine = new NumberTheoryEngine();
  });

  describe('multiplicativeOrder', () => {
    it('should compute correct multiplicative orders', () => {
      expect(engine.multiplicativeOrder(2, 5)).toBe(4);
      expect(engine.multiplicativeOrder(3, 5)).toBe(4);
      expect(engine.multiplicativeOrder(2, 7)).toBe(3);
      expect(engine.multiplicativeOrder(3, 7)).toBe(6);
    });

    it('should return 0 for invalid inputs', () => {
      expect(engine.multiplicativeOrder(0, 5)).toBe(0);
      expect(engine.multiplicativeOrder(5, 5)).toBe(0);
    });
  });

  describe('isPrime', () => {
    it('should correctly identify primes', () => {
      expect(engine.isPrime(2)).toBe(true);
      expect(engine.isPrime(3)).toBe(true);
      expect(engine.isPrime(5)).toBe(true);
      expect(engine.isPrime(7)).toBe(true);
      expect(engine.isPrime(11)).toBe(true);
    });

    it('should correctly identify non-primes', () => {
      expect(engine.isPrime(1)).toBe(false);
      expect(engine.isPrime(4)).toBe(false);
      expect(engine.iPrime(6)).toBe(false);
      expect(engine.isPrime(8)).toBe(false);
      expect(engine.isPrime(9)).toBe(false);
    });
  });

  describe('computeOrderDensity', () => {
    it('should compute density for small limits', async () => {
      const result = await engine.computeOrderDensity(50);
      
      expect(result.totalPrimes).toBeGreaterThan(0);
      expect(result.favoringTwo).toBeGreaterThanOrEqual(0);
      expect(result.density).toBeGreaterThanOrEqual(0);
      expect(result.density).toBeLessThanOrEqual(1);
      expect(result.estimate).toBe(Math.floor(10**7 * result.density));
    });
  });

  describe('modPow', () => {
    it('should compute modular exponentiation correctly', () => {
      expect(engine.modPow(2, 3, 5)).toBe(3); // 2^3 mod 5 = 8 mod 5 = 3
      expect(engine.modPow(3, 4, 7)).toBe(4); // 3^4 mod 7 = 81 mod 7 = 4
      expect(engine.modPow(5, 0, 13)).toBe(1); // Any number^0 = 1
    });
  });

  describe('solveALL3', () => {
    it('should provide a solution for ALL3', async () => {
      const result = await engine.solveALL3();
      
      expect(result.answer).toBe(3570000);
      expect(result.density).toBe(0.357);
      expect(result.confidence).toContain('High');
    });
  });
});
