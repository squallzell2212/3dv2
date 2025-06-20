/**
 * Animation Controller for 5x5 Slot Machine
 * Manages spinning reel animations, visual effects, and particle systems
 * Integrates with SlotMachine3DRenderer and Enhanced5x5SlotMachine
 */

class AnimationController {
    constructor(renderer, slotMachine) {
        this.renderer = renderer;
        this.slotMachine = slotMachine;
        
        // Animation state
        this.isAnimating = false;
        this.animationQueue = [];
        this.activeAnimations = new Map();
        
        // Spinning animation parameters
        this.spinDuration = 2000; // 2 seconds
        this.spinStaggerDelay = 100; // 100ms between columns
        this.spinAcceleration = 0.02;
        this.spinDeceleration = 0.98;
        this.maxSpinSpeed = 0.3;
        
        // Visual effects
        this.particleSystems = [];
        this.winningEffects = [];
        this.bonusEffects = [];
        
        // Timing and easing
        this.clock = new THREE.Clock();
        this.tweens = [];
        
        // Physics simulation for realistic spinning
        this.physicsEnabled = true;
        this.gravity = -0.001;
        this.friction = 0.95;
        
        this.init();
    }
    
    /**
     * Initialize animation systems
     */
    init() {
        this.setupParticleSystems();
        this.setupTweenSystem();
        this.startAnimationLoop();
    }
    
    /**
     * Setup particle systems for visual effects
     */
    setupParticleSystems() {
        // Win celebration particles
        this.createWinParticleSystem();
        
        // Jackpot particles
        this.createJackpotParticleSystem();
        
        // Bonus effect particles
        this.createBonusParticleSystem();
        
        // Ambient steam particles for steampunk theme
        this.createSteamParticleSystem();
    }
    
    /**
     * Create win celebration particle system
     */
    createWinParticleSystem() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random positions around the grid
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 15;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
            
            // Golden colors for win effects
            colors[i3] = 1.0; // R
            colors[i3 + 1] = 0.8; // G
            colors[i3 + 2] = 0.2; // B
            
            sizes[i] = Math.random() * 0.5 + 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.visible = false;
        this.renderer.scene.add(particles);
        
        this.particleSystems.push({
            name: 'win',
            particles: particles,
            geometry: geometry,
            material: material,
            velocities: new Float32Array(particleCount * 3),
            lifetimes: new Float32Array(particleCount),
            active: false
        });
    }
    
    /**
     * Create jackpot particle system
     */
    createJackpotParticleSystem() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 25;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 15;
            
            // Purple/crystal colors for jackpot
            colors[i3] = 0.6 + Math.random() * 0.4; // R
            colors[i3 + 1] = 0.2 + Math.random() * 0.3; // G
            colors[i3 + 2] = 1.0; // B
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.visible = false;
        this.renderer.scene.add(particles);
        
        this.particleSystems.push({
            name: 'jackpot',
            particles: particles,
            geometry: geometry,
            material: material,
            velocities: new Float32Array(particleCount * 3),
            active: false
        });
    }
    
    /**
     * Create bonus effect particle system
     */
    createBonusParticleSystem() {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 15;
            positions[i3 + 1] = (Math.random() - 0.5) * 12;
            positions[i3 + 2] = (Math.random() - 0.5) * 8;
            
            // Blue/cyan colors for bonus effects
            colors[i3] = 0.2; // R
            colors[i3 + 1] = 0.8; // G
            colors[i3 + 2] = 1.0; // B
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.visible = false;
        this.renderer.scene.add(particles);
        
        this.particleSystems.push({
            name: 'bonus',
            particles: particles,
            geometry: geometry,
            material: material,
            velocities: new Float32Array(particleCount * 3),
            active: false
        });
    }
    
    /**
     * Create ambient steam particle system
     */
    createSteamParticleSystem() {
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 30;
            positions[i3 + 1] = -10 + Math.random() * 5;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // White/gray steam colors
            const intensity = 0.7 + Math.random() * 0.3;
            colors[i3] = intensity; // R
            colors[i3 + 1] = intensity; // G
            colors[i3 + 2] = intensity; // B
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.NormalBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.renderer.scene.add(particles);
        
        this.particleSystems.push({
            name: 'steam',
            particles: particles,
            geometry: geometry,
            material: material,
            velocities: new Float32Array(particleCount * 3),
            active: true
        });
    }
    
    /**
     * Setup tween animation system
     */
    setupTweenSystem() {
        // Simple tween implementation for smooth animations
        this.createTween = (object, target, duration, easing = 'easeInOutCubic') => {
            const start = {};
            const change = {};
            
            // Calculate start values and changes
            Object.keys(target).forEach(key => {
                start[key] = object[key];
                change[key] = target[key] - start[key];
            });
            
            const tween = {
                object: object,
                start: start,
                change: change,
                duration: duration,
                elapsed: 0,
                easing: easing,
                active: true,
                onComplete: null
            };
            
            this.tweens.push(tween);
            return tween;
        };
    }
    
    /**
     * Start the main animation loop
     */
    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            const deltaTime = this.clock.getDelta();
            this.update(deltaTime);
        };
        
        animate();
    }
    
    /**
     * Main animation update loop
     */
    update(deltaTime) {
        this.updateTweens(deltaTime);
        this.updateParticles(deltaTime);
        this.updateSpinAnimations(deltaTime);
        this.updateVisualEffects(deltaTime);
    }
    
    /**
     * Update tween animations
     */
    updateTweens(deltaTime) {
        this.tweens = this.tweens.filter(tween => {
            if (!tween.active) return false;
            
            tween.elapsed += deltaTime * 1000; // Convert to milliseconds
            const progress = Math.min(tween.elapsed / tween.duration, 1);
            const easedProgress = this.applyEasing(progress, tween.easing);
            
            // Update object properties
            Object.keys(tween.change).forEach(key => {
                tween.object[key] = tween.start[key] + tween.change[key] * easedProgress;
            });
            
            // Check if tween is complete
            if (progress >= 1) {
                if (tween.onComplete) {
                    tween.onComplete();
                }
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * Update particle systems
     */
    updateParticles(deltaTime) {
        this.particleSystems.forEach(system => {
            if (!system.active) return;
            
            const positions = system.geometry.attributes.position.array;
            const velocities = system.velocities;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Update positions based on velocities
                positions[i] += velocities[i] * deltaTime;
                positions[i + 1] += velocities[i + 1] * deltaTime;
                positions[i + 2] += velocities[i + 2] * deltaTime;
                
                // Apply physics
                if (this.physicsEnabled) {
                    velocities[i + 1] += this.gravity; // Gravity
                    velocities[i] *= this.friction; // Friction
                    velocities[i + 1] *= this.friction;
                    velocities[i + 2] *= this.friction;
                }
                
                // Special behavior for steam particles
                if (system.name === 'steam') {
                    velocities[i + 1] = Math.abs(velocities[i + 1]) + 0.5; // Always rise
                    
                    // Reset particles that go too high
                    if (positions[i + 1] > 15) {
                        positions[i + 1] = -10;
                        velocities[i + 1] = 0.5 + Math.random() * 0.5;
                    }
                }
            }
            
            system.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    /**
     * Update spinning animations
     */
    updateSpinAnimations(deltaTime) {
        this.renderer.symbolMeshes.forEach((mesh, index) => {
            if (mesh.userData.isSpinning) {
                const spinData = mesh.userData.spinData;
                
                if (spinData) {
                    spinData.elapsed += deltaTime * 1000;
                    const progress = Math.min(spinData.elapsed / spinData.duration, 1);
                    
                    // Apply easing for realistic spin physics
                    let speed;
                    if (progress < 0.3) {
                        // Acceleration phase
                        speed = this.easeOutCubic(progress / 0.3) * this.maxSpinSpeed;
                    } else if (progress < 0.7) {
                        // Constant speed phase
                        speed = this.maxSpinSpeed;
                    } else {
                        // Deceleration phase
                        const decelerationProgress = (progress - 0.7) / 0.3;
                        speed = this.maxSpinSpeed * (1 - this.easeInCubic(decelerationProgress));
                    }
                    
                    mesh.rotation.y += speed;
                    mesh.rotation.x += speed * 0.3;
                    
                    // Check if spin is complete
                    if (progress >= 1) {
                        mesh.userData.isSpinning = false;
                        mesh.userData.spinData = null;
                        
                        // Snap to final rotation
                        mesh.rotation.y = 0;
                        mesh.rotation.x = 0;
                    }
                }
            }
        });
    }
    
    /**
     * Update visual effects
     */
    updateVisualEffects(deltaTime) {
        // Update winning line highlights
        this.winningEffects.forEach((effect, index) => {
            effect.elapsed += deltaTime * 1000;
            
            if (effect.elapsed > effect.duration) {
                this.winningEffects.splice(index, 1);
            } else {
                const progress = effect.elapsed / effect.duration;
                const intensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
                
                effect.meshes.forEach(mesh => {
                    mesh.material.emissiveIntensity = 0.2 + intensity * 0.3;
                });
            }
        });
        
        // Update bonus effects
        this.bonusEffects.forEach((effect, index) => {
            effect.elapsed += deltaTime * 1000;
            
            if (effect.elapsed > effect.duration) {
                this.bonusEffects.splice(index, 1);
            }
        });
    }
    
    /**
     * Start spinning animation for the entire grid
     */
    startSpinAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Stagger the spin start for each column
        for (let col = 0; col < 5; col++) {
            setTimeout(() => {
                this.startColumnSpin(col);
            }, col * this.spinStaggerDelay);
        }
        
        // Set total animation duration
        setTimeout(() => {
            this.isAnimating = false;
            this.onSpinComplete();
        }, this.spinDuration + 4 * this.spinStaggerDelay);
    }
    
    /**
     * Start spinning animation for a specific column
     */
    startColumnSpin(col) {
        for (let row = 0; row < 5; row++) {
            const index = row * 5 + col;
            const mesh = this.renderer.symbolMeshes[index];
            
            if (mesh) {
                mesh.userData.isSpinning = true;
                mesh.userData.spinData = {
                    elapsed: 0,
                    duration: this.spinDuration,
                    startRotation: { x: mesh.rotation.x, y: mesh.rotation.y }
                };
            }
        }
    }
    
    /**
     * Handle spin completion
     */
    onSpinComplete() {
        // Update 3D grid to match slot machine state
        this.renderer.updateGridFromSlotMachine();
        
        // Check for wins and trigger effects
        const gameState = this.slotMachine.getGameState();
        
        if (gameState.winningCombinations.length > 0) {
            this.triggerWinEffects(gameState.winningPositions);
        }
        
        if (gameState.isJackpot) {
            this.triggerJackpotEffects();
        }
    }
    
    /**
     * Trigger win celebration effects
     */
    triggerWinEffects(winningPositions) {
        // Highlight winning positions
        this.renderer.highlightWinningPositions(winningPositions);
        
        // Activate win particle system
        const winSystem = this.particleSystems.find(s => s.name === 'win');
        if (winSystem) {
            winSystem.active = true;
            winSystem.particles.visible = true;
            
            // Initialize particle velocities
            for (let i = 0; i < winSystem.velocities.length; i += 3) {
                winSystem.velocities[i] = (Math.random() - 0.5) * 2;
                winSystem.velocities[i + 1] = Math.random() * 3 + 1;
                winSystem.velocities[i + 2] = (Math.random() - 0.5) * 2;
            }
            
            // Deactivate after duration
            setTimeout(() => {
                winSystem.active = false;
                winSystem.particles.visible = false;
            }, 3000);
        }
        
        // Create winning line effect
        this.createWinningLineEffect(winningPositions);
    }
    
    /**
     * Trigger jackpot celebration effects
     */
    triggerJackpotEffects() {
        // Activate jackpot particle system
        const jackpotSystem = this.particleSystems.find(s => s.name === 'jackpot');
        if (jackpotSystem) {
            jackpotSystem.active = true;
            jackpotSystem.particles.visible = true;
            
            // Initialize explosive particle velocities
            for (let i = 0; i < jackpotSystem.velocities.length; i += 3) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                
                jackpotSystem.velocities[i] = Math.cos(angle) * speed;
                jackpotSystem.velocities[i + 1] = Math.random() * 4 + 2;
                jackpotSystem.velocities[i + 2] = Math.sin(angle) * speed;
            }
            
            // Deactivate after duration
            setTimeout(() => {
                jackpotSystem.active = false;
                jackpotSystem.particles.visible = false;
            }, 5000);
        }
        
        // Camera shake effect
        this.triggerCameraShake(1.0, 2000);
    }
    
    /**
     * Create winning line visual effect
     */
    createWinningLineEffect(winningPositions) {
        const meshes = winningPositions.map(pos => this.renderer.symbolMeshes[pos]);
        
        this.winningEffects.push({
            meshes: meshes,
            elapsed: 0,
            duration: 2000
        });
    }
    
    /**
     * Trigger camera shake effect
     */
    triggerCameraShake(intensity, duration) {
        const originalPosition = this.renderer.camera.position.clone();
        const shakeStart = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - shakeStart;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const currentIntensity = intensity * (1 - progress);
                
                this.renderer.camera.position.x = originalPosition.x + (Math.random() - 0.5) * currentIntensity;
                this.renderer.camera.position.y = originalPosition.y + (Math.random() - 0.5) * currentIntensity;
                this.renderer.camera.position.z = originalPosition.z + (Math.random() - 0.5) * currentIntensity * 0.5;
                
                requestAnimationFrame(shake);
            } else {
                this.renderer.camera.position.copy(originalPosition);
            }
        };
        
        shake();
    }
    
    /**
     * Trigger bonus power-up effects
     */
    triggerBonusEffects(bonusType) {
        const bonusSystem = this.particleSystems.find(s => s.name === 'bonus');
        if (bonusSystem) {
            bonusSystem.active = true;
            bonusSystem.particles.visible = true;
            
            // Different effects for different bonus types
            switch (bonusType) {
                case 'Double Damage':
                    this.createDoubleEffects();
                    break;
                case 'Steam Healing':
                    this.createHealingEffects();
                    break;
                case 'Mechanical Shield':
                    this.createShieldEffects();
                    break;
                case 'Multi-Spin':
                    this.createMultiSpinEffects();
                    break;
                case 'Combo Boost':
                    this.createComboEffects();
                    break;
            }
            
            setTimeout(() => {
                bonusSystem.active = false;
                bonusSystem.particles.visible = false;
            }, 2000);
        }
    }
    
    /**
     * Create double damage visual effects
     */
    createDoubleEffects() {
        // Red glow effect on all symbols
        this.renderer.symbolMeshes.forEach(mesh => {
            const originalEmissive = mesh.material.emissive.clone();
            mesh.material.emissive.setHex(0xff0000);
            
            setTimeout(() => {
                mesh.material.emissive.copy(originalEmissive);
            }, 1000);
        });
    }
    
    /**
     * Create healing visual effects
     */
    createHealingEffects() {
        // Green healing particles
        const healingSystem = this.particleSystems.find(s => s.name === 'bonus');
        if (healingSystem) {
            const colors = healingSystem.geometry.attributes.color.array;
            for (let i = 0; i < colors.length; i += 3) {
                colors[i] = 0.2; // R
                colors[i + 1] = 1.0; // G
                colors[i + 2] = 0.2; // B
            }
            healingSystem.geometry.attributes.color.needsUpdate = true;
        }
    }
    
    /**
     * Create shield visual effects
     */
    createShieldEffects() {
        // Blue protective aura
        this.renderer.symbolMeshes.forEach(mesh => {
            const originalEmissive = mesh.material.emissive.clone();
            mesh.material.emissive.setHex(0x0066ff);
            
            setTimeout(() => {
                mesh.material.emissive.copy(originalEmissive);
            }, 1500);
        });
    }
    
    /**
     * Create multi-spin visual effects
     */
    createMultiSpinEffects() {
        // Rainbow color cycling
        let hue = 0;
        const colorCycle = setInterval(() => {
            this.renderer.symbolMeshes.forEach(mesh => {
                mesh.material.emissive.setHSL(hue, 0.5, 0.3);
            });
            hue += 0.1;
            if (hue > 1) hue = 0;
        }, 100);
        
        setTimeout(() => {
            clearInterval(colorCycle);
            this.renderer.symbolMeshes.forEach(mesh => {
                mesh.material.emissive.setHex(mesh.userData.originalEmissive || 0x000000);
            });
        }, 2000);
    }
    
    /**
     * Create combo boost visual effects
     */
    createComboEffects() {
        // Pulsing golden effect
        let intensity = 0;
        let direction = 1;
        
        const pulse = setInterval(() => {
            intensity += direction * 0.1;
            if (intensity > 1) {
                intensity = 1;
                direction = -1;
            } else if (intensity < 0) {
                intensity = 0;
                direction = 1;
            }
            
            this.renderer.symbolMeshes.forEach(mesh => {
                mesh.material.emissive.setRGB(intensity * 0.8, intensity * 0.6, intensity * 0.2);
            });
        }, 50);
        
        setTimeout(() => {
            clearInterval(pulse);
            this.renderer.symbolMeshes.forEach(mesh => {
                mesh.material.emissive.setHex(mesh.userData.originalEmissive || 0x000000);
            });
        }, 2000);
    }
    
    /**
     * Apply easing functions
     */
    applyEasing(t, easingType) {
        switch (easingType) {
            case 'easeInCubic':
                return this.easeInCubic(t);
            case 'easeOutCubic':
                return this.easeOutCubic(t);
            case 'easeInOutCubic':
                return this.easeInOutCubic(t);
            case 'linear':
            default:
                return t;
        }
    }
    
    easeInCubic(t) {
        return t * t * t;
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    /**
     * Cleanup animation resources
     */
    dispose() {
        // Clear all active animations
        this.tweens = [];
        this.winningEffects = [];
        this.bonusEffects = [];
        
        // Dispose particle systems
        this.particleSystems.forEach(system => {
            system.geometry.dispose();
            system.material.dispose();
            this.renderer.scene.remove(system.particles);
        });
        
        this.particleSystems = [];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}