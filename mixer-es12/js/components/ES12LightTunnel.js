// ES12+ Light Tunnel Visualizer with advanced JavaScript features
export default class ES12LightTunnel {
    // Private fields with advanced data structures
    #tunnelSegments = 60;
    #rings = new Set(); // Using Set for unique ring management
    #lights = new WeakMap(); // WeakMap for light metadata
    #tunnelGroup = null;
    #time = 0;
    #performanceMonitor = {
        frameCount: 0,
        lastFPSCheck: 0,
        currentFPS: 0
    };
    
    // Static private fields for shared resources
    static #sharedRingGeometry = new THREE.RingGeometry(4, 9, 20);
    static #instanceCount = 0;
    
    constructor(config = {}) {
        // Advanced destructuring with nested objects and computed properties
        const {
            segments = 60,
            performance: { 
                enableFPSMonitoring = true,
                maxFPS = 60 
            } = {},
            visual: {
                ringCount = segments,
                lightCount = 8,
                tunnelLength = segments * 2.5
            } = {},
            ...restConfig
        } = config;
        
        this.#tunnelSegments = segments;
        this.config = {
            enableFPSMonitoring,
            maxFPS,
            ringCount,
            lightCount,
            tunnelLength,
            ...restConfig
        };
        
        // Increment static counter
        ES12LightTunnel.#instanceCount++;
        
        console.log(`🌈 ES12+ Light Tunnel #${ES12LightTunnel.#instanceCount} created with ${segments} segments`);
    }

    // Async initialization with advanced error handling
    async init(scene, camera, renderer) {
        try {
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            this.#tunnelGroup = new THREE.Group();
            
            // Parallel initialization using Promise.all
            await Promise.all([
                this.#createTunnelRings(),
                this.#createDynamicLights(),
                this.#setupPerformanceMonitoring()
            ]);
            
            this.scene?.add(this.#tunnelGroup);
            
        } catch (error) {
            console.error('❌ ES12+ Light Tunnel initialization failed:', error);
            throw new Error(`Light Tunnel init failed: ${error.message}`);
        }
    }
    
    // Private async method with generator pattern
    async #createTunnelRings() {
        // Generator for ring creation with yield delegation
        const ringGenerator = function* (segments, config) {
            for (let i = 0; i < segments; i++) {
                const progress = i / segments;
                yield {
                    index: i,
                    position: i * -2.5,
                    hue: progress,
                    scale: 1 + Math.sin(progress * Math.PI) * 0.3,
                    opacity: 0.6 + Math.cos(progress * Math.PI * 2) * 0.2
                };
            }
        };
        
        // Process rings with modern async patterns
        for await (const ringData of this.#asyncIterator(ringGenerator(this.#tunnelSegments, this.config))) {
            const ring = await this.#createSingleRing(ringData);
            this.#rings.add(ring);
            this.#tunnelGroup.add(ring.mesh);
        }
    }
    
    // Convert generator to async iterator
    async *#asyncIterator(generator) {
        for (const item of generator) {
            // Yield control periodically to prevent blocking
            if (item.index % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            yield item;
        }
    }
    
    // Create individual ring with modern patterns
    async #createSingleRing(ringData) {
        const { index, position, hue, scale, opacity } = ringData;
        
        // Create material with advanced configuration
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(hue, 0.9, 0.6),
            transparent: true,
            opacity,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const mesh = new THREE.Mesh(ES12LightTunnel.#sharedRingGeometry, material);
        mesh.position.z = position;
        mesh.scale.setScalar(scale);
        
        // Store metadata using object with computed properties
        const ringObject = {
            mesh,
            material,
            originalPosition: position,
            originalScale: scale,
            index,
            // Computed property names
            [`audioIndex_${index}`]: Math.floor((index / this.#tunnelSegments) * 256),
            // Method shorthand
            updatePosition(newZ) {
                this.mesh.position.z = newZ;
            },
            // Getter/setter
            get currentHue() {
                return this.material.color.getHSL({}).h;
            },
            set currentHue(value) {
                const { s, l } = this.material.color.getHSL({});
                this.material.color.setHSL(value, s, l);
            }
        };
        
        return ringObject;
    }
    
    // Create dynamic point lights with WeakMap metadata
    async #createDynamicLights() {
        const lightPromises = Array.from({ length: this.config.lightCount }, async (_, i) => {
            const light = new THREE.PointLight(
                new THREE.Color().setHSL(i / this.config.lightCount, 1, 0.6),
                2,
                25
            );
            
            // Position lights in spiral pattern
            const angle = (i / this.config.lightCount) * Math.PI * 2;
            const radius = 8;
            light.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                i * -15
            );
            
            // Store metadata in WeakMap
            this.#lights.set(light, {
                originalPosition: light.position.clone(),
                baseIntensity: light.intensity,
                colorPhase: i / this.config.lightCount,
                movementPattern: `spiral_${i}`
            });
            
            this.#tunnelGroup.add(light);
            return light;
        });
        
        await Promise.all(lightPromises);
    }
    
    // Setup performance monitoring with modern timing APIs
    async #setupPerformanceMonitoring() {
        if (!this.config.enableFPSMonitoring) return;
        
        // Use performance.now() for high-resolution timing
        this.#performanceMonitor.lastFPSCheck = performance.now();
        
        // Optional: Setup performance observer (if supported)
        if ('PerformanceObserver' in globalThis) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    // Process performance entries
                    entries.forEach(entry => {
                        if (entry.entryType === 'measure') {
                            console.debug(`⚡ Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                        }
                    });
                });
                observer.observe({ entryTypes: ['measure'] });
            } catch (error) {
                console.warn('Performance monitoring setup failed:', error);
            }
        }
    }

    // Advanced update method with performance optimization
    async update(frequencyData) {
        if (!this.#tunnelGroup || !frequencyData) return;
        
        // Performance monitoring
        const updateStart = performance.now();
        
        this.#time += 0.016;
        this.#performanceMonitor.frameCount++;
        
        try {
            // Parallel updates using Promise.allSettled for resilience
            const [ringUpdates, lightUpdates, cameraUpdates] = await Promise.allSettled([
                this.#updateRings(frequencyData),
                this.#updateLights(frequencyData),
                this.#updateCamera(frequencyData)
            ]);
            
            // Log any failures
            [ringUpdates, lightUpdates, cameraUpdates].forEach((result, index) => {
                if (result.status === 'rejected') {
                    const names = ['rings', 'lights', 'camera'];
                    console.warn(`⚠️ ${names[index]} update failed:`, result.reason);
                }
            });
            
        } catch (error) {
            console.error('❌ Light tunnel update error:', error);
        }
        
        // FPS monitoring with modern timing
        this.#updateFPSMonitoring();
        
        // Performance measurement
        const updateDuration = performance.now() - updateStart;
        if (updateDuration > 16.67) { // More than 60fps budget
            console.warn(`⚠️ Frame took ${updateDuration.toFixed(2)}ms (budget: 16.67ms)`);
        }
    }
    
    // Update rings with modern iteration patterns
    async #updateRings(frequencyData) {
        // Convert Set to Array for processing
        const ringArray = [...this.#rings];
        
        // Process in chunks to avoid blocking
        const chunkSize = 10;
        for (let i = 0; i < ringArray.length; i += chunkSize) {
            const chunk = ringArray.slice(i, i + chunkSize);
            
            // Process chunk in parallel
            await Promise.all(chunk.map(ring => this.#updateSingleRing(ring, frequencyData)));
            
            // Yield control every chunk
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    // Update individual ring with advanced calculations
    async #updateSingleRing(ring, frequencyData) {
        const audioIndex = ring[`audioIndex_${ring.index}`];
        const audioLevel = frequencyData?.[audioIndex] / 255 ?? 0;
        
        // Move ring towards camera
        ring.mesh.position.z += 0.8 + audioLevel * 0.5;
        
        // Reset position when ring passes camera
        if (ring.mesh.position.z > 15) {
            ring.mesh.position.z = -this.#tunnelSegments * 2.5;
        }
        
        // Audio-reactive scaling with easing
        const targetScale = ring.originalScale * (1 + audioLevel * 3);
        const currentScale = ring.mesh.scale.x;
        const easedScale = currentScale + (targetScale - currentScale) * 0.1;
        ring.mesh.scale.setScalar(easedScale);
        
        // Dynamic color shifting
        const timeHue = (ring.index / this.#tunnelSegments + this.#time * 0.05) % 1;
        const audioHue = audioLevel * 0.3;
        ring.currentHue = (timeHue + audioHue) % 1;
        
        // Opacity modulation
        ring.material.opacity = 0.4 + audioLevel * 0.6;
        
        // Rotation with audio influence
        ring.mesh.rotation.z += 0.02 + audioLevel * 0.08;
    }
    
    // Update dynamic lights
    async #updateLights(frequencyData) {
        for (const [light, metadata] of this.#lights) {
            const { originalPosition, baseIntensity, colorPhase } = metadata;
            
            // Audio-reactive intensity
            const bassLevel = frequencyData?.[0] / 255 ?? 0;
            light.intensity = baseIntensity * (1 + bassLevel * 2);
            
            // Color cycling
            const hue = (colorPhase + this.#time * 0.1) % 1;
            light.color.setHSL(hue, 1, 0.6);
            
            // Position animation
            const offset = Math.sin(this.#time * 2 + colorPhase * Math.PI * 2) * 3;
            light.position.copy(originalPosition);
            light.position.y += offset;
            light.position.z += this.#time * 0.5;
            
            // Reset light position
            if (light.position.z > 50) {
                light.position.z = originalPosition.z;
            }
        }
    }
    
    // Camera movement with audio reactivity
    async #updateCamera(frequencyData) {
        if (!this.camera) return;
        
        const bassLevel = frequencyData?.[0] / 255 ?? 0;
        const trebleLevel = frequencyData?.[frequencyData.length - 1] / 255 ?? 0;
        
        // Smooth camera movement through tunnel
        this.camera.position.z = Math.sin(this.#time * 0.3) * 8 * bassLevel;
        this.camera.position.x = Math.cos(this.#time * 0.2) * 2 * trebleLevel;
        this.camera.position.y = Math.sin(this.#time * 0.4) * 1.5 * trebleLevel;
        
        // Look ahead in tunnel
        this.camera.lookAt(0, 0, -20);
    }
    
    // FPS monitoring with modern APIs
    #updateFPSMonitoring() {
        if (!this.config.enableFPSMonitoring) return;
        
        const now = performance.now();
        const deltaTime = now - this.#performanceMonitor.lastFPSCheck;
        
        if (deltaTime >= 1000) { // Update every second
            this.#performanceMonitor.currentFPS = 
                (this.#performanceMonitor.frameCount * 1000) / deltaTime;
            
            this.#performanceMonitor.frameCount = 0;
            this.#performanceMonitor.lastFPSCheck = now;
            
            // Log performance if below target
            if (this.#performanceMonitor.currentFPS < this.config.maxFPS * 0.9) {
                console.warn(`⚠️ FPS below target: ${this.#performanceMonitor.currentFPS.toFixed(1)} / ${this.config.maxFPS}`);
            }
        }
    }

    // Resize with advanced viewport handling
    resize(width = globalThis.innerWidth, height = globalThis.innerHeight) {
        const aspectRatio = width / height;
        console.log(`📐 ES12+ Light Tunnel resized: ${width}×${height} (${aspectRatio.toFixed(3)})`);
        
        // Adjust tunnel scale based on viewport
        const scaleFactor = Math.min(width / 1920, height / 1080);
        this.#tunnelGroup?.scale.setScalar(Math.max(0.5, scaleFactor));
    }
    
    // Get comprehensive metrics
    getMetrics() {
        return {
            instanceId: ES12LightTunnel.#instanceCount,
            ringCount: this.#rings.size,
            lightCount: this.#lights.size,
            currentFPS: this.#performanceMonitor.currentFPS,
            uptime: performance.now(),
            memoryEstimate: (this.#rings.size * 2 + this.#lights.size) * 1024 // Rough estimate in bytes
        };
    }
    
    // Advanced cleanup with resource tracking
    destroy() {
        // Clear all rings
        for (const ring of this.#rings) {
            ring.material?.dispose();
            this.#tunnelGroup?.remove(ring.mesh);
        }
        this.#rings.clear();
        
        // Clear all lights and their metadata
        for (const [light] of this.#lights) {
            this.#tunnelGroup?.remove(light);
        }
        this.#lights = new WeakMap();
        
        // Remove from scene
        this.scene?.remove(this.#tunnelGroup);
        
        // Decrement static counter
        ES12LightTunnel.#instanceCount--;
        
        console.log(`🧹 ES12+ Light Tunnel destroyed. Remaining instances: ${ES12LightTunnel.#instanceCount}`);
    }
}