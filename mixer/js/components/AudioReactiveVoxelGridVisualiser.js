function AudioReactiveVoxelGridVisualiser() {
    Akko.Visualiser.call(this, {
        code: 'ARVG',
        name: 'Audio Reactive Voxel Grid',
        fftSize: 512
    });
    
    this.gridSize = 16;
    this.voxels = [];
    this.time = 0;
}

AudioReactiveVoxelGridVisualiser.prototype = Object.create(Akko.Visualiser.prototype);
AudioReactiveVoxelGridVisualiser.prototype.constructor = AudioReactiveVoxelGridVisualiser;

AudioReactiveVoxelGridVisualiser.prototype.init = function(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Create voxel grid
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    this.voxelGroup = new THREE.Group();

    for (var x = 0; x < this.gridSize; x++) {
        this.voxels[x] = [];
        for (var y = 0; y < this.gridSize; y++) {
            this.voxels[x][y] = [];
            for (var z = 0; z < this.gridSize; z++) {
                var material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(
                        (x + y + z) / (this.gridSize * 3),
                        0.8,
                        0.5
                    ),
                    transparent: true,
                    opacity: 0.3
                });

                var voxel = new THREE.Mesh(geometry, material);
                voxel.position.set(
                    x - this.gridSize / 2,
                    y - this.gridSize / 2,
                    z - this.gridSize / 2
                );

                this.voxels[x][y][z] = voxel;
                this.voxelGroup.add(voxel);
            }
        }
    }

    this.scene.add(this.voxelGroup);
};

AudioReactiveVoxelGridVisualiser.prototype.update = function(frequencyData) {
    if (!this.voxelGroup) return;

    this.time += 0.016;

    for (var x = 0; x < this.gridSize; x++) {
        for (var y = 0; y < this.gridSize; y++) {
            for (var z = 0; z < this.gridSize; z++) {
                var voxel = this.voxels[x][y][z];
                
                // Map voxel position to frequency data
                var freqIndex = Math.floor(
                    ((x + y + z) / (this.gridSize * 3)) * frequencyData.length
                );
                var audioLevel = frequencyData[freqIndex] / 255;
                
                // Scale voxel based on audio
                var scale = 0.5 + audioLevel * 2;
                voxel.scale.setScalar(scale);
                
                // Update opacity
                voxel.material.opacity = 0.2 + audioLevel * 0.8;
                
                // Update color hue based on audio
                var hue = ((x + y + z) / (this.gridSize * 3) + this.time * 0.1) % 1;
                voxel.material.color.setHSL(hue, 0.8, 0.3 + audioLevel * 0.7);
            }
        }
    }

    // Rotate the entire grid
    this.voxelGroup.rotation.x += 0.005;
    this.voxelGroup.rotation.y += 0.01;
};

AudioReactiveVoxelGridVisualiser.prototype.resize = function(width, height) {
    // No specific resize logic needed
};

// Register with Akko
if (typeof Akko !== 'undefined') {
    Akko.addVisualiser('AudioReactiveVoxelGridVisualiser', AudioReactiveVoxelGridVisualiser);
}