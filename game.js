/**
 * Steampunk Slot Machine RPG - Enhanced Game Engine
 * A complete slot machine game with RPG elements, boss battles, and advanced features
 */

// Game State Management
class GameState {
    constructor() {
        this.score = 0;
        this.spinCount = 0;
        this.winCount = 0;
        this.bossesDefeated = 0;
        this.currentBossIndex = 0;
        this.currentWorldIndex = 0;
        this.playerHealth = 100;
        this.maxPlayerHealth = 100;
        this.isSpinning = false;
        this.gameOver = false;
        
        // Power-up system
        this.activePowerUps = new Map();
        this.powerUpDurations = new Map();
        
        // Bonus system
        this.comboMultiplier = 1;
        this.consecutiveWins = 0;
        this.freeSpinsRemaining = 0;
        this.jackpotProgress = 0;
        
        // Achievement system
        this.achievements = new Set();
        this.totalDamageDealt = 0;
        this.criticalHits = 0;
        
        // Settings
        this.settings = {
            soundEnabled: true,
            animationsEnabled: true,
            autoSpin: false
        };
    }

    // Reset game state for new game
    reset() {
        this.score = 0;
        this.spinCount = 0;
        this.winCount = 0;
        this.bossesDefeated = 0;
        this.currentBossIndex = 0;
        this.currentWorldIndex = 0;
        this.playerHealth = 100;
        this.maxPlayerHealth = 100;
        this.isSpinning = false;
        this.gameOver = false;
        this.activePowerUps.clear();
        this.powerUpDurations.clear();
        this.comboMultiplier = 1;
        this.consecutiveWins = 0;
        this.freeSpinsRemaining = 0;
        this.jackpotProgress = 0;
        this.totalDamageDealt = 0;
        this.criticalHits = 0;
    }

    // Save game progress to localStorage
    save() {
        const saveData = {
            score: this.score,
            spinCount: this.spinCount,
            winCount: this.winCount,
            bossesDefeated: this.bossesDefeated,
            currentBossIndex: this.currentBossIndex,
            currentWorldIndex: this.currentWorldIndex,
            achievements: Array.from(this.achievements),
            totalDamageDealt: this.totalDamageDealt,
            criticalHits: this.criticalHits,
            settings: this.settings
        };
        localStorage.setItem('steampunkSlotRPG', JSON.stringify(saveData));
    }

    // Load game progress from localStorage
    load() {
        const saveData = localStorage.getItem('steampunkSlotRPG');
        if (saveData) {
            const data = JSON.parse(saveData);
            Object.assign(this, data);
            this.achievements = new Set(data.achievements || []);
            return true;
        }
        return false;
    }
}

// Slot Machine Symbols Configuration
const SLOT_SYMBOLS = [
    { name: 'sword', image: 'slot_sword.png', damage: 30, rarity: 0.15, type: 'attack' },
    { name: 'shield', image: 'slot_shield.png', damage: 25, rarity: 0.15, type: 'defense' },
    { name: 'gear', image: 'slot_gear.png', damage: 20, rarity: 0.20, type: 'mechanical' },
    { name: 'crystal', image: 'slot_crystal.png', damage: 35, rarity: 0.10, type: 'magic' },
    { name: 'pipe', image: 'slot_pipe.png', damage: 15, rarity: 0.15, type: 'steam' },
    { name: 'potion', image: 'slot_potion.png', damage: 10, rarity: 0.10, type: 'healing' },
    { name: 'armor', image: 'slot_armor.png', damage: 22, rarity: 0.10, type: 'defense' },
    { name: 'button', image: 'slot_button.png', damage: 5, rarity: 0.05, type: 'utility' }
];

// Power-up System Configuration
const POWER_UPS = {
    DOUBLE_DAMAGE: {
        name: 'Double Damage',
        description: 'Next attack deals double damage',
        duration: 3,
        icon: '⚡',
        effect: 'doubleDamage'
    },
    HEALING: {
        name: 'Steam Healing',
        description: 'Restore 30 health points',
        duration: 0,
        icon: '💚',
        effect: 'heal'
    },
    SHIELD: {
        name: 'Mechanical Shield',
        description: 'Blocks next 2 enemy attacks',
        duration: 2,
        icon: '🛡️',
        effect: 'shield'
    },
    MULTI_SPIN: {
        name: 'Multi-Spin',
        description: 'Get 3 free spins',
        duration: 0,
        icon: '🎰',
        effect: 'freeSpins'
    },
    COMBO_BOOST: {
        name: 'Combo Boost',
        description: 'Increases combo multiplier by 1',
        duration: 5,
        icon: '🔥',
        effect: 'comboBoost'
    }
};

// World Progression System
const WORLDS = [
    {
        name: 'Mechanical Foundry',
        description: 'A steampunk factory filled with mechanical creatures',
        theme: 'industrial',
        bosses: [0], // Boss indices
        unlocked: true,
        background: 'linear-gradient(135deg, #2c1810 0%, #4a2c1a 50%, #6b3e2a 100%)'
    },
    {
        name: 'Steam Gardens',
        description: 'Overgrown gardens powered by steam technology',
        theme: 'nature',
        bosses: [1],
        unlocked: false,
        background: 'linear-gradient(135deg, #1a2c18 0%, #2a4a1c 50%, #3a6b2a 100%)'
    },
    {
        name: 'Sky Fortress',
        description: 'A floating fortress high above the clouds',
        theme: 'aerial',
        bosses: [2],
        unlocked: false,
        background: 'linear-gradient(135deg, #181c2c 0%, #1c2a4a 50%, #2a3a6b 100%)'
    }
];

// Boss Configuration
const BOSSES = [
    {
        name: 'Mechanical Spider',
        image: 'boss_spider.png',
        health: 100,
        maxHealth: 100,
        level: 1,
        attackDamage: 15,
        world: 0,
        description: 'A deadly arachnid powered by steam and gears',
        abilities: ['Web Trap', 'Steam Burst'],
        criticalChance: 0.1
    },
    {
        name: 'Steam Golem',
        image: 'boss_golem.png',
        health: 150,
        maxHealth: 150,
        level: 2,
        attackDamage: 20,
        world: 1,
        description: 'A massive construct of metal and steam',
        abilities: ['Boulder Throw', 'Steam Overload'],
        criticalChance: 0.15
    },
    {
        name: 'Airship Captain',
        image: 'boss_captain.png',
        health: 200,
        maxHealth: 200,
        level: 3,
        attackDamage: 25,
        world: 2,
        description: 'The notorious captain of the sky pirates',
        abilities: ['Cannon Barrage', 'Wind Strike'],
        criticalChance: 0.2
    }
];

// Achievement System Configuration
const ACHIEVEMENTS = {
    FIRST_WIN: {
        id: 'first_win',
        name: 'First Victory',
        description: 'Win your first slot spin',
        icon: '🏆',
        condition: (game) => game.gameState.winCount >= 1
    },
    BOSS_SLAYER: {
        id: 'boss_slayer',
        name: 'Boss Slayer',
        description: 'Defeat your first boss',
        icon: '⚔️',
        condition: (game) => game.gameState.bossesDefeated >= 1
    },
    DAMAGE_DEALER: {
        id: 'damage_dealer',
        name: 'Damage Dealer',
        description: 'Deal 500 total damage',
        icon: '💥',
        condition: (game) => game.gameState.totalDamageDealt >= 500
    },
    CRITICAL_MASTER: {
        id: 'critical_master',
        name: 'Critical Master',
        description: 'Land 10 critical hits',
        icon: '🎯',
        condition: (game) => game.gameState.criticalHits >= 10
    },
    SPIN_MASTER: {
        id: 'spin_master',
        name: 'Spin Master',
        description: 'Complete 100 spins',
        icon: '🎰',
        condition: (game) => game.gameState.spinCount >= 100
    },
    WORLD_EXPLORER: {
        id: 'world_explorer',
        name: 'World Explorer',
        description: 'Unlock all worlds',
        icon: '🌍',
        condition: (game) => game.gameState.currentWorldIndex >= WORLDS.length - 1
    },
    JACKPOT_WINNER: {
        id: 'jackpot_winner',
        name: 'Jackpot Winner',
        description: 'Hit the jackpot combination',
        icon: '💰',
        condition: (game) => false // Set by special jackpot logic
    }
};

// Game Engine Class
class SlotMachineRPG {
    constructor() {
        this.gameState = new GameState();
        this.currentBoss = { ...BOSSES[0] };
        this.currentWorld = { ...WORLDS[0] };
        this.animationQueue = [];
        this.isProcessingAnimations = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadGameProgress();
        this.updateDisplay();
        this.initializeUI();
    }

    // Initialize DOM elements
    initializeElements() {
        // Slot machine elements
        this.reel1 = document.getElementById('reel1');
        this.reel2 = document.getElementById('reel2');
        this.reel3 = document.getElementById('reel3');
        this.spinButton = document.getElementById('spin-button');
        
        // Display elements
        this.scoreElement = document.getElementById('score');
        this.spinCountElement = document.getElementById('spin-count');
        this.winCountElement = document.getElementById('win-count');
        this.bossesDefeatedElement = document.getElementById('bosses-defeated');
        this.totalDamageElement = document.getElementById('total-damage');
        this.criticalHitsElement = document.getElementById('critical-hits');
        this.gameMessageElement = document.getElementById('game-message');
        
        // Health elements
        this.playerHealthBar = document.getElementById('player-health');
        this.playerHealthText = document.getElementById('player-health-text');
        this.bossHealthBar = document.getElementById('boss-health');
        this.bossHealthText = document.getElementById('boss-health-text');
        
        // Boss elements
        this.bossSprite = document.getElementById('boss-sprite');
        this.bossName = document.getElementById('boss-name');
        this.bossLevel = document.getElementById('boss-level');
        
        // Modal elements
        this.gameOverModal = document.getElementById('game-over-modal');
        this.victoryModal = document.getElementById('victory-modal');
        this.restartButton = document.getElementById('restart-button');
        this.continueButton = document.getElementById('continue-button');
        this.gameOverMessage = document.getElementById('game-over-message');
        this.victoryMessage = document.getElementById('victory-message');
        
        // New UI elements (will be created dynamically)
        this.powerUpContainer = null;
        this.worldProgressContainer = null;
        this.achievementContainer = null;
        this.settingsModal = null;
        this.helpModal = null;
        this.comboMultiplierElement = null;
        this.freeSpinsElement = null;
        this.jackpotProgressElement = null;
    }

    // Bind event listeners
    bindEvents() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.continueButton.addEventListener('click', () => this.nextBoss());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameState.isSpinning && !this.gameState.gameOver) {
                e.preventDefault();
                this.spin();
            } else if (e.code === 'KeyH') {
                // Show help modal
                this.helpModal.classList.remove('hidden');
            } else if (e.code === 'KeyS') {
                // Show settings modal
                this.settingsModal.classList.remove('hidden');
            } else if (e.code === 'Escape') {
                // Close any open modals
                this.helpModal.classList.add('hidden');
                this.settingsModal.classList.add('hidden');
            }
        });
        
        // Add UI button events after UI is created
        setTimeout(() => {
            // Help button
            const helpButton = document.createElement('button');
            helpButton.className = 'ui-button help-button';
            helpButton.innerHTML = '❓ Help (H)';
            helpButton.addEventListener('click', () => this.helpModal.classList.remove('hidden'));
            
            // Settings button
            const settingsButton = document.createElement('button');
            settingsButton.className = 'ui-button settings-button';
            settingsButton.innerHTML = '⚙️ Settings (S)';
            settingsButton.addEventListener('click', () => this.settingsModal.classList.remove('hidden'));
            
            // Add buttons to header
            const gameHeader = document.querySelector('.game-header');
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'ui-buttons';
            buttonContainer.appendChild(helpButton);
            buttonContainer.appendChild(settingsButton);
            gameHeader.appendChild(buttonContainer);
        }, 100);
    }

    // Generate weighted random symbol based on rarity
    getRandomSymbol() {
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (const symbol of SLOT_SYMBOLS) {
            cumulativeWeight += symbol.rarity;
            if (random <= cumulativeWeight) {
                return symbol;
            }
        }
        
        // Fallback to last symbol
        return SLOT_SYMBOLS[SLOT_SYMBOLS.length - 1];
    }

    // Spin the slot machine
    async spin() {
        if (this.gameState.isSpinning || this.gameState.gameOver) return;
        
        this.gameState.isSpinning = true;
        this.spinButton.disabled = true;
        this.gameMessageElement.textContent = 'Spinning...';
        this.gameMessageElement.className = 'game-message';
        
        // Check if using free spin
        const isFreeSpinUsed = this.gameState.freeSpinsRemaining > 0;
        if (isFreeSpinUsed) {
            this.gameState.freeSpinsRemaining--;
            this.showFloatingText('Free Spin Used!', 'bonus');
        }
        
        // Enhanced spinning animation with staggered timing
        this.reel1.classList.add('spinning');
        await this.delay(200);
        this.reel2.classList.add('spinning');
        await this.delay(200);
        this.reel3.classList.add('spinning');
        
        // Generate random symbols for each reel
        const symbol1 = this.getRandomSymbol();
        const symbol2 = this.getRandomSymbol();
        const symbol3 = this.getRandomSymbol();
        
        // Wait for animation with staggered stopping
        await this.delay(800);
        this.updateReel(this.reel1, symbol1);
        this.reel1.classList.remove('spinning');
        
        await this.delay(300);
        this.updateReel(this.reel2, symbol2);
        this.reel2.classList.remove('spinning');
        
        await this.delay(300);
        this.updateReel(this.reel3, symbol3);
        this.reel3.classList.remove('spinning');
        
        // Check for winning combination
        const result = this.checkWinCondition(symbol1, symbol2, symbol3);
        
        // Check for jackpot
        this.updateJackpotProgress(result);
        
        // Update game state
        this.gameState.spinCount++;
        
        // Check for power-up activation
        this.checkForPowerUp();
        
        if (result.isWin) {
            await this.handleWin(result);
        } else {
            await this.handleLoss();
        }
        
        // Update power-up durations
        this.updatePowerUpDurations();
        
        // Check achievements
        this.checkAchievements();
        
        // Save progress
        this.saveGameProgress();
        
        this.updateDisplay();
        this.gameState.isSpinning = false;
        this.spinButton.disabled = false;
        
        // Auto-spin if enabled
        if (this.gameState.settings.autoSpin && !this.gameState.gameOver) {
            setTimeout(() => this.spin(), 1000);
        }
    }

    // Update individual reel display
    updateReel(reel, symbol) {
        const symbolContainer = reel.querySelector('.symbol-container');
        const img = symbolContainer.querySelector('.slot-symbol');
        img.src = `assets/images/${symbol.image}`;
        img.alt = symbol.name;
    }

    // Check if three symbols match
    checkWinCondition(symbol1, symbol2, symbol3) {
        if (symbol1.name === symbol2.name && symbol2.name === symbol3.name) {
            return {
                isWin: true,
                symbol: symbol1,
                damage: symbol1.damage
            };
        }
        return { isWin: false };
    }

    // Handle winning spin
    async handleWin(result) {
        this.gameState.winCount++;
        this.gameState.consecutiveWins++;
        
        // Calculate damage with power-ups and combo multiplier
        let finalDamage = result.damage;
        let isCritical = Math.random() < 0.15; // 15% critical chance
        
        // Apply double damage power-up
        if (this.gameState.activePowerUps.has('doubleDamage')) {
            finalDamage *= 2;
            this.gameState.activePowerUps.delete('doubleDamage');
            this.gameState.powerUpDurations.delete('doubleDamage');
            this.showFloatingText('Double Damage!', 'powerup');
        }
        
        // Apply combo multiplier
        finalDamage = Math.floor(finalDamage * this.gameState.comboMultiplier);
        
        // Apply critical hit
        if (isCritical) {
            finalDamage = Math.floor(finalDamage * 1.5);
            this.gameState.criticalHits++;
            this.screenShake('strong');
            this.showFloatingText('CRITICAL HIT!', 'critical');
        }
        
        // Update combo multiplier (max 5x)
        if (this.gameState.consecutiveWins % 3 === 0 && this.gameState.comboMultiplier < 5) {
            this.gameState.comboMultiplier += 0.5;
            this.showFloatingText(`Combo ${this.gameState.comboMultiplier}x!`, 'combo');
        }
        
        // Calculate score with combo
        const scoreGain = Math.floor(finalDamage * 10 * this.gameState.comboMultiplier);
        this.gameState.score += scoreGain;
        this.gameState.totalDamageDealt += finalDamage;
        
        // Deal damage to boss
        this.currentBoss.health = Math.max(0, this.currentBoss.health - finalDamage);
        
        // Show damage animation
        await this.showDamageNumber(finalDamage, isCritical);
        
        // Update message
        let message = `🎉 Triple ${result.symbol.name.toUpperCase()}! Dealt ${finalDamage} damage`;
        if (this.gameState.comboMultiplier > 1) {
            message += ` (${this.gameState.comboMultiplier}x combo)`;
        }
        if (isCritical) {
            message += ` - CRITICAL!`;
        }
        message += `!`;
        
        this.gameMessageElement.textContent = message;
        this.gameMessageElement.className = 'game-message win';
        
        // Screen shake for big hits
        if (finalDamage >= 50) {
            this.screenShake('medium');
        }
        
        // Check if boss is defeated
        if (this.currentBoss.health <= 0) {
            await this.defeatBoss();
        }
    }

    // Handle losing spin
    async handleLoss() {
        // Reset combo multiplier
        this.gameState.consecutiveWins = 0;
        this.gameState.comboMultiplier = 1;
        
        // Check if shield is active
        if (this.gameState.activePowerUps.has('shield')) {
            const shieldBlocks = this.gameState.activePowerUps.get('shield');
            if (shieldBlocks > 0) {
                this.gameState.activePowerUps.set('shield', shieldBlocks - 1);
                if (shieldBlocks - 1 <= 0) {
                    this.gameState.activePowerUps.delete('shield');
                    this.gameState.powerUpDurations.delete('shield');
                }
                
                this.gameMessageElement.textContent = 
                    `🛡️ Shield blocked ${this.currentBoss.name}'s attack!`;
                this.gameMessageElement.className = 'game-message';
                this.showFloatingText('BLOCKED!', 'shield');
                return;
            }
        }
        
        // Boss attacks player
        let damage = this.currentBoss.attackDamage;
        
        // Boss critical hit chance
        if (Math.random() < this.currentBoss.criticalChance) {
            damage = Math.floor(damage * 1.5);
            this.screenShake('medium');
            this.showFloatingText('Boss Critical!', 'boss-critical');
        }
        
        this.gameState.playerHealth = Math.max(0, this.gameState.playerHealth - damage);
        
        this.gameMessageElement.textContent = 
            `No match! ${this.currentBoss.name} attacks for ${damage} damage!`;
        this.gameMessageElement.className = 'game-message damage';
        
        // Show damage to player
        this.showFloatingText(`-${damage} HP`, 'damage');
        
        // Check if player is defeated
        if (this.gameState.playerHealth <= 0) {
            await this.gameOver();
        }
    }

    // Handle boss defeat
    async defeatBoss() {
        this.gameState.bossesDefeated++;
        const bonusScore = this.currentBoss.maxHealth * 5;
        this.gameState.score += bonusScore;
        
        // Victory animations
        this.screenShake('strong');
        this.showFloatingText('BOSS DEFEATED!', 'victory');
        await this.delay(1000);
        
        this.victoryMessage.textContent = 
            `You defeated the ${this.currentBoss.name}! Earned ${bonusScore} bonus points!`;
        
        // Check if there are more bosses in current world
        const currentWorldBosses = WORLDS[this.gameState.currentWorldIndex].bosses;
        const currentBossIndexInWorld = currentWorldBosses.indexOf(this.gameState.currentBossIndex);
        
        if (currentBossIndexInWorld < currentWorldBosses.length - 1) {
            // More bosses in current world
            this.victoryModal.classList.remove('hidden');
        } else if (this.gameState.currentWorldIndex < WORLDS.length - 1) {
            // Move to next world
            this.victoryMessage.textContent += ` You've conquered ${this.currentWorld.name}! A new world awaits!`;
            this.victoryModal.classList.remove('hidden');
        } else {
            // Game completed - all worlds conquered
            this.victoryMessage.textContent += ' You have conquered all worlds! You are the ultimate steampunk warrior!';
            this.continueButton.textContent = 'Play Again';
            this.victoryModal.classList.remove('hidden');
        }
        
        // Award free spins for boss defeat
        this.gameState.freeSpinsRemaining += 2;
        this.showFloatingText('+2 Free Spins!', 'bonus');
    }

    // Progress to next boss
    nextBoss() {
        this.victoryModal.classList.add('hidden');
        
        const currentWorldBosses = WORLDS[this.gameState.currentWorldIndex].bosses;
        const currentBossIndexInWorld = currentWorldBosses.indexOf(this.gameState.currentBossIndex);
        
        if (currentBossIndexInWorld < currentWorldBosses.length - 1) {
            // Next boss in current world
            this.gameState.currentBossIndex = currentWorldBosses[currentBossIndexInWorld + 1];
            this.currentBoss = { ...BOSSES[this.gameState.currentBossIndex] };
        } else if (this.gameState.currentWorldIndex < WORLDS.length - 1) {
            // Move to next world
            this.gameState.currentWorldIndex++;
            this.currentWorld = { ...WORLDS[this.gameState.currentWorldIndex] };
            WORLDS[this.gameState.currentWorldIndex].unlocked = true;
            
            // First boss of new world
            this.gameState.currentBossIndex = this.currentWorld.bosses[0];
            this.currentBoss = { ...BOSSES[this.gameState.currentBossIndex] };
            
            // Change background theme
            document.body.style.background = this.currentWorld.background;
            
            this.showFloatingText(`Welcome to ${this.currentWorld.name}!`, 'world');
        } else {
            // All worlds completed, restart game
            this.restartGame();
            return;
        }
        
        // Heal player partially and boost max health
        this.gameState.playerHealth = Math.min(
            this.gameState.maxPlayerHealth, 
            this.gameState.playerHealth + 50
        );
        
        // Increase max health slightly for progression
        this.gameState.maxPlayerHealth += 10;
        this.gameState.playerHealth += 10;
        
        this.gameMessageElement.textContent = 
            `A new challenger appears: ${this.currentBoss.name}!`;
        this.gameMessageElement.className = 'game-message';
        
        this.updateDisplay();
        this.updateWorldDisplay();
    }

    // Jackpot system
    updateJackpotProgress(result) {
        if (result.isWin) {
            // Increase jackpot progress based on symbol rarity
            const progressIncrease = Math.floor((1 - result.symbol.rarity) * 10);
            this.gameState.jackpotProgress += progressIncrease;
            
            // Check for jackpot (rare triple crystal = instant jackpot)
            if (result.symbol.name === 'crystal') {
                this.triggerJackpot();
                return;
            }
            
            // Progressive jackpot at 100 progress
            if (this.gameState.jackpotProgress >= 100) {
                this.triggerJackpot();
            }
        }
        
        this.updateJackpotDisplay();
    }

    // Trigger jackpot
    async triggerJackpot() {
        this.gameState.jackpotProgress = 0;
        const jackpotBonus = 1000 + (this.gameState.currentWorldIndex * 500);
        this.gameState.score += jackpotBonus;
        
        // Unlock jackpot achievement
        this.gameState.achievements.add('jackpot_winner');
        
        // Jackpot celebration
        this.screenShake('extreme');
        this.showFloatingText('🎰 JACKPOT! 🎰', 'jackpot');
        await this.delay(500);
        this.showFloatingText(`+${jackpotBonus} POINTS!`, 'jackpot');
        
        // Award bonus free spins
        this.gameState.freeSpinsRemaining += 5;
        this.showFloatingText('+5 Free Spins!', 'bonus');
    }

    // Update jackpot display
    updateJackpotDisplay() {
        const jackpotFill = this.jackpotProgressElement?.querySelector('.jackpot-fill');
        if (jackpotFill) {
            const percentage = Math.min(100, this.gameState.jackpotProgress);
            jackpotFill.style.width = `${percentage}%`;
        }
    }

    // Handle game over
    gameOver() {
        this.gameState.gameOver = true;
        this.gameOverMessage.textContent = 
            `Your party has been defeated! You defeated ${this.gameState.bossesDefeated} bosses and scored ${this.gameState.score} points.`;
        this.gameOverModal.classList.remove('hidden');
    }

    // Restart the game
    restartGame() {
        this.gameOverModal.classList.add('hidden');
        this.victoryModal.classList.add('hidden');
        
        this.gameState.reset();
        this.gameState.currentBossIndex = 0;
        this.gameState.currentWorldIndex = 0;
        this.currentBoss = { ...BOSSES[0] };
        this.currentWorld = { ...WORLDS[0] };
        
        // Reset world unlocks
        WORLDS.forEach((world, index) => {
            world.unlocked = index === 0;
        });
        
        // Reset background
        document.body.style.background = this.currentWorld.background;
        
        this.gameMessageElement.textContent = 'Welcome to the Enhanced Steampunk Slot Machine RPG! Spin to battle and discover new features!';
        this.gameMessageElement.className = 'game-message';
        
        // Reset reels to default symbols
        this.updateReel(this.reel1, SLOT_SYMBOLS[0]);
        this.updateReel(this.reel2, SLOT_SYMBOLS[1]);
        this.updateReel(this.reel3, SLOT_SYMBOLS[2]);
        
        // Update all displays
        this.updateDisplay();
        this.updateWorldDisplay();
        this.updateAchievementDisplay();
        this.updatePowerUpDisplay();
        
        // Save the reset state
        this.saveGameProgress();
    }

    // Update all display elements
    updateDisplay() {
        // Update score and stats
        this.scoreElement.textContent = this.gameState.score.toLocaleString();
        this.spinCountElement.textContent = this.gameState.spinCount;
        this.winCountElement.textContent = this.gameState.winCount;
        this.bossesDefeatedElement.textContent = this.gameState.bossesDefeated;
        
        // Update new statistics
        if (this.totalDamageElement) {
            this.totalDamageElement.textContent = this.gameState.totalDamageDealt.toLocaleString();
        }
        if (this.criticalHitsElement) {
            this.criticalHitsElement.textContent = this.gameState.criticalHits;
        }
        
        // Update player health
        const playerHealthPercent = (this.gameState.playerHealth / this.gameState.maxPlayerHealth) * 100;
        this.playerHealthBar.style.width = `${playerHealthPercent}%`;
        this.playerHealthText.textContent = `${this.gameState.playerHealth}/${this.gameState.maxPlayerHealth}`;
        
        // Update boss health
        const bossHealthPercent = (this.currentBoss.health / this.currentBoss.maxHealth) * 100;
        this.bossHealthBar.style.width = `${bossHealthPercent}%`;
        this.bossHealthText.textContent = `${this.currentBoss.health}/${this.currentBoss.maxHealth}`;
        
        // Update boss display
        this.bossSprite.src = `assets/images/${this.currentBoss.image}`;
        this.bossSprite.alt = this.currentBoss.name;
        this.bossName.textContent = this.currentBoss.name;
        this.bossLevel.textContent = this.currentBoss.level;
        
        // Update bonus displays
        if (this.comboMultiplierElement) {
            this.comboMultiplierElement.textContent = `×${this.gameState.comboMultiplier}`;
            this.comboMultiplierElement.className = this.gameState.comboMultiplier > 1 ? 'bonus-value active' : 'bonus-value';
        }
        
        if (this.freeSpinsElement) {
            this.freeSpinsElement.textContent = this.gameState.freeSpinsRemaining;
            this.freeSpinsElement.className = this.gameState.freeSpinsRemaining > 0 ? 'bonus-value active' : 'bonus-value';
        }
        
        // Update spin button text
        if (this.gameState.freeSpinsRemaining > 0) {
            this.spinButton.querySelector('span').textContent = 'FREE SPIN';
            this.spinButton.classList.add('free-spin');
        } else {
            this.spinButton.querySelector('span').textContent = 'SPIN';
            this.spinButton.classList.remove('free-spin');
        }
        
        // Update jackpot display
        this.updateJackpotDisplay();
        
        // Update power-up display
        this.updatePowerUpDisplay();
    }

    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialize new UI elements
    initializeUI() {
        this.createPowerUpDisplay();
        this.createWorldProgressDisplay();
        this.createBonusDisplay();
        this.createSettingsModal();
        this.createHelpModal();
        this.createAchievementDisplay();
    }

    // Create power-up display
    createPowerUpDisplay() {
        const powerUpContainer = document.createElement('div');
        powerUpContainer.className = 'power-up-container';
        powerUpContainer.innerHTML = `
            <h3>Active Power-ups</h3>
            <div id="active-powerups" class="active-powerups"></div>
        `;
        
        const playerSection = document.querySelector('.player-section');
        playerSection.appendChild(powerUpContainer);
        this.powerUpContainer = powerUpContainer;
    }

    // Create world progress display
    createWorldProgressDisplay() {
        const worldContainer = document.createElement('div');
        worldContainer.className = 'world-progress-container';
        worldContainer.innerHTML = `
            <h3>World Progress</h3>
            <div id="world-map" class="world-map"></div>
            <div id="current-world-info" class="current-world-info"></div>
        `;
        
        const bossSection = document.querySelector('.boss-section');
        bossSection.appendChild(worldContainer);
        this.worldProgressContainer = worldContainer;
        this.updateWorldDisplay();
    }

    // Create bonus display
    createBonusDisplay() {
        const bonusContainer = document.createElement('div');
        bonusContainer.className = 'bonus-display';
        bonusContainer.innerHTML = `
            <div class="bonus-item">
                <span>Combo: </span>
                <span id="combo-multiplier" class="bonus-value">×1</span>
            </div>
            <div class="bonus-item">
                <span>Free Spins: </span>
                <span id="free-spins" class="bonus-value">0</span>
            </div>
            <div class="bonus-item">
                <span>Jackpot: </span>
                <div id="jackpot-progress" class="jackpot-bar">
                    <div class="jackpot-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        const slotSection = document.querySelector('.slot-machine-section');
        slotSection.appendChild(bonusContainer);
        
        this.comboMultiplierElement = document.getElementById('combo-multiplier');
        this.freeSpinsElement = document.getElementById('free-spins');
        this.jackpotProgressElement = document.getElementById('jackpot-progress');
    }

    // Create settings modal
    createSettingsModal() {
        const settingsModal = document.createElement('div');
        settingsModal.id = 'settings-modal';
        settingsModal.className = 'modal hidden';
        settingsModal.innerHTML = `
            <div class="modal-content">
                <h2>Settings</h2>
                <div class="settings-options">
                    <label>
                        <input type="checkbox" id="sound-toggle" ${this.gameState.settings.soundEnabled ? 'checked' : ''}>
                        Sound Effects
                    </label>
                    <label>
                        <input type="checkbox" id="animations-toggle" ${this.gameState.settings.animationsEnabled ? 'checked' : ''}>
                        Animations
                    </label>
                    <label>
                        <input type="checkbox" id="auto-spin-toggle" ${this.gameState.settings.autoSpin ? 'checked' : ''}>
                        Auto Spin
                    </label>
                </div>
                <div class="modal-buttons">
                    <button id="save-settings" class="continue-button">Save</button>
                    <button id="close-settings" class="restart-button">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(settingsModal);
        this.settingsModal = settingsModal;
        
        // Bind settings events
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        document.getElementById('close-settings').addEventListener('click', () => this.closeSettings());
    }

    // Create help modal
    createHelpModal() {
        const helpModal = document.createElement('div');
        helpModal.id = 'help-modal';
        helpModal.className = 'modal hidden';
        helpModal.innerHTML = `
            <div class="modal-content help-content">
                <h2>How to Play</h2>
                <div class="help-sections">
                    <div class="help-section">
                        <h3>🎰 Slot Machine</h3>
                        <p>Match 3 symbols to deal damage to bosses. Different symbols deal different damage amounts.</p>
                    </div>
                    <div class="help-section">
                        <h3>⚡ Power-ups</h3>
                        <p>Special power-ups appear randomly and provide temporary bonuses like double damage or healing.</p>
                    </div>
                    <div class="help-section">
                        <h3>🔥 Combos</h3>
                        <p>Consecutive wins increase your combo multiplier for bonus damage and score.</p>
                    </div>
                    <div class="help-section">
                        <h3>🌍 Worlds</h3>
                        <p>Progress through different worlds by defeating bosses. Each world has unique themes and challenges.</p>
                    </div>
                    <div class="help-section">
                        <h3>🏆 Achievements</h3>
                        <p>Complete various challenges to unlock achievements and earn bonus rewards.</p>
                    </div>
                </div>
                <button id="close-help" class="continue-button">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        this.helpModal = helpModal;
        
        document.getElementById('close-help').addEventListener('click', () => this.closeHelp());
    }

    // Create achievement display
    createAchievementDisplay() {
        const achievementContainer = document.createElement('div');
        achievementContainer.className = 'achievement-container';
        achievementContainer.innerHTML = `
            <h3>Achievements</h3>
            <div id="achievement-list" class="achievement-list"></div>
        `;
        
        const footer = document.querySelector('.game-footer');
        footer.appendChild(achievementContainer);
        this.achievementContainer = achievementContainer;
        this.updateAchievementDisplay();
    }

    // Power-up system methods
    activatePowerUp(powerUpType) {
        const powerUp = POWER_UPS[powerUpType];
        if (!powerUp) return;

        switch (powerUp.effect) {
            case 'doubleDamage':
                this.gameState.activePowerUps.set('doubleDamage', true);
                this.gameState.powerUpDurations.set('doubleDamage', powerUp.duration);
                break;
            case 'heal':
                this.gameState.playerHealth = Math.min(
                    this.gameState.maxPlayerHealth,
                    this.gameState.playerHealth + 30
                );
                this.showFloatingText('+30 HP', 'heal');
                break;
            case 'shield':
                this.gameState.activePowerUps.set('shield', 2);
                this.gameState.powerUpDurations.set('shield', powerUp.duration);
                break;
            case 'freeSpins':
                this.gameState.freeSpinsRemaining += 3;
                this.showFloatingText('+3 Free Spins!', 'bonus');
                break;
            case 'comboBoost':
                this.gameState.comboMultiplier += 1;
                this.gameState.powerUpDurations.set('comboBoost', powerUp.duration);
                break;
        }

        this.updatePowerUpDisplay();
        this.showFloatingText(`${powerUp.name} Activated!`, 'powerup');
    }

    // Generate random power-up (5% chance)
    checkForPowerUp() {
        if (Math.random() < 0.05) {
            const powerUpTypes = Object.keys(POWER_UPS);
            const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            this.activatePowerUp(randomPowerUp);
            return true;
        }
        return false;
    }

    // Update power-up durations
    updatePowerUpDurations() {
        for (const [powerUp, duration] of this.gameState.powerUpDurations.entries()) {
            if (duration > 0) {
                this.gameState.powerUpDurations.set(powerUp, duration - 1);
            } else {
                this.gameState.activePowerUps.delete(powerUp);
                this.gameState.powerUpDurations.delete(powerUp);
            }
        }
        this.updatePowerUpDisplay();
    }

    // Update power-up display
    updatePowerUpDisplay() {
        const container = document.getElementById('active-powerups');
        if (!container) return;

        container.innerHTML = '';
        
        for (const [powerUpName, value] of this.gameState.activePowerUps.entries()) {
            const powerUpElement = document.createElement('div');
            powerUpElement.className = 'power-up-item';
            
            const powerUpData = Object.values(POWER_UPS).find(p => p.effect === powerUpName);
            const duration = this.gameState.powerUpDurations.get(powerUpName) || 0;
            
            powerUpElement.innerHTML = `
                <span class="power-up-icon">${powerUpData?.icon || '⚡'}</span>
                <span class="power-up-name">${powerUpData?.name || powerUpName}</span>
                ${duration > 0 ? `<span class="power-up-duration">${duration}</span>` : ''}
            `;
            
            container.appendChild(powerUpElement);
        }
    }

    // Animation system
    async showFloatingText(text, type = 'default') {
        if (!this.gameState.settings.animationsEnabled) return;

        const floatingText = document.createElement('div');
        floatingText.className = `floating-text floating-text-${type}`;
        floatingText.textContent = text;
        
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(floatingText);
        
        // Position randomly in the center area
        const rect = gameContainer.getBoundingClientRect();
        floatingText.style.left = `${rect.width * 0.3 + Math.random() * rect.width * 0.4}px`;
        floatingText.style.top = `${rect.height * 0.4}px`;
        
        // Animate
        floatingText.style.animation = 'floatUp 2s ease-out forwards';
        
        await this.delay(2000);
        floatingText.remove();
    }

    // Screen shake effect
    screenShake(intensity = 'medium') {
        if (!this.gameState.settings.animationsEnabled) return;

        const gameContainer = document.querySelector('.game-container');
        const shakeClass = `shake-${intensity}`;
        
        gameContainer.classList.add(shakeClass);
        setTimeout(() => {
            gameContainer.classList.remove(shakeClass);
        }, 500);
    }

    // Damage number animation
    async showDamageNumber(damage, isCritical = false) {
        if (!this.gameState.settings.animationsEnabled) return;

        const damageElement = document.createElement('div');
        damageElement.className = `damage-number ${isCritical ? 'critical' : ''}`;
        damageElement.textContent = `-${damage}`;
        
        const bossSprite = this.bossSprite;
        const rect = bossSprite.getBoundingClientRect();
        
        damageElement.style.position = 'absolute';
        damageElement.style.left = `${rect.left + rect.width / 2}px`;
        damageElement.style.top = `${rect.top}px`;
        damageElement.style.zIndex = '1000';
        
        document.body.appendChild(damageElement);
        
        // Animate
        damageElement.style.animation = 'damageFloat 1.5s ease-out forwards';
        
        await this.delay(1500);
        damageElement.remove();
    }

    // Load game progress
    loadGameProgress() {
        if (this.gameState.load()) {
            this.currentBoss = { ...BOSSES[this.gameState.currentBossIndex] };
            this.currentWorld = { ...WORLDS[this.gameState.currentWorldIndex] };
            this.unlockWorlds();
        }
    }

    // Save game progress
    saveGameProgress() {
        this.gameState.save();
    }

    // World progression methods
    unlockWorlds() {
        for (let i = 0; i <= this.gameState.currentWorldIndex; i++) {
            WORLDS[i].unlocked = true;
        }
    }

    // Update world display
    updateWorldDisplay() {
        const worldMap = document.getElementById('world-map');
        const worldInfo = document.getElementById('current-world-info');
        
        if (!worldMap || !worldInfo) return;

        // Update world map
        worldMap.innerHTML = '';
        WORLDS.forEach((world, index) => {
            const worldElement = document.createElement('div');
            worldElement.className = `world-node ${world.unlocked ? 'unlocked' : 'locked'} ${index === this.gameState.currentWorldIndex ? 'current' : ''}`;
            worldElement.innerHTML = `
                <div class="world-icon">${index + 1}</div>
                <div class="world-name">${world.name}</div>
            `;
            worldMap.appendChild(worldElement);
        });

        // Update current world info
        worldInfo.innerHTML = `
            <h4>${this.currentWorld.name}</h4>
            <p>${this.currentWorld.description}</p>
        `;
    }

    // Achievement system
    checkAchievements() {
        for (const achievement of Object.values(ACHIEVEMENTS)) {
            if (!this.gameState.achievements.has(achievement.id) && achievement.condition(this)) {
                this.unlockAchievement(achievement);
            }
        }
    }

    // Unlock achievement
    unlockAchievement(achievement) {
        this.gameState.achievements.add(achievement.id);
        this.showFloatingText(`Achievement Unlocked: ${achievement.name}!`, 'achievement');
        this.updateAchievementDisplay();
        
        // Bonus score for achievements
        this.gameState.score += 100;
    }

    // Update achievement display
    updateAchievementDisplay() {
        const achievementList = document.getElementById('achievement-list');
        if (!achievementList) return;

        achievementList.innerHTML = '';
        
        Object.values(ACHIEVEMENTS).forEach(achievement => {
            const isUnlocked = this.gameState.achievements.has(achievement.id);
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            achievementElement.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            `;
            achievementList.appendChild(achievementElement);
        });
    }

    // Settings methods
    saveSettings() {
        this.gameState.settings.soundEnabled = document.getElementById('sound-toggle').checked;
        this.gameState.settings.animationsEnabled = document.getElementById('animations-toggle').checked;
        this.gameState.settings.autoSpin = document.getElementById('auto-spin-toggle').checked;
        this.saveGameProgress();
        this.closeSettings();
    }

    closeSettings() {
        this.settingsModal.classList.add('hidden');
    }

    closeHelp() {
        this.helpModal.classList.add('hidden');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎰 Enhanced Steampunk Slot Machine RPG - Game Engine Loaded');
    console.log('🔧 Press SPACE or click SPIN to play!');
    console.log('❓ Press H for Help, S for Settings, ESC to close modals');
    
    // Create game instance
    window.game = new SlotMachineRPG();
    
    // Display enhanced welcome message
    const gameMessage = document.getElementById('game-message');
    gameMessage.textContent = 'Welcome to the Enhanced Steampunk Slot Machine RPG! Discover power-ups, combos, and multiple worlds!';
    gameMessage.className = 'game-message';
    
    console.log('⚙️ Enhanced Game initialized successfully!');
    console.log('🎯 Objective: Defeat all bosses across multiple worlds!');
    console.log('💡 New Features:');
    console.log('  ⚡ Power-ups: Random bonuses like double damage, healing, shields');
    console.log('  🔥 Combo System: Consecutive wins increase damage multiplier');
    console.log('  🎰 Free Spins: Earn free spins from power-ups and boss defeats');
    console.log('  💰 Jackpot: Progressive jackpot system with rare combinations');
    console.log('  🌍 World Progression: Multiple themed worlds to explore');
    console.log('  🏆 Achievements: Complete challenges to unlock rewards');
    console.log('  💾 Auto-Save: Your progress is automatically saved');
    console.log('  🎨 Enhanced Animations: Smooth effects and visual feedback');
    console.log('💡 Pro Tips:');
    console.log('  • Build combo streaks for maximum damage');
    console.log('  • Use power-ups strategically against tough bosses');
    console.log('  • Crystal symbols have the highest damage and jackpot potential');
    console.log('  • Shield power-ups can save you from boss attacks');
    console.log('  • Each world has unique themes and stronger bosses');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SlotMachineRPG, GameState, SLOT_SYMBOLS, BOSSES };
}