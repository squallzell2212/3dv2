/**
 * Integrated 3D Slot Machine Game
 * Combines Enhanced5x5SlotMachine, 3D Renderer, Animation Controller, and Bonus Features
 * Complete game implementation with UI integration
 */

// Symbol definitions from enhanced game logic
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
    horizontal: [
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], 
        [15, 16, 17, 18, 19], [20, 21, 22, 23, 24]
    ],
    vertical: [
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], 
        [3, 8, 13, 18, 23], [4, 9, 14, 19, 24]
    ],
    diagonal: [
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ],
    patterns: [
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20], [2, 6, 12, 18, 22], 
        [10, 11, 12, 13, 14], [0, 1, 4, 20, 24], [0, 4, 12, 20, 24],
        [0, 6, 12, 8, 4], [20, 16, 12, 18, 24]
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

    generateGrid() {
        this.grid = [];
        for (let i = 0; i < GRID_CONFIG.TOTAL_POSITIONS; i++) {
            this.grid[i] = this.getRandomSymbol();
        }
        return this.grid;
    }

    getSymbolAt(row, col) {
        const index = row * GRID_CONFIG.COLS + col;
        return this.grid[index];
    }

    setSymbolAt(row, col, symbol) {
        const index = row * GRID_CONFIG.COLS + col;
        this.grid[index] = symbol;
    }

    indexToCoords(index) {
        return {
            row: Math.floor(index / GRID_CONFIG.COLS),
            col: index % GRID_CONFIG.COLS
        };
    }

    coordsToIndex(row, col) {
        return row * GRID_CONFIG.COLS + col;
    }

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
                if (currentMatch.length >= GRID_CONFIG.MIN_MATCH_LENGTH) {
                    wins.push({
                        symbol: currentMatch.symbol,
                        positions: [...currentMatch.positions],
                        length: currentMatch.length,
                        damage: this.calculateMatchDamage(currentMatch.symbol, currentMatch.length)
                    });
                }
                
                currentMatch = {
                    symbol: symbols[i],
                    positions: [payline[i]],
                    length: 1
                };
            }
        }
        
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

    calculateMatchDamage(symbol, matchLength) {
        let baseDamage = symbol.damage;
        const lengthMultiplier = { 3: 1.0, 4: 1.5, 5: 2.0 };
        return Math.floor(baseDamage * (lengthMultiplier[matchLength] || 1.0));
    }

    analyzeAllPaylines() {
        this.winningCombinations = [];
        this.activePaylines = [];
        
        // Check all payline types
        ['horizontal', 'vertical', 'diagonal', 'patterns'].forEach(type => {
            PAYLINES[type].forEach((payline, index) => {
                const wins = this.checkPaylineWin(payline);
                if (wins.length > 0) {
                    this.activePaylines.push({ type, index, payline });
                    this.winningCombinations.push(...wins);
                }
            });
        });
        
        return this.winningCombinations;
    }

    calculateTotalDamage() {
        this.totalDamage = this.winningCombinations.reduce((total, win) => {
            return total + win.damage;
        }, 0);
        
        this.totalDamage = Math.floor(this.totalDamage * this.multiplier);
        return this.totalDamage;
    }

    updateComboSystem(hasWin) {
        if (hasWin) {
            this.comboCount++;
            this.multiplier = Math.min(5.0, 1.0 + Math.floor(this.comboCount / 3) * 0.5);
        } else {
            this.comboCount = 0;
            this.multiplier = 1.0;
        }
    }

    updateJackpotProgress() {
        this.grid.forEach(symbol => {
            const progressValue = Math.floor((1 - symbol.rarity) * 10);
            this.jackpotProgress += progressValue;
        });
        
        const crystalCount = this.winningCombinations.filter(win => 
            win.symbol.name === 'Crystal' && win.length >= 3
        ).length;
        
        if (crystalCount > 0) {
            this.jackpotProgress = 100;
        }
        
        this.jackpotProgress = Math.min(100, this.jackpotProgress);
    }

    isJackpotTriggered() {
        return this.jackpotProgress >= 100;
    }

    resetJackpot() {
        this.jackpotProgress = 0;
    }

    getWinningPositions() {
        const positions = new Set();
        this.winningCombinations.forEach(win => {
            win.positions.forEach(pos => positions.add(pos));
        });
        return Array.from(positions);
    }

    spin() {
        this.generateGrid();
        const wins = this.analyzeAllPaylines();
        const hasWin = wins.length > 0;
        
        this.updateComboSystem(hasWin);
        this.updateJackpotProgress();
        
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
}

/**
 * Bonus Feature System
 */
class BonusFeatureSystem {
    constructor(slotMachine) {
        this.slotMachine = slotMachine;
        this.activeBonuses = new Map();
        this.bonusHistory = [];
    }

    static POWER_UPS = {
        DOUBLE_DAMAGE: { name: 'Double Damage', effect: 'Next attack deals 2x damage', duration: 3, chance: 0.05 },
        STEAM_HEALING: { name: 'Steam Healing', effect: 'Instantly restore 30 health points', duration: 0, chance: 0.05 },
        MECHANICAL_SHIELD: { name: 'Mechanical Shield', effect: 'Block next 2 enemy attacks', duration: 2, chance: 0.05 },
        MULTI_SPIN: { name: 'Multi-Spin', effect: 'Receive 3 free spins', duration: 0, chance: 0.05 },
        COMBO_BOOST: { name: 'Combo Boost', effect: 'Increase combo multiplier by 1', duration: 5, chance: 0.05 }
    };

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

        this.bonusHistory.push({ ...bonus, activatedAt: Date.now() });
        return bonus;
    }

    updateBonusDurations() {
        const expiredBonuses = [];

        this.activeBonuses.forEach((bonus, id) => {
            bonus.remainingTurns--;
            if (bonus.remainingTurns <= 0) {
                expiredBonuses.push(id);
            }
        });

        expiredBonuses.forEach(id => {
            this.activeBonuses.delete(id);
        });

        return expiredBonuses;
    }

    getActiveBonuses() {
        return Array.from(this.activeBonuses.values());
    }

    isBonusActive(bonusName) {
        return Array.from(this.activeBonuses.values()).some(
            bonus => bonus.name === bonusName
        );
    }

    applyBonusEffects(baseDamage) {
        let modifiedDamage = baseDamage;

        if (this.isBonusActive('Double Damage')) {
            modifiedDamage *= 2;
        }

        if (this.isBonusActive('Combo Boost')) {
            this.slotMachine.multiplier += 1;
        }

        return Math.floor(modifiedDamage);
    }
}

/**
 * 3D Renderer for Slot Machine
 */
class SlotMachine3DRenderer {
    constructor(containerId, slotMachine) {
        this.container = document.getElementById(containerId);
        this.slotMachine = slotMachine;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        this.symbolMeshes = [];
        this.gridPositions = [];
        this.symbolGeometries = new Map();
        this.symbolMaterials = new Map();
        
        this.ambientLight = null;
        this.directionalLight = null;
        this.pointLights = [];
        
        this.isSpinning = false;
        this.spinSpeed = 0;
        this.targetRotation = 0;
        this.animationMixer = null;
        
        this.GRID_ROWS = 5;
        this.GRID_COLS = 5;
        this.SYMBOL_SIZE = 1.2;
        this.GRID_SPACING = 1.5;
        
        this.SYMBOL_CONFIGS = {
            'Crystal': { color: 0x9966ff, emissive: 0x4433aa, geometry: 'octahedron', scale: 1.0, metalness: 0.1, roughness: 0.2 },
            'Sword': { color: 0xcccccc, emissive: 0x333333, geometry: 'cylinder', scale: 1.2, metalness: 0.8, roughness: 0.3 },
            'Shield': { color: 0x8b4513, emissive: 0x2d1505, geometry: 'sphere', scale: 1.0, metalness: 0.6, roughness: 0.4 },
            'Armor': { color: 0x696969, emissive: 0x1a1a1a, geometry: 'box', scale: 1.1, metalness: 0.9, roughness: 0.2 },
            'Gear': { color: 0xcd7f32, emissive: 0x3d2610, geometry: 'torus', scale: 0.9, metalness: 0.7, roughness: 0.3 },
            'Pipe': { color: 0x8b4513, emissive: 0x2d1505, geometry: 'cylinder', scale: 0.8, metalness: 0.5, roughness: 0.6 },
            'Potion': { color: 0x32cd32, emissive: 0x0a330a, geometry: 'sphere', scale: 0.9, metalness: 0.1, roughness: 0.1 },
            'Button': { color: 0xff6347, emissive: 0x4d1e17, geometry: 'cylinder', scale: 0.7, metalness: 0.3, roughness: 0.5 }
        };
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.createSymbolGeometries();
        this.createSymbolMaterials();
        this.setupGrid();
        this.setupEventListeners();
        this.startRenderLoop();
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    }
    
    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 12);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    setupLighting() {
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(this.ambientLight);
        
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(5, 10, 5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.scene.add(this.directionalLight);
        
        const pointLight1 = new THREE.PointLight(0xff6b35, 0.5, 20);
        pointLight1.position.set(-8, 5, 8);
        this.scene.add(pointLight1);
        this.pointLights.push(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x35a7ff, 0.5, 20);
        pointLight2.position.set(8, 5, 8);
        this.scene.add(pointLight2);
        this.pointLights.push(pointLight2);
    }
    
    createSymbolGeometries() {
        this.symbolGeometries.set('octahedron', new THREE.OctahedronGeometry(this.SYMBOL_SIZE));
        this.symbolGeometries.set('cylinder', new THREE.CylinderGeometry(this.SYMBOL_SIZE * 0.5, this.SYMBOL_SIZE * 0.5, this.SYMBOL_SIZE * 1.5));
        this.symbolGeometries.set('sphere', new THREE.SphereGeometry(this.SYMBOL_SIZE));
        this.symbolGeometries.set('box', new THREE.BoxGeometry(this.SYMBOL_SIZE, this.SYMBOL_SIZE, this.SYMBOL_SIZE));
        this.symbolGeometries.set('torus', new THREE.TorusGeometry(this.SYMBOL_SIZE * 0.7, this.SYMBOL_SIZE * 0.3));
    }
    
    createSymbolMaterials() {
        Object.entries(this.SYMBOL_CONFIGS).forEach(([name, config]) => {
            const material = new THREE.MeshStandardMaterial({
                color: config.color,
                emissive: config.emissive,
                metalness: config.metalness,
                roughness: config.roughness
            });
            this.symbolMaterials.set(name, material);
        });
    }
    
    setupGrid() {
        this.symbolMeshes = [];
        this.gridPositions = [];
        
        for (let row = 0; row < this.GRID_ROWS; row++) {
            for (let col = 0; col < this.GRID_COLS; col++) {
                const x = (col - 2) * this.GRID_SPACING;
                const y = (2 - row) * this.GRID_SPACING;
                const z = 0;
                
                this.gridPositions.push(new THREE.Vector3(x, y, z));
                
                // Create initial symbol mesh
                const symbol = this.slotMachine.getSymbolAt(row, col) || SLOT_SYMBOLS[0];
                const mesh = this.createSymbolMesh(symbol);
                mesh.position.copy(this.gridPositions[row * this.GRID_COLS + col]);
                
                this.scene.add(mesh);
                this.symbolMeshes.push(mesh);
            }
        }
    }
    
    createSymbolMesh(symbol) {
        const config = this.SYMBOL_CONFIGS[symbol.name];
        const geometry = this.symbolGeometries.get(config.geometry);
        const material = this.symbolMaterials.get(symbol.name);
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.setScalar(config.scale);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { symbol: symbol };
        
        return mesh;
    }
    
    updateGrid(grid) {
        grid.forEach((symbol, index) => {
            if (this.symbolMeshes[index]) {
                this.scene.remove(this.symbolMeshes[index]);
            }
            
            const mesh = this.createSymbolMesh(symbol);
            mesh.position.copy(this.gridPositions[index]);
            
            this.scene.add(mesh);
            this.symbolMeshes[index] = mesh;
        });
    }
    
    animateSpin(duration = 2000) {
        this.isSpinning = true;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for realistic spin
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            this.symbolMeshes.forEach((mesh, index) => {
                if (mesh) {
                    mesh.rotation.y = easeOut * Math.PI * 4;
                    mesh.rotation.x = easeOut * Math.PI * 2;
                }
            });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                // Reset rotations
                this.symbolMeshes.forEach(mesh => {
                    if (mesh) {
                        mesh.rotation.set(0, 0, 0);
                    }
                });
            }
        };
        
        animate();
    }
    
    highlightWinningPositions(positions) {
        // Reset all materials
        this.symbolMeshes.forEach(mesh => {
            if (mesh && mesh.userData.symbol) {
                const symbolName = mesh.userData.symbol.name;
                mesh.material = this.symbolMaterials.get(symbolName);
            }
        });
        
        // Highlight winning positions
        positions.forEach(position => {
            if (this.symbolMeshes[position]) {
                const mesh = this.symbolMeshes[position];
                const highlightMaterial = mesh.material.clone();
                highlightMaterial.emissive.setHex(0xffd700);
                highlightMaterial.emissiveIntensity = 0.5;
                mesh.material = highlightMaterial;
            }
        });
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            const aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }
    
    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            const delta = this.clock.getDelta();
            
            // Rotate symbols slowly for ambient animation
            if (!this.isSpinning) {
                this.symbolMeshes.forEach((mesh, index) => {
                    if (mesh) {
                        mesh.rotation.y += delta * 0.5;
                    }
                });
            }
            
            // Animate point lights
            this.pointLights.forEach((light, index) => {
                const time = Date.now() * 0.001;
                light.intensity = 0.5 + Math.sin(time + index * Math.PI) * 0.2;
            });
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }
}

/**
 * Main Game Controller
 */
class SlotMachineGame {
    constructor() {
        this.slotMachine = new Enhanced5x5SlotMachine();
        this.bonusSystem = new BonusFeatureSystem(this.slotMachine);
        this.renderer3D = null;
        
        // Game state
        this.playerHealth = 100;
        this.maxHealth = 100;
        // Start players with some credits so they can spin immediately
        this.score = 100;
        this.totalSpins = 0;
        this.totalWins = 0;
        this.betAmount = 10;
        this.isAutoSpinning = false;
        this.autoSpinCount = 0;
        this.freeSpins = 0;
        
        // World and boss system
        this.currentWorld = 0;
        this.worlds = [
            { name: 'Mechanical Foundry', boss: { name: 'Mechanical Spider', health: 100, maxHealth: 100, attack: 15 } },
            { name: 'Steam Gardens', boss: { name: 'Steam Golem', health: 150, maxHealth: 150, attack: 20 } },
            { name: 'Sky Fortress', boss: { name: 'Airship Captain', health: 200, maxHealth: 200, attack: 25 } }
        ];
        
        // UI elements
        this.elements = {};
        
        this.init();
    }
    
    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeGame();
        this.hideLoadingScreen();
    }
    
    initializeElements() {
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            loadingBar: document.getElementById('loading-bar'),
            loadingText: document.querySelector('.loading-text'),
            
            scoreDisplay: document.getElementById('score-display'),
            healthFill: document.getElementById('health-fill'),
            healthText: document.getElementById('health-text'),
            comboDisplay: document.getElementById('combo-display'),
            jackpotFill: document.getElementById('jackpot-fill'),
            jackpotText: document.getElementById('jackpot-text'),
            
            spinBtn: document.getElementById('spin-btn'),
            betAmount: document.getElementById('bet-amount'),
            betDecrease: document.getElementById('bet-decrease'),
            betIncrease: document.getElementById('bet-increase'),
            autoSpinBtn: document.getElementById('auto-spin-btn'),
            addFundsBtn: document.getElementById('add-funds-btn'),
            addFundsAmount: document.getElementById('add-funds-amount'),
            
            activeBonuses: document.getElementById('active-bonuses'),
            worldName: document.getElementById('world-name'),
            worldLevel: document.getElementById('world-level'),
            bossName: document.getElementById('boss-name'),
            bossHealthFill: document.getElementById('boss-health-fill'),
            bossHealthText: document.getElementById('boss-health-text'),
            recentWins: document.getElementById('recent-wins'),
            
            helpBtn: document.getElementById('help-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            
            helpModal: document.getElementById('help-modal'),
            settingsModal: document.getElementById('settings-modal'),
            gameOverModal: document.getElementById('game-over-modal'),
            victoryModal: document.getElementById('victory-modal'),
            
            achievementNotifications: document.getElementById('achievement-notifications')
        };
    }
    
    setupEventListeners() {
        // Spin button
        this.elements.spinBtn.addEventListener('click', () => this.spin());
        
        // Bet controls
        this.elements.betDecrease.addEventListener('click', () => this.adjustBet(-1));
        this.elements.betIncrease.addEventListener('click', () => this.adjustBet(1));
        this.elements.betAmount.addEventListener('change', (e) => {
            this.betAmount = Math.max(1, Math.min(100, parseInt(e.target.value) || 10));
            this.updateUI();
        });
        
        // Auto spin
        this.elements.autoSpinBtn.addEventListener('click', () => this.toggleAutoSpin());

        // Add funds control
        this.elements.addFundsBtn.addEventListener('click', () => {
            const amount = parseInt(this.elements.addFundsAmount.value) || 0;
            if (amount > 0) {
                this.score += amount;
                this.updateUI();
            }
        });
        
        // Modal controls
        this.elements.helpBtn.addEventListener('click', () => this.showModal('help'));
        this.elements.settingsBtn.addEventListener('click', () => this.showModal('settings'));
        this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal);
            });
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.spin();
                    break;
                case 'KeyH':
                    this.showModal('help');
                    break;
                case 'KeyS':
                    this.showModal('settings');
                    break;
                case 'Escape':
                    this.hideAllModals();
                    break;
            }
        });
        
        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });
    }
    
    initializeGame() {
        // Initialize 3D renderer
        this.renderer3D = new SlotMachine3DRenderer('slot-machine-3d', this.slotMachine);
        
        // Generate initial grid
        this.slotMachine.generateGrid();
        this.renderer3D.updateGrid(this.slotMachine.grid);
        
        // Update UI
        this.updateUI();
        
        // Simulate loading
        this.simulateLoading();
    }
    
    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            progress = Math.min(progress, 100);
            
            this.elements.loadingBar.style.width = progress + '%';
            
            if (progress < 30) {
                this.elements.loadingText.textContent = 'Loading 3D assets...';
            } else if (progress < 60) {
                this.elements.loadingText.textContent = 'Initializing game engine...';
            } else if (progress < 90) {
                this.elements.loadingText.textContent = 'Setting up steampunk world...';
            } else {
                this.elements.loadingText.textContent = 'Ready to play!';
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => this.hideLoadingScreen(), 500);
            }
        }, 100);
    }
    
    hideLoadingScreen() {
        this.elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            this.elements.loadingScreen.style.display = 'none';
        }, 500);
    }
    
    spin() {
        if (this.elements.spinBtn.disabled || this.renderer3D.isSpinning) return;
        
        // Check if player can afford the bet
        if (this.score < this.betAmount && this.freeSpins === 0) {
            this.showNotification('Insufficient funds!', 'warning');
            return;
        }
        
        // Deduct bet or free spin
        if (this.freeSpins > 0) {
            this.freeSpins--;
        } else {
            this.score -= this.betAmount;
        }
        
        this.totalSpins++;
        
        // Disable spin button during animation
        this.elements.spinBtn.disabled = true;
        
        // Start 3D animation
        this.renderer3D.animateSpin(2000);
        
        // Perform spin after animation delay
        setTimeout(() => {
            const result = this.slotMachine.spin();
            this.processSpinResult(result);
            
            // Re-enable spin button
            this.elements.spinBtn.disabled = false;
            
            // Continue auto spin if active
            if (this.isAutoSpinning && this.autoSpinCount > 0) {
                this.autoSpinCount--;
                if (this.autoSpinCount > 0) {
                    setTimeout(() => this.spin(), 1000);
                } else {
                    this.toggleAutoSpin();
                }
            }
        }, 1500);
        
        this.updateUI();
    }
    
    processSpinResult(result) {
        // Update 3D renderer
        this.renderer3D.updateGrid(result.grid);
        
        if (result.wins.length > 0) {
            this.totalWins++;
            
            // Highlight winning positions
            this.renderer3D.highlightWinningPositions(result.winningPositions);
            
            // Apply bonus effects
            const finalDamage = this.bonusSystem.applyBonusEffects(result.totalDamage);
            
            // Deal damage to boss
            this.dealDamageToBoss(finalDamage);
            
            // Add to score
            this.score += finalDamage * 10;
            
            // Show damage numbers
            this.showDamageNumbers(finalDamage, result.winningPositions);
            
            // Add to recent wins
            this.addRecentWin(result.wins[0]);
            
            // Check for jackpot
            if (result.isJackpot) {
                this.triggerJackpot();
            }
        }
        
        // Check for power-up activation
        const activatedPowerUps = this.bonusSystem.checkPowerUpActivation();
        activatedPowerUps.forEach(powerUp => {
            this.showNotification(`${powerUp.name} activated!`, 'success');
            this.applyPowerUpEffect(powerUp);
        });
        
        // Update bonus durations
        this.bonusSystem.updateBonusDurations();
        
        // Boss attack (if boss is alive)
        if (this.getCurrentBoss().health > 0) {
            setTimeout(() => this.bossAttack(), 1000);
        }
        
        this.updateUI();
    }
    
    dealDamageToBoss(damage) {
        const boss = this.getCurrentBoss();
        boss.health = Math.max(0, boss.health - damage);
        
        if (boss.health === 0) {
            this.defeatBoss();
        }
    }
    
    defeatBoss() {
        this.showNotification('Boss defeated!', 'success');
        this.score += 1000;
        this.freeSpins += 5;
        
        // Advance to next world
        if (this.currentWorld < this.worlds.length - 1) {
            this.currentWorld++;
            this.getCurrentBoss().health = this.getCurrentBoss().maxHealth;
            this.showNotification(`Welcome to ${this.getCurrentWorld().name}!`, 'info');
        } else {
            this.showVictory();
        }
    }
    
    bossAttack() {
        const boss = this.getCurrentBoss();
        if (boss.health <= 0) return;
        
        // Check for shield protection
        if (this.bonusSystem.isBonusActive('Mechanical Shield')) {
            this.showNotification('Attack blocked by shield!', 'info');
            return;
        }
        
        const damage = boss.attack;
        this.playerHealth = Math.max(0, this.playerHealth - damage);
        
        this.showNotification(`Boss deals ${damage} damage!`, 'warning');
        
        if (this.playerHealth === 0) {
            this.gameOver();
        }
    }
    
    applyPowerUpEffect(powerUp) {
        switch (powerUp.name) {
            case 'Steam Healing':
                this.playerHealth = Math.min(this.maxHealth, this.playerHealth + 30);
                break;
            case 'Multi-Spin':
                this.freeSpins += 3;
                break;
        }
    }
    
    triggerJackpot() {
        this.showNotification('JACKPOT!', 'success');
        this.score += 5000;
        this.freeSpins += 10;
        this.slotMachine.resetJackpot();
    }
    
    adjustBet(delta) {
        this.betAmount = Math.max(1, Math.min(100, this.betAmount + delta));
        this.elements.betAmount.value = this.betAmount;
        this.updateUI();
    }
    
    toggleAutoSpin() {
        this.isAutoSpinning = !this.isAutoSpinning;
        
        if (this.isAutoSpinning) {
            this.autoSpinCount = parseInt(document.getElementById('auto-spin-count').value) || 10;
            this.elements.autoSpinBtn.classList.add('active');
            this.elements.autoSpinBtn.querySelector('.auto-spin-status').textContent = 'ON';
            this.spin();
        } else {
            this.autoSpinCount = 0;
            this.elements.autoSpinBtn.classList.remove('active');
            this.elements.autoSpinBtn.querySelector('.auto-spin-status').textContent = 'OFF';
        }
    }
    
    getCurrentWorld() {
        return this.worlds[this.currentWorld];
    }
    
    getCurrentBoss() {
        return this.getCurrentWorld().boss;
    }
    
    updateUI() {
        // Update stats
        this.elements.scoreDisplay.textContent = this.score.toLocaleString();
        this.elements.healthFill.style.width = (this.playerHealth / this.maxHealth * 100) + '%';
        this.elements.healthText.textContent = `${this.playerHealth}/${this.maxHealth}`;
        this.elements.comboDisplay.textContent = this.slotMachine.multiplier.toFixed(1) + 'x';
        this.elements.jackpotFill.style.width = this.slotMachine.jackpotProgress + '%';
        this.elements.jackpotText.textContent = this.slotMachine.jackpotProgress + '%';
        
        // Update spin button
        const spinText = this.freeSpins > 0 ? 'FREE SPIN' : 'SPIN';
        const spinCost = this.freeSpins > 0 ? `Free (${this.freeSpins} left)` : `Cost: ${this.betAmount}`;
        this.elements.spinBtn.querySelector('.spin-text').textContent = spinText;
        this.elements.spinBtn.querySelector('.spin-cost').textContent = spinCost;
        
        // Update world info
        const world = this.getCurrentWorld();
        const boss = this.getCurrentBoss();
        this.elements.worldName.textContent = world.name;
        this.elements.worldLevel.textContent = `Level ${this.currentWorld + 1}`;
        this.elements.bossName.textContent = boss.name;
        this.elements.bossHealthFill.style.width = (boss.health / boss.maxHealth * 100) + '%';
        this.elements.bossHealthText.textContent = `${boss.health}/${boss.maxHealth}`;
        
        // Update active bonuses
        this.updateActiveBonusesDisplay();
    }
    
    updateActiveBonusesDisplay() {
        const bonuses = this.bonusSystem.getActiveBonuses();
        
        if (bonuses.length === 0) {
            this.elements.activeBonuses.innerHTML = '<p class="no-bonuses">No active bonuses</p>';
        } else {
            this.elements.activeBonuses.innerHTML = bonuses.map(bonus => `
                <div class="bonus-item">
                    <div class="bonus-name">${bonus.name}</div>
                    <div class="bonus-duration">${bonus.remainingTurns} turns left</div>
                </div>
            `).join('');
        }
    }
    
    addRecentWin(win) {
        const winElement = document.createElement('div');
        winElement.className = 'win-item';
        winElement.innerHTML = `
            <div class="win-symbol">${win.symbol.name} x${win.length}</div>
            <div class="win-damage">${win.damage} damage</div>
        `;
        
        this.elements.recentWins.insertBefore(winElement, this.elements.recentWins.firstChild);
        
        // Keep only last 5 wins
        while (this.elements.recentWins.children.length > 5) {
            this.elements.recentWins.removeChild(this.elements.recentWins.lastChild);
        }
        
        // Remove "no wins" message
        const noWins = this.elements.recentWins.querySelector('.no-wins');
        if (noWins) noWins.remove();
    }
    
    showDamageNumbers(damage, positions) {
        positions.forEach((position, index) => {
            setTimeout(() => {
                const coords = this.slotMachine.indexToCoords(position);
                const damageElement = document.createElement('div');
                damageElement.className = 'damage-number';
                damageElement.textContent = Math.floor(damage / positions.length);
                damageElement.style.left = (coords.col * 20 + 10) + '%';
                damageElement.style.top = (coords.row * 20 + 10) + '%';
                
                document.getElementById('damage-numbers').appendChild(damageElement);
                
                setTimeout(() => damageElement.remove(), 2000);
            }, index * 100);
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-title">${type.toUpperCase()}</div>
            <div class="achievement-description">${message}</div>
        `;
        
        this.elements.achievementNotifications.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
    
    showModal(modalType) {
        const modal = document.getElementById(`${modalType}-modal`);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        }
    }
    
    hideModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
    
    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.hideModal(modal);
        });
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    gameOver() {
        document.getElementById('final-score').textContent = this.score.toLocaleString();
        document.getElementById('bosses-defeated').textContent = this.currentWorld;
        document.getElementById('total-damage').textContent = (this.totalWins * 50).toLocaleString();
        
        this.showModal('game-over');
        
        // Setup restart button
        document.getElementById('restart-btn').onclick = () => {
            location.reload();
        };
    }
    
    showVictory() {
        document.getElementById('victory-score').textContent = this.score.toLocaleString();
        document.getElementById('total-spins').textContent = this.totalSpins;
        document.getElementById('win-rate').textContent = Math.round((this.totalWins / this.totalSpins) * 100) + '%';
        
        this.showModal('victory');
        
        // Setup buttons
        document.getElementById('new-game-btn').onclick = () => {
            location.reload();
        };
        
        document.getElementById('continue-btn').onclick = () => {
            this.hideModal(document.getElementById('victory-modal'));
        };
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.slotGame = new SlotMachineGame();
});


/**
 * Performance Monitor Class
 */
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.memoryUsage = 0;
        this.renderTime = 0;
    }

    update() {
        const currentTime = performance.now();
        this.frameCount++;

        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;

            // Memory usage monitoring
            if (performance.memory) {
                this.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
            }

            // Update performance display if element exists
            this.updateDisplay();
        }
    }

    updateDisplay() {
        const perfDisplay = document.getElementById('performance-display');
        if (perfDisplay) {
            perfDisplay.innerHTML = `FPS: ${this.fps} | Memory: ${this.memoryUsage}MB`;
        }
    }

    measureRenderTime(renderFunction) {
        const startTime = performance.now();
        try {
            renderFunction();
        } catch (error) {
            console.error('Render error:', error);
        }
        this.renderTime = performance.now() - startTime;
    }
}

/**
 * Mobile Touch Handler Class
 */
class MobileTouchHandler {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        try {
            // Touch events for spin gesture
            document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

            // Prevent zoom on double tap
            document.addEventListener('touchend', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            });

            // Handle orientation change
            window.addEventListener('orientationchange', () => {
                setTimeout(() => this.handleOrientationChange(), 100);
            });

        } catch (error) {
            console.error('Touch event setup error:', error);
        }
    }

    handleTouchStart(e) {
        try {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        } catch (error) {
            console.error('Touch start error:', error);
        }
    }

    handleTouchMove(e) {
        try {
            // Prevent scrolling during game interaction
            const gameArea = document.querySelector('.game-area');
            if (gameArea && gameArea.contains(e.target)) {
                e.preventDefault();
            }
        } catch (error) {
            console.error('Touch move error:', error);
        }
    }

    handleTouchEnd(e) {
        try {
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;

            const deltaX = this.touchEndX - this.touchStartX;
            const deltaY = this.touchEndY - this.touchStartY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Swipe down to spin
            if (deltaY > this.minSwipeDistance && Math.abs(deltaX) < this.minSwipeDistance) {
                if (this.game && typeof this.game.spin === 'function') {
                    this.game.spin();
                }
            }

            // Double tap for auto-spin
            if (distance < 10) {
                this.handleTap(e);
            }

        } catch (error) {
            console.error('Touch end error:', error);
        }
    }

    handleTap(e) {
        try {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - (this.lastTap || 0);

            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                const autoSpinBtn = document.getElementById('auto-spin-btn');
                if (autoSpinBtn) {
                    autoSpinBtn.click();
                }
            }

            this.lastTap = currentTime;
        } catch (error) {
            console.error('Tap handling error:', error);
        }
    }

    handleOrientationChange() {
        try {
            // Trigger resize event for responsive adjustments
            window.dispatchEvent(new Event('resize'));

            // Adjust game canvas if needed
            if (this.game && typeof this.game.handleResize === 'function') {
                this.game.handleResize();
            }
        } catch (error) {
            console.error('Orientation change error:', error);
        }
    }
}

/**
 * Error Handler Class
 */
class ErrorHandler {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 10;
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            this.logError('Global Error', e.error || e.message, e.filename, e.lineno);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            this.logError('Unhandled Promise Rejection', e.reason);
            e.preventDefault();
        });

        // WebGL context lost handler
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('webglcontextlost', (e) => {
                this.logError('WebGL Context Lost', 'WebGL context was lost');
                e.preventDefault();
            });

            canvas.addEventListener('webglcontextrestored', () => {
                console.log('WebGL context restored');
                // Reinitialize WebGL resources
                this.handleWebGLRestore();
            });
        }
    }

    logError(type, message, filename = '', line = '') {
        this.errorCount++;

        const errorInfo = {
            type,
            message: message.toString(),
            filename,
            line,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.error(`[${type}]`, errorInfo);

        // Show user-friendly error message
        this.showUserError(type, message);

        // If too many errors, suggest page reload
        if (this.errorCount >= this.maxErrors) {
            this.showCriticalError();
        }
    }

    showUserError(type, message) {
        try {
            // Create or update error notification
            let errorNotification = document.getElementById('error-notification');
            if (!errorNotification) {
                errorNotification = document.createElement('div');
                errorNotification.id = 'error-notification';
                errorNotification.className = 'error-notification';
                document.body.appendChild(errorNotification);
            }

            errorNotification.innerHTML = `
                <div class="error-content">
                    <span class="error-icon">⚠️</span>
                    <span class="error-text">Something went wrong. The game will continue.</span>
                    <button class="error-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
                </div>
            `;

            errorNotification.style.display = 'block';

            // Auto-hide after 5 seconds
            setTimeout(() => {
                if (errorNotification) {
                    errorNotification.style.display = 'none';
                }
            }, 5000);

        } catch (e) {
            console.error('Error showing user notification:', e);
        }
    }

    showCriticalError() {
        try {
            const criticalError = document.createElement('div');
            criticalError.className = 'critical-error-modal';
            criticalError.innerHTML = `
                <div class="critical-error-content">
                    <h2>Critical Error</h2>
                    <p>Multiple errors have occurred. Please reload the page to continue.</p>
                    <button onclick="window.location.reload()">Reload Page</button>
                </div>
            `;
            document.body.appendChild(criticalError);
        } catch (e) {
            // Fallback to alert if DOM manipulation fails
            alert('Critical error occurred. Please reload the page.');
        }
    }

    handleWebGLRestore() {
        try {
            // Attempt to reinitialize the game
            if (window.slotGame && typeof window.slotGame.reinitialize === 'function') {
                window.slotGame.reinitialize();
            }
        } catch (error) {
            this.logError('WebGL Restore Error', error.message);
        }
    }
}

// Initialize global instances
let performanceMonitor;
let mobileTouchHandler;
let errorHandler;

// Enhanced initialization function
function initializeGameSafely() {
    try {
        // Initialize error handling first
        errorHandler = new ErrorHandler();

        // Initialize performance monitoring
        performanceMonitor = new PerformanceMonitor();

        // Check WebGL support
        if (!checkWebGLSupport()) {
            throw new Error('WebGL is not supported on this device');
        }

        // Initialize the main game
        initializeMainGame();

        // Initialize mobile touch handling
        mobileTouchHandler = new MobileTouchHandler(window.slotGame);

        console.log('Game initialized successfully with all optimizations');

    } catch (error) {
        console.error('Game initialization failed:', error);
        showFallbackMessage();
    }
}

function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    } catch (e) {
        return false;
    }
}

function showFallbackMessage() {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.innerHTML = `
            <div class="fallback-message">
                <h2>Game Not Available</h2>
                <p>Your device or browser doesn't support the required features for this 3D game.</p>
                <p>Please try:</p>
                <ul>
                    <li>Using a modern browser (Chrome, Firefox, Safari, Edge)</li>
                    <li>Enabling hardware acceleration</li>
                    <li>Updating your graphics drivers</li>
                </ul>
            </div>
        `;
    }
}

// Enhanced animation loop with performance monitoring
function enhancedAnimationLoop() {
    try {
        if (performanceMonitor) {
            performanceMonitor.measureRenderTime(() => {
                // Original animation logic here
                if (window.slotGame && typeof window.slotGame.animate === 'function') {
                    window.slotGame.animate();
                }
            });
            performanceMonitor.update();
        }

        requestAnimationFrame(enhancedAnimationLoop);
    } catch (error) {
        if (errorHandler) {
            errorHandler.logError('Animation Loop Error', error.message);
        }
        // Continue animation loop even if there's an error
        requestAnimationFrame(enhancedAnimationLoop);
    }
}

