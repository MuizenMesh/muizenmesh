// ES12+ Node Network Visualizer with cutting-edge JavaScript features
export default class ES12NodeNetwork {
    // Private fields (ES2022)
    #nodes = [];
    #connections = [];
    #nodeCount = 50;
    #time = 0;
    #networkGroup = null;
    
    // Static private field for tracking instances
    static #instances = new WeakSet();
    
    constructor(nodeCount = 50) {
        // Add to instances tracking
        ES12NodeNetwork.#instances.add(this);
        
        // Using nullish coalescing for default values
        this.#nodeCount = nodeCount ?? 50;
        
        console.log(`🕸️ ES12+ Node Network created with ${this.#nodeCount} nodes`);
    }
    
    // Optional chaining and modern syntax
    init(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        
        this.#networkGroup = new THREE.Group();
        
        // Create nodes with modern array methods
        this.#createNodes();
        this.#createConnections();
        
        // Optional chaining for safe method calls
        this.scene?.add(this.#networkGroup);
    }
    
    // Private method using modern syntax
    #createNodes() {
        const nodeGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        
        // Use Array.from with modern destructuring
        this.#nodes = Array.from({ length: this.#nodeCount }, (_, i) => {
            // Object shorthand and computed properties
            const nodeMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            
            // Destructuring with spread operator
            const [x, y, z] = [...Array(3)].map(() => (Math.random() - 0.5) * 50);
            node.position.set(x, y, z);
            
            // Modern object literal with computed properties
            node.userData = {
                originalPosition: node.position.clone(),
                velocity: new THREE.Vector3(
                    ...[...Array(3)].map(() => (Math.random() - 0.5) * 0.1)
                ),
                audioIndex: Math.floor((i / this.#nodeCount) * 128),
                // Template literal property
                [`node_${i}_id`]: `node-${i}`
            };
            
            this.#networkGroup?.add(node);
            return node;
        });
    }
    
    // Private method for creating connections
    #createConnections() {
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3
        });
        
        // Nested loops with modern array methods
        this.#connections = this.#nodes.flatMap((nodeA, i) => 
            this.#nodes.slice(i + 1).map((nodeB, j) => {
                const distance = nodeA.position.distanceTo(nodeB.position);
                
                // Early return with nullish coalescing
                if (distance >= 15) return null;
                
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array([
                    nodeA.position.x, nodeA.position.y, nodeA.position.z,
                    nodeB.position.x, nodeB.position.y, nodeB.position.z
                ]);
                
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                const line = new THREE.Line(geometry, connectionMaterial);
                // Object shorthand
                line.userData = { nodeA: i, nodeB: i + j + 1 };
                
                this.#networkGroup?.add(line);
                return line;
            }).filter(Boolean) // Remove null values
        ).flat();
    }
    
    // Async update method with modern features
    async update(frequencyData) {
        // Early return with nullish coalescing
        if (!this.#networkGroup || !frequencyData) return;
        
        this.#time += 0.016;
        
        // Update nodes with modern array methods
        this.#nodes.forEach((node, i) => {
            const { audioIndex, velocity, originalPosition } = node.userData;
            const audioLevel = frequencyData[audioIndex] / 255 || 0;
            
            // Logical assignment operators (ES2021)
            node.scale.x ||= 1;
            node.scale.y ||= 1;
            node.scale.z ||= 1;
            
            // Scale nodes based on audio with modern math
            const scale = 0.5 + audioLevel * 2;
            node.scale.setScalar(scale);
            
            // Update node color with template literals
            const hue = (audioIndex / 128 + this.#time * 0.1) % 1;
            node.material.color.setHSL(hue, 0.8, 0.3 + audioLevel * 0.7);
            
            // Modern vector operations
            node.position.add(velocity);
            
            // Apply attraction back to original position
            const returnForce = originalPosition.clone()
                .sub(node.position)
                .multiplyScalar(0.01);
            velocity.add(returnForce);
            
            // Apply damping
            velocity.multiplyScalar(0.98);
            
            // Add audio-reactive movement with destructuring
            const [dx, dy, dz] = [...Array(3)].map(() => 
                (Math.random() - 0.5) * audioLevel * 0.1
            );
            velocity.add(new THREE.Vector3(dx, dy, dz));
        });
        
        // Update connections with modern syntax
        this.#connections.forEach(connection => {
            const { nodeA: nodeAIndex, nodeB: nodeBIndex } = connection.userData;
            const [nodeA, nodeB] = [this.#nodes[nodeAIndex], this.#nodes[nodeBIndex]];
            
            // Optional chaining for safe access
            if (!nodeA || !nodeB) return;
            
            // Update connection positions with destructuring
            const positions = connection.geometry.attributes.position.array;
            [
                positions[0], positions[1], positions[2],
                positions[3], positions[4], positions[5]
            ] = [
                nodeA.position.x, nodeA.position.y, nodeA.position.z,
                nodeB.position.x, nodeB.position.y, nodeB.position.z
            ];
            
            connection.geometry.attributes.position.needsUpdate = true;
            
            // Update connection opacity with modern math
            const distance = nodeA.position.distanceTo(nodeB.position);
            const audioA = frequencyData[nodeA.userData.audioIndex] / 255 || 0;
            const audioB = frequencyData[nodeB.userData.audioIndex] / 255 || 0;
            const avgAudio = (audioA + audioB) / 2;
            
            // Math.max with computed values
            connection.material.opacity = Math.max(0.1, (1 - distance / 20) * avgAudio);
        });
        
        // Rotate entire network with nullish coalescing
        this.#networkGroup.rotation.y += 0.005 * (1 + (frequencyData[0] / 255 || 0) * 0.5);
        this.#networkGroup.rotation.x += 0.002 * (1 + (frequencyData[64] / 255 || 0) * 0.3);
    }
    
    // Optional method with default parameters
    resize(width = window.innerWidth, height = window.innerHeight) {
        const aspectRatio = width / height;
        console.log(`🕸️ ES12+ Node Network resized to ${width}x${height} (${aspectRatio.toFixed(2)})`);
    }
    
    // Static method to check if instance exists
    static hasInstance(instance) {
        return this.#instances.has(instance);
    }
    
    // Cleanup method with modern syntax
    destroy() {
        ES12NodeNetwork.#instances.delete(this);
        
        // Clean up nodes
        this.#nodes.forEach(node => {
            node.geometry?.dispose();
            node.material?.dispose();
        });
        
        // Clean up connections
        this.#connections.forEach(connection => {
            connection.geometry?.dispose();
            connection.material?.dispose();
        });
        
        // Remove from scene
        this.scene?.remove(this.#networkGroup);
        
        // Clear arrays
        this.#nodes.length = 0;
        this.#connections.length = 0;
    }
    
    // Getter for node count (modern syntax)
    get nodeCount() {
        return this.#nodeCount;
    }
    
    // Getter for connection count
    get connectionCount() {
        return this.#connections.length;
    }
}