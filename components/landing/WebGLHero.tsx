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
        scene.fog = new THREE.Fog(0x0f1729, 10, 50);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.z = 30;
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x4a9eff, 0.2);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Background gradient
        const gradientGeometry = new THREE.PlaneGeometry(100, 100);
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
        gradientPlane.position.z = -20;
        scene.add(gradientPlane);

        // Floating glass planes
        const glassPlanes: THREE.Mesh[] = [];
        const glassGeometry = new THREE.PlaneGeometry(3, 3);
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4a9eff,
            metalness: 0.1,
            roughness: 0.1,
            transparent: true,
            opacity: 0.08,
            transmission: 0.9,
            thickness: 0.1,
        });

        for (let i = 0; i < 6; i++) {
            const plane = new THREE.Mesh(glassGeometry, glassMaterial);
            plane.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15 - 5
            );
            plane.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            scene.add(plane);
            glassPlanes.push(plane);
        }

        // Particle system - flowing light streams
        const particleCount = 800;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities: { progress: number; pathIndex: number; speed: number }[] = [];

        // Create spline paths for particles
        const paths: THREE.CatmullRomCurve3[] = [];
        const pathCount = 5;

        for (let i = 0; i < pathCount; i++) {
            const points: THREE.Vector3[] = [];
            const startX = (i - pathCount / 2) * 4;
            const startY = (Math.random() - 0.5) * 8;

            // Entry pulse (enquiry)
            points.push(new THREE.Vector3(startX - 15, startY, -5));

            // Structured geometry (quotation)
            points.push(new THREE.Vector3(startX - 8, startY + 2, 0));

            // Branching (negotiation)
            const branchY = startY + (Math.random() - 0.5) * 3;
            points.push(new THREE.Vector3(startX - 3, branchY, 2));

            // Convergence (acceptance)
            points.push(new THREE.Vector3(startX + 3, 0, 3));

            // Forward stream (workflow)
            points.push(new THREE.Vector3(startX + 10, 0, 2));

            // Exit
            points.push(new THREE.Vector3(startX + 18, 0, 0));

            const path = new THREE.CatmullRomCurve3(points);
            paths.push(path);
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            const pathIndex = Math.floor(Math.random() * paths.length);
            velocities.push({
                progress: Math.random(),
                pathIndex,
                speed: 0.0003 + Math.random() * 0.0005,
            });

            const point = paths[pathIndex].getPoint(velocities[i].progress);
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;

            // Color (muted cyan/white)
            const colorChoice = Math.random();
            if (colorChoice < 0.7) {
                // Muted cyan
                colors[i * 3] = 0.29;
                colors[i * 3 + 1] = 0.62;
                colors[i * 3 + 2] = 1;
            } else {
                // Soft white
                colors[i * 3] = 1;
                colors[i * 3 + 1] = 1;
                colors[i * 3 + 2] = 1;
            }

            sizes[i] = 0.1 + Math.random() * 0.15;
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
                void main() {
                    vColor = particleColor;
                    vOpacity = 0.5 + sin(position.x * 0.5) * 0.3;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vOpacity;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    float alpha = (1.0 - dist * 2.0) * vOpacity;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Background grid
        const gridHelper = new THREE.GridHelper(60, 40, 0x4a9eff, 0x4a9eff);
        gridHelper.material.opacity = 0.03;
        gridHelper.material.transparent = true;
        gridHelper.position.y = -8;
        gridHelper.position.z = -10;
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

            // Smooth parallax
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

            // Camera subtle drift + parallax
            camera.position.x = Math.sin(elapsedTime * 0.1) * 0.5 + mouseRef.current.x * 2;
            camera.position.y = Math.cos(elapsedTime * 0.15) * 0.3 + mouseRef.current.y * 1;
            camera.lookAt(0, 0, 0);

            // Animate glass planes
            glassPlanes.forEach((plane, i) => {
                plane.rotation.x += 0.0005 * (i % 2 === 0 ? 1 : -1);
                plane.rotation.y += 0.0003 * (i % 2 === 0 ? -1 : 1);
                plane.position.y += Math.sin(elapsedTime * 0.3 + i) * 0.002;
            });

            // Update particles along paths
            const positionArray = particleGeometry.attributes.position.array as Float32Array;
            for (let i = 0; i < particleCount; i++) {
                const vel = velocities[i];
                vel.progress += vel.speed;

                // Loop particle
                if (vel.progress > 1) {
                    vel.progress = 0;
                    // Randomly switch paths for variation
                    if (Math.random() < 0.1) {
                        vel.pathIndex = Math.floor(Math.random() * paths.length);
                    }
                }

                const point = paths[vel.pathIndex].getPoint(vel.progress);
                positionArray[i * 3] = point.x;
                positionArray[i * 3 + 1] = point.y;
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
            particleGeometry.dispose();
            particleMaterial.dispose();
            glassGeometry.dispose();
            glassMaterial.dispose();
            gradientGeometry.dispose();
            gradientMaterial.dispose();
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
