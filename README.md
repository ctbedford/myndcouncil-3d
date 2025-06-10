# 🏛️ MyndCouncil 3D Council Hall

A stunning 3D visualization of the MyndCouncil - your personal council of great thinkers gathered in an immersive council hall built with Three.js.

## ✨ Features

### 🎭 **The Council of Thinkers**
- **📚 Plato** - Eternal forms and universal truth (Golden Octahedron)
- **🎨 Leonardo** - Synthesis and creative connection (Red Icosahedron)
- **🏛️ Aristotle** - Analysis and logical categorization (Blue Cube)
- **🔭 Tycho** - Pure observation and data (Teal Tetrahedron)
- **🧪 Feynman** - Simplification and essence (Green Dodecahedron)
- **⚡ Machiavelli** - Strategic decision making (Red Diamond)
- **💡 Edison** - Execution and iteration (Orange Cone)
- **🌳 Socrates** - Reflection and wisdom (Purple Sphere)

### 🌟 **Council Hall Environment**
- **Central Round Table** - The thinkers gather around one table
- **Thought Particle Systems** - Flowing energy representing consciousness
- **Warm Lighting** - Subtle ambient illumination for readability

### 🎮 **Interactive Controls**
- **Mouse/Touch Navigation** - Drag to rotate, scroll to zoom
- **Thinker Consultation** - Click on any orb to consult that thinker
- **Floating Labels** - Each thinker displays a name tag above their orb
- **Glass UI Panels** - Translucent controls with subtle blur
- **First-Person Walking** - Press **F** to explore the hall with WASD/arrow keys
- **Thought Flow Animation** - Particles flow from thinker to center when selected
- **Full Council Summoning** - Activate all thinkers in sequence
- **Real-time Toggles** - Control particles, connections, and animations

### 🚀 **Technical Excellence**
- Built with **Three.js** for WebGL performance
- **Modular Architecture** with separate managers for scene, interaction, and animation
- **Responsive Design** with mobile touch support
- **Performance Monitoring** with FPS and object counters
- **Graceful Degradation** with quality level controls
- **Accessibility** features and keyboard shortcuts

## 🎯 **Quick Start**

### **Method 1: Direct Browser (Simplest)**
```bash
# Navigate to the project directory
cd ~/Documents/myndcouncil-3d

# Open directly in your browser
open index.html
```

### **Method 2: Local HTTP Server (Recommended)**
Some browsers require HTTPS for certain features. Use a local server:

```bash
# Using Python (built into macOS)
cd ~/Documents/myndcouncil-3d
python3 -m http.server 8000

# Then open: http://localhost:8000
```

```bash
# Or using Node.js (if installed)
npx serve .
```

```bash
# Or using PHP (if available)
php -S localhost:8000
```

### **Method 3: Live Server (VSCode)**
If you use VSCode:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎮 **Controls & Interaction**

-### **Mouse/Touch Controls**
- **Drag** - Rotate the hall around the center
- **Scroll/Pinch** - Zoom in and out
- **Click/Tap** - Select and consult a thinker
- **Hover** - Highlight thinkers for interaction

### **Keyboard Shortcuts**
- **SPACE** - Summon the full council (sequential activation)
- **P** - Toggle thought particles on/off
- **C** - Toggle connection lines
- **A** - Toggle all animations
- **R** - Reset camera view to default
- **ESC** - Deselect current thinker
- **1-8** - Quickly select thinkers by number
- **F** - Toggle first-person walking mode

### **UI Buttons**
- **✨ Toggle Thought Particles** - Show/hide floating consciousness
- **🔗 Toggle Connections** - Show/hide connection lines
- **🌊 Toggle Animations** - Pause/resume all movement
- **🏛️ Summon Full Council** - Activate all thinkers in sequence
- **🎯 Reset View** - Return to default camera position

## 🔧 **Advanced Usage**

### **Developer Console Commands**
Open browser console (F12) and try:

```javascript
// Get performance statistics
getMyndCouncilStats()

// Adjust visual quality
setMyndCouncilQuality('low')    // Better performance
setMyndCouncilQuality('medium')  // Balanced
setMyndCouncilQuality('high')   // Best visuals

// Animation presets
window.animationManager.setAnimationPreset('meditation')     // Slow, peaceful
window.animationManager.setAnimationPreset('active')         // Default energy
window.animationManager.setAnimationPreset('contemplation')  // Minimal movement

// Direct thinker consultation
window.interactionManager.activateAllThinkers()

// Speed controls
window.animationManager.setAnimationSpeed(0.5)  // Half speed
window.animationManager.setAnimationSpeed(2.0)  // Double speed
```

### **Performance Optimization**
If experiencing slow performance:

1. **Lower Quality**: Click buttons or use `setMyndCouncilQuality('low')`
2. **Disable Effects**: Turn off particles or animations
3. **Close Other Tabs**: Free up browser resources
4. **Update Graphics Drivers**: Ensure WebGL support

### **Mobile Optimization**
- Touch controls automatically enabled
- Responsive UI scaling
- Reduced particle counts on smaller screens
- Battery-conscious animation pausing

## 📁 **Project Structure**

```
myndcouncil-3d/
├── index.html              # Main HTML file
├── styles.css              # Complete styling
├── README.md              # This documentation
└── js/
    ├── council-data.js     # Thinker configurations & layout
    ├── scene-manager.js    # 3D scene creation & management
    ├── interaction-manager.js # User input & thinker selection
    ├── animation-manager.js   # All animations & effects
    └── main.js            # Application entry point
```

## 🎨 **Customization**

### **Adding New Thinkers**
Edit `js/council-data.js` to add new council members:

```javascript
{
    id: 'newton',
    name: '🍎 NEWTON',
    role: 'Universal Laws',
    question: 'What forces are at work here?',
    position: { x: 0, y: 8, z: 0 },
    color: 0xFF0000,
    geometry: 'sphere',
    scale: 0.8
}
```

### **Modifying Connections**
Adjust the `CONNECTIONS` array to change how thinkers relate:

```javascript
{ from: 'newton', to: 'plato', type: 'natural_law', strength: 0.7 }
```

### **Custom Animation Presets**
Add new animation modes in `ANIMATION_PRESETS`:

```javascript
chaos: {
    name: 'Chaos Mode',
    rotationSpeed: 0.05,
    floatAmplitude: 1.0,
    particleFlow: 'wild'
}
```

## 🐛 **Troubleshooting**

### **Common Issues**

**Black Screen/No Rendering**
- Check browser WebGL support: Visit `about:gpu` in Chrome
- Try different browser (Chrome, Firefox, Safari)
- Update graphics drivers
- Disable browser extensions

**Performance Issues**
- Use `setMyndCouncilQuality('low')`
- Close other tabs and applications
- Disable particles/animations
- Check Task Manager for high CPU usage

**Touch Controls Not Working**
- Ensure you're on a touch device
- Try tapping/dragging more deliberately
- Check if other apps are interfering

**Thinkers Not Responding to Clicks**
- Make sure you're clicking directly on the glowing orbs
- Try zooming in closer
- Check console for JavaScript errors (F12)

### **Browser Compatibility**
- **Chrome** ✅ Full support (recommended)
- **Firefox** ✅ Full support
- **Safari** ✅ Full support (macOS/iOS)
- **Edge** ✅ Full support
- **Mobile Browsers** ✅ Touch-optimized

## 🌟 **Philosophy & Purpose**

This isn't just a 3D visualization - it's a **living meditation on the nature of thought itself**. Each thinker gathers around the council table, ready to offer guidance.

The connections between them represent their shared wisdom. The space in the center is **you** - the observer who turns insight into action.

When you consult a thinker, you're not just clicking a button - you're **invoking a mode of consciousness**. The particle flows represent thoughts moving from archetypal forms into your personal awareness.

## 🔮 **Future Enhancements**

- **Audio Integration** - Spatial sound for each thinker
- **VR Support** - WebXR for immersive consultation
- **AI Integration** - Dynamic responses from each thinker
- **Constellation Patterns** - Time-based geometric transformations
- **Collaborative Councils** - Multi-user shared halls
- **Personal Thinker Creation** - Upload your own advisors
- **Sacred Time Cycles** - Different arrangements for different occasions

## 📜 **Credits**

- **Three.js** - WebGL 3D library
- **Typography** - System fonts for universal compatibility
- **Philosophy** - Inspired by the eternal forms and archetypal thinking

---

**🔮 May your consultations bring clarity, and your decisions reflect the wisdom of the ages.**

*Built to inspire reflection and meaningful action.*

