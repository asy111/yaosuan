// 3D爻像场景管理
let threeScene = {
    // 场景相关变量
    scene: null,
    camera: null,
    renderer: null,
    hexagramObject: null,
    controls: null,
    container: null,
    animationMixer: null,
    clock: new THREE.Clock(),
    
    // 初始化场景
    init: function() {
        this.container = document.getElementById('three-container');
        if (!this.container) return;
        
        // 创建场景
        this.scene = new THREE.Scene();
        
        // 设置相机
        this.camera = new THREE.PerspectiveCamera(
            70, // 视角
            this.container.clientWidth / this.container.clientHeight, // 宽高比
            0.1, // 近裁剪面
            1000 // 远裁剪面
        );
        this.camera.position.z = 5;
        
        // 设置渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0); // 透明背景
        this.container.appendChild(this.renderer.domElement);
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        this.scene.add(ambientLight);
        
        // 添加定向光
        const directionalLight = new THREE.DirectionalLight(0x00e5ff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // 添加轨道控制（可选，允许用户旋转视图）
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());
    },
    
    // 窗口大小变化时调整
    onWindowResize: function() {
        if (!this.camera || !this.renderer || !this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    },
    
    // 创建爻像模型
    createHexagram: function(hexagramType) {
        // 清除旧模型
        if (this.hexagramObject) {
            this.scene.remove(this.hexagramObject);
        }
        
        // 创建一个组来包含六个爻
        const hexagram = new THREE.Group();
        
        // 根据卦象类型生成不同的爻组合
        // 这里简化处理，根据类型选择不同颜色和排列
        const hexagramTypes = {
            '乾': { color: 0xFFD700, lines: [1, 1, 1, 1, 1, 1] }, // 全阳
            '坤': { color: 0xC0C0C0, lines: [0, 0, 0, 0, 0, 0] }, // 全阴
            '坎': { color: 0x00BFFF, lines: [0, 1, 0, 1, 0, 1] }, // 水
            '离': { color: 0xFF4500, lines: [1, 0, 1, 0, 1, 0] }, // 火
            '震': { color: 0x9932CC, lines: [0, 0, 0, 1, 0, 0] }, // 雷
            '巽': { color: 0x98FB98, lines: [1, 1, 0, 1, 1, 0] }, // 风
            '艮': { color: 0x8B4513, lines: [1, 0, 0, 0, 0, 1] }, // 山
            '兑': { color: 0xFFFFFF, lines: [0, 0, 1, 1, 1, 1] }  // 泽
        };
        
        // 获取对应的颜色和线型
        let config = hexagramTypes[hexagramType] || hexagramTypes['乾']; // 默认乾卦
        let mainColor = config.color;
        let lines = config.lines;
        
        // 创建爻线
        const spacing = 0.5; // 爻之间的间距
        const lineGeometry = new THREE.BoxGeometry(3, 0.3, 0.3);
        
        for (let i = 0; i < 6; i++) {
            if (lines[i]) {
                // 阳爻 - 一整条线
                const lineMaterial = new THREE.MeshPhongMaterial({ 
                    color: mainColor,
                    emissive: mainColor,
                    emissiveIntensity: 0.2,
                    specular: 0xffffff
                });
                const yangLine = new THREE.Mesh(lineGeometry, lineMaterial);
                yangLine.position.y = (i - 2.5) * spacing;
                hexagram.add(yangLine);
            } else {
                // 阴爻 - 两条短线
                const shortGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.3);
                const lineMaterial = new THREE.MeshPhongMaterial({ 
                    color: mainColor,
                    emissive: mainColor,
                    emissiveIntensity: 0.2,
                    specular: 0xffffff
                });
                
                // 左侧短线
                const leftLine = new THREE.Mesh(shortGeometry, lineMaterial);
                leftLine.position.set(-0.9, (i - 2.5) * spacing, 0);
                hexagram.add(leftLine);
                
                // 右侧短线
                const rightLine = new THREE.Mesh(shortGeometry, lineMaterial);
                rightLine.position.set(0.9, (i - 2.5) * spacing, 0);
                hexagram.add(rightLine);
            }
        }
        
        // 添加整体缩放动画
        hexagram.scale.set(0.5, 0.5, 0.5);
        this.hexagramObject = hexagram;
        this.scene.add(hexagram);
        
        // 创建入场动画
        gsap.to(hexagram.scale, {
            x: 1, y: 1, z: 1,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)"
        });
        
        // 创建持续旋转
        gsap.to(hexagram.rotation, {
            y: Math.PI * 2,
            duration: 20,
            repeat: -1,
            ease: "none"
        });
    },
    
    // 破命特效
    breakFateEffect: function() {
        if (!this.hexagramObject) return;
        
        // 停止当前动画
        gsap.killTweensOf(this.hexagramObject.rotation);
        
        // 爆炸效果
        gsap.to(this.hexagramObject.rotation, {
            x: Math.PI * 4,
            y: Math.PI * 4,
            z: Math.PI * 4,
            duration: 1.5,
            ease: "power4.inOut"
        });
        
        // 闪烁效果
        const originalEmissive = [];
        this.hexagramObject.traverse(child => {
            if (child.isMesh) {
                originalEmissive.push({
                    mesh: child,
                    emissive: child.material.emissiveIntensity
                });
                gsap.to(child.material, {
                    emissiveIntensity: 1,
                    duration: 0.2,
                    repeat: 5,
                    yoyo: true,
                    onComplete: () => {
                        child.material.emissiveIntensity = 0.2;
                    }
                });
            }
        });
        
        // 重新开始旋转
        setTimeout(() => {
            gsap.to(this.hexagramObject.rotation, {
                y: Math.PI * 2,
                duration: 20,
                repeat: -1,
                ease: "none"
            });
        }, 1500);
    },
    
    // 动画循环
    animate: function() {
        if (!this.scene || !this.camera || !this.renderer) return;
        
        requestAnimationFrame(() => this.animate());
        
        // 更新控制器
        if (this.controls) {
            this.controls.update();
        }
        
        // 更新动画混合器
        if (this.animationMixer) {
            this.animationMixer.update(this.clock.getDelta());
        }
        
        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }
};

// 由于我们用到了GSAP动画库，需要引入它
document.addEventListener('DOMContentLoaded', function() {
    // 动态添加GSAP库
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.11.4/dist/gsap.min.js';
    gsapScript.onload = function() {
        // 初始化场景并开始动画
        threeScene.init();
        threeScene.animate();
    };
    document.head.appendChild(gsapScript);
}); 