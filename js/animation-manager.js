/**
 * ==========================================
 * ANIMATION MANAGER
 * Handles all animations and time-based effects
 * ==========================================
 */

class AnimationManager {
    constructor(sceneManager, interactionManager) {
        this.sceneManager = sceneManager;
        this.interactionManager = interactionManager;
        this.time = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
        
        // Animation state
        this.isAnimating = true;
        this.animationSpeed = 1.0;
        this.currentPreset = 'active';
        
        // Effects
        this.pulsePhase = 0;
        this.rotationPhase = 0;
        this.floatPhase = 0;
    }

    update() {
        if (!this.isAnimating || !this.interactionManager.getAnimationsEnabled()) {
            return;
        }
        
        const currentTime = performance.now() * 0.001; // Convert to seconds
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.time = currentTime * this.animationSpeed;
        
        // Update animation phases
        this.pulsePhase = this.time * 2;
        this.rotationPhase = this.time * 0.5;
        this.floatPhase = this.time * 1.5;
        
        // Update different animation systems
        this.updateCouncilMembers();
        this.updateCenterVoid();
        this.updateParticles();
        this.updateConnections();
        this.updateAmbientElements();
        this.updateThoughtFlows();
        this.updateCamera();
    }

    updateCouncilMembers() {
        const members = this.sceneManager.getCouncilMembers();
        const preset = ANIMATION_PRESETS[this.currentPreset];
        
        members.forEach((member, index) => {
            const userData = member.userData;
            const originalPos = userData.originalPosition;
            
            // Rotation animation
            member.rotation.y += preset.rotationSpeed;
            member.rotation.x = Math.sin(this.time + index * Math.PI / 4) * 0.1;
            member.rotation.z = Math.cos(this.time * 0.7 + index * Math.PI / 6) * 0.05;
            
            // Float animation
            const floatOffset = Math.sin(this.floatPhase + index * Math.PI / 4) * preset.floatAmplitude;
            member.position.y = originalPos.y + floatOffset;
            
            // Subtle orbital motion
            const orbitRadius = 0.1;
            const orbitSpeed = 0.3;
            member.position.x = originalPos.x + Math.cos(this.time * orbitSpeed + index) * orbitRadius;
            member.position.z = originalPos.z + Math.sin(this.time * orbitSpeed + index) * orbitRadius;
            
            // Breathing effect for emissive intensity
            if (!this.interactionManager.getSelectedThinker() || 
                this.interactionManager.getSelectedThinker() === member) {
                const breathe = Math.sin(this.pulsePhase + index * 0.5) * 0.1;
                member.material.emissiveIntensity = Math.max(0.3, 0.4 + breathe);
            }
            
            // Update member particle emitters
            this.updateMemberParticles(member, index);
        });
    }

    updateMemberParticles(member, memberIndex) {
        const emitter = member.children.find(child => child.userData.isEmitter);
        if (!emitter) return;
        
        const positions = emitter.geometry.attributes.position.array;
        const lifetimes = emitter.userData.lifetimes;
        const particleCount = lifetimes.length;
        
        for (let i = 0; i < particleCount; i++) {
            lifetimes[i] += this.deltaTime * 2;
            
            if (lifetimes[i] > 1) {
                lifetimes[i] = 0;
                // Reset particle to member position
                positions[i * 3] = 0;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = 0;
            } else {
                // Animate particle towards center
                const t = lifetimes[i];
                const easing = 1 - Math.pow(1 - t, 3); // Ease out cubic
                
                // Calculate direction to center (accounting for member's world position)
                const memberWorldPos = member.position;
                const directionX = -memberWorldPos.x * easing;
                const directionY = -memberWorldPos.y * easing;
                const directionZ = -memberWorldPos.z * easing;
                
                positions[i * 3] = directionX * 0.1;
                positions[i * 3 + 1] = directionY * 0.1;
                positions[i * 3 + 2] = directionZ * 0.1;
            }
        }
        
        emitter.geometry.attributes.position.needsUpdate = true;
        
        // Update emitter opacity based on member state
        const isSelected = this.interactionManager.getSelectedThinker() === member;
        emitter.material.opacity = isSelected ? 0.9 : 0.4;
    }

    updateCenterVoid() {
        const centerVoid = this.sceneManager.getCenterVoid();
        if (!centerVoid) return;
        
        // Rotation
        centerVoid.rotation.y += 0.01;
        centerVoid.rotation.x = Math.sin(this.time * 0.7) * 0.1;
        
        // Pulsing scale
        const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.05;
        centerVoid.scale.setScalar(pulseScale);
        
        // Dynamic emissive intensity
        const intensity = 0.3 + Math.sin(this.time * 3) * 0.1;
        centerVoid.material.emissiveIntensity = intensity;
        
        // Update glow rings
        centerVoid.children.forEach((glow, index) => {
            glow.rotation.x += 0.005 * (index + 1);
            glow.rotation.z += 0.003 * (index + 1);
            
            const glowPulse = Math.sin(this.time * 2 + index * Math.PI / 3) * 0.05;
            glow.material.opacity = Math.max(0.02, glow.material.opacity + glowPulse * 0.01);
        });
    }

    updateParticles() {
        const particles = this.sceneManager.getParticles();
        
        particles.forEach(particleSystem => {
            if (!particleSystem.userData.isGlobalParticles) return;
            
            // Rotate entire particle system
            particleSystem.rotation.y += 0.0005;
            particleSystem.rotation.x = Math.sin(this.time * 0.3) * 0.1;
            
            // Update individual particle positions
            const positions = particleSystem.geometry.attributes.position.array;
            const velocities = particleSystem.userData.velocities;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Apply velocities
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // Add some floating motion
                positions[i + 1] += Math.sin(this.time + i * 0.01) * 0.005;
                
                // Boundary check - wrap around sphere
                const distance = Math.sqrt(
                    positions[i] ** 2 + 
                    positions[i + 1] ** 2 + 
                    positions[i + 2] ** 2
                );
                
                if (distance > 25) {
                    // Reset to random position
                    const radius = 20;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    
                    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[i + 2] = radius * Math.cos(phi);
                }
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
            
            // Pulse opacity
            const opacityPulse = 0.5 + Math.sin(this.time * 1.5) * 0.2;
            particleSystem.material.opacity = opacityPulse;
        });
    }

    updateConnections() {
        const connections = this.sceneManager.getConnections();
        
        connections.forEach((connection, index) => {
            const connectionData = connection.userData;
            const baseOpacity = connectionData.strength || 0.1;
            
            // Different pulsing patterns based on connection type
            let opacity = baseOpacity;
            
            switch(connectionData.type) {
                case 'radial':
                    opacity = baseOpacity + Math.sin(this.time * 2 + index * 0.5) * 0.05;
                    break;
                case 'synthesis':
                    opacity = baseOpacity + Math.sin(this.time * 3 + index) * 0.08;
                    break;
                case 'execution':
                    opacity = baseOpacity + Math.abs(Math.sin(this.time * 4)) * 0.1;
                    break;
                case 'wisdom':
                    opacity = baseOpacity + Math.sin(this.time * 1 + index * Math.PI) * 0.06;
                    break;
                default:
                    opacity = baseOpacity + Math.sin(this.time + index * 0.3) * 0.03;
            }
            
            connection.material.opacity = Math.max(0.01, opacity);
            
            // Color shifting for special connections
            if (connectionData.type === 'synthesis') {
                const hue = (this.time * 0.1 + index * 0.2) % 1;
                connection.material.color.setHSL(hue, 0.5, 0.8);
            }
        });
    }

    updateAmbientElements() {
        const ambientElements = this.sceneManager.ambientElements;
        
        ambientElements.forEach(element => {
            if (element.userData.isRing) {
                const rotSpeed = element.userData.rotationSpeed;
                element.rotation.x += rotSpeed.x;
                element.rotation.y += rotSpeed.y;
                element.rotation.z += rotSpeed.z;
                
                // Subtle opacity pulsing
                const pulse = Math.sin(this.time * 0.8) * 0.02;
                element.material.opacity = Math.max(0.02, element.material.opacity + pulse);
            }
        });
    }

    updateThoughtFlows() {
        const thoughtFlows = this.sceneManager.thoughtFlows;
        
        thoughtFlows.forEach(flow => {
            if (!flow.userData.isThoughtFlow) return;
            
            const positions = flow.geometry.attributes.position.array;
            const fromPos = flow.userData.fromPosition;
            const lifetimes = flow.userData.lifetimes;
            const elapsed = (Date.now() - flow.userData.startTime) / 1000;
            
            for (let i = 0; i < positions.length / 3; i++) {
                lifetimes[i] += this.deltaTime * 0.8;
                if (lifetimes[i] > 1) lifetimes[i] = 0;
                
                const t = lifetimes[i];
                const easing = 1 - Math.pow(1 - t, 2); // Ease out quad
                
                // Add some swirling motion
                const swirl = Math.sin(this.time * 2 + i * 0.1) * 0.5;
                
                positions[i * 3] = fromPos.x * (1 - easing) + Math.cos(t * Math.PI * 2) * swirl * (1 - t);
                positions[i * 3 + 1] = fromPos.y * (1 - easing);
                positions[i * 3 + 2] = fromPos.z * (1 - easing) + Math.sin(t * Math.PI * 2) * swirl * (1 - t);
            }
            
            flow.geometry.attributes.position.needsUpdate = true;
            
            // Fade out over time
            const fadeOut = Math.max(0, 1 - elapsed / 2);
            flow.material.opacity = 0.9 * fadeOut;
        });
    }

    updateCamera() {
        // Let interaction manager handle camera updates
        this.interactionManager.updateCamera();
    }

    // Animation control methods
    setAnimationPreset(presetName) {
        if (ANIMATION_PRESETS[presetName]) {
            this.currentPreset = presetName;
            console.log(`🎭 Animation preset changed to: ${ANIMATION_PRESETS[presetName].name}`);
        }
    }

    setAnimationSpeed(speed) {
        this.animationSpeed = Math.max(0.1, Math.min(3.0, speed));
        console.log(`⚡ Animation speed: ${this.animationSpeed}x`);
    }

    pauseAnimations() {
        this.isAnimating = false;
        console.log('⏸️ Animations paused');
    }

    resumeAnimations() {
        this.isAnimating = true;
        this.lastTime = performance.now() * 0.001;
        console.log('▶️ Animations resumed');
    }

    // Special effects
    createRippleEffect(position, color = 0xffffff) {
        const rippleGeometry = new THREE.RingGeometry(0, 1, 32);
        const rippleMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        ripple.position.copy(position);
        ripple.lookAt(this.sceneManager.getCamera().position);
        
        ripple.userData = {
            isRipple: true,
            startTime: Date.now(),
            maxRadius: 5
        };
        
        this.sceneManager.getScene().add(ripple);
        
        // Animate ripple expansion
        const animateRipple = () => {
            const elapsed = (Date.now() - ripple.userData.startTime) / 1000;
            const progress = elapsed / 1; // 1 second duration
            
            if (progress >= 1) {
                this.sceneManager.getScene().remove(ripple);
                return;
            }
            
            const radius = progress * ripple.userData.maxRadius;
            ripple.scale.setScalar(radius);
            ripple.material.opacity = 0.8 * (1 - progress);
            
            requestAnimationFrame(animateRipple);
        };
        
        animateRipple();
    }

    createEnergyPulse(fromMember, toMember) {
        const pulseGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: fromMember.userData.color,
            transparent: true,
            opacity: 0.9
        });
        
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulse.position.copy(fromMember.position);
        
        pulse.userData = {
            isPulse: true,
            startTime: Date.now(),
            fromPos: fromMember.position.clone(),
            toPos: toMember.position.clone(),
            duration: 1000 // 1 second
        };
        
        this.sceneManager.getScene().add(pulse);
        
        // Animate pulse movement
        const animatePulse = () => {
            const elapsed = Date.now() - pulse.userData.startTime;
            const progress = elapsed / pulse.userData.duration;
            
            if (progress >= 1) {
                this.sceneManager.getScene().remove(pulse);
                // Create impact effect at destination
                this.createRippleEffect(pulse.userData.toPos, fromMember.userData.color);
                return;
            }
            
            // Bezier curve movement
            const t = progress;
            const midPoint = new THREE.Vector3(
                (pulse.userData.fromPos.x + pulse.userData.toPos.x) / 2,
                Math.max(pulse.userData.fromPos.y, pulse.userData.toPos.y) + 2,
                (pulse.userData.fromPos.z + pulse.userData.toPos.z) / 2
            );
            
            pulse.position.lerpVectors(pulse.userData.fromPos, midPoint, t * 2);
            if (t > 0.5) {
                pulse.position.lerpVectors(midPoint, pulse.userData.toPos, (t - 0.5) * 2);
            }
            
            // Scale and fade
            const scale = 1 + Math.sin(progress * Math.PI) * 0.5;
            pulse.scale.setScalar(scale);
            pulse.material.opacity = 0.9 * (1 - progress * 0.5);
            
            requestAnimationFrame(animatePulse);
        };
        
        animatePulse();
    }

    // Getters
    getTime() {
        return this.time;
    }

    getDeltaTime() {
        return this.deltaTime;
    }

    getCurrentPreset() {
        return this.currentPreset;
    }

    getAnimationSpeed() {
        return this.animationSpeed;
    }

    isAnimationEnabled() {
        return this.isAnimating;
    }
}

