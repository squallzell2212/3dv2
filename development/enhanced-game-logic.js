/**
 * Enhanced 5x5 Slot Machine Game Logic
 * Replaces the 3-reel system with a comprehensive 5x5 grid implementation
 * Based on analysis from game-logic-review.md and requirements.md
 */

// Symbol definitions from requirements analysis
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

// 5x5 Grid Configuration
const GRID_CONFIG = {
    ROWS: 5,
    COLS: 5,
    TOTAL_POSITIONS: 25,
    MIN_MATCH_LENGTH: 3
};

// Payline definitions for 5x5 grid
const PAYLINES = {
    // Horizontal paylines (5 rows)
    horizontal: [
        [0, 1, 2, 3, 4],     // Row 1
        [5, 6, 7, 8, 9],     // Row 2
        [10, 11, 12, 13, 14], // Row 3
        [15, 16, 17, 18, 19], // Row 4
        [20, 21, 22, 23, 24]  // Row 5
    ],
    
    // Vertical paylines (5 columns)
    vertical: [
        [0, 5, 10, 15, 20],   // Col 1
        [1, 6, 11, 16, 21],   // Col 2
        [2, 7, 12, 17, 22],   // Col 3
        [3, 8, 13, 18, 23],   // Col 4
        [4, 9, 14, 19, 24]    // Col 5
    ],
    
    // Diagonal paylines
    diagonal: [
        [0, 6, 12, 18, 24],   // Main diagonal (top-left to bottom-right)
        [4, 8, 12, 16, 20]    // Anti-diagonal (top-right to bottom-left)
    ],
    
    // Additional pattern paylines for variety
    patterns: [
        // Zigzag patterns
        [0, 6, 12, 18, 24],   // Main diagonal
        [4, 8, 12, 16, 20],   // Anti-diagonal
        [2, 6, 12, 18, 22],   // Center cross vertical
        [10, 11, 12, 13, 14], // Center cross horizontal
        
        // Corner patterns
        [0, 1, 4, 20, 24],    // Corners + edges
        [0, 4, 12, 20, 24],   // Four corners + center
        
        // V-shapes
        [0, 6, 12, 8, 4],     // V-shape top
        [20, 16, 12, 18, 24], // V-shape bottom
    ]
};

/**
 * Enhanced 5x5 Grid Slot Machine Class
 */
class Enhanced5x5SlotMachine {
    constructor() {
        this.grid = new Array(GRID_CONFIG.TOTAL_POSITIONS).fill(null);
        this.activePaylines = [];
        this.winningCombinations = [];
        this.totalDamage = 0;
        this.multiplier = 1.0;
        this.comboCount = 0;
        this.jackpotProgress = 0;
    }

    /**
     * Generate random symbol based on rarity weights
     * Maintains the existing probability system from analysis
     */
    getRandomSymbol() {
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (const symbol of SLOT_SYMBOLS) {
            cumulativeWeight += symbol.rarity;
            if (random <= cumulativeWeight) {
                return { ...symbol }; // Return copy to avoid reference issues
            }
        }
        
        // Fallback to last symbol (Button)
        return { ...SLOT_SYMBOLS[SLOT_SYMBOLS.length - 1] };
    }

    /**
     * Populate the 5x5 grid with random symbols
     */
    generateGrid() {
        this.grid = [];
        for (let i = 0; i < GRID_CONFIG.TOTAL_POSITIONS; i++) {
            this.grid[i] = this.getRandomSymbol();
        }
        return this.grid;
    }

    /**
     * Get symbol at specific grid position
     */
    getSymbolAt(row, col) {
        const index = row * GRID_CONFIG.COLS + col;
        return this.grid[index];
    }

    /**
     * Set symbol at specific grid position
     */
    setSymbolAt(row, col, symbol) {
        const index = row * GRID_CONFIG.COLS + col;
        this.grid[index] = symbol;
    }

    /**
     * Convert grid index to row/column coordinates
     */
    indexToCoords(index) {
        return {
            row: Math.floor(index / GRID_CONFIG.COLS),
            col: index % GRID_CONFIG.COLS
        };
    }

    /**
     * Convert row/column coordinates to grid index
     */
    coordsToIndex(row, col) {
        return row * GRID_CONFIG.COLS + col;
    }

    /**
     * Check for winning combinations on a specific payline
     */
    checkPaylineWin(payline) {
        const symbols = payline.map(index => this.grid[index]);
        const wins = [];
        
        let currentMatch = {
            symbol: symbols[0],
            positions: [payline[0]],
            length: 1
        };
        
        for (let i = 1; i < symbols.length; i++) {
            if (symbols[i].name === currentMatch.symbol.name) {
                currentMatch.positions.push(payline[i]);
                currentMatch.length++;
            } else {
                // Check if current match qualifies as a win
                if (currentMatch.length >= GRID_CONFIG.MIN_MATCH_LENGTH) {
                    wins.push({
                        symbol: currentMatch.symbol,
                        positions: [...currentMatch.positions],
                        length: currentMatch.length,
                        damage: this.calculateMatchDamage(currentMatch.symbol, currentMatch.length)
                    });
                }
                
                // Start new match
                currentMatch = {
                    symbol: symbols[i],
                    positions: [payline[i]],
                    length: 1
                };
            }
        }
        
        // Check final match
        if (currentMatch.length >= GRID_CONFIG.MIN_MATCH_LENGTH) {
            wins.push({
                symbol: currentMatch.symbol,
                positions: [...currentMatch.positions],
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
        let baseDamage = symbol.damage;
        
        // Bonus damage for longer matches
        const lengthMultiplier = {
            3: 1.0,   // 3 symbols = base damage
            4: 1.5,   // 4 symbols = 1.5x damage
            5: 2.0    // 5 symbols = 2x damage
        };
        
        return Math.floor(baseDamage * (lengthMultiplier[matchLength] || 1.0));
    }

    /**
     * Analyze all paylines for winning combinations
     */
    analyzeAllPaylines() {
        this.winningCombinations = [];
        this.activePaylines = [];
        
        // Check horizontal paylines
        PAYLINES.horizontal.forEach((payline, index) => {
            const wins = this.checkPaylineWin(payline);
            if (wins.length > 0) {
                this.activePaylines.push({ type: 'horizontal', index, payline });
                this.winningCombinations.push(...wins);
            }
        });
        
        // Check vertical paylines
        PAYLINES.vertical.forEach((payline, index) => {
            const wins = this.checkPaylineWin(payline);
            if (wins.length > 0) {
                this.activePaylines.push({ type: 'vertical', index, payline });
                this.winningCombinations.push(...wins);
            }
        });
        
        // Check diagonal paylines
        PAYLINES.diagonal.forEach((payline, index) => {
            const wins = this.checkPaylineWin(payline);
            if (wins.length > 0) {
                this.activePaylines.push({ type: 'diagonal', index, payline });
                this.winningCombinations.push(...wins);
            }
        });
        
        // Check pattern paylines
        PAYLINES.patterns.forEach((payline, index) => {
            const wins = this.checkPaylineWin(payline);
            if (wins.length > 0) {
                this.activePaylines.push({ type: 'pattern', index, payline });
                this.winningCombinations.push(...wins);
            }
        });
        
        return this.winningCombinations;
    }

    /**
     * Calculate total damage from all winning combinations
     */
    calculateTotalDamage() {
        this.totalDamage = this.winningCombinations.reduce((total, win) => {
            return total + win.damage;
        }, 0);
        
        // Apply combo multiplier
        this.totalDamage = Math.floor(this.totalDamage * this.multiplier);
        
        return this.totalDamage;
    }

    /**
     * Update combo system based on win/loss
     */
    updateComboSystem(hasWin) {
        if (hasWin) {
            this.comboCount++;
            // Increase multiplier every 3 consecutive wins, max 5x
            this.multiplier = Math.min(5.0, 1.0 + Math.floor(this.comboCount / 3) * 0.5);
        } else {
            this.comboCount = 0;
            this.multiplier = 1.0;
        }
    }

    /**
     * Update jackpot progress based on symbols
     */
    updateJackpotProgress() {
        // Add progress based on symbol rarity (rarer symbols = more progress)
        this.grid.forEach(symbol => {
            // Inverse rarity for progress (rarer = more progress)
            const progressValue = Math.floor((1 - symbol.rarity) * 10);
            this.jackpotProgress += progressValue;
        });
        
        // Check for instant jackpot (triple Crystal)
        const crystalCount = this.winningCombinations.filter(win => 
            win.symbol.name === 'Crystal' && win.length >= 3
        ).length;
        
        if (crystalCount > 0) {
            this.jackpotProgress = 100; // Instant jackpot
        }
        
        // Cap at 100
        this.jackpotProgress = Math.min(100, this.jackpotProgress);
    }

    /**
     * Check if jackpot is triggered
     */
    isJackpotTriggered() {
        return this.jackpotProgress >= 100;
    }

    /**
     * Reset jackpot progress after payout
     */
    resetJackpot() {
        this.jackpotProgress = 0;
    }

    /**
     * Get all unique winning positions for highlighting
     */
    getWinningPositions() {
        const positions = new Set();
        this.winningCombinations.forEach(win => {
            win.positions.forEach(pos => positions.add(pos));
        });
        return Array.from(positions);
    }

    /**
     * Perform a complete spin cycle
     */
    spin() {
        // Generate new grid
        this.generateGrid();
        
        // Analyze for wins
        const wins = this.analyzeAllPaylines();
        const hasWin = wins.length > 0;
        
        // Update systems
        this.updateComboSystem(hasWin);
        this.updateJackpotProgress();
        
        // Calculate final damage
        const totalDamage = this.calculateTotalDamage();
        
        return {
            grid: this.grid,
            wins: this.winningCombinations,
            activePaylines: this.activePaylines,
            totalDamage: totalDamage,
            multiplier: this.multiplier,
            comboCount: this.comboCount,
            jackpotProgress: this.jackpotProgress,
            isJackpot: this.isJackpotTriggered(),
            winningPositions: this.getWinningPositions()
        };
    }

    /**
     * Get current game state
     */
    getGameState() {
        return {
            grid: this.grid,
            winningCombinations: this.winningCombinations,
            activePaylines: this.activePaylines,
            totalDamage: this.totalDamage,
            multiplier: this.multiplier,
            comboCount: this.comboCount,
            jackpotProgress: this.jackpotProgress
        };
    }

    /**
     * Load game state
     */
    loadGameState(state) {
        this.grid = state.grid || new Array(GRID_CONFIG.TOTAL_POSITIONS).fill(null);
        this.winningCombinations = state.winningCombinations || [];
        this.activePaylines = state.activePaylines || [];
        this.totalDamage = state.totalDamage || 0;
        this.multiplier = state.multiplier || 1.0;
        this.comboCount = state.comboCount || 0;
        this.jackpotProgress = state.jackpotProgress || 0;
    }
}

/**
 * Bonus Feature System for 5x5 Grid
 */
class BonusFeatureSystem {
    constructor(slotMachine) {
        this.slotMachine = slotMachine;
        this.activeBonuses = new Map();
        this.bonusHistory = [];
    }

    /**
     * Power-up definitions from requirements
     */
    static POWER_UPS = {
        DOUBLE_DAMAGE: {
            name: 'Double Damage',
            effect: 'Next attack deals 2x damage',
            duration: 3,
            chance: 0.05
        },
        STEAM_HEALING: {
            name: 'Steam Healing',
            effect: 'Instantly restore 30 health points',
            duration: 0, // Instant effect
            chance: 0.05
        },
        MECHANICAL_SHIELD: {
            name: 'Mechanical Shield',
            effect: 'Block next 2 enemy attacks',
            duration: 2,
            chance: 0.05
        },
        MULTI_SPIN: {
            name: 'Multi-Spin',
            effect: 'Receive 3 free spins',
            duration: 0, // Instant effect
            chance: 0.05
        },
        COMBO_BOOST: {
            name: 'Combo Boost',
            effect: 'Increase combo multiplier by 1',
            duration: 5,
            chance: 0.05
        }
    };

    /**
     * Check for power-up activation (5% chance per spin)
     */
    checkPowerUpActivation() {
        const powerUps = Object.values(BonusFeatureSystem.POWER_UPS);
        const activatedPowerUps = [];

        powerUps.forEach(powerUp => {
            if (Math.random() < powerUp.chance) {
                activatedPowerUps.push(this.activatePowerUp(powerUp));
            }
        });

        return activatedPowerUps;
    }

    /**
     * Activate a specific power-up
     */
    activatePowerUp(powerUp) {
        const bonusId = Date.now() + Math.random();
        
        const bonus = {
            id: bonusId,
            name: powerUp.name,
            effect: powerUp.effect,
            duration: powerUp.duration,
            remainingTurns: powerUp.duration,
            activated: true
        };

        if (powerUp.duration > 0) {
            this.activeBonuses.set(bonusId, bonus);
        }

        this.bonusHistory.push({
            ...bonus,
            activatedAt: Date.now()
        });

        return bonus;
    }

    /**
     * Update bonus durations (call after each spin)
     */
    updateBonusDurations() {
        const expiredBonuses = [];

        this.activeBonuses.forEach((bonus, id) => {
            bonus.remainingTurns--;
            
            if (bonus.remainingTurns <= 0) {
                expiredBonuses.push(id);
            }
        });

        // Remove expired bonuses
        expiredBonuses.forEach(id => {
            this.activeBonuses.delete(id);
        });

        return expiredBonuses;
    }

    /**
     * Get all currently active bonuses
     */
    getActiveBonuses() {
        return Array.from(this.activeBonuses.values());
    }

    /**
     * Check if specific bonus type is active
     */
    isBonusActive(bonusName) {
        return Array.from(this.activeBonuses.values()).some(
            bonus => bonus.name === bonusName
        );
    }

    /**
     * Apply bonus effects to damage calculation
     */
    applyBonusEffects(baseDamage) {
        let modifiedDamage = baseDamage;

        // Apply Double Damage bonus
        if (this.isBonusActive('Double Damage')) {
            modifiedDamage *= 2;
        }

        // Apply Combo Boost bonus
        if (this.isBonusActive('Combo Boost')) {
            this.slotMachine.multiplier += 1;
        }

        return Math.floor(modifiedDamage);
    }
}

// Export classes and constants for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Enhanced5x5SlotMachine,
        BonusFeatureSystem,
        SLOT_SYMBOLS,
        GRID_CONFIG,
        PAYLINES
    };
}