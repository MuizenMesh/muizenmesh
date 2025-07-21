// ES12+ Voxel Grid Visualizer with cutting-edge JavaScript features
export default class ES12VoxelGrid {
    // Private fields with complex data structures
    #gridSize = 12;
    #voxels = new Map(); // Using Map for better performance
    #voxelGroup = null;
    #time = 0;
    #animationFrameId = null;
    
    // Private static field for shared geometry
    static #sharedGeometry = new THREE.BoxGeometry(1, 1, 1);
    
    constructor(options = {}) {
        // Object destructuring with defaults and rest parameters
        const {
            gridSize = 12,
            ...otherOptions
        } = options;
        
        this.#gridSize = gridSize;
        
        // Using WeakMap for private data (ES2015 but showcasing modern patterns)
        this.metadata = new WeakMap();
        this.metadata.set(this, { 
            created: Date.now(),
            ...otherOptions 
        });
        
        console.log(`🧊 ES12+ Voxel Grid created: ${this.#gridSize}³ = ${this.#gridSize ** 3} voxels`);
    }

    // Async initialization with error handling
    async init(scene, camera, renderer) {
        try {
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            this.#voxelGroup = new THREE.Group();
            
            // Using async iteration pattern (though not truly async here)
            await this.#createVoxels();
            
            this.scene?.add(this.#voxelGroup);
            
        } catch (error) {
            console.error('❌ Failed to initialize ES12+ Voxel Grid:', error);
        }
    }
    
    // Private async method for voxel creation
    async #createVoxels() {
        // Generator function for coordinates
        const coordinateGenerator = function* (size) {
            for (let x = 0; x < size; x++) {
                for (let y = 0; y < size; y++) {
                    for (let z = 0; z < size; z++) {
                        yield { x, y, z, index: x * size * size + y * size + z };
                    }
                }
            }
        };

        // Process voxels in batches to avoid blocking
        const batchSize = 100;
        let batch = [];
        
        for (const coord of coordinateGenerator(this.#gridSize)) {
            batch.push(coord);
            
            if (batch.length >= batchSize) {
                await this.#processBatch(batch);
                batch = [];
                // Yield control to prevent blocking
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        // Process remaining batch
        if (batch.length > 0) {
            await this.#processBatch(batch);
        }
    }
    
    // Process a batch of voxels
    async #processBatch(batch) {
        batch.forEach(({ x, y, z, index }) => {
            // Create material with modern color calculation
            const hue = (x + y + z) / (this.#gridSize * 3);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(hue, 0.8, 0.5),
                transparent: true,
                opacity: 0.4
            });

            const voxel = new THREE.Mesh(ES12VoxelGrid.#sharedGeometry, material);
            
            // Position with modern calculation
            const offset = this.#gridSize / 2;
            voxel.position.set(x - offset, y - offset, z - offset);
            
            // Store in Map with coordinate key
            const key = `${x},${y},${z}`;
            this.#voxels.set(key, {
                mesh: voxel,
                originalScale: 1,
                audioIndex: Math.floor((index / (this.#gridSize ** 3)) * 256),
                coordinates: { x, y, z }
            });
            
            this.#voxelGroup.add(voxel);
        });
    }

    // Update with modern async patterns and error boundaries
    async update(frequencyData) {
        if (!this.#voxelGroup || !frequencyData) return;

        this.#time += 0.016;
        
        try {
            // Process voxels with modern iteration
            const voxelEntries = [...this.#voxels.entries()];
            
            // Use Promise.allSettled for error resilience (ES2020)
            const updatePromises = voxelEntries.map(async ([key, voxelData]) => {
                return this.#updateSingleVoxel(voxelData, frequencyData);
            });
            
            const results = await Promise.allSettled(updatePromises);
            
            // Log any failures (optional)
            const failures = results.filter(result => result.status === 'rejected');
            if (failures.length > 0) {
                console.warn(`⚠️ ${failures.length} voxel updates failed`);
            }
            
        } catch (error) {
            console.error('❌ Voxel update error:', error);
        }
        
        // Rotate entire grid with modern math
        const rotationSpeed = {
            x: 0.005,
            y: 0.01,
            z: 0.003
        };
        
        Object.entries(rotationSpeed).forEach(([axis, speed]) => {
            this.#voxelGroup.rotation[axis] += speed;
        });
    }
    
    // Private method to update individual voxel
    async #updateSingleVoxel(voxelData, frequencyData) {
        const { mesh, audioIndex, coordinates } = voxelData;
        
        // Get audio level with bounds checking
        const audioLevel = frequencyData?.[audioIndex] / 255 ?? 0;
        
        // Calculate scale with modern math functions
        const baseScale = 0.3;
        const audioScale = audioLevel * 2.5;
        const timeScale = Math.sin(this.#time * 2 + coordinates.x * 0.1) * 0.2;
        const finalScale = Math.max(0.1, baseScale + audioScale + timeScale);
        
        // Apply scale with clamping
        mesh.scale.setScalar(Math.min(finalScale, 3.0));
        
        // Update material properties
        const hue = (coordinates.x + coordinates.y + coordinates.z) / (this.#gridSize * 3);
        const adjustedHue = (hue + this.#time * 0.1) % 1;
        const lightness = 0.3 + audioLevel * 0.7;
        
        mesh.material.color.setHSL(adjustedHue, 0.8, lightness);
        mesh.material.opacity = 0.2 + audioLevel * 0.8;
        
        // Add subtle position animation
        const positionOffset = audioLevel * 0.5;
        const originalPos = coordinates;
        mesh.position.set(
            originalPos.x - this.#gridSize / 2 + Math.sin(this.#time + originalPos.x) * positionOffset,
            originalPos.y - this.#gridSize / 2 + Math.cos(this.#time + originalPos.y) * positionOffset,
            originalPos.z - this.#gridSize / 2 + Math.sin(this.#time + originalPos.z) * positionOffset
        );
    }

    // Resize with modern parameter handling
    resize(width = globalThis.innerWidth, height = globalThis.innerHeight) {
        const aspectRatio = width / height;
        console.log(`📐 ES12+ Voxel Grid resized: ${width}×${height} (ratio: ${aspectRatio.toFixed(3)})`);
        
        // Adjust grid based on screen size
        const scaleFactor = Math.min(width, height) / 800;
        this.#voxelGroup?.scale.setScalar(scaleFactor);
    }
    
    // Get performance metrics
    getMetrics() {
        return {
            voxelCount: this.#voxels.size,
            gridSize: this.#gridSize,
            memoryUsage: this.#voxels.size * 4, // Rough estimate
            uptime: Date.now() - this.metadata.get(this)?.created ?? 0
        };
    }
    
    // Cleanup with proper resource disposal
    destroy() {
        // Cancel any pending animation frames
        if (this.#animationFrameId) {
            cancelAnimationFrame(this.#animationFrameId);
        }
        
        // Dispose of all voxel materials and geometries
        for (const [key, voxelData] of this.#voxels) {
            voxelData.mesh.material?.dispose();
            this.#voxelGroup?.remove(voxelData.mesh);
        }
        
        // Clear the map
        this.#voxels.clear();
        
        // Remove from scene
        this.scene?.remove(this.#voxelGroup);
        
        console.log('🧹 ES12+ Voxel Grid destroyed and cleaned up');
    }
}