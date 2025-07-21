// ES12+ Akko-compatible Node Network Visualizer
export default class ES12AkkoNodeNetwork extends Akko.Visualiser {
    // Private fields
    #network = null;
    #nodes = [];
    #connections = [];
    #nodeCount = 30;
    #time = 0;
    
    constructor() {
        super({
            code: 'NET',
            name: 'Node Network',
            fftSize: 256,
            smoothingTimeConstant: 0.6,
        });
        
        console.log('🕸️ ES12+ Node Network visualizer created');
    }
    
    onInit(data) {
        console.log('🚀 ES12+ Node Network initializing...');
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.z = 50;
        
        this.#createNetwork();
    }
    
    #createNetwork() {
        this.#network = new THREE.Group();
        
        // Create nodes with modern syntax
        this.#nodes = Array.from({ length: this.#nodeCount }, (_, i) => {
            const geometry = new THREE.SphereGeometry(1, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                transparent: true,
                opacity: 0.8
            });
            
            const node = new THREE.Mesh(geometry, material);
            const [x, y, z] = [...Array(3)].map(() => (Math.random() - 0.5) * 60);
            node.position.set(x, y, z);
            
            node.userData = {
                originalPosition: node.position.clone(),
                velocity: new THREE.Vector3(
                    ...[...Array(3)].map(() => (Math.random() - 0.5) * 0.2)
                ),
                audioIndex: Math.floor((i / this.#nodeCount) * 256)
            };
            
            this.#network.add(node);
            return node;
        });
        
        // Create connections
        this.#createConnections();
        this.scene?.add(this.#network);
    }
    
    #createConnections() {
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3
        });
        
        this.#connections = this.#nodes.flatMap((nodeA, i) =>
            this.#nodes.slice(i + 1)
                .filter(nodeB => nodeA.position.distanceTo(nodeB.position) < 20)
                .map(nodeB => {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array([
                        nodeA.position.x, nodeA.position.y, nodeA.position.z,
                        nodeB.position.x, nodeB.position.y, nodeB.position.z
                    ]);
                    
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    const line = new THREE.Line(geometry, connectionMaterial);
                    line.userData = { nodeA, nodeB };
                    
                    this.#network.add(line);
                    return line;
                })
        );
    }
    
    onUpdate(data) {
        if (!this.#network || !data?.frequencyData) return;
        
        this.#time += 0.016;
        
        // Update nodes
        this.#nodes.forEach(node => {
            const { audioIndex, velocity, originalPosition } = node.userData;
            const audioLevel = data.frequencyData[audioIndex] / 255 || 0;
            
            // Scale and color based on audio
            const scale = 0.5 + audioLevel * 3;
            node.scale.setScalar(scale);
            
            const hue = (audioIndex / 256 + this.#time * 0.1) % 1;
            node.material.color?.setHSL(hue, 0.8, 0.3 + audioLevel * 0.7);
            
            // Movement
            node.position.add(velocity);
            
            // Return to original position
            const returnForce = originalPosition.clone()
                .sub(node.position)
                .multiplyScalar(0.01);
            velocity.add(returnForce);
            velocity.multiplyScalar(0.98);
            
            // Audio-reactive movement
            velocity.add(new THREE.Vector3(
                ...[...Array(3)].map(() => (Math.random() - 0.5) * audioLevel * 0.2)
            ));
        });
        
        // Update connections
        this.#connections.forEach(connection => {
            const { nodeA, nodeB } = connection.userData;
            const positions = connection.geometry.attributes.position.array;
            
            // Update positions
            [positions[0], positions[1], positions[2]] = [nodeA.position.x, nodeA.position.y, nodeA.position.z];
            [positions[3], positions[4], positions[5]] = [nodeB.position.x, nodeB.position.y, nodeB.position.z];
            
            connection.geometry.attributes.position.needsUpdate = true;
            
            // Update opacity based on distance
            const distance = nodeA.position.distanceTo(nodeB.position);
            connection.material.opacity = Math.max(0.1, 1 - distance / 30);
        });
        
        // Rotate network
        this.#network.rotation.y += 0.005;
        this.#network.rotation.x += 0.002;
        
        if (data.renderer && this.scene && this.camera) {
            data.renderer.render(this.scene, this.camera);
        }
    }
    
    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
    }
    
    onDestroy() {
        this.#nodes.forEach(node => {
            node.geometry?.dispose();
            node.material?.dispose();
        });
        this.#connections.forEach(connection => {
            connection.geometry?.dispose();
            connection.material?.dispose();
        });
        this.scene?.remove(this.#network);
        this.#nodes.length = 0;
        this.#connections.length = 0;
        console.log('🗑️ ES12+ Node Network destroyed');
    }
}