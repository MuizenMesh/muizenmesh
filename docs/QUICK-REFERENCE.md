# MuizenMesh Quick Reference

## 🚀 Quick Start Commands

```bash
# Start development server
netlify dev

# Alternative local server
python3 -m http.server 8888

# Access mixers
# ES5:   http://localhost:8888/mixer/
# ES6:   http://localhost:8888/mixer-es6/
# ES12+: http://localhost:8888/mixer-es12/
```

## 📁 Project Structure

```
muizenmesh/
├── mixer/           # ES5 version (legacy)
├── mixer-es6/       # ES6 version (modern)
├── mixer-es12/      # ES12+ version (cutting-edge)
├── Akko/           # Audio framework
├── docs/           # Documentation
└── netlify.toml    # Configuration
```

## 🎛️ Mixer Controls

### Universal Controls
- **Click Play Button**: Start mixer
- **Drag & Drop**: Add audio files
- **Space**: Play/pause toggle

### ES5/ES6 Mixer (Akko UI)
- **Arrow Keys**: Navigate tracks
- **Number Keys**: Switch visualizers
- **UI Controls**: Volume, settings

### ES12+ Mixer (Akko UI + Modern Features)
- Same as ES6 + enhanced error handling
- Private field encapsulation
- Modern async patterns

## 🔧 Development Quick Reference

### Adding New Visualizer

#### ES5 Pattern
```javascript
function MyVisualizer() {
    Akko.Visualiser.call(this, { code: 'MV', name: 'My Visualizer' });
}
MyVisualizer.prototype = Object.create(Akko.Visualiser.prototype);
MyVisualizer.prototype.update = function(frequencyData) { /* ... */ };
```

#### ES6 Pattern
```javascript
export default class MyVisualizer {
    constructor() { /* ... */ }
    init(scene, camera, renderer) { /* ... */ }
    update(frequencyData) { /* ... */ }
}
```

#### ES12+ Pattern
```javascript
export default class MyVisualizer {
    #privateField = value;
    static #instances = new Set();
    
    constructor() {
        MyVisualizer.#instances.add(this);
    }
    
    async update(frequencyData) {
        const level = frequencyData?.[0] / 255 ?? 0;
        this.#privateField ||= defaultValue;
    }
}
```

## 🌐 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES5 Mixer | Any | Any | Any | Any |
| ES6 Mixer | 61+ | 60+ | 10.1+ | 16+ |
| ES12+ Mixer | 94+ | 93+ | 15+ | 94+ |

## 🎵 Audio Sources

### Supported Formats
- MP3, WAV, OGG, M4A
- Drag & drop files
- Demo tracks included

### Audio Processing
- Web Audio API
- Real-time frequency analysis
- Akko framework integration

## 🎨 Visualizer Types

### Built-in (ES5/ES6)
- Bar Visualizer
- Ring Visualizer
- Sphere Visualizer
- Custom Bars

### ES12+ Enhanced
- Particle Swarm (with swarm intelligence)
- Voxel Grid (3D audio-reactive)
- Light Tunnel (procedural effects)
- Node Network (interconnected)

## 🛠️ Common Tasks

### Fix MIME Type Issues
```toml
# netlify.toml - Remove this line:
# X-Content-Type-Options = "nosniff"
```

### Debug Module Loading
```javascript
// Check in browser console
console.log('THREE:', typeof THREE);
console.log('Akko:', typeof Akko);
```

### Test ES12+ Features
```javascript
// Feature detection
const hasPrivateFields = (() => {
    try { eval('class T { #p = 1; }'); return true; }
    catch { return false; }
})();
```

## 🔍 Troubleshooting

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| MIME type mismatch | Server headers | Remove `nosniff` header |
| Module loading failed | Wrong URL/path | Use correct relative paths |
| THREE is not defined | Missing dependency | Load Three.js before modules |
| Audio context suspended | No user interaction | Click play button first |

### Debug Checklist

1. ✅ Correct URL (`/mixer-es12/` not `/`)
2. ✅ Modern browser for ES12+
3. ✅ Netlify Dev running
4. ✅ No console errors
5. ✅ Audio files present

## 📊 Performance Tips

### Optimization
- Use object pooling for particles
- Minimize Three.js state changes
- Dispose resources properly
- Use efficient update patterns

### Memory Management
```javascript
// ES12+ cleanup pattern
destroy() {
    this.#geometry?.dispose();
    this.#material?.dispose();
    this.scene?.remove(this.#mesh);
}
```

## 🎯 ES12+ Features Quick Reference

### Private Fields
```javascript
class Example {
    #private = value;        // Private field
    static #shared = data;   // Static private
    
    #method() { /* ... */ }  // Private method
}
```

### Optional Chaining
```javascript
obj?.prop?.method?.();      // Safe property access
array?.[index]              // Safe array access
func?.()                    // Safe function call
```

### Nullish Coalescing
```javascript
value ?? defaultValue       // Only null/undefined
value || defaultValue       // Any falsy value
```

### Logical Assignment
```javascript
x ||= y    // x = x || y
x &&= y    // x = x && y
x ??= y    // x = x ?? y
```

### Top-level Await
```javascript
// In modules
const module = await import('./module.js');
const data = await fetch('/api/data');
```

## 📝 File Templates

### ES12+ Visualizer Template
```javascript
export default class NewVisualizer {
    #scene = null;
    #mesh = null;
    #time = 0;
    
    constructor() {
        console.log('🎨 New visualizer created');
    }
    
    init(scene, camera, renderer) {
        this.#scene = scene;
        // Setup Three.js objects
    }
    
    async update(frequencyData) {
        this.#time += 0.016;
        const audioLevel = frequencyData?.[0] / 255 ?? 0;
        // Update visualization
    }
    
    destroy() {
        this.#scene?.remove(this.#mesh);
        this.#mesh?.geometry?.dispose();
        this.#mesh?.material?.dispose();
    }
}
```

### Integration Template
```javascript
// In mixer-es12/index.html
const { default: NewVisualizer } = await import('./js/components/NewVisualizer.js');
akkoManager.addVisualizer(new NewVisualizer());
```

## 🔗 Useful Links

- [Three.js Examples](https://threejs.org/examples/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [ES2022 Features](https://2ality.com/2021/09/es2022.html)
- [Netlify Dev Docs](https://docs.netlify.com/cli/get-started/)

---

*Keep this reference handy for quick development tasks!*