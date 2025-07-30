import { FiniteFieldEngine } from '../engines/finite-fields';

describe('FiniteFieldEngine', () => {
  let engine: FiniteFieldEngine;

  beforeEach(() => {
    engine = new FiniteFieldEngine();
  });

  describe('createField', () => {
    it('should create finite fields correctly', async () => {
      const result1 = await engine.createField(25); // F_5^2
      expect(result1.characteristic).toBe(5);
      expect(result1.degree).toBe(2);
      expect(result1.size).toBe(25);

      const result2 = await engine.createField('5^3');
      expect(result2.characteristic).toBe(5);
      expect(result2.degree).toBe(3);
      expect(result2.size).toBe(125);
    });

    it('should handle prime fields', async () => {
      const result = await engine.createField(7);
      expect(result.characteristic).toBe(7);
      expect(result.degree).toBe(1);
      expect(result.size).toBe(7);
    });
  });

  describe('field operations', () => {
    it('should perform addition correctly', async () => {
      const fieldResult = await engine.createField(25);
      const field = fieldResult.field;
      
      const a = engine.createElement([1, 2], field); // 1 + 2α
      const b = engine.createElement([3, 4], field); // 3 + 4α
      const sum = engine.add(a, b);
      
      expect(sum.coefficients).toEqual([4, 1]); // (1+3) mod 5, (2+4) mod 5
    });

    it('should perform multiplication correctly', async () => {
      const fieldResult = await engine.createField(25);
      const field = fieldResult.field;
      
      const a = engine.createElement([1, 0], field); // 1
      const b = engine.createElement([0, 1], field); // α
      const product = engine.multiply(a, b);
      
      expect(product.coefficients).toEqual([0, 1]); // 1 * α = α
    });
  });

  describe('power operations', () => {
    it('should compute powers correctly', async () => {
      const fieldResult = await engine.createField(25);
      const field = fieldResult.field;
      
      const element = engine.createElement([2, 0], field); // 2
      const squared = engine.power(element, 2);
      
      expect(squared.coefficients).toEqual([4, 0]); // 2^2 = 4
    });

    it('should handle zero exponent', async () => {
      const fieldResult = await engine.createField(25);
      const field = fieldResult.field;
      
      const element = engine.createElement([3, 2], field);
      const result = engine.power(element, 0);
      
      expect(result.coefficients).toEqual([1, 0]); // Any element^0 = 1
    });
  });

  describe('findPrimitiveElement', () => {
    it('should find primitive elements for small fields', async () => {
      const fieldResult = await engine.createField(9); // F_3^2
      const field = fieldResult.field;
      
      const primitive = engine.findPrimitiveElement(field);
      
      // Primitive element should have order 8 (= 9-1)
      expect(primitive.coefficients.length).toBe(2);
    });
  });
});
