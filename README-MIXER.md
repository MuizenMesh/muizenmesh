# MuizenMesh Audio Mixer Setup

## Directory Structure

### 🎵 **mixer/** (Original ES5 Version)
- **Status**: ✅ Production Ready
- **Framework**: Akko bundled (ES5 compatible)
- **Visualizers**: 6 total (2 original + 4 new)
- **Browser Support**: All modern browsers
- **URL**: `/mixer/`

**Visualizers Available:**
- BarVisualiser (3D bars with lighting)
- RingVisualiser (Scaling rings)
- DynamicParticleSwarmVisualiser (500 swarming particles)
- AudioReactiveVoxelGridVisualiser (4,096 voxel cubes)
- ProceduralLightTunnelVisualiser (Moving tunnel rings)
- InterconnectedNodeNetworkVisualiser (Connected node physics)

### 🎵 **mixer-es5/** (Backup Copy)
- **Status**: ✅ Backup of working ES5 version
- **Purpose**: Preserve working state before ES6 experiments
- **Framework**: Akko bundled (ES5 compatible)
- **Note**: Identical to mixer/ directory

### 🎵 **mixer-es6/** (ES6 Experimental)
- **Status**: 🧪 Testing ES6 modules
- **Framework**: Akko ES6 modules from submodule
- **Visualizers**: ES6 class syntax versions
- **Browser Support**: Modern browsers with ES6 module support
- **URL**: `/mixer-es6/`

**Features:**
- ES6 module imports
- Native ES6 class syntax for visualizers
- Direct import from Akko submodule
- Green-themed play button (vs purple for ES5)
- "ES6 VERSION" badge for identification

### 📁 **Akko/** (Git Submodule)
- **Status**: 📦 Git submodule
- **Purpose**: ES6 source code and examples
- **Contains**: Original ES6 visualizers, framework source
- **Note**: Should be committed as submodule reference

## Usage

### Production (ES5)
```bash
# Use the main mixer
open https://muizenmesh.co.za/mixer/
```

### Development/Testing (ES6)
```bash
# Test ES6 version
open https://muizenmesh.co.za/mixer-es6/
```

## Development Workflow

### Adding New Visualizers

**For ES5 (Production):**
1. Create visualizer in `mixer/js/components/`
2. Use ES5 function syntax: `function MyVisualiser() {}`
3. Use prototype inheritance: `MyVisualiser.prototype = Object.create(Akko.Visualiser.prototype)`
4. Register with: `Akko.addVisualiser('MyVisualiser', MyVisualiser)`
5. Add script tag to `mixer/index.html`

**For ES6 (Experimental):**
1. Create visualizer in `mixer-es6/js/components/`
2. Use ES6 class syntax: `class MyVisualiser extends Visualiser {}`
3. Use ES6 imports: `import Visualiser from '../../lib/Visualiser.js'`
4. Export as: `export default MyVisualiser`
5. Import in `mixer-es6/index.html` module script

### Browser Compatibility

**ES5 Version:**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 16+
- ✅ Mobile browsers

**ES6 Version:**
- ✅ Chrome 61+ (ES6 modules)
- ✅ Firefox 60+ (ES6 modules)
- ✅ Safari 11+ (ES6 modules)
- ✅ Edge 79+ (ES6 modules)
- ❌ Internet Explorer (not supported)

## Commit Strategy

```bash
# Commit ES5 working version
git add mixer/ mixer-es5/
git commit -m "🎵 Working ES5 mixer with 6 visualizers"

# Add ES6 experimental version
git add mixer-es6/
git commit -m "🧪 Add ES6 experimental mixer"

# Update Akko submodule
git submodule add https://github.com/muizenmesh/Akko.git Akko
git commit -m "📦 Add Akko ES6 framework as submodule"
```

## Performance Notes

- **ES5 Version**: Uses pre-bundled Akko (~200KB minified)
- **ES6 Version**: Loads individual modules (better for development)
- **Visualizers**: All optimized for 60fps performance
- **Audio**: Supports MP3, WAV, OGG formats
- **WebGL**: Requires WebGL-enabled browser

## Troubleshooting

### Common Issues

**"module is not defined" error:**
- Check for `module.exports` in visualizer files
- Ensure all visualizers use browser-compatible syntax

**Visualizers not appearing:**
- Verify script tags in HTML
- Check browser console for JavaScript errors
- Ensure Akko framework loads before visualizers

**Audio not playing:**
- Check browser autoplay policies
- Ensure audio files are accessible
- Verify HTTPS for production deployment

### Debug Mode

Add `?debug=true` to URL for additional console logging:
```
https://muizenmesh.co.za/mixer/?debug=true
```