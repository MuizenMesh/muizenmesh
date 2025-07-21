// ES12+ Particle Swarm Visualizer with latest JavaScript features
export default class ES12ParticleSwarm {
    // Private fields (ES2022)
    #particles = [];
    #particleCount = 1000;
    #swarmCenter = new THREE.Vector3();
    #time = 0;
    #particleSystem = null;
    #velocities = null;
    
    // Static private field
    static #instances = new Set();
    
    constructor() {
        // Add to instances tracking
        ES12ParticleSwarm.#instances.add(this);
        
        // Using nullish coalescing for default values
        this.#particleCount = globalThis.particleCount ?? 1000;
        
        console.log(`🌟 ES12+ Particle Swarm created with ${this.#particleCount} particles`);
    }
    
    // Optional chaining and nullish coalescing in action
    init(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        // Create particle geometry with modern syntax
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.#particleCount * 3);
        const colors = new Float32Array(this.#particleCount * 3);
        const velocities = new Float32Array(this.#particleCount * 3);

        // Use for...of with destructuring
        for (const [i] of Array(this.#particleCount).entries()) {
            const i3 = i * 3;
            
            // Spread operator with array methods
            const [x, y, z] = [...Array(3)].map(() => (Math.random() - 0.5) * 100);
            const [r, g, b] = [...Array(3)].map(() => Math.random());
            const [vx, vy, vz] = [...Array(3)].map(() => (Math.random() - 0.5) * 2);
            
            // Assignment with array destructuring
            [positions[i3], positions[i3 + 1], positions[i3 + 2]] = [x, y, z];
            [colors[i3], colors[i3 + 1], colors[i3 + 2]] = [r, g, b];
            [velocities[i3], velocities[i3 + 1], velocities[i3 + 2]] = [vx, vy, vz];
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        this.#velocities = velocities;

        // Object shorthand and computed property names
        const materialConfig = {
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            // Computed property name
            [`sizeAttenuation`]: true
        };

        const material = new THREE.PointsMaterial(materialConfig);
        this.#particleSystem = new THREE.Points(geometry, material);
        
        // Optional chaining for safe method calls
        this.scene?.add(this.#particleSystem);
    }

    // Async method with top-level await support
    async update(frequencyData) {
        // Early return with nullish coalescing
        if (!this.#particleSystem) return;

        this.#time += 0.016;
        
        // Destructuring with default values and computed properties
        const [bass = 0, mid = 0, treble = 0] = [
            frequencyData?.[0] / 255,
            frequencyData?.[Math.floor(frequencyData.length / 2)] / 255,
            frequencyData?.[frequencyData.length - 1] / 255
        ];
        
        // Object destructuring with renaming and defaults
        const swarmConfig = {
            x: Math.sin(this.#time * 0.5) * 40 * (bass || 0.1),
            y: Math.cos(this.#time * 0.3) * 40 * (mid || 0.1),
            z: Math.sin(this.#time * 0.7) * 40 * (treble || 0.1)
        };
        
        // Logical assignment operators (ES2021)
        this.#swarmCenter.x ||= 0;
        this.#swarmCenter.y ||= 0;
        this.#swarmCenter.z ||= 0;
        
        // Update swarm center with object spread
        Object.assign(this.#swarmCenter, swarmConfig);

        const positions = this.#particleSystem.geometry.attributes.position.array;
        const colors = this.#particleSystem.geometry.attributes.color.array;

        // Modern for loop with array methods
        Array.from({ length: this.#particleCount }, (_, i) => {
            const i3 = i * 3;
            
            // Destructuring assignment
            const [x, y, z] = [positions[i3], positions[i3 + 1], positions[i3 + 2]];
            
            // Calculate force with modern math
            const distance = Math.hypot(
                this.#swarmCenter.x - x,
                this.#swarmCenter.y - y,
                this.#swarmCenter.z - z
            );
            
            // Nullish coalescing with logical assignment
            const force = 0.03 * ((bass ?? 0) + 0.1);
            
            if (distance > 0) {
                // Array destructuring for velocity updates
                const forceVector = [
                    (this.#swarmCenter.x - x) / distance * force,
                    (this.#swarmCenter.y - y) / distance * force,
                    (this.#swarmCenter.z - z) / distance * force
                ];
                
                // Logical assignment operators
                this.#velocities[i3] += forceVector[0];
                this.#velocities[i3 + 1] += forceVector[1];
                this.#velocities[i3 + 2] += forceVector[2];
            }
            
            // Apply damping with array methods
            [i3, i3 + 1, i3 + 2].forEach(idx => {
                this.#velocities[idx] *= 0.98;
                positions[idx] += this.#velocities[idx];
            });
            
            // Update colors with modern array methods
            const audioIndex = Math.floor((i / this.#particleCount) * frequencyData.length);
            const audioLevel = frequencyData?.[audioIndex] / 255 ?? 0;
            
            // Template literals with expressions
            const colorMultipliers = [
                audioLevel * 0.9 + 0.1,
                mid * 0.7 + 0.3,
                treble * 0.8 + 0.2
            ];
            
            colorMultipliers.forEach((multiplier, idx) => {
                colors[i3 + idx] = multiplier;
            });
        });

        // Update geometry with optional chaining
        this.#particleSystem.geometry.attributes.position.needsUpdate = true;
        this.#particleSystem.geometry.attributes.color.needsUpdate = true;
        
        // Rotation with nullish coalescing
        this.#particleSystem.rotation.y += 0.008 * ((bass ?? 0) + 0.1);
        this.#particleSystem.rotation.x += 0.003 * ((treble ?? 0) + 0.05);
    }

    // Optional method with default parameters
    resize(width = window.innerWidth, height = window.innerHeight) {
        // Modern object destructuring with computed properties
        const aspectRatio = width / height;
        console.log(`📐 ES12+ Particle Swarm resized to ${width}x${height} (${aspectRatio.toFixed(2)})`);
    }
    
    // Static method to get instance count
    static getInstanceCount() {
        return this.#instances.size;
    }
    
    // Cleanup method
    destroy() {
        ES12ParticleSwarm.#instances.delete(this);
        this.scene?.remove(this.#particleSystem);
        this.#particleSystem?.geometry?.dispose();
        this.#particleSystem?.material?.dispose();
    }
}