/**
 * ==========================================
 * SCENE MANAGER
 * Handles 3D scene creation and management
 * ==========================================
 */

class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.councilMembers = [];
        this.connections = [];
        this.particles = [];
        this.centerVoid = null;
        this.ambientElements = [];
        this.thoughtFlows = [];
        
        // Performance tracking
        this.frameCount = 0;
        this.lastTime = 0;
        this.fps = 0;
    }

    init(canvas) {
        this.createScene();
        this.createCamera();
        this.createRenderer(canvas);
        this.createLights();
        this.createSacredFloor();
        this.createCenterVoid();
        this.createCouncilMembers();
        this.createConnections();
        this.createParticleSystem();
        this.createAmbientElements();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        console.log('🏛️ Sacred Temple initialized with', this.councilMembers.length, 'council members');
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 15, 50);
        this.scene.background = new THREE.Color(0x000000);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 20);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer(canvas) {
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
    }

    createLights() {
        // Ambient base light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Central void light
        const centerLight = new THREE.PointLight(0xffffff, 2, 30);
        centerLight.position.set(0, 0, 0);
        centerLight.castShadow = true;
        centerLight.shadow.camera.near = 0.1;
        centerLight.shadow.camera.far = 25;
        this.scene.add(centerLight);

        // Top directional light
        const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
        topLight.position.set(0, 20, 5);
        topLight.castShadow = true;
        topLight.shadow.camera.near = 0.1;
        topLight.shadow.camera.far = 50;
        topLight.shadow.camera.left = -15;
        topLight.shadow.camera.right = 15;
        topLight.shadow.camera.top = 15;
        topLight.shadow.camera.bottom = -15;
        topLight.shadow.mapSize.width = 2048;
        topLight.shadow.mapSize.height = 2048;
        this.scene.add(topLight);

        // Individual thinker lights
        COUNCIL_DATA.forEach(member => {
            const light = new THREE.PointLight(member.color, 0.8, 8);
            light.position.set(member.position.x, member.position.y, member.position.z);
            light.userData.memberId = member.id;
            this.scene.add(light);
        });
    }

    createSacredFloor() {
        // Main floor
        const floorGeometry = new THREE.CircleGeometry(15, 64);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -8;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Sacred geometry patterns
        this.createSacredPatterns();
    }

    createSacredPatterns() {
        // Flower of Life base pattern
        const patterns = [
            { radius: 6, segments: 6, opacity: 0.15, color: 0xFFD700 },
            { radius: 9, segments: 8, opacity: 0.1, color: 0x4169E1 },
            { radius: 12, segments: 12, opacity: 0.08, color: 0xFFFFFF }
        ];

        patterns.forEach(pattern => {
            const patternGeometry = new THREE.RingGeometry(
                pattern.radius - 0.5, 
                pattern.radius + 0.5, 
                pattern.segments
            );
            const patternMaterial = new THREE.MeshBasicMaterial({
                color: pattern.color,
                transparent: true,
                opacity: pattern.opacity,
                side: THREE.DoubleSide
            });
            const patternMesh = new THREE.Mesh(patternGeometry, patternMaterial);
            patternMesh.rotation.x = -Math.PI / 2;
            patternMesh.position.y = -7.8;
            this.scene.add(patternMesh);
        });
    }

    createCenterVoid() {
        // Main void sphere
        const voidGeometry = new THREE.SphereGeometry(1, 32, 32);
        const voidMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0xffffff,
            emissiveIntensity: 0.3,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        this.centerVoid = new THREE.Mesh(voidGeometry, voidMaterial);
        this.centerVoid.position.set(0, 0, 0);
        this.centerVoid.castShadow = true;
        this.scene.add(this.centerVoid);

        // Outer glow rings
        for (let i = 0; i < 3; i++) {
            const glowGeometry = new THREE.SphereGeometry(1.5 + i * 0.3, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.1 - i * 0.03,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            this.centerVoid.add(glow);
        }
    }

    createCouncilMembers() {
        COUNCIL_DATA.forEach(memberData => {
            const member = this.createThinkerMesh(memberData);
            this.councilMembers.push(member);
            this.scene.add(member);
        });
    }

    createThinkerMesh(memberData) {
        // Create geometry based on type
        let geometry = this.getGeometryForType(memberData.geometry, memberData.scale);
        
        // Create material with enhanced properties
        const material = new THREE.MeshStandardMaterial({
            color: memberData.color,
            emissive: memberData.emissive,
            emissiveIntensity: 0.4,
            metalness: 0.6,
            roughness: 0.3,
            transparent: true,
            opacity: 0.9
        });

        // Create main mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            memberData.position.x,
            memberData.position.y,
            memberData.position.z
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { ...memberData, originalPosition: { ...memberData.position } };

        // Add outer glow
        const glowGeometry = geometry.clone();
        glowGeometry.scale(1.4, 1.4, 1.4);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: memberData.color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        mesh.add(glowMesh);

        // Add particle trail emitter
        this.createMemberParticleEmitter(mesh);

        return mesh;
    }

    getGeometryForType(type, scale) {
        switch(type) {
            case 'octahedron':
                return new THREE.OctahedronGeometry(scale);
            case 'box':
                return new THREE.BoxGeometry(scale, scale, scale);
            case 'icosahedron':
                return new THREE.IcosahedronGeometry(scale);
            case 'tetrahedron':
                return new THREE.TetrahedronGeometry(scale);
            case 'dodecahedron':
                return new THREE.DodecahedronGeometry(scale);
            case 'diamond':
                return new THREE.OctahedronGeometry(scale);
            case 'cone':
                return new THREE.ConeGeometry(scale * 0.7, scale * 1.5, 8);
            case 'sphere':
            default:
                return new THREE.SphereGeometry(scale, 32, 32);
        }
    }

    createMemberParticleEmitter(memberMesh) {
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const memberColor = new THREE.Color(memberMesh.userData.color);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
            
            colors[i * 3] = memberColor.r;
            colors[i * 3 + 1] = memberColor.g;
            colors[i * 3 + 2] = memberColor.b;
            
            sizes[i] = Math.random() * 0.1 + 0.05;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.isEmitter = true;
        particles.userData.lifetimes = new Array(particleCount).fill(0);
        memberMesh.add(particles);
    }

    createConnections() {
        // Create sacred geometry connections
        SACRED_CONNECTIONS.forEach(connection => {
            this.createConnection(connection);
        });
    }

    createConnection(connectionData) {
        const fromPos = this.getPositionForId(connectionData.from);
        const toPos = this.getPositionForId(connectionData.to);
        
        if (!fromPos || !toPos) return;
        
        // Create curved connection line
        const curve = new THREE.QuadraticBezierCurve3(
            fromPos,
            new THREE.Vector3(
                (fromPos.x + toPos.x) / 2,
                Math.max(fromPos.y, toPos.y) + 2,
                (fromPos.z + toPos.z) / 2
            ),
            toPos
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: connectionData.strength || 0.1,
            linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        line.userData = connectionData;
        this.connections.push(line);
        this.scene.add(line);
    }

    getPositionForId(id) {
        if (id === 'center') {
            return new THREE.Vector3(0, 0, 0);
        }
        
        const member = COUNCIL_DATA.find(m => m.id === id);
        return member ? new THREE.Vector3(member.position.x, member.position.y, member.position.z) : null;
    }

    createParticleSystem() {
        // Global thought particles
        const particleCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Random position in sphere
            const radius = 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Golden colors
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i * 3 + 2] = Math.random() * 0.4;
            
            // Random velocities
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        particleSystem.userData = {
            isGlobalParticles: true,
            velocities: velocities
        };
        
        this.particles.push(particleSystem);
        this.scene.add(particleSystem);
    }

    createAmbientElements() {
        // Rotating sacred rings
        const ringConfigs = [
            { radius: 12, tube: 0.1, segments: 64, color: 0xffffff, opacity: 0.1 },
            { radius: 16, tube: 0.05, segments: 32, color: 0xFFD700, opacity: 0.08 },
            { radius: 20, tube: 0.03, segments: 16, color: 0x4169E1, opacity: 0.06 }
        ];
        
        ringConfigs.forEach((config, index) => {
            const geometry = new THREE.TorusGeometry(config.radius, config.tube, 8, config.segments);
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: config.opacity,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            ring.userData = {
                isRing: true,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.005,
                    z: (Math.random() - 0.5) * 0.005
                }
            };
            
            this.ambientElements.push(ring);
            this.scene.add(ring);
        });
    }

    setupPerformanceMonitoring() {
        this.lastTime = performance.now();
    }

    updatePerformanceStats() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update UI
            const fpsElement = document.getElementById('fps');
            const objectsElement = document.getElementById('objects');
            
            if (fpsElement) fpsElement.textContent = `FPS: ${this.fps}`;
            if (objectsElement) objectsElement.textContent = `Objects: ${this.scene.children.length}`;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.updatePerformanceStats();
        this.renderer.render(this.scene, this.camera);
    }

    // Getters for external access
    getCouncilMembers() {
        return this.councilMembers;
    }

    getCenterVoid() {
        return this.centerVoid;
    }

    getConnections() {
        return this.connections;
    }

    getParticles() {
        return this.particles;
    }

    getCamera() {
        return this.camera;
    }

    getScene() {
        return this.scene;
    }

    getRenderer() {
        return this.renderer;
    }
}

