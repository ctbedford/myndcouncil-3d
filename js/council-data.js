/**
 * ==========================================
 * MYNDCOUNCIL DATA CONFIGURATION
 * Council Hall Members
 * ==========================================
 */

// Council member configuration and layout
const COUNCIL_DATA = [
    {
        id: 'plato',
        name: '📚 PLATO',
        role: 'Eternal Forms & Truth',
        question: 'What eternal truth emerges from this moment?',
        description: 'The seeker of ideal forms and universal truths that transcend material reality.',
        position: { x: 5, y: 1, z: 0 },
        color: 0xFFD700,
        emissive: 0xFFD700,
        geometry: 'octahedron',
        scale: 0.9,
        layer: 'eternal',
        invocation: 'Plato reveals the eternal forms behind temporal appearances.'
    },
    {
        id: 'aristotle',
        name: '🏛️ ARISTOTLE',
        role: 'Analysis & Categorization',
        question: 'What kind of thing is this? What is its essence and purpose?',
        description: 'The systematic analyzer who creates order through logical categorization.',
        position: { x: 3.54, y: 1, z: 3.54 },
        color: 0x4169E1,
        emissive: 0x4169E1,
        geometry: 'box',
        scale: 0.8,
        layer: 'synthesis',
        invocation: 'Aristotle structures reality through systematic analysis.'
    },
    {
        id: 'leonardo',
        name: '🎨 LEONARDO',
        role: 'Synthesis & Connection',
        question: 'How does this connect to everything else? What patterns emerge?',
        description: 'The universal connector who sees the hidden relationships between all things.',
        position: { x: 0, y: 1, z: 5 },
        color: 0xFF6347,
        emissive: 0xFF6347,
        geometry: 'icosahedron',
        scale: 0.8,
        layer: 'synthesis',
        invocation: 'Leonardo weaves the web of connections across all domains.'
    },
    {
        id: 'tycho',
        name: '🔭 TYCHO',
        role: 'Pure Observation',
        question: 'What do I observe without judgment, theory, or assumption?',
        description: 'The precise observer who sees reality as it is, free from preconceptions.',
        position: { x: -3.54, y: 1, z: 3.54 },
        color: 0x20B2AA,
        emissive: 0x20B2AA,
        geometry: 'tetrahedron',
        scale: 0.7,
        layer: 'void',
        invocation: 'Tycho observes with the clarity of untainted perception.'
    },
    {
        id: 'feynman',
        name: '🧪 FEYNMAN',
        role: 'Simplification & Essence',
        question: 'How can I explain this simply? What is the core essence?',
        description: 'The simplifier who strips away complexity to reveal fundamental truth.',
        position: { x: -5, y: 1, z: 0 },
        color: 0x32CD32,
        emissive: 0x32CD32,
        geometry: 'dodecahedron',
        scale: 0.7,
        layer: 'void',
        invocation: 'Feynman reduces complexity to elegant simplicity.'
    },
    {
        id: 'machiavelli',
        name: '⚡ MACHIAVELLI',
        role: 'Strategic Decision',
        question: 'What action achieves the goal most effectively?',
        description: 'The pragmatic strategist who navigates reality to achieve desired outcomes.',
        position: { x: -3.54, y: 1, z: -3.54 },
        color: 0xDC143C,
        emissive: 0xDC143C,
        geometry: 'diamond',
        scale: 0.8,
        layer: 'action',
        invocation: 'Machiavelli calculates the path to effective action.'
    },
    {
        id: 'edison',
        name: '💡 EDISON',
        role: 'Execution & Iteration',
        question: 'What is the smallest step I can take right now?',
        description: 'The relentless executor who turns ideas into reality through persistent action.',
        position: { x: 0, y: 1, z: -5 },
        color: 0xFFA500,
        emissive: 0xFFA500,
        geometry: 'cone',
        scale: 0.8,
        layer: 'action',
        invocation: 'Edison transforms vision into tangible reality.'
    },
    {
        id: 'socrates',
        name: '🌳 SOCRATES',
        role: 'Reflection & Wisdom',
        question: 'What did I truly learn? What questions remain?',
        description: 'The wise reflector who integrates experience into deeper understanding.',
        position: { x: 3.54, y: 1, z: -3.54 },
        color: 0x9370DB,
        emissive: 0x9370DB,
        geometry: 'sphere',
        scale: 0.9,
        layer: 'wisdom',
        invocation: 'Socrates transforms experience into enduring wisdom.'
    }
];

// Connection lines between thinkers
const CONNECTIONS = [
    // Center connections (all to void)
    ...COUNCIL_DATA.map(member => ({ from: 'center', to: member.id, type: 'radial' })),
    
    // Hierarchical connections
    { from: 'plato', to: 'leonardo', type: 'forms', strength: 0.8 },
    { from: 'plato', to: 'aristotle', type: 'categories', strength: 0.8 },
    { from: 'leonardo', to: 'aristotle', type: 'synthesis', strength: 0.9 },
    
    // Observation layer
    { from: 'tycho', to: 'feynman', type: 'clarity', strength: 0.7 },
    { from: 'tycho', to: 'aristotle', type: 'data', strength: 0.6 },
    { from: 'feynman', to: 'leonardo', type: 'patterns', strength: 0.6 },
    
    // Action layer
    { from: 'machiavelli', to: 'edison', type: 'execution', strength: 0.9 },
    { from: 'leonardo', to: 'machiavelli', type: 'strategy', strength: 0.5 },
    { from: 'aristotle', to: 'edison', type: 'implementation', strength: 0.5 },
    
    // Wisdom integration
    { from: 'socrates', to: 'plato', type: 'wisdom', strength: 0.8 },
    { from: 'edison', to: 'socrates', type: 'experience', strength: 0.7 },
    { from: 'machiavelli', to: 'socrates', type: 'results', strength: 0.7 },
    { from: 'socrates', to: 'tycho', type: 'questions', strength: 0.6 }
];

// Layer configuration for visual organization
const LAYERS = {
    eternal: {
        name: 'Eternal Forms',
        color: 0xFFD700,
        description: 'Truth, wisdom, and ideal forms'
    },
    synthesis: {
        name: 'Synthesis & Analysis',
        color: 0x4169E1,
        description: 'Pattern recognition and categorization'
    },
    void: {
        name: 'Quantum Void',
        color: 0x20B2AA,
        description: 'Observation and simplification around the user center'
    },
    action: {
        name: 'Action Layer',
        color: 0xDC143C,
        description: 'Decision and execution'
    },
    wisdom: {
        name: 'Wisdom Integration',
        color: 0x9370DB,
        description: 'Reflection and learning'
    }
};

// Animation presets
const ANIMATION_PRESETS = {
    meditation: {
        name: 'Meditation Mode',
        rotationSpeed: 0.002,
        floatAmplitude: 0.1,
        particleFlow: 'gentle',
        connections: 'pulse'
    },
    active: {
        name: 'Active Consultation',
        rotationSpeed: 0.01,
        floatAmplitude: 0.3,
        particleFlow: 'dynamic',
        connections: 'flow'
    },
    contemplation: {
        name: 'Deep Contemplation',
        rotationSpeed: 0.001,
        floatAmplitude: 0.05,
        particleFlow: 'minimal',
        connections: 'steady'
    }
};

// Invocation sequences for full council activation
const INVOCATION_SEQUENCE = [
    { thinker: 'plato', delay: 0, message: 'The eternal forms illuminate...' },
    { thinker: 'leonardo', delay: 500, message: 'Connections emerge...' },
    { thinker: 'aristotle', delay: 1000, message: 'Order crystallizes...' },
    { thinker: 'tycho', delay: 1500, message: 'Observation clarifies...' },
    { thinker: 'feynman', delay: 2000, message: 'Simplicity reveals...' },
    { thinker: 'machiavelli', delay: 2500, message: 'Strategy focuses...' },
    { thinker: 'edison', delay: 3000, message: 'Action manifests...' },
    { thinker: 'socrates', delay: 3500, message: 'Wisdom integrates all...' }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COUNCIL_DATA,
        CONNECTIONS,
        LAYERS,
        ANIMATION_PRESETS,
        INVOCATION_SEQUENCE
    };
}

