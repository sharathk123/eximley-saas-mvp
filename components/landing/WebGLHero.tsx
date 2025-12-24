"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

export function WebGLHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetMouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x0f1729, 20, 80); // Increased fog depth
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            120
        );
        camera.position.z = 40; // Moved camera back slightly
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x6366f1, 0.4); // Indigo ambient
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x8b5cf6, 2, 50); // Violet point light
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        const indigoLight = new THREE.PointLight(0x4f46e5, 2, 40);
        indigoLight.position.set(-10, -5, 5);
        scene.add(indigoLight);


        // Background gradient
        const gradientGeometry = new THREE.PlaneGeometry(150, 150);
        const gradientMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color(0x1a1d2e) },
                color2: { value: new THREE.Color(0x0f1729) },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                }
            `,
            side: THREE.DoubleSide,
        });
        const gradientPlane = new THREE.Mesh(gradientGeometry, gradientMaterial);
        gradientPlane.position.z = -30;
        scene.add(gradientPlane);

        // Abstract Global Sphere (Background)
        const globeGeometry = new THREE.BufferGeometry();
        const globePoints = 1500;
        const globePositions = new Float32Array(globePoints * 3);
        const globeSizes = new Float32Array(globePoints);

        for (let i = 0; i < globePoints; i++) {
            const phi = Math.acos(-1 + (2 * i) / globePoints);
            const theta = Math.sqrt(globePoints * Math.PI) * phi;

            const r = 25; // Radius
            globePositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
            globePositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            globePositions[i * 3 + 2] = r * Math.cos(phi);

            globeSizes[i] = Math.random() * 0.15;
        }

        globeGeometry.setAttribute('position', new THREE.BufferAttribute(globePositions, 3));
        globeGeometry.setAttribute('size', new THREE.BufferAttribute(globeSizes, 1));

        const globeMaterial = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 0.1,
            transparent: true,
            opacity: 0.15,
            sizeAttenuation: true
        });

        const globe = new THREE.Points(globeGeometry, globeMaterial);
        globe.position.z = -10;
        scene.add(globe);


        // Floating glass planes (Premium)
        const glassPlanes: THREE.Mesh[] = [];
        const glassGeometry = new THREE.PlaneGeometry(3, 3);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.05,
            transparent: true,
            opacity: 0.1,
            transmission: 0.95,
            thickness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            ior: 1.5,
        });

        for (let i = 0; i < 8; i++) {
            const plane = new THREE.Mesh(glassGeometry, glassMaterial);
            plane.position.set(
                (Math.random() - 0.5) * 25,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            );
            plane.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            plane.scale.setScalar(0.8 + Math.random() * 0.5);
            scene.add(plane);
            glassPlanes.push(plane);
        }

        // Particle system - Data Streaks
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities: { progress: number; pathIndex: number; speed: number; offset: number }[] = [];

        // Create spline paths for particles (Wider layout)
        const paths: THREE.CatmullRomCurve3[] = [];
        const pathCount = 6;

        for (let i = 0; i < pathCount; i++) {
            const points: THREE.Vector3[] = [];
            const startX = (i - pathCount / 2) * 5;
            const startY = (Math.random() - 0.5) * 10;

            // More complex "global" curves
            points.push(new THREE.Vector3(startX - 20, startY - 5, -10)); // Far left
            points.push(new THREE.Vector3(startX - 10, startY + 5, -5)); // Curve up
            points.push(new THREE.Vector3(startX, startY, 0)); // Center
            points.push(new THREE.Vector3(startX + 10, startY - 5, 5)); // Curve down
            points.push(new THREE.Vector3(startX + 20, startY + 5, 0)); // Far right

            const path = new THREE.CatmullRomCurve3(points);
            paths.push(path);
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            const pathIndex = Math.floor(Math.random() * paths.length);
            velocities.push({
                progress: Math.random(),
                pathIndex,
                speed: 0.0005 + Math.random() * 0.001, // Faster data speed
                offset: Math.random() * 0.5 // For sine wave motion
            });

            const point = paths[pathIndex].getPoint(velocities[i].progress);
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;

            // Refined Colors (Indigo, Violet, White)
            const colorChoice = Math.random();
            if (colorChoice < 0.6) {
                // Muted violet
                colors[i * 3] = 0.545; // 0x8b5cf6 -> 139/255
                colors[i * 3 + 1] = 0.36; // 92/255
                colors[i * 3 + 2] = 0.96; // 246/255
            } else if (colorChoice < 0.9) {
                // Bright Indigo
                colors[i * 3] = 0.31; // 0x4f46e5 -> 79/255
                colors[i * 3 + 1] = 0.27; // 69/255
                colors[i * 3 + 2] = 0.9; // 229/255
            } else {
                // Data White
                colors[i * 3] = 0.95;
                colors[i * 3 + 1] = 0.95;
                colors[i * 3 + 2] = 1.0;
            }

            sizes[i] = 0.1 + Math.random() * 0.3;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('particleColor', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
            },
            vertexShader: `
                attribute float size;
                attribute vec3 particleColor;
                varying vec3 vColor;
                varying float vOpacity;
                uniform float time;
                void main() {
                    vColor = particleColor;
                    
                    // Pulse effect along the path
                    float pulse = sin(time * 2.0 + position.x * 0.2) * 0.5 + 0.5;
                    vOpacity = 0.3 + pulse * 0.7; // Dynamic opacity
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Size attenuation + pulse
                    gl_PointSize = size * (1.0 + pulse * 1.0) * (500.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vOpacity;
                void main() {
                    // Soft glow particle
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    
                    if (dist > 0.5) discard;
                    
                    // Exponential falloff for "hot core" look
                    float strength = exp(-dist * 8.0); 
                    float alpha = strength * vOpacity;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Dynamic Grid
        const gridHelper = new THREE.GridHelper(80, 50, 0x1e293b, 0x1e293b); // Darker base
        gridHelper.position.y = -10;
        gridHelper.material.opacity = 0.05;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);

        // Mouse move handler
        const handleMouseMove = (event: MouseEvent) => {
            targetMouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Resize handler
        const handleResize = () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Animation loop
        let animationId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Update uniforms
            particleMaterial.uniforms.time.value = elapsedTime;

            // Smooth parallax
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

            // Cinematic Camera Float
            camera.position.x = Math.sin(elapsedTime * 0.05) * 1.5 + mouseRef.current.x * 3;
            camera.position.y = Math.cos(elapsedTime * 0.08) * 1.0 + mouseRef.current.y * 2;
            camera.lookAt(0, 0, 0);

            // Rotate Globe
            globe.rotation.y = elapsedTime * 0.02;

            // Animate glass planes
            glassPlanes.forEach((plane, i) => {
                plane.rotation.x += 0.001 * (i % 2 === 0 ? 1 : -1);
                plane.rotation.y += 0.001 * (i % 2 === 0 ? -1 : 1);
                plane.position.y += Math.sin(elapsedTime * 0.5 + i) * 0.005;
            });

            // Update particles along paths
            const positionArray = particleGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                const vel = velocities[i];
                vel.progress += vel.speed;

                // Loop particle
                if (vel.progress > 1) {
                    vel.progress = 0;
                    if (Math.random() < 0.2) {
                        vel.pathIndex = Math.floor(Math.random() * paths.length);
                    }
                }

                const point = paths[vel.pathIndex].getPoint(vel.progress);

                // Add some "noise" or wave to the path
                const noiseY = Math.sin(vel.progress * 10 + elapsedTime + vel.offset) * 0.5;

                positionArray[i * 3] = point.x;
                positionArray[i * 3 + 1] = point.y + noiseY;
                positionArray[i * 3 + 2] = point.z;
            }
            particleGeometry.attributes.position.needsUpdate = true;

            // Render
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            gradientGeometry.dispose();
            gradientMaterial.dispose();
            globeGeometry.dispose();
            globeMaterial.dispose();
            glassGeometry.dispose();
            glassMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();

            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0 }}
        />
    );
}
