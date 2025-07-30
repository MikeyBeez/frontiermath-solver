import chalk from 'chalk';
import bigInt from 'big-integer';

interface FiniteFieldElement {
  coefficients: number[];
  field: FiniteField;
}

class FiniteField {
  constructor(
    public p: number,
    public n: number,
    public irreduciblePoly: number[]
  ) {}

  get size(): number {
    return this.p ** this.n;
  }
}

export class FiniteFieldEngine {
  
  /**
   * Create finite field F_q where q = p^n
   */
  async createField(q: number | string): Promise<{
    field: FiniteField;
    size: number;
    characteristic: number;
    degree: number;
  }> {
    let p: number, n: number;
    
    if (typeof q === 'string') {
      // Parse "p^n" format
      const match = q.match(/(\d+)\^(\d+)/);
      if (!match) throw new Error('Invalid field specification');
      p = parseInt(match[1]);
      n = parseInt(match[2]);
    } else {
      // Factor q to find p^n representation
      [p, n] = this.factorPrimePower(q);
    }
    
    console.log(chalk.cyan(`Creating finite field F_${p}^${n}`));
    
    if (!this.isPrime(p)) {
      throw new Error(`${p} is not prime`);
    }
    
    const irreduciblePoly = this.findIrreduciblePolynomial(p, n);
    const field = new FiniteField(p, n, irreduciblePoly);
    
    return {
      field,
      size: p ** n,
      characteristic: p,
      degree: n
    };
  }

  /**
   * Factor number into p^n form
   */
  private factorPrimePower(q: number): [number, number] {
    // Find the prime factorization
    for (let p = 2; p * p <= q; p++) {
      if (q % p === 0) {
        let n = 0;
        let temp = q;
        while (temp % p === 0) {
          temp /= p;
          n++;
        }
        if (temp === 1) return [p, n];
      }
    }
    return [q, 1]; // q is prime
  }

  /**
   * Check if number is prime
   */
  private isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  /**
   * Find irreducible polynomial of degree n over F_p
   */
  private findIrreduciblePolynomial(p: number, n: number): number[] {
    // Known irreducible polynomials for small cases
    const knownPolys: { [key: string]: number[] } = {
      '2,2': [1, 1, 1], // x^2 + x + 1
      '2,3': [1, 1, 0, 1], // x^3 + x + 1
      '2,4': [1, 1, 0, 0, 1], // x^4 + x + 1
      '3,2': [1, 0, 2], // x^2 + 2
      '5,2': [1, 0, 2], // x^2 + 2
      '5,3': [1, 1, 0, 1], // x^3 + x + 1
    };
    
    const key = `${p},${n}`;
    if (knownPolys[key]) {
      console.log(chalk.gray(`Using known irreducible polynomial for F_${p}^${n}`));
      return knownPolys[key];
    }
    
    // For larger cases, we'd need to implement polynomial irreducibility testing
    console.log(chalk.yellow(`Warning: Using default polynomial for F_${p}^${n}`));
    const poly = new Array(n + 1).fill(0);
    poly[0] = 1; // constant term
    poly[n] = 1; // leading term
    if (n > 1) poly[1] = 1; // linear term
    
    return poly;
  }

  /**
   * Create field element from coefficients
   */
  createElement(coefficients: number[], field: FiniteField): FiniteFieldElement {
    // Ensure coefficients are reduced mod p and have correct length
    const reducedCoeffs = coefficients
      .slice(0, field.n)
      .map(c => ((c % field.p) + field.p) % field.p);
    
    while (reducedCoeffs.length < field.n) {
      reducedCoeffs.push(0);
    }
    
    return { coefficients: reducedCoeffs, field };
  }

  /**
   * Add two field elements
   */
  add(a: FiniteFieldElement, b: FiniteFieldElement): FiniteFieldElement {
    if (a.field !== b.field) throw new Error('Elements from different fields');
    
    const result = a.coefficients.map((coeff, i) => 
      (coeff + b.coefficients[i]) % a.field.p
    );
    
    return { coefficients: result, field: a.field };
  }

  /**
   * Multiply two field elements
   */
  multiply(a: FiniteFieldElement, b: FiniteFieldElement): FiniteFieldElement {
    if (a.field !== b.field) throw new Error('Elements from different fields');
    
    const field = a.field;
    const p = field.p;
    const n = field.n;
    
    // Polynomial multiplication
    const product = new Array(2 * n - 1).fill(0);
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        product[i + j] = (product[i + j] + a.coefficients[i] * b.coefficients[j]) % p;
      }
    }
    
    // Reduce modulo irreducible polynomial
    const reduced = this.reducePolynomial(product, field.irreduciblePoly, p);
    
    return { coefficients: reduced.slice(0, n), field };
  }

  /**
   * Reduce polynomial modulo irreducible polynomial
   */
  private reducePolynomial(poly: number[], irreducible: number[], p: number): number[] {
    const result = [...poly];
    const degIrred = irreducible.length - 1;
    
    for (let i = result.length - 1; i >= degIrred; i--) {
      if (result[i] !== 0) {
        const coeff = result[i];
        for (let j = 0; j < irreducible.length; j++) {
          result[i - degIrred + j] = (result[i - degIrred + j] - coeff * irreducible[j] + p * p) % p;
        }
      }
    }
    
    return result.slice(0, degIrred);
  }

  /**
   * Compute multiplicative inverse
   */
  inverse(a: FiniteFieldElement): FiniteFieldElement {
    // Use extended Euclidean algorithm for polynomials
    // For now, implement a simple version for small fields
    
    const field = a.field;
    const p = field.p;
    
    // Try all possible elements to find inverse (brute force for small fields)
    for (let i = 0; i < p ** field.n; i++) {
      const coeffs = this.intToCoefficients(i, p, field.n);
      const candidate = this.createElement(coeffs, field);
      
      const product = this.multiply(a, candidate);
      if (this.isOne(product)) {
        return candidate;
      }
    }
    
    throw new Error('Element is not invertible');
  }

  /**
   * Check if element is one (multiplicative identity)
   */
  private isOne(element: FiniteFieldElement): boolean {
    return element.coefficients[0] === 1 && 
           element.coefficients.slice(1).every(c => c === 0);
  }

  /**
   * Convert integer to coefficient representation
   */
  private intToCoefficients(num: number, base: number, length: number): number[] {
    const coeffs = [];
    for (let i = 0; i < length; i++) {
      coeffs.push(num % base);
      num = Math.floor(num / base);
    }
    return coeffs;
  }

  /**
   * Fast exponentiation in finite field
   */
  power(base: FiniteFieldElement, exp: number): FiniteFieldElement {
    if (exp === 0) {
      return this.createElement([1], base.field);
    }
    
    let result = this.createElement([1], base.field);
    let current = base;
    
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = this.multiply(result, current);
      }
      current = this.multiply(current, current);
      exp = Math.floor(exp / 2);
    }
    
    return result;
  }

  /**
   * Generate primitive element (generator of multiplicative group)
   */
  findPrimitiveElement(field: FiniteField): FiniteFieldElement {
    const order = field.size - 1; // Order of multiplicative group
    
    for (let i = 2; i < field.size; i++) {
      const coeffs = this.intToCoefficients(i, field.p, field.n);
      const element = this.createElement(coeffs, field);
      
      if (this.isPrimitiveElement(element, order)) {
        return element;
      }
    }
    
    throw new Error('No primitive element found');
  }

  /**
   * Check if element is primitive (has maximum order)
   */
  private isPrimitiveElement(element: FiniteFieldElement, order: number): boolean {
    // Check if element^order = 1 and element^d ≠ 1 for proper divisors d of order
    
    const one = this.createElement([1], element.field);
    
    // Check if element^order = 1
    const powerOrder = this.power(element, order);
    if (!this.isOne(powerOrder)) return false;
    
    // Check proper divisors (simplified check for small orders)
    for (let d = 1; d < order; d++) {
      if (order % d === 0) {
        const powerD = this.power(element, d);
        if (this.isOne(powerD)) return false;
      }
    }
    
    return true;
  }
}
