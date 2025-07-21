function ProceduralLightTunnelVisualiser() {
    Akko.Visualiser.call(this, {
        code: 'PLT',
        name: 'Procedural Light Tunnel',
        fftSize: 256
    });
    
    this.tunnelSegments = 50;
    this.rings = [];
    this.time = 0;
}

ProceduralLightTunnelVisualiser.prototype = Object.create(Akko.Visualiser.prototype);
ProceduralLightTunnelVisualiser.prototype.constructor = ProceduralLightTunnelVisualiser;

ProceduralLightTunnelVisualiser.prototype.init = function(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Create tunnel rings
    this.tunnelGroup = new THREE.Group();
    
    for (var i = 0; i < this.tunnelSegments; i++) {
        var ringGeometry = new THREE.RingGeometry(5, 8, 16);
        var ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(i / this.tunnelSegments, 1, 0.5),
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        var ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.z = i * -2;
        ring.userData = { originalZ: ring.position.z, index: i };
        
        this.rings.push(ring);
        this.tunnelGroup.add(ring);
    }

    // Add some point lights
    for (var j = 0; j < 5; j++) {
        var light = new THREE.PointLight(
            new THREE.Color().setHSL(j / 5, 1, 0.5),
            1,
            20
        );
        light.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            j * -20
        );
        this.tunnelGroup.add(light);
    }

    this.scene.add(this.tunnelGroup);
};

ProceduralLightTunnelVisualiser.prototype.update = function(frequencyData) {
    if (!this.tunnelGroup) return;

    this.time += 0.016;

    // Move camera through tunnel
    this.camera.position.z = Math.sin(this.time * 0.5) * 5;

    for (var i = 0; i < this.rings.length; i++) {
        var ring = this.rings[i];
        var audioIndex = Math.floor((i / this.rings.length) * frequencyData.length);
        var audioLevel = frequencyData[audioIndex] / 255;
        
        // Move rings towards camera
        ring.position.z += 0.5;
        
        // Reset ring position when it passes the camera
        if (ring.position.z > 10) {
            ring.position.z = -this.tunnelSegments * 2;
        }
        
        // Scale rings based on audio
        var scale = 1 + audioLevel * 2;
        ring.scale.setScalar(scale);
        
        // Update ring color and opacity
        var hue = (ring.userData.index / this.tunnelSegments + this.time * 0.1) % 1;
        ring.material.color.setHSL(hue, 1, 0.3 + audioLevel * 0.7);
        ring.material.opacity = 0.3 + audioLevel * 0.7;
        
        // Rotate rings
        ring.rotation.z += 0.02 + audioLevel * 0.05;
    }

    // Rotate entire tunnel
    this.tunnelGroup.rotation.z += 0.005;
};

ProceduralLightTunnelVisualiser.prototype.resize = function(width, height) {
    // No specific resize logic needed
};

// Register with Akko
if (typeof Akko !== 'undefined') {
    Akko.addVisualiser('ProceduralLightTunnelVisualiser', ProceduralLightTunnelVisualiser);
}