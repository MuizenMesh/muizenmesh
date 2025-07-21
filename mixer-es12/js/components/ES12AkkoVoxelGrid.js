// ES12+ Akko-compatible Voxel Grid Visualizer
export default class ES12AkkoVoxelGrid extends Akko.Visualiser {
    // Private fields (ES2022)
    #voxelGrid = null;
    #gridSize = 16;
    #voxels = [];
    #time = 0;
    
    // Static private field
    static #instances = new WeakSet();
    
    constructor() {
        super({
            code: 'VXL',
            name: 'Voxel Grid',
            fftSize: 256,
            smoothingTimeConstant: 0.7,
        });
        
        ES12AkkoVoxelGrid.#instances.add(this);
        console.log('🧊 ES12+ Voxel Grid visualizer created');
    }
    
    onInit(data) {
        console.log('🚀 ES12+ Voxel Grid initializing...');
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.set(30, 30, 30);
        this.camera.lookAt(0, 0, 0);
        
        this.#createVoxelGrid();
    }
    
    // Private method using modern syntax
    #createVoxelGrid() {
        this.#voxelGrid = new THREE.Group();
        
        // Create voxels with modern array methods
        this.#voxels = Array.from({ length: this.#gridSize }, (_, x) =>
            Array.from({ length: this.#gridSize }, (_, y) =>
                Array.from({ length: this.#gridSize }, (_, z) => {
                    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
                    const material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(
                            (x + y + z) / (this.#gridSize * 3),
                            0.8,
                            0.5
                        ),
                        transparent: true,
                        opacity: 0.7
                    });
                    
                    const voxel = new THREE.Mesh(geometry, material);
                    voxel.position.set(
                        x - this.#gridSize / 2,
                        y - this.#gridSize / 2,
                        z - this.#gridSize / 2
                    );
                    
                    // Store original position and audio index
                    voxel.userData = {
                        originalPosition: voxel.position.clone(),
                        audioIndex: Math.floor(((x + y + z) / (this.#gridSize * 3)) * 256),
                        baseScale: 1
                    };
                    
                    this.#voxelGrid.add(voxel);
                    return voxel;
                })
            )
        );
        
        this.scene?.add(this.#voxelGrid);
    }
    
    onUpdate(data) {
        if (!this.#voxelGrid || !data?.frequencyData) return;
        
        this.#time += 0.016;
        
        // Update voxels with modern syntax
        this.#voxels.flat(2).forEach((voxel, index) => {
            const { audioIndex, originalPosition, baseScale } = voxel.userData;
            const audioLevel = data.frequencyData[audioIndex % data.frequencyData.length] / 255 || 0;
            
            // Scale based on audio with nullish coalescing
            const scale = baseScale + audioLevel * 2;
            voxel.scale.setScalar(scale);
            
            // Color animation with optional chaining
            const hue = (audioIndex / 256 + this.#time * 0.1) % 1;
            voxel.material.color?.setHSL(hue, 0.8, 0.3 + audioLevel * 0.7);
            
            // Position animation
            voxel.position.y = originalPosition.y + Math.sin(this.#time + index * 0.1) * audioLevel * 5;
        });
        
        // Rotate entire grid
        this.#voxelGrid.rotation.y += 0.005;
        this.#voxelGrid.rotation.x += 0.002;
        
        if (data.renderer && this.scene && this.camera) {
            data.renderer.render(this.scene, this.camera);
        }
    }
    
    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
    }
    
    onDestroy() {
        ES12AkkoVoxelGrid.#instances.delete(this);
        this.#voxels.flat(2).forEach(voxel => {
            voxel.geometry?.dispose();
            voxel.material?.dispose();
        });
        this.scene?.remove(this.#voxelGrid);
        this.#voxels.length = 0;
        console.log('🗑️ ES12+ Voxel Grid destroyed');
    }
}