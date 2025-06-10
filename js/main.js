/**
 * ==========================================
 * MYNDCOUNCIL 3D MAIN APPLICATION
 * Sacred Temple Entry Point
 * ==========================================
 */

class MyndCouncil3D {
    constructor() {
        this.sceneManager = null;
        this.interactionManager = null;
        this.animationManager = null;
        this.isInitialized = false;
        this.animationId = null;
        
        console.log('🏛️ MyndCouncil 3D Sacred Temple initializing...');
    }

    async init() {
        try {
            // Show loading screen
            this.showLoading();
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Get canvas element
            const canvas = document.getElementById('canvas');
            if (!canvas) {
                throw new Error('Canvas element not found');
            }
            
            // Initialize managers in order
            await this.initializeManagers(canvas);
            
            // Start the render loop
            this.startRenderLoop();
            
            // Hide loading screen
            this.hideLoading();
            
            // Show welcome message
            this.showWelcomeMessage();
            
            this.isInitialized = true;
            console.log('🌟 Sacred Temple fully initialized and ready for consultation');
            
        } catch (error) {
            console.error('❌ Failed to initialize MyndCouncil 3D:', error);
            this.showError(error.message);
        }
    }

    async waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async initializeManagers(canvas) {
        // Create scene manager
        this.sceneManager = new SceneManager();
        this.sceneManager.init(canvas);
        
        // Small delay to ensure scene is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Create interaction manager
        this.interactionManager = new InteractionManager(this.sceneManager);
        
        // Create animation manager
        this.animationManager = new AnimationManager(this.sceneManager, this.interactionManager);
        
        // Make managers globally accessible for UI functions
        window.sceneManager = this.sceneManager;
        window.interactionManager = this.interactionManager;
        window.animationManager = this.animationManager;
        
        console.log('✅ All managers initialized successfully');
    }

    startRenderLoop() {
        const render = () => {
            this.animationId = requestAnimationFrame(render);
            
            // Update animations
            if (this.animationManager) {
                this.animationManager.update();
            }
            
            // Render the scene
            if (this.sceneManager) {
                this.sceneManager.render();
            }
        };
        
        render();
        console.log('🎬 Render loop started');
    }

    stopRenderLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            console.log('⏹️ Render loop stopped');
        }
    }

    showLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            setTimeout(() => {
                loadingElement.style.opacity = '0';
                setTimeout(() => {
                    loadingElement.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    showWelcomeMessage() {
        console.log(`
🏛️ ================================
   WELCOME TO MYNDCOUNCIL 3D
   Sacred Temple of Thought
================================

✨ Your personal council of great thinkers awaits...

📚 Plato - Eternal forms and universal truth
🎨 Leonardo - Synthesis and creative connection  
🏛️ Aristotle - Analysis and logical categorization
🔭 Tycho - Pure observation and data
🧪 Feynman - Simplification and essence
⚡ Machiavelli - Strategic decision making
💡 Edison - Execution and iteration
🌳 Socrates - Reflection and wisdom

🖱️ Controls:
• Drag to rotate the temple
• Scroll to zoom in/out
• Click on any thinker to consult them
• Use buttons in the control panel

⌨️ Keyboard Shortcuts:
• SPACE - Summon full council
• P - Toggle particles
• C - Toggle connections
• A - Toggle animations
• R - Reset view
• ESC - Deselect thinker

🔮 Ready for your first consultation?
Click on any glowing orb to begin...
`);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(200, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            text-align: center;
            max-width: 400px;
        `;
        
        errorDiv.innerHTML = `
            <h3>🚨 Initialization Error</h3>
            <p>${message}</p>
            <p><small>Please check the console for more details.</small></p>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                border: 1px solid white;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">Close</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    // Cleanup method
    destroy() {
        this.stopRenderLoop();
        
        if (this.sceneManager && this.sceneManager.getRenderer()) {
            this.sceneManager.getRenderer().dispose();
        }
        
        // Clear global references
        window.sceneManager = null;
        window.interactionManager = null;
        window.animationManager = null;
        
        console.log('🧹 MyndCouncil 3D cleaned up');
    }

    // Debug methods
    getStats() {
        if (!this.isInitialized) {
            return { error: 'Not initialized' };
        }
        
        return {
            fps: this.sceneManager.fps,
            objects: this.sceneManager.getScene().children.length,
            councilMembers: this.sceneManager.getCouncilMembers().length,
            particles: this.sceneManager.getParticles().length,
            connections: this.sceneManager.getConnections().length,
            animationPreset: this.animationManager.getCurrentPreset(),
            animationSpeed: this.animationManager.getAnimationSpeed(),
            selectedThinker: this.interactionManager.getSelectedThinker()?.userData.name || 'None'
        };
    }

    // Performance optimization
    setQuality(level) {
        const renderer = this.sceneManager.getRenderer();
        
        switch(level) {
            case 'low':
                renderer.setPixelRatio(1);
                renderer.shadowMap.enabled = false;
                this.animationManager.setAnimationSpeed(0.5);
                console.log('🔧 Quality set to LOW');
                break;
                
            case 'medium':
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
                renderer.shadowMap.enabled = true;
                this.animationManager.setAnimationSpeed(0.8);
                console.log('🔧 Quality set to MEDIUM');
                break;
                
            case 'high':
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.shadowMap.enabled = true;
                this.animationManager.setAnimationSpeed(1.0);
                console.log('🔧 Quality set to HIGH');
                break;
        }
    }
}

// Global application instance
let myndCouncil3D = null;

// Initialize when page loads
window.addEventListener('load', async () => {
    myndCouncil3D = new MyndCouncil3D();
    await myndCouncil3D.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (myndCouncil3D) {
        myndCouncil3D.destroy();
    }
});

// Handle visibility change (pause/resume when tab is hidden/shown)
document.addEventListener('visibilitychange', () => {
    if (myndCouncil3D && myndCouncil3D.animationManager) {
        if (document.hidden) {
            myndCouncil3D.animationManager.pauseAnimations();
        } else {
            myndCouncil3D.animationManager.resumeAnimations();
        }
    }
});

// Global utility functions for console access
window.getMyndCouncilStats = () => {
    return myndCouncil3D ? myndCouncil3D.getStats() : null;
};

window.setMyndCouncilQuality = (level) => {
    if (myndCouncil3D) {
        myndCouncil3D.setQuality(level);
    }
};

// Console welcome for developers
console.log(`
%c🏛️ MYNDCOUNCIL 3D DEVELOPER CONSOLE

%cAvailable Commands:
• getMyndCouncilStats() - Get performance stats
• setMyndCouncilQuality('low'|'medium'|'high') - Adjust quality
• window.interactionManager.activateAllThinkers() - Summon council
• window.animationManager.setAnimationPreset('meditation'|'active'|'contemplation')

%cBuilt with Three.js and sacred geometry principles.
May your code be as elegant as the eternal forms.
`, 
'color: #FFD700; font-size: 16px; font-weight: bold;',
'color: #4169E1; font-size: 12px;',
'color: #888; font-size: 10px; font-style: italic;'
);

