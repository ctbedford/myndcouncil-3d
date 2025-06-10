/**
 * ==========================================
 * INTERACTION MANAGER
 * Handles user input and thinker selection
 * ==========================================
 */

class InteractionManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedThinker = null;
        this.hoveredThinker = null;
        
        // Camera controls
        this.isMouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.targetDistance = 20;
        this.currentDistance = 20;
        
        // UI state
        this.showParticles = true;
        this.showConnections = true;
        this.animationsEnabled = true;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const canvas = this.sceneManager.getRenderer().domElement;
        
        // Mouse events
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('click', this.onMouseClick.bind(this));
        canvas.addEventListener('wheel', this.onMouseWheel.bind(this), { passive: false });
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        canvas.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        
        // Window events
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        
        // Prevent context menu on right-click
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    onMouseDown(event) {
        if (event.button === 0) { // Left click
            this.isMouseDown = true;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            document.body.style.cursor = 'grabbing';
        }
    }

    onMouseUp(event) {
        this.isMouseDown = false;
        document.body.style.cursor = 'grab';
    }

    onMouseMove(event) {
        // Update mouse position for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Handle camera rotation
        if (this.isMouseDown) {
            const deltaX = event.clientX - this.mouseX;
            const deltaY = event.clientY - this.mouseY;
            
            this.targetRotationY += deltaX * 0.01;
            this.targetRotationX += deltaY * 0.01;
            
            // Clamp vertical rotation
            this.targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetRotationX));
            
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        } else {
            // Check for hover effects
            this.checkHover();
        }
    }

    onMouseClick(event) {
        if (this.isMouseDown) return; // Ignore clicks during drag
        
        // Update mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Raycast to find clicked objects
        this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
        const intersects = this.raycaster.intersectObjects(this.sceneManager.getCouncilMembers());
        
        if (intersects.length > 0) {
            const clickedMember = intersects[0].object;
            this.selectThinker(clickedMember);
        } else {
            this.deselectThinker();
        }
    }

    onMouseWheel(event) {
        event.preventDefault();
        
        this.targetDistance += event.deltaY * 0.01;
        this.targetDistance = Math.max(8, Math.min(50, this.targetDistance));
    }

    // Touch events for mobile support
    onTouchStart(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            this.mouseX = event.touches[0].clientX;
            this.mouseY = event.touches[0].clientY;
            this.isMouseDown = true;
        }
    }

    onTouchMove(event) {
        event.preventDefault();
        
        if (event.touches.length === 1 && this.isMouseDown) {
            const deltaX = event.touches[0].clientX - this.mouseX;
            const deltaY = event.touches[0].clientY - this.mouseY;
            
            this.targetRotationY += deltaX * 0.01;
            this.targetRotationX += deltaY * 0.01;
            
            this.targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.targetRotationX));
            
            this.mouseX = event.touches[0].clientX;
            this.mouseY = event.touches[0].clientY;
        } else if (event.touches.length === 2) {
            // Pinch to zoom
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (this.lastTouchDistance) {
                const delta = this.lastTouchDistance - distance;
                this.targetDistance += delta * 0.01;
                this.targetDistance = Math.max(8, Math.min(50, this.targetDistance));
            }
            
            this.lastTouchDistance = distance;
        }
    }

    onTouchEnd(event) {
        event.preventDefault();
        
        if (event.touches.length === 0) {
            this.isMouseDown = false;
            this.lastTouchDistance = null;
            
            // Handle tap to select
            if (event.changedTouches.length === 1) {
                const touch = event.changedTouches[0];
                this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
                
                this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
                const intersects = this.raycaster.intersectObjects(this.sceneManager.getCouncilMembers());
                
                if (intersects.length > 0) {
                    const tappedMember = intersects[0].object;
                    this.selectThinker(tappedMember);
                }
            }
        }
    }

    onKeyDown(event) {
        switch(event.code) {
            case 'Space':
                event.preventDefault();
                this.activateAllThinkers();
                break;
            case 'KeyP':
                this.toggleParticles();
                break;
            case 'KeyC':
                this.toggleConnections();
                break;
            case 'KeyA':
                this.toggleAnimation();
                break;
            case 'KeyR':
                this.resetView();
                break;
            default:
                if (event.code.startsWith('Digit')) {
                    const index = parseInt(event.code.slice(5), 10) - 1;
                    const members = this.sceneManager.getCouncilMembers();
                    if (members[index]) {
                        this.selectThinker(members[index]);
                    }
                }
                if (event.code === 'Escape') {
                    this.deselectThinker();
                }
                break;
        }
    }

    onWindowResize() {
        this.sceneManager.onWindowResize();
    }

    checkHover() {
        this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
        const intersects = this.raycaster.intersectObjects(this.sceneManager.getCouncilMembers());
        
        if (intersects.length > 0) {
            const hoveredMember = intersects[0].object;
            
            if (this.hoveredThinker !== hoveredMember) {
                // Reset previous hover
                if (this.hoveredThinker && this.hoveredThinker !== this.selectedThinker) {
                    this.hoveredThinker.material.emissiveIntensity = 0.4;
                }
                
                // Set new hover
                this.hoveredThinker = hoveredMember;
                if (this.hoveredThinker !== this.selectedThinker) {
                    this.hoveredThinker.material.emissiveIntensity = 0.6;
                }
                
                document.body.style.cursor = 'pointer';
            }
        } else {
            // No hover
            if (this.hoveredThinker && this.hoveredThinker !== this.selectedThinker) {
                this.hoveredThinker.material.emissiveIntensity = 0.4;
            }
            this.hoveredThinker = null;
            document.body.style.cursor = 'grab';
        }
    }

    selectThinker(thinkerMesh) {
        // Deselect previous
        if (this.selectedThinker) {
            this.selectedThinker.material.emissiveIntensity = 0.4;
        }
        
        this.selectedThinker = thinkerMesh;
        const data = thinkerMesh.userData;
        
        // Highlight selected thinker
        thinkerMesh.material.emissiveIntensity = 0.9;
        
        // Update info panel
        this.showThinkerInfo(data);
        
        // Create thought flow animation
        this.createThoughtFlow(thinkerMesh.position, data.color);
        
        // Dim other thinkers
        this.sceneManager.getCouncilMembers().forEach(member => {
            if (member !== thinkerMesh) {
                member.material.emissiveIntensity = 0.2;
            }
        });
        
        // Auto-reset after 5 seconds
        setTimeout(() => {
            if (this.selectedThinker === thinkerMesh) {
                this.resetThinkerHighlights();
            }
        }, 5000);
        
        console.log(`🎯 Consulting ${data.name}: "${data.question}"`);
    }

    deselectThinker() {
        this.selectedThinker = null;
        this.hideThinkerInfo();
        this.resetThinkerHighlights();
    }

    showThinkerInfo(data) {
        const infoPanel = document.getElementById('selected-info');
        const nameElement = document.getElementById('thinker-name');
        const roleElement = document.getElementById('thinker-role');
        const questionElement = document.getElementById('thinker-question');
        
        if (nameElement) nameElement.textContent = data.name;
        if (roleElement) roleElement.textContent = data.role;
        if (questionElement) questionElement.textContent = `"${data.question}"`;
        
        if (infoPanel) {
            infoPanel.style.display = 'block';
            infoPanel.style.animation = 'slideUp 0.4s ease-out';
        }
    }

    hideThinkerInfo() {
        const infoPanel = document.getElementById('selected-info');
        if (infoPanel) {
            infoPanel.style.display = 'none';
        }
    }

    resetThinkerHighlights() {
        this.sceneManager.getCouncilMembers().forEach(member => {
            member.material.emissiveIntensity = 0.4;
        });
    }

    createThoughtFlow(fromPosition, color) {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = fromPosition.x;
            positions[i * 3 + 1] = fromPosition.y;
            positions[i * 3 + 2] = fromPosition.z;
            lifetimes[i] = i / particleCount;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.3,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        
        const thoughtFlow = new THREE.Points(geometry, material);
        thoughtFlow.userData = {
            fromPosition: fromPosition.clone(),
            lifetimes: lifetimes,
            isThoughtFlow: true,
            startTime: Date.now()
        };
        
        this.sceneManager.thoughtFlows.push(thoughtFlow);
        this.sceneManager.getScene().add(thoughtFlow);
        
        // Remove after animation completes
        setTimeout(() => {
            this.sceneManager.getScene().remove(thoughtFlow);
            const index = this.sceneManager.thoughtFlows.indexOf(thoughtFlow);
            if (index > -1) {
                this.sceneManager.thoughtFlows.splice(index, 1);
            }
        }, 3000);
    }

    updateCamera() {
        // Smooth camera movement
        this.currentDistance += (this.targetDistance - this.currentDistance) * 0.1;
        
        const camera = this.sceneManager.getCamera();
        camera.position.x = this.currentDistance * Math.sin(this.targetRotationY) * Math.cos(this.targetRotationX);
        camera.position.y = this.currentDistance * Math.sin(this.targetRotationX);
        camera.position.z = this.currentDistance * Math.cos(this.targetRotationY) * Math.cos(this.targetRotationX);
        
        camera.lookAt(0, 0, 0);
    }

    // UI Control Functions
    toggleParticles() {
        this.showParticles = !this.showParticles;
        this.sceneManager.getParticles().forEach(particleSystem => {
            particleSystem.visible = this.showParticles;
        });
        console.log('✨ Particles:', this.showParticles ? 'ON' : 'OFF');
    }

    toggleConnections() {
        this.showConnections = !this.showConnections;
        this.sceneManager.getConnections().forEach(connection => {
            connection.visible = this.showConnections;
        });
        console.log('🔗 Connections:', this.showConnections ? 'ON' : 'OFF');
    }

    toggleAnimation() {
        this.animationsEnabled = !this.animationsEnabled;
        console.log('🌊 Animations:', this.animationsEnabled ? 'ON' : 'OFF');
    }

    activateAllThinkers() {
        console.log('🏛️ Summoning full council...');
        
        // Highlight all thinkers in sequence
        INVOCATION_SEQUENCE.forEach((invocation, index) => {
            setTimeout(() => {
                const member = this.sceneManager.getCouncilMembers().find(
                    m => m.userData.id === invocation.thinker
                );
                
                if (member) {
                    member.material.emissiveIntensity = 0.9;
                    this.createThoughtFlow(member.position, member.userData.color);
                    
                    console.log(`${member.userData.name}: ${invocation.message}`);
                    
                    // Reset after a moment
                    setTimeout(() => {
                        member.material.emissiveIntensity = 0.4;
                    }, 1000);
                }
            }, invocation.delay);
        });
        
        // Final message
        setTimeout(() => {
            console.log('🌟 The full council stands ready for your consultation.');
        }, 4000);
    }

    resetView() {
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        this.targetDistance = 20;
        this.deselectThinker();
        console.log('🎯 View reset to default position');
    }

    // Getters
    getShowParticles() {
        return this.showParticles;
    }

    getShowConnections() {
        return this.showConnections;
    }

    getAnimationsEnabled() {
        return this.animationsEnabled;
    }

    getSelectedThinker() {
        return this.selectedThinker;
    }
}

// Global functions for UI buttons
function toggleParticles() {
    if (window.interactionManager) {
        window.interactionManager.toggleParticles();
    }
}

function toggleConnections() {
    if (window.interactionManager) {
        window.interactionManager.toggleConnections();
    }
}

function toggleAnimation() {
    if (window.interactionManager) {
        window.interactionManager.toggleAnimation();
    }
}

function activateAllThinkers() {
    if (window.interactionManager) {
        window.interactionManager.activateAllThinkers();
    }
}

function resetView() {
    if (window.interactionManager) {
        window.interactionManager.resetView();
    }
}

function closeSelection() {
    if (window.interactionManager) {
        window.interactionManager.deselectThinker();
    }
}

