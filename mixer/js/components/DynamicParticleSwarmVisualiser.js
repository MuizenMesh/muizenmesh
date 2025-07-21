function DynamicParticleSwarmVisualiser() {
    Akko.Visualiser.call(this, {
        code: 'DPS',
        name: 'Dynamic Particle Swarm',
        fftSize: 256
    });
    
    this.particles = [];
    this.particleCount = 500;
    this.swarmCenter = new THREE.Vector3();
    this.time = 0;
}

DynamicParticleSwarmVisualiser.prototype = Object.create(Akko.Visualiser.prototype);
DynamicParticleSwarmVisualiser.prototype.constructor = DynamicParticleSwarmVisualiser;

DynamicParticleSwarmVisualiser.prototype.init = function(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Create particle geometry
    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(this.particleCount * 3);
    var colors = new Float32Array(this.particleCount * 3);
    var velocities = new Float32Array(this.particleCount * 3);

    for (var i = 0; i < this.particleCount; i++) {
        var i3 = i * 3;
        
        // Random initial positions
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
        
        // Random initial colors
        colors[i3] = Math.random();
        colors[i3 + 1] = Math.random();
        colors[i3 + 2] = Math.random();
        
        // Random initial velocities
        velocities[i3] = (Math.random() - 0.5) * 2;
        velocities[i3 + 1] = (Math.random() - 0.5) * 2;
        velocities[i3 + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    this.velocities = velocities;

    // Create particle material
    var material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Create particle system
    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
};

DynamicParticleSwarmVisualiser.prototype.update = function(frequencyData) {
    if (!this.particleSystem) return;

    this.time += 0.016;
    
    // Calculate audio-reactive swarm center
    var bassLevel = frequencyData[0] / 255;
    var midLevel = frequencyData[Math.floor(frequencyData.length / 2)] / 255;
    var trebleLevel = frequencyData[frequencyData.length - 1] / 255;
    
    this.swarmCenter.x = Math.sin(this.time * 0.5) * 30 * bassLevel;
    this.swarmCenter.y = Math.cos(this.time * 0.3) * 30 * midLevel;
    this.swarmCenter.z = Math.sin(this.time * 0.7) * 30 * trebleLevel;

    var positions = this.particleSystem.geometry.attributes.position.array;
    var colors = this.particleSystem.geometry.attributes.color.array;

    for (var i = 0; i < this.particleCount; i++) {
        var i3 = i * 3;
        
        // Current position
        var x = positions[i3];
        var y = positions[i3 + 1];
        var z = positions[i3 + 2];
        
        // Calculate force towards swarm center
        var dx = this.swarmCenter.x - x;
        var dy = this.swarmCenter.y - y;
        var dz = this.swarmCenter.z - z;
        var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Apply swarm behavior
        var force = 0.02 * (bassLevel + 0.1);
        if (distance > 0) {
            this.velocities[i3] += (dx / distance) * force;
            this.velocities[i3 + 1] += (dy / distance) * force;
            this.velocities[i3 + 2] += (dz / distance) * force;
        }
        
        // Apply damping
        this.velocities[i3] *= 0.98;
        this.velocities[i3 + 1] *= 0.98;
        this.velocities[i3 + 2] *= 0.98;
        
        // Update positions
        positions[i3] += this.velocities[i3];
        positions[i3 + 1] += this.velocities[i3 + 1];
        positions[i3 + 2] += this.velocities[i3 + 2];
        
        // Update colors based on audio
        var audioIndex = Math.floor((i / this.particleCount) * frequencyData.length);
        var audioLevel = frequencyData[audioIndex] / 255;
        
        colors[i3] = audioLevel * 0.8 + 0.2; // Red
        colors[i3 + 1] = midLevel * 0.6 + 0.4; // Green
        colors[i3 + 2] = trebleLevel * 0.9 + 0.1; // Blue
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    this.particleSystem.geometry.attributes.color.needsUpdate = true;
    
    // Rotate the entire system
    this.particleSystem.rotation.y += 0.005 * (bassLevel + 0.1);
};

DynamicParticleSwarmVisualiser.prototype.resize = function(width, height) {
    // No specific resize logic needed for particles
};

// Register with Akko
if (typeof Akko !== 'undefined') {
    Akko.addVisualiser('DynamicParticleSwarmVisualiser', DynamicParticleSwarmVisualiser);
}