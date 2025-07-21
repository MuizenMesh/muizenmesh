// ES12+ Akko-compatible Light Tunnel Visualizer
export default class ES12AkkoLightTunnel extends Akko.Visualiser {
    // Private fields
    #tunnel = null;
    #rings = [];
    #ringCount = 50;
    #time = 0;
    
    constructor() {
        super({
            code: 'TNL',
            name: 'Light Tunnel',
            fftSize: 512,
            smoothingTimeConstant: 0.8,
        });
        
        console.log('🌈 ES12+ Light Tunnel visualizer created');
    }
    
    onInit(data) {
        console.log('🚀 ES12+ Light Tunnel initializing...');
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.z = 0;
        
        this.#createTunnel();
    }
    
    #createTunnel() {
        this.#tunnel = new THREE.Group();
        
        // Create rings with modern array methods
        this.#rings = Array.from({ length: this.#ringCount }, (_, i) => {
            const geometry = new THREE.RingGeometry(5, 15, 32);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i / this.#ringCount, 1, 0.5),
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(geometry, material);
            ring.position.z = -i * 5;
            
            ring.userData = {
                originalZ: ring.position.z,
                audioIndex: Math.floor((i / this.#ringCount) * 256),
                baseScale: 1
            };
            
            this.#tunnel.add(ring);
            return ring;
        });
        
        this.scene?.add(this.#tunnel);
    }
    
    onUpdate(data) {
        if (!this.#tunnel || !data?.frequencyData) return;
        
        this.#time += 0.016;
        
        // Move camera through tunnel
        this.camera.position.z += 0.5;
        
        // Update rings
        this.#rings.forEach((ring, index) => {
            const { audioIndex, originalZ, baseScale } = ring.userData;
            const audioLevel = data.frequencyData[audioIndex] / 255 || 0;
            
            // Move ring forward
            ring.position.z += 0.5;
            
            // Reset ring when it passes camera
            if (ring.position.z > this.camera.position.z + 10) {
                ring.position.z = this.camera.position.z - this.#ringCount * 5;
            }
            
            // Scale and color based on audio
            const scale = baseScale + audioLevel * 2;
            ring.scale.setScalar(scale);
            
            const hue = (audioIndex / 256 + this.#time * 0.1) % 1;
            ring.material.color?.setHSL(hue, 1, 0.3 + audioLevel * 0.7);
            ring.material.opacity = 0.5 + audioLevel * 0.5;
            
            // Rotation
            ring.rotation.z += 0.01 + audioLevel * 0.05;
        });
        
        if (data.renderer && this.scene && this.camera) {
            data.renderer.render(this.scene, this.camera);
        }
    }
    
    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
    }
    
    onDestroy() {
        this.#rings.forEach(ring => {
            ring.geometry?.dispose();
            ring.material?.dispose();
        });
        this.scene?.remove(this.#tunnel);
        this.#rings.length = 0;
        console.log('🗑️ ES12+ Light Tunnel destroyed');
    }
}