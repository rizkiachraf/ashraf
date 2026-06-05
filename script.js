/* ============================================
   ACHRAF RIZKI — Portfolio JavaScript
   Animations, Interactions & Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- 3D Full Page Background ----
    const bgCanvas = document.getElementById('particleCanvas');
    if (typeof THREE !== 'undefined' && bgCanvas) {
        const bgScene = new THREE.Scene();
        
        // Background Camera
        const bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        bgCamera.position.z = 30;

        // Renderer
        const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(window.devicePixelRatio);

        // Lighting
        const bgAmbient = new THREE.AmbientLight(0xffffff, 0.4);
        bgScene.add(bgAmbient);

        const bgPoint1 = new THREE.PointLight(0x7c5cfc, 2, 100);
        bgPoint1.position.set(20, 20, 20);
        bgScene.add(bgPoint1);

        const bgPoint2 = new THREE.PointLight(0x38bdf8, 2, 100);
        bgPoint2.position.set(-20, -20, 20);
        bgScene.add(bgPoint2);

        // Objects
        const objects = [];
        const geometry1 = new THREE.TorusGeometry(3, 0.8, 16, 100);
        const geometry2 = new THREE.IcosahedronGeometry(2, 0);
        const geometry3 = new THREE.OctahedronGeometry(2.5, 0);

        const material1 = new THREE.MeshStandardMaterial({ 
            color: 0x7c5cfc, wireframe: true, transparent: true, opacity: 0.3 
        });
        const material2 = new THREE.MeshStandardMaterial({ 
            color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.3 
        });

        // Distribute objects along Y axis (downwards for scroll)
        for (let i = 0; i < 60; i++) {
            let mesh;
            const rand = Math.random();
            if (rand < 0.33) mesh = new THREE.Mesh(geometry1, material1);
            else if (rand < 0.66) mesh = new THREE.Mesh(geometry2, material2);
            else mesh = new THREE.Mesh(geometry3, material1);

            mesh.position.x = (Math.random() - 0.5) * 80;
            // Spread them across a large scrollable area
            mesh.position.y = Math.random() * 20 - (i * 6); 
            mesh.position.z = (Math.random() - 0.5) * 40 - 10;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;

            // Save random rotation speeds
            mesh.userData = {
                rx: (Math.random() - 0.5) * 0.01,
                ry: (Math.random() - 0.5) * 0.01
            };

            bgScene.add(mesh);
            objects.push(mesh);
        }

        // Add 3D Particles
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 1500;
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i+=3) {
            posArray[i] = (Math.random() - 0.5) * 120;
            posArray[i+1] = Math.random() * 20 - (i/3 * 0.3); // Spread along Y
            posArray[i+2] = (Math.random() - 0.5) * 120;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.15,
            color: 0xc084fc,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        const particlesMesh = new THREE.Points(particleGeo, particleMat);
        bgScene.add(particlesMesh);

        // Scroll Logic
        let scrollY = window.scrollY;
        let baseCameraY = 0;
        
        function moveCamera() {
            scrollY = window.scrollY;
            // Move camera down as we scroll down
            baseCameraY = -(scrollY * 0.08);
        }

        window.addEventListener('scroll', moveCamera);
        moveCamera(); // Init

        // Handle Resize
        window.addEventListener('resize', () => {
            bgCamera.aspect = window.innerWidth / window.innerHeight;
            bgCamera.updateProjectionMatrix();
            bgRenderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse Parallax for background
        let bgMouseX = 0;
        let bgMouseY = 0;
        document.addEventListener('mousemove', (e) => {
            bgMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            bgMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation Loop
        const animateBg = function () {
            requestAnimationFrame(animateBg);

            // Rotate objects
            objects.forEach(obj => {
                obj.rotation.x += obj.userData.rx;
                obj.rotation.y += obj.userData.ry;
            });

            // Slowly rotate particle field
            particlesMesh.rotation.y -= 0.0003;

            // Mouse parallax effect on camera
            bgCamera.position.x += (bgMouseX * 3 - bgCamera.position.x) * 0.05;
            
            // Apply base scroll Y + mouse parallax Y
            const targetY = baseCameraY + (bgMouseY * 3);
            bgCamera.position.y += (targetY - bgCamera.position.y) * 0.05;

            bgRenderer.render(bgScene, bgCamera);
        };

        animateBg();
    }


    // ---- Cursor Glow Effect ----
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();


    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();


    // ---- Mobile Nav Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ---- Scroll Reveal Animations ----
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ---- Counting Animation for Stats ----
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                statNumbers.forEach(num => {
                    const target = parseInt(num.dataset.count);
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        num.textContent = Math.floor(eased * target);

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            num.textContent = target;
                        }
                    }
                    requestAnimationFrame(updateCount);
                });
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);


    // ---- Skill Progress Bars ----
    const skillCards = document.querySelectorAll('.skill-card');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.querySelector('.skill-progress');
                if (progress) {
                    const targetWidth = progress.dataset.width;
                    setTimeout(() => {
                        progress.style.width = targetWidth + '%';
                    }, 200);
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillCards.forEach(card => skillObserver.observe(card));


    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Button animation
            const btnText = submitBtn.querySelector('span');
            const originalText = btnText.textContent;

            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';

            // Simulate submission
            setTimeout(() => {
                btnText.textContent = 'Sent! ✓';
                submitBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                submitBtn.style.boxShadow = '0 4px 24px rgba(74, 222, 128, 0.3)';

                setTimeout(() => {
                    contactForm.reset();
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = '';
                    submitBtn.style.boxShadow = '';
                }, 2500);
            }, 1500);
        });
    }


    // ---- Magnetic Button Effect ----
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });


    // ---- Tilt Effect on Cards ----
    document.querySelectorAll('.project-card, .skill-card, .about-image-card, .contact-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateX = (0.5 - y) * 10;
            const rotateY = (x - 0.5) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    // ---- Typed Effect for Hero (optional subtle effect) ----
    // Adds a blinking cursor after the gradient text
    const gradientText = document.querySelector('.hero-title .gradient-text');
    if (gradientText) {
        const cursor = document.createElement('span');
        cursor.style.cssText = `
            display: inline-block;
            width: 3px;
            height: 0.9em;
            background: var(--accent-primary);
            margin-left: 4px;
            animation: blink 1s step-end infinite;
            vertical-align: baseline;
            border-radius: 2px;
        `;

        // Add blink keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        gradientText.appendChild(cursor);

        // Remove cursor after 4 seconds
        setTimeout(() => {
            cursor.style.animation = 'blink 1s step-end 3';
            cursor.addEventListener('animationend', () => cursor.remove());
        }, 4000);
    }

    // ---- 3D Interactive Avatar ("Him") ----
    const about3DContainer = document.getElementById('about3DContainer');
    if (about3DContainer && typeof THREE !== 'undefined') {
        // Remove existing placeholder content
        about3DContainer.innerHTML = '';
        
        const scene = new THREE.Scene();

        // Lighting to match the dark/neon theme
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        const backLight = new THREE.DirectionalLight(0x7c5cfc, 1.2);
        backLight.position.set(-10, 10, -10);
        scene.add(backLight);

        const camera = new THREE.PerspectiveCamera(45, about3DContainer.clientWidth / about3DContainer.clientHeight, 0.1, 100);
        camera.position.z = 5.5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(about3DContainer.clientWidth, about3DContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        about3DContainer.appendChild(renderer.domElement);

        // Avatar Group
        const headGroup = new THREE.Group();

        // Head Base
        const headGeo = new THREE.BoxGeometry(2, 2.2, 2);
        const headMat = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a24, 
            roughness: 0.2,
            metalness: 0.3
        });
        const head = new THREE.Mesh(headGeo, headMat);
        headGroup.add(head);

        // Eyes (cyan glow)
        const eyeGeo = new THREE.BoxGeometry(0.4, 0.15, 0.1);
        const eyeMat = new THREE.MeshStandardMaterial({ 
            color: 0x38bdf8,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.8
        });
        
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.45, 0.3, 1.01);
        headGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.45, 0.3, 1.01);
        headGroup.add(rightEye);

        // Visor/Mouth (purple glow)
        const mouthGeo = new THREE.BoxGeometry(1.4, 0.3, 0.1);
        const mouthMat = new THREE.MeshStandardMaterial({
            color: 0x7c5cfc,
            emissive: 0x7c5cfc,
            emissiveIntensity: 0.6
        });
        const mouth = new THREE.Mesh(mouthGeo, mouthMat);
        mouth.position.set(0, -0.4, 1.01);
        headGroup.add(mouth);

        // Headphone / Ear pieces
        const earGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
        earGeo.rotateZ(Math.PI / 2);
        const earMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.7 });
        
        const leftEar = new THREE.Mesh(earGeo, earMat);
        leftEar.position.set(-1.05, 0, 0);
        headGroup.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeo, earMat);
        rightEar.position.set(1.05, 0, 0);
        headGroup.add(rightEar);

        scene.add(headGroup);

        // Handle Resize
        window.addEventListener('resize', () => {
            if (about3DContainer.clientWidth > 0) {
                camera.aspect = about3DContainer.clientWidth / about3DContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(about3DContainer.clientWidth, about3DContainer.clientHeight);
            }
        });

        // Mouse Tracking Interaction
        let targetRotationX = 0;
        let targetRotationY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            // Calculate rotation based on cursor distance from center
            targetRotationY = ((event.clientX - windowHalfX) / windowHalfX) * 0.8;
            targetRotationX = ((event.clientY - windowHalfY) / windowHalfY) * 0.4;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        const animate3D = function () {
            requestAnimationFrame(animate3D);
            const time = clock.getElapsedTime();

            // Smoothly look at the cursor
            headGroup.rotation.y += (targetRotationY - headGroup.rotation.y) * 0.05;
            headGroup.rotation.x += (targetRotationX - headGroup.rotation.x) * 0.05;

            // Add a subtle floating effect
            headGroup.position.y = Math.sin(time * 1.5) * 0.1;
            
            renderer.render(scene, camera);
        };

        animate3D();
    }

});
