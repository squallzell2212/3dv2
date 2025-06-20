/**
 * Probability System for 5x5 Slot Machine
 * Accurate probability calculations, RTP analysis, and win frequency calculations
 * Based on analysis from game-logic-review.md and requirements.md
 */

// Import symbol definitions and grid configuration
const SLOT_SYMBOLS = [
    { name: 'Crystal', damage: 35, rarity: 0.10, type: 'magic' },
    { name: 'Sword', damage: 30, rarity: 0.15, type: 'attack' },
    { name: 'Shield', damage: 25, rarity: 0.15, type: 'defense' },
    { name: 'Armor', damage: 22, rarity: 0.10, type: 'defense' },
    { name: 'Gear', damage: 20, rarity: 0.20, type: 'mechanical' },
    { name: 'Pipe', damage: 15, rarity: 0.15, type: 'steam' },
    { name: 'Potion', damage: 10, rarity: 0.10, type: 'healing' },
    { name: 'Button', damage: 5, rarity: 0.05, type: 'utility' }
];

const GRID_CONFIG = {
    ROWS: 5,
    COLS: 5,
    TOTAL_POSITIONS: 25,
    MIN_MATCH_LENGTH: 3
};

/**
 * Probability Analysis System for 5x5 Grid
 */
class ProbabilitySystem {
    constructor() {
        this.symbolProbabilities = this.calculateSymbolProbabilities();
        this.paylineProbabilities = this.calculatePaylineProbabilities();
        this.rtpData = null;
        this.simulationCache = new Map();
    }

    /**
     * Calculate individual symbol probabilities
     * Validates that probabilities sum to 1.0
     */
    calculateSymbolProbabilities() {
        const probabilities = {};
        let totalProbability = 0;

        SLOT_SYMBOLS.forEach(symbol => {
            probabilities[symbol.name] = symbol.rarity;
            totalProbability += symbol.rarity;
        });

        // Validate probability distribution
        if (Math.abs(totalProbability - 1.0) > 0.001) {
            console.warn(`Symbol probabilities sum to ${totalProbability}, expected 1.0`);
        }

        return probabilities;
    }

    /**
     * Calculate probability of specific symbol appearing at any position
     */
    getSymbolProbability(symbolName) {
        return this.symbolProbabilities[symbolName] || 0;
    }

    /**
     * Calculate probability of getting exactly N matching symbols in a row
     */
    calculateMatchProbability(symbolName, matchLength, totalPositions = 5) {
        const symbolProb = this.getSymbolProbability(symbolName);
        const otherProb = 1 - symbolProb;
        
        // Probability of exactly matchLength consecutive symbols
        // followed by a different symbol (or end of line)
        if (matchLength === totalPositions) {
            // All positions match
            return Math.pow(symbolProb, matchLength);
        } else {
            // Consecutive matches with different symbol after
            return Math.pow(symbolProb, matchLength) * otherProb;
        }
    }

    /**
     * Calculate probability of getting at least N matching symbols
     */
    calculateMinMatchProbability(symbolName, minLength, totalPositions = 5) {
        let totalProbability = 0;
        
        for (let length = minLength; length <= totalPositions; length++) {
            totalProbability += this.calculateMatchProbability(symbolName, length, totalPositions);
        }
        
        return totalProbability;
    }

    /**
     * Calculate payline win probabilities for all symbols
     */
    calculatePaylineProbabilities() {
        const paylineProbs = {};
        
        SLOT_SYMBOLS.forEach(symbol => {
            paylineProbs[symbol.name] = {
                exactly3: this.calculateMatchProbability(symbol.name, 3),
                exactly4: this.calculateMatchProbability(symbol.name, 4),
                exactly5: this.calculateMatchProbability(symbol.name, 5),
                atLeast3: this.calculateMinMatchProbability(symbol.name, 3)
            };
        });
        
        return paylineProbs;
    }

    /**
     * Calculate overall win probability for a single payline
     */
    calculateSinglePaylineWinProbability() {
        let totalWinProb = 0;
        
        SLOT_SYMBOLS.forEach(symbol => {
            totalWinProb += this.paylineProbabilities[symbol.name].atLeast3;
        });
        
        return totalWinProb;
    }

    /**
     * Calculate total number of active paylines
     */
    getTotalPaylines() {
        // From enhanced-game-logic.js payline definitions
        return 5 + 5 + 2 + 8; // horizontal + vertical + diagonal + patterns
    }

    /**
     * Calculate probability of winning on any payline in a 5x5 spin
     */
    calculateOverallWinProbability() {
        const singlePaylineWinProb = this.calculateSinglePaylineWinProbability();
        const totalPaylines = this.getTotalPaylines();
        
        // Probability of NOT winning on any payline
        const noWinProb = Math.pow(1 - singlePaylineWinProb, totalPaylines);
        
        // Probability of winning on at least one payline
        return 1 - noWinProb;
    }

    /**
     * Calculate expected damage per spin
     */
    calculateExpectedDamage() {
        let expectedDamage = 0;
        const totalPaylines = this.getTotalPaylines();
        
        SLOT_SYMBOLS.forEach(symbol => {
            const symbolProbs = this.paylineProbabilities[symbol.name];
            
            // Expected damage from this symbol across all paylines
            const symbolExpectedDamage = 
                (symbolProbs.exactly3 * symbol.damage * 1.0) +  // 3-match: base damage
                (symbolProbs.exactly4 * symbol.damage * 1.5) +  // 4-match: 1.5x damage
                (symbolProbs.exactly5 * symbol.damage * 2.0);   // 5-match: 2x damage
            
            expectedDamage += symbolExpectedDamage * totalPaylines;
        });
        
        return expectedDamage;
    }

    /**
     * Calculate Return to Player (RTP) percentage
     * Based on damage output vs. theoretical input
     */
    calculateRTP(spinCost = 1, damageToPointsRatio = 1) {
        const expectedDamage = this.calculateExpectedDamage();
        const expectedReturn = expectedDamage * damageToPointsRatio;
        
        return (expectedReturn / spinCost) * 100;
    }

    /**
     * Simulate multiple spins to validate theoretical calculations
     */
    simulateSpins(numSpins = 10000) {
        const cacheKey = `simulation_${numSpins}`;
        
        if (this.simulationCache.has(cacheKey)) {
            return this.simulationCache.get(cacheKey);
        }

        let totalWins = 0;
        let totalDamage = 0;
        let symbolWins = {};
        let matchLengthStats = { 3: 0, 4: 0, 5: 0 };
        
        // Initialize symbol win tracking
        SLOT_SYMBOLS.forEach(symbol => {
            symbolWins[symbol.name] = 0;
        });

        for (let spin = 0; spin < numSpins; spin++) {
            const result = this.simulateSingleSpin();
            
            if (result.hasWin) {
                totalWins++;
                totalDamage += result.totalDamage;
                
                result.wins.forEach(win => {
                    symbolWins[win.symbol.name]++;
                    matchLengthStats[win.length]++;
                });
            }
        }

        const simulationResults = {
            totalSpins: numSpins,
            totalWins: totalWins,
            winRate: totalWins / numSpins,
            averageDamage: totalDamage / numSpins,
            averageDamagePerWin: totalWins > 0 ? totalDamage / totalWins : 0,
            symbolWinRates: {},
            matchLengthDistribution: {}
        };

        // Calculate symbol win rates
        SLOT_SYMBOLS.forEach(symbol => {
            simulationResults.symbolWinRates[symbol.name] = symbolWins[symbol.name] / numSpins;
        });

        // Calculate match length distribution
        Object.keys(matchLengthStats).forEach(length => {
            simulationResults.matchLengthDistribution[length] = matchLengthStats[length] / totalWins;
        });

        this.simulationCache.set(cacheKey, simulationResults);
        return simulationResults;
    }

    /**
     * Simulate a single spin result
     */
    simulateSingleSpin() {
        // Generate random 5x5 grid
        const grid = [];
        for (let i = 0; i < GRID_CONFIG.TOTAL_POSITIONS; i++) {
            grid.push(this.getRandomSymbol());
        }

        // Check for wins using simplified payline analysis
        const wins = this.analyzeGridForWins(grid);
        const totalDamage = wins.reduce((sum, win) => sum + win.damage, 0);

        return {
            grid: grid,
            wins: wins,
            hasWin: wins.length > 0,
            totalDamage: totalDamage
        };
    }

    /**
     * Generate random symbol based on rarity weights
     */
    getRandomSymbol() {
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (const symbol of SLOT_SYMBOLS) {
            cumulativeWeight += symbol.rarity;
            if (random <= cumulativeWeight) {
                return { ...symbol };
            }
        }
        
        return { ...SLOT_SYMBOLS[SLOT_SYMBOLS.length - 1] };
    }

    /**
     * Simplified win analysis for simulation
     */
    analyzeGridForWins(grid) {
        const wins = [];
        
        // Check horizontal lines
        for (let row = 0; row < GRID_CONFIG.ROWS; row++) {
            const lineStart = row * GRID_CONFIG.COLS;
            const line = grid.slice(lineStart, lineStart + GRID_CONFIG.COLS);
            wins.push(...this.checkLineForWins(line));
        }
        
        // Check vertical lines
        for (let col = 0; col < GRID_CONFIG.COLS; col++) {
            const line = [];
            for (let row = 0; row < GRID_CONFIG.ROWS; row++) {
                line.push(grid[row * GRID_CONFIG.COLS + col]);
            }
            wins.push(...this.checkLineForWins(line));
        }
        
        // Check main diagonal
        const mainDiagonal = [];
        for (let i = 0; i < GRID_CONFIG.ROWS; i++) {
            mainDiagonal.push(grid[i * GRID_CONFIG.COLS + i]);
        }
        wins.push(...this.checkLineForWins(mainDiagonal));
        
        // Check anti-diagonal
        const antiDiagonal = [];
        for (let i = 0; i < GRID_CONFIG.ROWS; i++) {
            antiDiagonal.push(grid[i * GRID_CONFIG.COLS + (GRID_CONFIG.COLS - 1 - i)]);
        }
        wins.push(...this.checkLineForWins(antiDiagonal));
        
        return wins;
    }

    /**
     * Check a single line for winning combinations
     */
    checkLineForWins(line) {
        const wins = [];
        let currentMatch = { symbol: line[0], length: 1 };
        
        for (let i = 1; i < line.length; i++) {
            if (line[i].name === currentMatch.symbol.name) {
                currentMatch.length++;
            } else {
                if (currentMatch.length >= GRID_CONFIG.MIN_MATCH_LENGTH) {
                    wins.push({
                        symbol: currentMatch.symbol,
                        length: currentMatch.length,
                        damage: this.calculateMatchDamage(currentMatch.symbol, currentMatch.length)
                    });
                }
                currentMatch = { symbol: line[i], length: 1 };
            }
        }
        
        // Check final match
        if (currentMatch.length >= GRID_CONFIG.MIN_MATCH_LENGTH) {
            wins.push({
                symbol: currentMatch.symbol,
                length: currentMatch.length,
                damage: this.calculateMatchDamage(currentMatch.symbol, currentMatch.length)
            });
        }
        
        return wins;
    }

    /**
     * Calculate damage for a symbol match based on length
     */
    calculateMatchDamage(symbol, matchLength) {
        const lengthMultiplier = {
            3: 1.0,   // 3 symbols = base damage
            4: 1.5,   // 4 symbols = 1.5x damage
            5: 2.0    // 5 symbols = 2x damage
        };
        
        return Math.floor(symbol.damage * (lengthMultiplier[matchLength] || 1.0));
    }

    /**
     * Calculate jackpot probability
     */
    calculateJackpotProbability() {
        // Jackpot triggered by triple Crystal or 100 progress points
        const crystalProb = this.getSymbolProbability('Crystal');
        
        // Probability of getting 3+ Crystals in any payline
        const tripleCrystalProb = this.paylineProbabilities['Crystal'].atLeast3;
        const totalPaylines = this.getTotalPaylines();
        
        // Probability of jackpot on any payline
        const jackpotPerSpin = 1 - Math.pow(1 - tripleCrystalProb, totalPaylines);
        
        return {
            perSpin: jackpotPerSpin,
            expectedSpinsToJackpot: 1 / jackpotPerSpin
        };
    }

    /**
     * Generate comprehensive probability report
     */
    generateProbabilityReport() {
        const simulation = this.simulateSpins(100000);
        const jackpotProb = this.calculateJackpotProbability();
        
        return {
            symbolProbabilities: this.symbolProbabilities,
            theoreticalWinRate: this.calculateOverallWinProbability(),
            simulatedWinRate: simulation.winRate,
            expectedDamagePerSpin: this.calculateExpectedDamage(),
            simulatedAverageDamage: simulation.averageDamage,
            rtp: this.calculateRTP(),
            jackpotProbability: jackpotProb,
            paylineProbabilities: this.paylineProbabilities,
            simulationResults: simulation,
            totalPaylines: this.getTotalPaylines(),
            gridConfiguration: GRID_CONFIG
        };
    }

    /**
     * Validate probability calculations against simulation
     */
    validateCalculations(tolerance = 0.05) {
        const simulation = this.simulateSpins(50000);
        const theoretical = this.calculateOverallWinProbability();
        const simulated = simulation.winRate;
        
        const difference = Math.abs(theoretical - simulated);
        const isValid = difference <= tolerance;
        
        return {
            isValid: isValid,
            theoreticalWinRate: theoretical,
            simulatedWinRate: simulated,
            difference: difference,
            tolerance: tolerance,
            message: isValid ? 
                'Probability calculations are valid' : 
                `Probability calculations may need adjustment (difference: ${difference.toFixed(4)})`
        };
    }

    /**
     * Optimize symbol distribution for target RTP
     */
    optimizeForTargetRTP(targetRTP = 95, maxIterations = 1000) {
        let bestDistribution = [...SLOT_SYMBOLS];
        let bestRTP = this.calculateRTP();
        let iteration = 0;
        
        while (Math.abs(bestRTP - targetRTP) > 1 && iteration < maxIterations) {
            // Create slight variations in symbol rarities
            const testDistribution = bestDistribution.map(symbol => ({
                ...symbol,
                rarity: Math.max(0.01, Math.min(0.5, 
                    symbol.rarity + (Math.random() - 0.5) * 0.02
                ))
            }));
            
            // Normalize probabilities to sum to 1.0
            const totalRarity = testDistribution.reduce((sum, s) => sum + s.rarity, 0);
            testDistribution.forEach(symbol => {
                symbol.rarity = symbol.rarity / totalRarity;
            });
            
            // Test this distribution
            const tempSystem = new ProbabilitySystem();
            tempSystem.symbolProbabilities = {};
            testDistribution.forEach(symbol => {
                tempSystem.symbolProbabilities[symbol.name] = symbol.rarity;
            });
            
            const testRTP = tempSystem.calculateRTP();
            
            if (Math.abs(testRTP - targetRTP) < Math.abs(bestRTP - targetRTP)) {
                bestDistribution = testDistribution;
                bestRTP = testRTP;
            }
            
            iteration++;
        }
        
        return {
            optimizedDistribution: bestDistribution,
            achievedRTP: bestRTP,
            targetRTP: targetRTP,
            iterations: iteration
        };
    }
}

/**
 * Win Frequency Analysis System
 */
class WinFrequencyAnalyzer {
    constructor(probabilitySystem) {
        this.probabilitySystem = probabilitySystem;
    }

    /**
     * Analyze win frequency patterns
     */
    analyzeWinFrequency(numSpins = 10000) {
        let consecutiveWins = 0;
        let maxConsecutiveWins = 0;
        let consecutiveLosses = 0;
        let maxConsecutiveLosses = 0;
        let winStreaks = [];
        let lossStreaks = [];
        let currentWinStreak = 0;
        let currentLossStreak = 0;
        
        for (let i = 0; i < numSpins; i++) {
            const result = this.probabilitySystem.simulateSingleSpin();
            
            if (result.hasWin) {
                consecutiveWins++;
                maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
                
                if (currentLossStreak > 0) {
                    lossStreaks.push(currentLossStreak);
                    currentLossStreak = 0;
                }
                currentWinStreak++;
                consecutiveLosses = 0;
            } else {
                consecutiveLosses++;
                maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
                
                if (currentWinStreak > 0) {
                    winStreaks.push(currentWinStreak);
                    currentWinStreak = 0;
                }
                currentLossStreak++;
                consecutiveWins = 0;
            }
        }
        
        return {
            maxConsecutiveWins: maxConsecutiveWins,
            maxConsecutiveLosses: maxConsecutiveLosses,
            averageWinStreak: winStreaks.length > 0 ? 
                winStreaks.reduce((a, b) => a + b, 0) / winStreaks.length : 0,
            averageLossStreak: lossStreaks.length > 0 ? 
                lossStreaks.reduce((a, b) => a + b, 0) / lossStreaks.length : 0,
            winStreakDistribution: this.calculateDistribution(winStreaks),
            lossStreakDistribution: this.calculateDistribution(lossStreaks)
        };
    }

    /**
     * Calculate distribution of streak lengths
     */
    calculateDistribution(streaks) {
        const distribution = {};
        streaks.forEach(streak => {
            distribution[streak] = (distribution[streak] || 0) + 1;
        });
        
        // Convert to percentages
        const total = streaks.length;
        Object.keys(distribution).forEach(key => {
            distribution[key] = (distribution[key] / total) * 100;
        });
        
        return distribution;
    }
}

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProbabilitySystem,
        WinFrequencyAnalyzer,
        SLOT_SYMBOLS,
        GRID_CONFIG
    };
}