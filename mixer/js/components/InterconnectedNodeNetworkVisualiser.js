function InterconnectedNodeNetworkVisualiser() {
    Akko.Visualiser.call(this, {
        code: 'INN',
        name: 'Interconnected Node Network',
        fftSize: 256
    });
    
    this.nodeCount = 50;
    this.nodes = [];
    this.connections = [];
    this.time = 0;
}

InterconnectedNodeNetworkVisualiser.prototype = Object.create(Akko.Visualiser.prototype);
InterconnectedNodeNetworkVisualiser.prototype.constructor = InterconnectedNodeNetworkVisualiser;

InterconnectedNodeNetworkVisualiser.prototype.init = function(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.networkGroup = new THREE.Group();

    // Create nodes
    var nodeGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    
    for (var i = 0; i < this.nodeCount; i++) {
        var nodeMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
            transparent: true,
            opacity: 0.8
        });
        
        var node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
        );
        
        node.userData = {
            originalPosition: node.position.clone(),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ),
            audioIndex: Math.floor((i / this.nodeCount) * 128)
        };
        
        this.nodes.push(node);
        this.networkGroup.add(node);
    }

    // Create connections between nearby nodes
    var connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3
    });

    for (var j = 0; j < this.nodes.length; j++) {
        for (var k = j + 1; k < this.nodes.length; k++) {
            var distance = this.nodes[j].position.distanceTo(this.nodes[k].position);
            
            if (distance < 15) { // Only connect nearby nodes
                var geometry = new THREE.BufferGeometry();
                var positions = new Float32Array(6); // 2 points * 3 coordinates
                
                positions[0] = this.nodes[j].position.x;
                positions[1] = this.nodes[j].position.y;
                positions[2] = this.nodes[j].position.z;
                positions[3] = this.nodes[k].position.x;
                positions[4] = this.nodes[k].position.y;
                positions[5] = this.nodes[k].position.z;
                
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                var line = new THREE.Line(geometry, connectionMaterial);
                line.userData = { nodeA: j, nodeB: k };
                
                this.connections.push(line);
                this.networkGroup.add(line);
            }
        }
    }

    this.scene.add(this.networkGroup);
};

InterconnectedNodeNetworkVisualiser.prototype.update = function(frequencyData) {
    if (!this.networkGroup) return;

    this.time += 0.016;

    // Update nodes
    for (var i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i];
        var audioLevel = frequencyData[node.userData.audioIndex] / 255;
        
        // Scale nodes based on audio
        var scale = 0.5 + audioLevel * 2;
        node.scale.setScalar(scale);
        
        // Update node color
        var hue = (node.userData.audioIndex / 128 + this.time * 0.1) % 1;
        node.material.color.setHSL(hue, 0.8, 0.3 + audioLevel * 0.7);
        
        // Move nodes slightly
        node.position.add(node.userData.velocity);
        
        // Apply some attraction back to original position
        var returnForce = node.userData.originalPosition.clone().sub(node.position).multiplyScalar(0.01);
        node.userData.velocity.add(returnForce);
        
        // Apply damping
        node.userData.velocity.multiplyScalar(0.98);
        
        // Add audio-reactive movement
        node.userData.velocity.add(new THREE.Vector3(
            (Math.random() - 0.5) * audioLevel * 0.1,
            (Math.random() - 0.5) * audioLevel * 0.1,
            (Math.random() - 0.5) * audioLevel * 0.1
        ));
    }

    // Update connections
    for (var j = 0; j < this.connections.length; j++) {
        var connection = this.connections[j];
        var nodeA = this.nodes[connection.userData.nodeA];
        var nodeB = this.nodes[connection.userData.nodeB];
        
        // Update connection positions
        var positions = connection.geometry.attributes.position.array;
        positions[0] = nodeA.position.x;
        positions[1] = nodeA.position.y;
        positions[2] = nodeA.position.z;
        positions[3] = nodeB.position.x;
        positions[4] = nodeB.position.y;
        positions[5] = nodeB.position.z;
        
        connection.geometry.attributes.position.needsUpdate = true;
        
        // Update connection opacity based on distance and audio
        var distance = nodeA.position.distanceTo(nodeB.position);
        var audioA = frequencyData[nodeA.userData.audioIndex] / 255;
        var audioB = frequencyData[nodeB.userData.audioIndex] / 255;
        var avgAudio = (audioA + audioB) / 2;
        
        connection.material.opacity = Math.max(0.1, (1 - distance / 20) * avgAudio);
    }

    // Rotate entire network
    this.networkGroup.rotation.y += 0.005;
    this.networkGroup.rotation.x += 0.002;
};

InterconnectedNodeNetworkVisualiser.prototype.resize = function(width, height) {
    // No specific resize logic needed
};

// Register with Akko
if (typeof Akko !== 'undefined') {
    Akko.addVisualiser('InterconnectedNodeNetworkVisualiser', InterconnectedNodeNetworkVisualiser);
}