/* ===== Product Data (JSON Array) =====
   Loaded at runtime from `data/products.json`. The inline array below is kept
   as a fallback so the grid still works when the page is opened directly via
   the file:// protocol (where fetch() is blocked by browsers). */
let products = [
    {
        id: 1,
        title: "MCCS IoT Device",
        category: "Hardware",
        description: "車両に取り付けるIoTデバイス。リアルタイムでGPS、エンジン状態、走行データを収集します。",
        image: "assets/Asset 4.png"
    },
    {
        id: 2,
        title: "AI Credit Scoring Platform",
        category: "Software",
        description: "車両データとAIを活用した革新的な与信スコアリングプラットフォーム。",
        image: "assets/card.png"
    },
    {
        id: 3,
        title: "Fleet Management System",
        category: "Platform",
        description: "車両フリートの一元管理。位置情報、メンテナンス、ドライバー管理を統合。",
        image: "assets/Asset 3.png"
    },
    {
        id: 4,
        title: "Smart Parking Solution",
        category: "Mobility",
        description: "AIによるスマート駐車場管理システム。空き状況のリアルタイム把握。",
        image: "assets/parket.png"
    },
    {
        id: 5,
        title: "Connected Car Platform",
        category: "Platform",
        description: "車両データのクラウド集約と分析。予防保守とドライバー行動分析。",
        image: "assets/car2.png"
    },
    {
        id: 6,
        title: "Mobility Data Analytics",
        category: "Software",
        description: "移動データの可視化と分析ダッシュボード。都市計画に活用可能。",
        image: "assets/34673258_m.jpg"
    },
    {
        id: 7,
        title: "Vehicle Security System",
        category: "Hardware",
        description: "遠隔からの車両ロック・アンロック制御。盗難防止と債権回収を支援。",
        image: "assets/33899414_m.jpg"
    },
    {
        id: 8,
        title: "ASEAN Mobility Network",
        category: "Service",
        description: "東南アジア全域をカバーするモビリティネットワーク。金融包摂を実現。",
        image: "assets/23917381_m.jpg"
    },
    {
        id: 9,
        title: "Driver Behavior Analysis",
        category: "Software",
        description: "運転行動をAIで分析し、安全運転スコアリングとフィードバックを提供。",
        image: "assets/33643559_m.jpg"
    }
];

/* ===== Three.js Hero Side Assets Animation ===== */
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.getElementById('hero');
    if (!canvas || !hero) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const loader = new THREE.TextureLoader();
    const floatingAssets = [];

    const assetConfigs = [
        { file: 'Asset 5.png', side: 'left', x: -7.2, y: 2.2, z: -1.5, scale: 3.8, opacity: 0.42 },
        { file: 'Asset 6.png', side: 'left', x: -6.4, y: -0.8, z: 0.5, scale: 3.4, opacity: 0.38 },
        { file: 'Asset 7.png', side: 'left', x: -7.8, y: -2.6, z: -0.8, scale: 3.6, opacity: 0.4 },
        { file: 'Asset 8.png', side: 'right', x: 7.2, y: 2.0, z: -1.2, scale: 3.7, opacity: 0.42 },
        { file: 'Asset 9.png', side: 'right', x: 6.6, y: -0.5, z: 0.4, scale: 3.3, opacity: 0.36 },
        { file: 'Asset 10.png', side: 'right', x: 7.6, y: -2.4, z: -0.6, scale: 3.5, opacity: 0.4 }
    ];

    assetConfigs.forEach((config, index) => {
        loader.load(`assets/${config.file}`, (texture) => {
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: config.opacity,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const sprite = new THREE.Sprite(material);
            sprite.scale.set(config.scale, config.scale, 1);
            sprite.position.set(config.x, config.y, config.z);
            scene.add(sprite);

            floatingAssets.push({
                sprite,
                baseScale: config.scale,
                baseX: config.x,
                baseY: config.y,
                baseZ: config.z,
                driftX: 0.35 + index * 0.05,
                driftY: 0.28 + index * 0.04,
                driftZ: 0.18 + index * 0.03,
                rotSpeed: 0.15 + index * 0.02,
                floatSpeed: 0.35 + index * 0.04,
                phase: index * 1.3
            });
            resize();
        });
    });

    const dotCount = 60;
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
        dotPositions[i * 3] = (Math.random() - 0.5) * 16;
        dotPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        dotPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const dots = new THREE.Points(
        dotsGeo,
        new THREE.PointsMaterial({
            color: 0x33aaff,
            size: 0.05,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        })
    );
    scene.add(dots);

    camera.position.z = 10;

    function resize() {
        const { width, height } = hero.getBoundingClientRect();
        const w = Math.max(width, 1);
        const h = Math.max(height, 1);
        const isMobile = w < 768;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);

        floatingAssets.forEach((item) => {
            const scaleMul = isMobile ? 0.5 : 1;
            item.sprite.scale.set(item.baseScale * scaleMul, item.baseScale * scaleMul, 1);
            item.currentXMul = isMobile ? 0.65 : 1;
        });
    }

    function animate(time) {
        requestAnimationFrame(animate);
        const t = time * 0.001;

        floatingAssets.forEach((item) => {
            const xMul = item.currentXMul || 1;
            item.sprite.position.x = (item.baseX * xMul) + Math.sin(t * item.floatSpeed + item.phase) * item.driftX;
            item.sprite.position.y = item.baseY + Math.cos(t * item.floatSpeed * 0.85 + item.phase) * item.driftY;
            item.sprite.position.z = item.baseZ + Math.sin(t * item.floatSpeed * 0.6 + item.phase) * item.driftZ;
            item.sprite.material.rotation = Math.sin(t * item.rotSpeed + item.phase) * 0.12;
            item.sprite.material.opacity = 0.28 + Math.sin(t * 0.8 + item.phase) * 0.12;
        });

        dots.rotation.y = t * 0.03;
        dots.rotation.x = Math.sin(t * 0.2) * 0.05;

        renderer.render(scene, camera);
    }

    resize();
    animate(0);
    window.addEventListener('resize', resize);
}

/* ===== Three.js Performance Globe Accent ===== */
function initGlobeAnimation() {
    const canvas = document.getElementById('performance-globe-canvas');
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);

    const radius = 2.55;
    const activePointCount = 44;
    const activePositions = new Float32Array(activePointCount * 3);

    for (let i = 0; i < activePointCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        activePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        activePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        activePositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(activePositions, 3));
    const points = new THREE.Points(
        pointsGeo,
        new THREE.PointsMaterial({
            color: 0x33ccff,
            size: 0.09,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending
        })
    );
    group.add(points);

    const linePositions = [];
    for (let i = 0; i < activePointCount; i += 2) {
        const next = (i + 9) % activePointCount;
        linePositions.push(
            activePositions[i * 3],
            activePositions[i * 3 + 1],
            activePositions[i * 3 + 2],
            activePositions[next * 3],
            activePositions[next * 3 + 1],
            activePositions[next * 3 + 2]
        );
    }

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(
        linesGeo,
        new THREE.LineBasicMaterial({
            color: 0x55dfff,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        })
    );
    group.add(lines);

    const ringGeo = new THREE.TorusGeometry(radius * 1.02, 0.012, 8, 160);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x1b9cff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending
    });
    const ringOne = new THREE.Mesh(ringGeo, ringMat);
    const ringTwo = new THREE.Mesh(ringGeo, ringMat.clone());
    ringOne.rotation.x = Math.PI / 2.8;
    ringTwo.rotation.y = Math.PI / 2.5;
    group.add(ringOne, ringTwo);

    const sparkGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const sparkMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const sparks = Array.from({ length: 7 }, (_, index) => {
        const spark = new THREE.Mesh(sparkGeo, sparkMat.clone());
        const angle = (index / 7) * Math.PI * 2;
        spark.position.set(Math.cos(angle) * radius, Math.sin(angle * 0.7) * radius * 0.6, Math.sin(angle) * radius);
        group.add(spark);
        return spark;
    });

    camera.position.z = 6.6;

    function resize() {
        const size = container.getBoundingClientRect();
        const width = Math.max(size.width, 1);
        const height = Math.max(size.height, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }

    function animate(time) {
        requestAnimationFrame(animate);
        const t = time * 0.001;
        group.rotation.y = t * 0.11;
        group.rotation.x = Math.sin(t * 0.4) * 0.06;
        ringOne.rotation.z = t * 0.2;
        ringTwo.rotation.x = Math.PI / 2.5 + t * 0.16;
        sparks.forEach((spark, index) => {
            spark.material.opacity = 0.45 + Math.sin(t * 2.3 + index) * 0.35;
            spark.scale.setScalar(0.8 + Math.sin(t * 2 + index) * 0.35);
        });
        renderer.render(scene, camera);
    }

    resize();
    animate(0);
    window.addEventListener('resize', resize);
}

/* ===== Three.js Solution Section Particle Network ===== */
function initSolutionAnimation() {
    const canvas = document.getElementById('solution-canvas');
    if (!canvas) return;

    const section = canvas.parentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, section.clientWidth / section.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(section.clientWidth, section.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        velocities.push({
            x: (Math.random() - 0.5) * 0.006,
            y: (Math.random() - 0.5) * 0.006,
            z: (Math.random() - 0.5) * 0.003
        });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const points = new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0x1a7ff5,
        size: 0.07,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    }));
    scene.add(points);

    const lineMat = new THREE.LineBasicMaterial({
        color: 0x1a7ff5,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
    });

    let linesMesh = null;

    camera.position.z = 9;

    function animate() {
        requestAnimationFrame(animate);

        const posArr = geo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            posArr[i * 3] += velocities[i].x;
            posArr[i * 3 + 1] += velocities[i].y;
            posArr[i * 3 + 2] += velocities[i].z;
            if (Math.abs(posArr[i * 3]) > 11) velocities[i].x *= -1;
            if (Math.abs(posArr[i * 3 + 1]) > 11) velocities[i].y *= -1;
            if (Math.abs(posArr[i * 3 + 2]) > 4) velocities[i].z *= -1;
        }
        geo.attributes.position.needsUpdate = true;

        if (linesMesh) scene.remove(linesMesh);
        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = posArr[i * 3] - posArr[j * 3];
                const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
                const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
                if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 3.5) {
                    linePositions.push(posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2]);
                    linePositions.push(posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]);
                }
            }
        }
        if (linePositions.length > 0) {
            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            linesMesh = new THREE.LineSegments(lineGeo, lineMat);
            scene.add(linesMesh);
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        const w = section.clientWidth;
        const h = section.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

/* ===== Product Grid Rendering ===== */
function renderProducts(filteredProducts) {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');

    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    grid.innerHTML = filteredProducts.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.06}s">
            <div class="product-card__image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="product-card__body">
                <span class="product-card__category">${product.category}</span>
                <h3 class="product-card__title">${product.title}</h3>
                <p class="product-card__desc">${product.description}</p>
            </div>
        </div>
    `).join('');
}

/* ===== Real-Time Search Filter ===== */
function initSearch() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (!query) {
            renderProducts(products);
            return;
        }

        const filtered = products.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );

        renderProducts(filtered);
    });
}

/* ===== Load products from JSON, then mount grid + search ===== */
async function initProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    try {
        const res = await fetch('data/products.json', { cache: 'no-cache' });
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length) {
                products = data;
            }
        }
    } catch (err) {
        console.warn('products.json fetch failed, using inline fallback.', err);
    }

    renderProducts(products);
    initSearch();
}

/* ===== Header Scroll Effect ===== */
function initHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
    const hamburger = document.querySelector('.nav__hamburger');
    const navCenter = document.querySelector('.nav__center');
    if (!hamburger || !navCenter) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navCenter.classList.toggle('active');
    });

    navCenter.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navCenter.classList.remove('active');
        });
    });
}

/* ===== Lenis Smooth Scroll ===== */
function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

/* ===== GSAP Scroll Animations ===== */
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero — pin the section while content zooms in + slides left, then unpin
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=120%',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1
        }
    });

    heroTl
        .to('.hero__content', {
            scale: 1.6,
            x: '-35vw',
            opacity: 0,
            filter: 'blur(8px)',
            ease: 'power2.in'
        }, 0)
        .to('.hero__bg', {
            scale: 1.18,
            ease: 'none'
        }, 0)
        .to('#hero-canvas', {
            opacity: 0,
            ease: 'power1.in'
        }, 0);

    // Performance section - title slides in from left
    gsap.from('.performance__title', {
        x: -80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.performance',
            start: 'top 75%',
            end: 'top 40%',
            scrub: 1,
            toggleActions: 'play reverse play reverse'
        }
    });

    // Performance car moves with scroll
    gsap.from('.performance__car', {
        x: -120,
        opacity: 0,
        rotation: -10,
        scrollTrigger: {
            trigger: '.performance',
            start: 'top 60%',
            end: 'center center',
            scrub: 1.5,
            toggleActions: 'play reverse play reverse'
        }
    });

    // Globe scale in
    gsap.from('.performance__globe-stack', {
        scale: 0.6,
        opacity: 0,
        scrollTrigger: {
            trigger: '.performance',
            start: 'top 70%',
            end: 'center center',
            scrub: 1.2,
            toggleActions: 'play reverse play reverse'
        }
    });

    // Core Platform - title
    gsap.from('.core-platform__title', {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.core-platform',
            start: 'top 80%',
            toggleActions: 'play reverse play reverse'
        }
    });

    // Core Platform chain steps - stagger in from alternating sides
    const chainSteps = document.querySelectorAll('.chain-step');
    chainSteps.forEach((step, i) => {
        const fromX = i % 2 === 0 ? -60 : 60;
        gsap.from(step, {
            x: fromX,
            opacity: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: step,
                start: 'top 82%',
                toggleActions: 'play reverse play reverse'
            }
        });
    });

    // Chain connectors - grow in
    gsap.utils.toArray('.chain-connector').forEach(con => {
        gsap.from(con, {
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'top center',
            duration: 0.7,
            scrollTrigger: {
                trigger: con,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse'
            }
        });
    });

    // Core Platform icons float continuously
    gsap.utils.toArray('.chain-step__icon').forEach((icon, i) => {
        gsap.to(icon, {
            y: -8,
            duration: 2 + i * 0.3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    });

    // Chain step car — drive across as user scrolls through Core Platform
    const carIcon = document.querySelector('.chain-step__icon--car');
    if (carIcon) {
        gsap.fromTo(carIcon,
            { x: -160, rotateZ: -2 },
            {
                x: 160,
                rotateZ: 2,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.core-platform',
                    start: 'top 75%',
                    end: 'bottom 30%',
                    scrub: 1
                }
            }
        );
    }

    // Performance car — bobs and drives slightly with scroll
    const perfCar = document.querySelector('.performance__car');
    if (perfCar) {
        gsap.fromTo(perfCar,
            { x: -40 },
            {
                x: 40,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.performance',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: 1.2
                }
            }
        );
    }


    // Solution section - title
    gsap.from('.solution__title', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.solution',
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
        }
    });

    // Solution parket image scale up
    gsap.from('.solution__image img', {
        scale: 0.85,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.solution__image',
            start: 'top 80%',
            toggleActions: 'play reverse play reverse'
        }
    });

    // Solution buttons pop in
    gsap.utils.toArray('.solution__btn').forEach((btn, i) => {
        gsap.from(btn, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: btn,
                start: 'top 90%',
                toggleActions: 'play reverse play reverse'
            }
        });
    });

    // SDGs section
    gsap.from('.sdgs__title', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.sdgs',
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
        }
    });

    gsap.from('.sdgs__body', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
            trigger: '.sdgs__body',
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
        }
    });

    gsap.from('.sdgs__collage', {
        x: 80,
        opacity: 0,
        rotation: 5,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.sdgs__collage',
            start: 'top 80%',
            toggleActions: 'play reverse play reverse'
        }
    });

    // Mission section
    gsap.from('.mission__quote', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.mission',
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
        }
    });

    gsap.from('.mission__cta', {
        scale: 0.8,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.mission__cta',
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
        }
    });

    // Partners rows slide in from alternate sides
    gsap.utils.toArray('.partners__row').forEach((row, i) => {
        gsap.from(row, {
            x: i % 2 === 0 ? -60 : 60,
            opacity: 0,
            duration: 0.7,
            scrollTrigger: {
                trigger: row,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse'
            }
        });
    });
}

/* ===== News Filter ===== */
function initNewsFilter() {
    const filter = document.getElementById('news-filter');
    const items = document.querySelectorAll('.news__item');
    if (!filter || !items.length) return;

    filter.addEventListener('change', () => {
        const value = filter.value;
        items.forEach(item => {
            const categories = item.dataset.category || '';
            const show = value === 'all' || categories.includes(value);
            item.style.display = show ? '' : 'none';
        });
    });
}

/* ===== Initialize Everything ===== */
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initHeroAnimation();
    initGlobeAnimation();
    initSolutionAnimation();
    initHeader();
    initMobileMenu();
    initProducts();
    initNewsFilter();
    initGSAPAnimations();
});
