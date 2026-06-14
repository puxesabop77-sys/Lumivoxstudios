// Three.js Scene Setup
let scene, camera, renderer, particles = [];
const canvas = document.getElementById('canvas-container');

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f1e);
    scene.fog = new THREE.Fog(0x0f0f1e, 2000, 3500);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.z = 100;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    canvas.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x667eea, 100, 1000);
    pointLight1.position.set(100, 100, 100);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf093fb, 80, 1000);
    pointLight2.position.set(-100, -100, 100);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    // Create animated 3D elements
    createParticles();
    createFloatingShapes();
    createTorus();

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    // Mouse interaction
    document.addEventListener('mousemove', onMouseMove);

    // Animation loop
    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 500;
        positions[i + 1] = (Math.random() - 0.5) * 500;
        positions[i + 2] = (Math.random() - 0.5) * 500;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x667eea,
        size: 2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    particles.push({
        mesh: particleSystem,
        speed: 0.1,
        rotationSpeed: 0.001,
    });
}

function createFloatingShapes() {
    // Cube
    const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x667eea,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x667eea,
        emissiveIntensity: 0.3,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-60, 0, 0);
    cube.castShadow = true;
    scene.add(cube);

    particles.push({
        mesh: cube,
        basePosition: cube.position.clone(),
        floatRange: 30,
        floatSpeed: 0.002,
    });

    // Sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(15, 4);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xf093fb,
        metalness: 0.6,
        roughness: 0.3,
        emissive: 0xf093fb,
        emissiveIntensity: 0.2,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(60, 0, 0);
    sphere.castShadow = true;
    scene.add(sphere);

    particles.push({
        mesh: sphere,
        basePosition: sphere.position.clone(),
        floatRange: 35,
        floatSpeed: 0.0025,
    });

    // Torus
    const torusGeometry = new THREE.TorusGeometry(25, 8, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x764ba2,
        metalness: 0.8,
        roughness: 0.1,
        emissive: 0x764ba2,
        emissiveIntensity: 0.4,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(0, 60, -30);
    torus.castShadow = true;
    scene.add(torus);

    particles.push({
        mesh: torus,
        basePosition: torus.position.clone(),
        floatRange: 40,
        floatSpeed: 0.002,
        rotationAxis: 'x',
    });
}

function createTorus() {
    const torusKnotGeometry = new THREE.TorusKnotGeometry(30, 10, 100, 16);
    const torusKnotMaterial = new THREE.MeshStandardMaterial({
        color: 0x43e97b,
        metalness: 0.9,
        roughness: 0.05,
        emissive: 0x43e97b,
        emissiveIntensity: 0.3,
        wireframe: false,
    });
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    torusKnot.position.set(0, -60, -50);
    torusKnot.castShadow = true;
    scene.add(torusKnot);

    particles.push({
        mesh: torusKnot,
        basePosition: torusKnot.position.clone(),
        floatRange: 50,
        floatSpeed: 0.0015,
    });
}

let mouseX = 0;
let mouseY = 0;

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    camera.position.x = mouseX * 30;
    camera.position.y = mouseY * 30;
    camera.lookAt(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);

    particles.forEach((particle, index) => {
        if (particle.mesh.geometry.type === 'BufferGeometry' && particle.speed) {
            // Particle system rotation
            particle.mesh.rotation.x += particle.rotationSpeed * 0.5;
            particle.mesh.rotation.y += particle.rotationSpeed;
        } else if (particle.floatSpeed) {
            // Floating animation
            const time = Date.now() * particle.floatSpeed;
            particle.mesh.position.x = particle.basePosition.x + Math.sin(time) * particle.floatRange;
            particle.mesh.position.y = particle.basePosition.y + Math.cos(time * 0.7) * particle.floatRange;
            particle.mesh.position.z = particle.basePosition.z + Math.sin(time * 0.5) * particle.floatRange;

            // Rotation
            if (particle.rotationAxis === 'x') {
                particle.mesh.rotation.x += 0.002;
            } else {
                particle.mesh.rotation.x += 0.001;
                particle.mesh.rotation.y += 0.002;
                particle.mesh.rotation.z += 0.001;
            }
        }
    });

    // Smooth camera transition
    gsap.to(camera.position, {
        duration: 0.5,
        x: mouseX * 50,
        y: mouseY * 50,
        overwrite: 'auto',
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Page scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 10);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .portfolio-item, .stat').forEach((el) => {
        observer.observe(el);
    });
}

// Smooth scroll with parallax
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (renderer) {
        camera.position.z = 100 + scrolled * 0.01;
    }
});

// CTA Button Click Handler
document.querySelector('.cta-button').addEventListener('click', () => {
    const portfolioSection = document.getElementById('portfolio');
    portfolioSection.scrollIntoView({ behavior: 'smooth' });
});

// Contact Form Handler
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
});

// Initialize
window.addEventListener('load', () => {
    initThreeJS();
    setupScrollAnimations();

    // Animate page elements on load
    gsap.from('.hero-content', {
        duration: 1,
        opacity: 0,
        y: 50,
    });
});

// Add subtle glow effect on scroll
const glowEffect = () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const canvas = document.getElementById('canvas-container');
    if (canvas) {
        canvas.style.boxShadow = `inset 0 0 100px rgba(102, 126, 234, ${scrollPercent * 0.3})`;
    }
};

window.addEventListener('scroll', glowEffect, { passive: true });
      
