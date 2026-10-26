
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Styles from "./3dmodule.module.css";

interface Product3DProps {
    modelUrl: string;
}

const Product3D = ({ modelUrl }: Product3DProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isMounted = true;
        let animationId = 0;
        let loadedObject: THREE.Group | null = null;

        setIsLoading(true);
        setError(false);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF1F5F9);

        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);

        const camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.01,
            100000
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(
            camera,
            renderer.domElement
        );

        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enablePan = false;
        controls.minDistance = 1;
        controls.maxDistance = 1000;

        // Iluminación suave de estudio
        const ambientLight = new THREE.AmbientLight(
            0xffffff,
            2
        );
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(
            0xffffff,
            3
        );
        mainLight.position.set(5, 8, 10);
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(
            0xdbeafe,
            1.5
        );
        fillLight.position.set(-6, 3, -5);
        scene.add(fillLight);

        const loader = new OBJLoader();

        loader.load(
            modelUrl,
            (object) => {
                if (!isMounted) {
                    object.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.geometry.dispose();

                            const materials = Array.isArray(child.material)
                                ? child.material
                                : [child.material];

                            materials.forEach((material) =>
                                material.dispose()
                            );
                        }
                    });
                    return;
                }

                loadedObject = object;

                // Material neutro para visualizar el modelo
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material =
                            new THREE.MeshStandardMaterial({
                                color: 0xA8B3C2,
                                roughness: 0.7,
                                metalness: 0.05,
                                side: THREE.DoubleSide,
                            });
                    }
                });

                scene.add(object);

                // Centrar y normalizar el tamaño del modelo
                const initialBox = new THREE.Box3().setFromObject(object);
                const initialSize = initialBox.getSize(
                    new THREE.Vector3()
                );
                const initialCenter = initialBox.getCenter(
                    new THREE.Vector3()
                );

                const maxDimension = Math.max(
                    initialSize.x,
                    initialSize.y,
                    initialSize.z
                );

                if (maxDimension <= 0 || !Number.isFinite(maxDimension)) {
                    scene.remove(object);
                    loadedObject = null;
                    setError(true);
                    setIsLoading(false);
                    return;
                }

                object.position.sub(initialCenter);

                // Escala consistente para modelos de diferentes dimensiones
                object.scale.setScalar(100 / maxDimension);

                // Calcular las dimensiones definitivas
                const finalBox = new THREE.Box3().setFromObject(object);
                const sphere = finalBox.getBoundingSphere(
                    new THREE.Sphere()
                );

                const radius = Math.max(sphere.radius, 0.1);
                const fov = THREE.MathUtils.degToRad(camera.fov);

                // Distancia calculada para que entre el modelo completo
                const distance = (radius / Math.sin(fov / 2)) * 1.2;

                camera.position.set(
                    0,
                    0,
                    Math.max(distance, 1)
                );

                camera.near = Math.max(radius / 1000, 0.01);
                camera.far = Math.max(distance + radius * 10, 100);
                camera.updateProjectionMatrix();

                controls.target.copy(sphere.center);
                controls.minDistance = Math.max(radius * 0.8, 0.1);
                controls.maxDistance = Math.max(distance * 4, 10);
                controls.update();

                setIsLoading(false);
            },
            undefined,
            (loadError) => {
                if (!isMounted) return;

                console.error("Error al cargar el modelo OBJ:", loadError);
                setError(true);
                setIsLoading(false);
            }
        );

        const handleResize = () => {
            if (!container) return;

            const newWidth = Math.max(container.clientWidth, 1);
            const newHeight = Math.max(container.clientHeight, 1);

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(newWidth, newHeight);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        const animate = () => {
            if (!isMounted) return;

            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            isMounted = false;

            cancelAnimationFrame(animationId);
            resizeObserver.disconnect();
            controls.dispose();

            if (loadedObject) {
                scene.remove(loadedObject);

                loadedObject.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.geometry.dispose();

                        const materials = Array.isArray(child.material)
                            ? child.material
                            : [child.material];

                        materials.forEach((material) =>
                            material.dispose()
                        );
                    }
                });
            }

            renderer.dispose();

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [modelUrl]);

    return (
        <div
            ref={containerRef}
            className={Styles.container3D}
        >
            {isLoading && (
                <div className={Styles.loadingContainer}>
                    <div className={Styles.spinner}></div>
                    <p className={Styles.loadingText}>
                        Cargando modelo 3D...
                    </p>
                </div>
            )}

            {error && !isLoading && (
                <div className={Styles.loadingContainer}>
                    <p className={Styles.loadingText}>
                        No se pudo cargar el modelo 3D.
                    </p>

                </div>
            )}
            <div className={Styles.controlsHelp}>
                        <div className={Styles.controlItem}>
                            <span className={Styles.controlIcon}>🖱️</span>
                            <span>
                                <strong>Rotar</strong>
                                <small>Click izquierdo + mover</small>
                            </span>
                        </div>

                        <div className={Styles.controlItem}>
                            <span className={Styles.controlIcon}>↕</span>
                            <span>
                                <strong>Zoom</strong>
                                <small>Rueda del mouse</small>
                            </span>
                        </div>

                        <div className={Styles.controlItem}>
                            <span className={Styles.controlIcon}>👆</span>
                            <span>
                                <strong>Táctil</strong>
                                <small>Arrastrá o pellizcá</small>
                            </span>
                        </div>
                    </div>
        </div>
    );
};

export default Product3D;
