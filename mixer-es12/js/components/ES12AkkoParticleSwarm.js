// ES12+ Akko-compatible Particle Swarm Visualizer
export default class ES12AkkoParticleSwarm extends Akko.Visualiser {
    // Private fields (ES2022)
    #particleSystem = null;
    #time = 0;
    #particleCount = 1000;
    
    // Static private field for tracking instances
    static #instances = new Set();
    
    constructor() {
        super({
            code: 'PSW',
            name: 'Particle Swarm',
            fftSize: 256,
            smoothingTimeConstant: 0.8,
        });
        
        // Add to instances tracking with modern syntax
        ES12AkkoParticleSwarm.#instances.add(this);
        console.log('🌟 ES12+ Particle Swarm visualizer created');
    }
    
    // Akko lifecycle method with ES12+ features
    onInit(data) {
        console.log('🚀 ES12+ Particle Swarm initializing...');
        
        // Setup scene with optional chaining
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.z = 50;
        
        // Create particles with modern array methods
        this.#createParticleSystem();
    }
    
    // Private method using ES12+ features
    #createParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.#particleCount * 3);
        const colors = new Float32Array(this.#particleCount * 3);
        const velocities = new Float32Array(this.#particleCount * 3);
        
        // Use modern array methods with destructuring
        Array.from({ length: this.#particleCount }, (_, i) => {
            const i3 = i * 3;
            
            // Destructuring with spread operator
            const [x, y, z] = [...Array(3)].map(() => (Math.random() - 0.5) * 100);
            
            // Bright futuristic color palette
            const hue = Math.random();
            const color = new THREE.Color().setHSL(hue, 0.9, 0.7); // High saturation, bright
            const [r, g, b] = [color.r, color.g, color.b];
            
            const [vx, vy, vz] = [...Array(3)].map(() => (Math.random() - 0.5) * 2);
            
            // Assignment with array destructuring
            [positions[i3], positions[i3 + 1], positions[i3 + 2]] = [x, y, z];
            [colors[i3], colors[i3 + 1], colors[i3 + 2]] = [r, g, b];
            [velocities[i3], velocities[i3 + 1], velocities[i3 + 2]] = [vx, vy, vz];
        });
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Store velocities for animation
        this.velocities = velocities;
        
        // Modern object shorthand with brighter settings
        const materialConfig = {
            size: 4, // Slightly larger for more impact
            vertexColors: true,
            transparent: true,
            opacity: 0.95, // More opaque for brighter appearance
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        };
        
        const material = new THREE.PointsMaterial(materialConfig);
        this.#particleSystem = new THREE.Points(geometry, material);
        this.scene?.add(this.#particleSystem);
    }
    
    // Akko update method with ES12+ features
    onUpdate(data) {
        // Early return with nullish coalescing
        if (!this.#particleSystem || !data?.frequencyData) return;
        
        this.#time += 0.016;
        
        // Destructuring with default values
        const [bass = 0, mid = 0, treble = 0] = [
            data.frequencyData[0] / 255,
            data.frequencyData[Math.floor(data.frequencyData.length / 2)] / 255,
            data.frequencyData[data.frequencyData.length - 1] / 255
        ];
        
        // Update particles with modern syntax
        this.#updateParticles(bass, mid, treble, data);
        
        // Rotation with nullish coalescing
        this.#particleSystem.rotation.y += 0.008 * (bass + 0.1);
        this.#particleSystem.rotation.x += 0.003 * (treble + 0.05);
        
        // Render with optional chaining
        if (data.renderer && this.scene && this.camera) {
            data.renderer.render(this.scene, this.camera);
        }
    }
    
    // Private update method
    #updateParticles(bass, mid, treble, data) {
        const positions = this.#particleSystem.geometry.attributes.position.array;
        const colors = this.#particleSystem.geometry.attributes.color.array;
        
        // Swarm center with object shorthand
        const swarmCenter = {
            x: Math.sin(this.#time * 0.5) * 40 * (bass || 0.1),
            y: Math.cos(this.#time * 0.3) * 40 * (mid || 0.1),
            z: Math.sin(this.#time * 0.7) * 40 * (treble || 0.1)
        };
        
        // Modern for loop with array methods
        Array.from({ length: this.#particleCount }, (_, i) => {
            const i3 = i * 3;
            
            // Destructuring assignment
            const [x, y, z] = [positions[i3], positions[i3 + 1], positions[i3 + 2]];
            
            // Calculate force with modern math
            const distance = Math.hypot(
                swarmCenter.x - x,
                swarmCenter.y - y,
                swarmCenter.z - z
            );
            
            const force = 0.03 * (bass + 0.1);
            
            if (distance > 0) {
                // Array destructuring for velocity updates
                const forceVector = [
                    (swarmCenter.x - x) / distance * force,
                    (swarmCenter.y - y) / distance * force,
                    (swarmCenter.z - z) / distance * force
                ];
                
                // Update velocities
                this.velocities[i3] += forceVector[0];
                this.velocities[i3 + 1] += forceVector[1];
                this.velocities[i3 + 2] += forceVector[2];
            }
            
            // Apply damping and update positions
            [i3, i3 + 1, i3 + 2].forEach(idx => {
                this.velocities[idx] *= 0.98;
                positions[idx] += this.velocities[idx];
            });
            
            // Update colors with modern array methods - brighter futuristic colors
            const audioIndex = Math.floor((i / this.#particleCount) * data.frequencyData.length);
            const audioLevel = data.frequencyData?.[audioIndex] / 255 ?? 0;
            
            // Bright futuristic color scheme
            const time = this.#time * 0.5;
            const hue = (audioIndex / this.#particleCount + time * 0.1) % 1;
            const saturation = 0.8 + audioLevel * 0.2; // High saturation
            const lightness = 0.6 + audioLevel * 0.4; // Bright colors
            
            const brightColor = new THREE.Color().setHSL(hue, saturation, lightness);
            const colorMultipliers = [
                brightColor.r,
                brightColor.g, 
                brightColor.b
            ];
            
            colorMultipliers.forEach((multiplier, idx) => {
                colors[i3 + idx] = multiplier;
            });
        });
        
        // Update geometry
        this.#particleSystem.geometry.attributes.position.needsUpdate = true;
        this.#particleSystem.geometry.attributes.color.needsUpdate = true;
    }
    
    // Akko resize method
    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
        console.log(`📐 ES12+ Particle Swarm resized to ${data.width}x${data.height}`);
    }
    
    // Akko destroy method with cleanup
    onDestroy() {
        ES12AkkoParticleSwarm.#instances.delete(this);
        this.scene?.remove(this.#particleSystem);
        this.#particleSystem?.geometry?.dispose();
        this.#particleSystem?.material?.dispose();
        
        // Clear references
        delete this.scene;
        delete this.camera;
        delete this.velocities;
        this.#particleSystem = null;
        
        console.log('🗑️ ES12+ Particle Swarm destroyed');
    }
    
    // Static method to get instance count
    static getInstanceCount() {
        return this.#instances.size;
    }
}