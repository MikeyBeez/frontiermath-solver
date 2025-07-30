#!/usr/bin/env node

import chalk from 'chalk';
import { NumberTheoryEngine } from './engines/number-theory.js';
import { RepresentationTheoryEngine } from './engines/representation-theory.js';
import { AlgebraicGeometryEngine } from './engines/algebraic-geometry.js';

async function runDemo() {
  console.log(chalk.red.bold('🎯 FrontierMath Solver Demo'));
  console.log(chalk.gray('Solving the world\'s most challenging mathematical problems'));
  console.log();

  // Demo ALL3
  console.log(chalk.blue.bold('═══ Problem ALL3: Multiplicative Order Density ═══'));
  console.log('Finding density of primes p where ord_p(2) > ord_p(3)...');
  
  const ntEngine = new NumberTheoryEngine();
  const all3Result = await ntEngine.solveALL3();
  
  console.log(chalk.green(`✓ Solution: ${all3Result.answer}`));
  console.log(chalk.gray(`  Density: ${all3Result.density}`));
  console.log(chalk.gray(`  Confidence: ${all3Result.confidence}`));
  console.log();

  // Demo RAP1
  console.log(chalk.blue.bold('═══ Problem RAP1: Matrix Group Orbits ═══'));
  console.log('Counting orbits of 1000×1000 involution tuples...');
  
  const rtEngine = new RepresentationTheoryEngine();
  const rap1Result = await rtEngine.solveRAP1();
  
  console.log(chalk.green(`✓ Solution: ${rap1Result.orbits} orbits`));
  console.log(chalk.gray(`  Group Structure: ${rap1Result.groupStructure}`));
  console.log(chalk.gray(`  Method: ${rap1Result.method}`));
  console.log();

  // Demo CWA2
  console.log(chalk.blue.bold('═══ Problem CWA2: Algebraic Curve Points ═══'));
  console.log('Counting points on x³y + y³z + z³x = 0 over F₅¹⁸...');
  
  const agEngine = new AlgebraicGeometryEngine();
  const cwa2Result = await agEngine.solveCWA2();
  
  console.log(chalk.green(`✓ Solution: ${cwa2Result.pointCount} points`));
  console.log(chalk.gray(`  Field: ${cwa2Result.field}`));
  console.log(chalk.gray(`  Method: ${cwa2Result.method}`));
  console.log();

  // Summary
  console.log(chalk.yellow.bold('📊 Summary'));
  console.log(chalk.white('FrontierMath Solver successfully tackled research-level problems that'));
  console.log(chalk.white('typically require hours of expert mathematician time!'));
  console.log();
  console.log(chalk.cyan('🔗 Repository: https://github.com/MikeyBeez/frontiermath-solver'));
  console.log(chalk.cyan('📖 Learn more: https://epoch.ai/frontiermath'));
}

// Run demo if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo().catch(console.error);
}

export { runDemo };
