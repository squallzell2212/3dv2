/**
 * 3D Renderer for 5x5 Slot Machine
 * Integrates with Enhanced5x5SlotMachine class for realistic 3D rendering
 * Uses Three.js for WebGL-based 3D graphics and animations
 */

class SlotMachine3DRenderer {
    constructor(containerId, slotMachine) {
        this.container = document.getElementById(containerId);
        this.slotMachine = slotMachine;
        
        // Three.js core components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        // 3D objects and materials
        this.symbolMeshes = [];
        this.gridPositions = [];
        this.symbolGeometries = new Map();
        this.symbolMaterials = new Map();
        
        // Lighting system
        this.ambientLight = null;
        this.directionalLight = null;
        this.pointLights = [];
        
        // Animation and interaction
        this.isSpinning = false;
        this.spinSpeed = 0;
        this.targetRotation = 0;
        this.animationMixer = null;
        
        // Grid configuration from enhanced game logic
        this.GRID_ROWS = 5;
        this.GRID_COLS = 5;
        this.SYMBOL_SIZE = 1.2;
        this.GRID_SPACING = 1.5;
        
        // Steampunk symbol definitions from requirements
        this.SYMBOL_CONFIGS = {
            'Crystal': {
                color: 0x9966ff,
                emissive: 0x4433aa,
                geometry: 'octahedron',
                scale: 1.0,
                metalness: 0.1,
                roughness: 0.2
            },
            'Sword': {
                color: 0xcccccc,
                emissive: 0x333333,
                geometry: 'cylinder',
                scale: 1.2,
                metalness: 0.8,
                roughness: 0.3
            },
            'Shield': {
                color: 0x8b4513,
                emissive: 0x2d1505,
                geometry: 'sphere',
                scale: 1.0,
                metalness: 0.6,
                roughness: 0.4
            },
            'Armor': {
                color: 0x696969,
                emissive: 0x1a1a1a,
                geometry: 'box',
                scale: 1.1,
                metalness: 0.9,
                roughness: 0.2
            },
            'Gear': {
                color: 0xcd7f32,
                emissive: 0x3d2610,
                geometry: 'torus',
                scale: 0.9,
                metalness: 0.7,
                roughness: 0.3
            },
            'Pipe': {
                color: 0x8b4513,
                emissive: 0x2d1505,
                geometry: 'cylinder',
                scale: 0.8,
                metalness: 0.5,
                roughness: 0.6
            },
            'Potion': {
                color: 0x32cd32,
                emissive: 0x0a330a,
                geometry: 'sphere',
                scale: 0.9,
                metalness: 0.1,
                roughness: 0.1
            },
            'Button': {
                color: 0xff6347,
                emissive: 0x4d1e17,
                geometry: 'cylinder',
                scale: 0.7,
                metalness: 0.3,
                roughness: 0.5
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize the 3D rendering system
     */
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
    
    /**
     * Setup the Three.js scene
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Add fog for atmospheric effect
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    }
    
    /**
     * Setup the camera with appropriate positioning
     */
    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        
        // Position camera to view the 5x5 grid optimally
        this.camera.position.set(0, 0, 12);
        this.camera.lookAt(0, 0, 0);
    }
    
    /**
     * Setup the WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        this.container.appendChild(this.renderer.domElement);
    }
    
    /**
     * Setup lighting system for realistic 3D appearance
     */
    setupLighting() {
        // Ambient light for overall illumination
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(this.ambientLight);
        
        // Main directional light
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(5, 10, 5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.scene.add(this.directionalLight);
        
        // Point lights for dynamic lighting
        const pointLight1 = new THREE.PointLight(0xff6b35, 0.5, 20);
        pointLight1.position.set(-8, 5, 8);
        this.scene.add(pointLight1);
        this.pointLights.push(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x35a7ff, 0.5, 20);
        pointLight2.position.set(8, 5, 8);
        this.scene.add(pointLight2);
        this.pointLights.push(pointLight2);
    }
    
    /**
     * Create geometries for each symbol type
     */
    createSymbolGeometries() {
        // Crystal - Octahedron
        this.symbolGeometries.set('Crystal', new THREE.OctahedronGeometry(this.SYMBOL_SIZE * 0.8));
        
        // Sword - Cylinder (tall and thin)
        this.symbolGeometries.set('Sword', new THREE.CylinderGeometry(0.1, 0.1, this.SYMBOL_SIZE * 1.5, 8));
        
        // Shield - Sphere (flattened)
        this.symbolGeometries.set('Shield', new THREE.SphereGeometry(this.SYMBOL_SIZE * 0.7, 16, 8));
        
        // Armor - Box
        this.symbolGeometries.set('Armor', new THREE.BoxGeometry(
            this.SYMBOL_SIZE * 0.8, 
            this.SYMBOL_SIZE * 1.0, 
            this.SYMBOL_SIZE * 0.6
        ));
        
        // Gear - Torus
        this.symbolGeometries.set('Gear', new THREE.TorusGeometry(
            this.SYMBOL_SIZE * 0.6, 
            this.SYMBOL_SIZE * 0.2, 
            8, 16
        ));
        
        // Pipe - Cylinder (short and wide)
        this.symbolGeometries.set('Pipe', new THREE.CylinderGeometry(
            this.SYMBOL_SIZE * 0.3, 
            this.SYMBOL_SIZE * 0.3, 
            this.SYMBOL_SIZE * 1.2, 
            12
        ));
        
        // Potion - Sphere (small)
        this.symbolGeometries.set('Potion', new THREE.SphereGeometry(this.SYMBOL_SIZE * 0.6, 12, 8));
        
        // Button - Cylinder (very short)
        this.symbolGeometries.set('Button', new THREE.CylinderGeometry(
            this.SYMBOL_SIZE * 0.4, 
            this.SYMBOL_SIZE * 0.4, 
            this.SYMBOL_SIZE * 0.3, 
            16
        ));
    }
    
    /**
     * Create materials for each symbol with steampunk aesthetics
     */
    createSymbolMaterials() {
        Object.keys(this.SYMBOL_CONFIGS).forEach(symbolName => {
            const config = this.SYMBOL_CONFIGS[symbolName];
            
            const material = new THREE.MeshPhysicalMaterial({
                color: config.color,
                emissive: config.emissive,
                metalness: config.metalness,
                roughness: config.roughness,
                clearcoat: 0.1,
                clearcoatRoughness: 0.1
            });
            
            this.symbolMaterials.set(symbolName, material);
        });
    }
    
    /**
     * Setup the 5x5 grid layout and positions
     */
    setupGrid() {
        this.gridPositions = [];
        this.symbolMeshes = [];
        
        // Calculate grid center offset
        const gridWidth = (this.GRID_COLS - 1) * this.GRID_SPACING;
        const gridHeight = (this.GRID_ROWS - 1) * this.GRID_SPACING;
        const offsetX = -gridWidth / 2;
        const offsetY = gridHeight / 2;
        
        // Create grid positions and initial symbol meshes
        for (let row = 0; row < this.GRID_ROWS; row++) {
            for (let col = 0; col < this.GRID_COLS; col++) {
                const x = offsetX + col * this.GRID_SPACING;
                const y = offsetY - row * this.GRID_SPACING;
                const z = 0;
                
                const position = new THREE.Vector3(x, y, z);
                this.gridPositions.push(position);
                
                // Create initial symbol mesh (Button as default)
                const mesh = this.createSymbolMesh('Button');
                mesh.position.copy(position);
                mesh.userData = { 
                    gridIndex: row * this.GRID_COLS + col,
                    row: row,
                    col: col,
                    isSpinning: false
                };
                
                this.scene.add(mesh);
                this.symbolMeshes.push(mesh);
            }
        }
    }
    
    /**
     * Create a 3D mesh for a specific symbol
     */
    createSymbolMesh(symbolName) {
        const geometry = this.symbolGeometries.get(symbolName);
        const material = this.symbolMaterials.get(symbolName);
        const config = this.SYMBOL_CONFIGS[symbolName];
        
        if (!geometry || !material) {
            console.warn(`Symbol ${symbolName} not found, using default`);
            return this.createSymbolMesh('Button');
        }
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.setScalar(config.scale);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.symbolName = symbolName;
        
        return mesh;
    }
    
    /**
     * Update the 3D grid to match the slot machine state
     */
    updateGridFromSlotMachine() {
        const grid = this.slotMachine.grid;
        
        for (let i = 0; i < grid.length && i < this.symbolMeshes.length; i++) {
            const symbol = grid[i];
            const currentMesh = this.symbolMeshes[i];
            
            if (symbol && currentMesh.userData.symbolName !== symbol.name) {
                // Remove old mesh
                this.scene.remove(currentMesh);
                
                // Create new mesh
                const newMesh = this.createSymbolMesh(symbol.name);
                newMesh.position.copy(this.gridPositions[i]);
                newMesh.userData = { 
                    ...currentMesh.userData,
                    symbolName: symbol.name
                };
                
                this.scene.add(newMesh);
                this.symbolMeshes[i] = newMesh;
            }
        }
    }
    
    /**
     * Highlight winning positions with special effects
     */
    highlightWinningPositions(winningPositions) {
        // Reset all meshes to normal state
        this.symbolMeshes.forEach(mesh => {
            mesh.material.emissiveIntensity = 0.1;
            mesh.scale.setScalar(this.SYMBOL_CONFIGS[mesh.userData.symbolName].scale);
        });
        
        // Highlight winning positions
        winningPositions.forEach(position => {
            if (position < this.symbolMeshes.length) {
                const mesh = this.symbolMeshes[position];
                mesh.material.emissiveIntensity = 0.5;
                mesh.scale.setScalar(this.SYMBOL_CONFIGS[mesh.userData.symbolName].scale * 1.2);
            }
        });
    }
    
    /**
     * Animate camera movement for dynamic viewing
     */
    animateCamera(targetPosition, targetLookAt, duration = 2000) {
        const startPosition = this.camera.position.clone();
        const startLookAt = new THREE.Vector3(0, 0, 0);
        
        const startTime = Date.now();
        
        const animateStep = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOutCubic(progress);
            
            this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
            
            const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, easeProgress);
            this.camera.lookAt(currentLookAt);
            
            if (progress < 1) {
                requestAnimationFrame(animateStep);
            }
        };
        
        animateStep();
    }
    
    /**
     * Easing function for smooth animations
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    /**
     * Handle window resize events
     */
    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        
        // Mouse interaction for camera controls
        let mouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        
        this.renderer.domElement.addEventListener('mousedown', (event) => {
            mouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            if (!mouseDown) return;
            
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            // Rotate camera around the grid
            const spherical = new THREE.Spherical();
            spherical.setFromVector3(this.camera.position);
            spherical.theta -= deltaX * 0.01;
            spherical.phi += deltaY * 0.01;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
            
            this.camera.position.setFromSpherical(spherical);
            this.camera.lookAt(0, 0, 0);
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        });
        
        this.renderer.domElement.addEventListener('mouseup', () => {
            mouseDown = false;
        });
        
        // Zoom with mouse wheel
        this.renderer.domElement.addEventListener('wheel', (event) => {
            const zoomSpeed = 0.1;
            const direction = event.deltaY > 0 ? 1 : -1;
            
            this.camera.position.multiplyScalar(1 + direction * zoomSpeed);
            this.camera.position.clampLength(5, 25);
        });
    }
    
    /**
     * Start the main render loop
     */
    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            const deltaTime = this.clock.getDelta();
            this.update(deltaTime);
            this.render();
        };
        
        animate();
    }
    
    /**
     * Update animations and effects
     */
    update(deltaTime) {
        // Rotate symbols slowly for visual appeal
        this.symbolMeshes.forEach((mesh, index) => {
            if (!mesh.userData.isSpinning) {
                mesh.rotation.y += deltaTime * 0.5;
                mesh.rotation.x += deltaTime * 0.2;
            }
        });
        
        // Animate point lights
        const time = this.clock.getElapsedTime();
        this.pointLights.forEach((light, index) => {
            light.intensity = 0.5 + Math.sin(time + index * Math.PI) * 0.2;
        });
        
        // Update animation mixer if present
        if (this.animationMixer) {
            this.animationMixer.update(deltaTime);
        }
    }
    
    /**
     * Render the scene
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Get current camera state for saving/loading
     */
    getCameraState() {
        return {
            position: this.camera.position.toArray(),
            rotation: this.camera.rotation.toArray()
        };
    }
    
    /**
     * Set camera state from saved data
     */
    setCameraState(state) {
        this.camera.position.fromArray(state.position);
        this.camera.rotation.fromArray(state.rotation);
    }
    
    /**
     * Cleanup resources
     */
    dispose() {
        // Dispose geometries
        this.symbolGeometries.forEach(geometry => geometry.dispose());
        
        // Dispose materials
        this.symbolMaterials.forEach(material => material.dispose());
        
        // Remove renderer
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        
        // Clear scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlotMachine3DRenderer;
}