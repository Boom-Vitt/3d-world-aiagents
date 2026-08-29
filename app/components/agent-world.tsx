'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { WORLD_CONFIG } from '../world-config';
import type { AgentProfile } from './agent-office';

type AgentWorldProps = {
  agents: AgentProfile[];
  selectedId: string | null;
  paused: boolean;
  onSelect: (id: string) => void;
  onTogglePause: () => void;
};

function createAgent(color: string) {
  const agent = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color, roughness: 0.28, metalness: 0.36 });
  const dark = new THREE.MeshStandardMaterial({ color: '#071017', roughness: 0.5, metalness: 0.25 });
  const glow = new THREE.MeshStandardMaterial({
    color: '#dffff6',
    emissive: color,
    emissiveIntensity: 1.6,
  });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.48, 6, 10), suit);
  torso.position.y = 0.92;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 12), dark);
  head.position.y = 1.55;
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.07), glow);
  visor.position.set(0, 1.57, 0.205);

  const limbGeometry = new THREE.CapsuleGeometry(0.075, 0.34, 4, 7);
  const leftLeg = new THREE.Mesh(limbGeometry, dark);
  leftLeg.position.set(-0.14, 0.3, 0);
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.14;
  const leftArm = new THREE.Mesh(limbGeometry, suit);
  leftArm.position.set(-0.38, 0.95, 0);
  leftArm.rotation.z = -0.15;
  const rightArm = leftArm.clone();
  rightArm.position.x = 0.38;
  rightArm.rotation.z = 0.15;

  const selection = new THREE.Mesh(
    new THREE.RingGeometry(0.42, 0.52, 28),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.82, side: THREE.DoubleSide }),
  );
  selection.rotation.x = -Math.PI / 2;
  selection.position.y = 0.015;
  selection.visible = false;

  agent.add(torso, head, visor, leftLeg, rightLeg, leftArm, rightArm, selection);
  agent.userData = { leftLeg, rightLeg, leftArm, rightArm, selection };
  return agent;
}

function addOffice(scene: THREE.Scene) {
  const deskMaterial = new THREE.MeshStandardMaterial({ color: '#17313f', roughness: 0.5, metalness: 0.38 });
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: WORLD_CONFIG.colors.primary,
    emissive: WORLD_CONFIG.colors.primary,
    emissiveIntensity: 1.25,
    roughness: 0.24,
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#72ddce',
    transparent: true,
    opacity: 0.12,
    roughness: 0.1,
    metalness: 0.05,
    transmission: 0.45,
    depthWrite: false,
  });

  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2;
    const pod = new THREE.Group();
    pod.position.set(Math.cos(angle) * 7.15, 0, Math.sin(angle) * 7.15);
    pod.rotation.y = -angle + Math.PI / 2;

    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.12, 0.62), deskMaterial);
    desk.position.y = 0.72;
    const legA = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.7, 0.09), deskMaterial);
    legA.position.set(-0.54, 0.35, 0);
    const legB = legA.clone();
    legB.position.x = 0.54;
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.4, 0.04), screenMaterial);
    screen.position.set(0, 1.05, -0.11);
    screen.rotation.x = -0.08;
    const partition = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.58, 0.035), glassMaterial);
    partition.position.set(0, 0.78, -0.48);
    pod.add(desk, legA, legB, screen, partition);
    scene.add(pod);
  }

  const laneMaterial = new THREE.MeshBasicMaterial({
    color: WORLD_CONFIG.colors.secondary,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
  });
  [3.15, 5.05, 7.9].forEach((radius) => {
    const lane = new THREE.Mesh(new THREE.RingGeometry(radius - 0.018, radius + 0.018, 96), laneMaterial);
    lane.rotation.x = -Math.PI / 2;
    lane.position.y = -0.038;
    scene.add(lane);
  });
}

export function AgentWorld({
  agents,
  selectedId,
  paused,
  onSelect,
  onTogglePause,
}: AgentWorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelsRef = useRef(new Map<string, THREE.Group>());
  const selectedIdRef = useRef(selectedId);
  const pausedRef = useRef(paused);
  const onSelectRef = useRef(onSelect);
  const [unsupported, setUnsupported] = useState(false);

  selectedIdRef.current = selectedId;
  pausedRef.current = paused;
  onSelectRef.current = onSelect;

  useEffect(() => {
    const model = selectedId ? modelsRef.current.get(selectedId) : null;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!model || !controls || !camera) return;

    const target = model.position.clone();
    target.y = 0.85;
    const direction = camera.position.clone().sub(controls.target).normalize();
    controls.target.copy(target);
    camera.position.copy(target.clone().add(direction.multiplyScalar(8.4)).add(new THREE.Vector3(0, 1.8, 0)));
  }, [selectedId]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setUnsupported(true);
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(WORLD_CONFIG.colors.background);
    scene.fog = new THREE.FogExp2(WORLD_CONFIG.colors.background, 0.027);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 120);
    camera.position.set(12, 10, 14);
    cameraRef.current = camera;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 6.5;
    controls.maxDistance = 28;
    controls.maxPolarAngle = Math.PI * 0.46;
    controls.target.set(0, 0.8, 0);
    controls.keyPanSpeed = 18;
    controls.listenToKeyEvents(mount);
    controls.saveState();
    controlsRef.current = controls;

    scene.add(new THREE.HemisphereLight('#c9fff2', '#07111a', 2.5));
    const key = new THREE.DirectionalLight('#e4fff8', 4.6);
    key.position.set(6, 12, 8);
    scene.add(key);
    const violet = new THREE.PointLight(WORLD_CONFIG.colors.secondary, 42, 18, 2);
    violet.position.set(-4, 4, -2);
    scene.add(violet);
    const amber = new THREE.PointLight(WORLD_CONFIG.colors.accent, 28, 15, 2);
    amber.position.set(5, 2.8, 5);
    scene.add(amber);

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(10.5, 10.5, 0.34, 64),
      new THREE.MeshStandardMaterial({ color: WORLD_CONFIG.colors.floor, roughness: 0.76, metalness: 0.18 }),
    );
    floor.position.y = -0.24;
    scene.add(floor);

    const grid = new THREE.GridHelper(19, 24, WORLD_CONFIG.colors.primary, '#173545');
    grid.position.y = -0.05;
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.2;
    });
    scene.add(grid);
    addOffice(scene);

    const core = new THREE.Group();
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: WORLD_CONFIG.colors.primary,
      emissive: WORLD_CONFIG.colors.primary,
      emissiveIntensity: 1.8,
      metalness: 0.78,
      roughness: 0.2,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.12, 12, 52), coreMaterial);
    ring.rotation.x = Math.PI / 2;
    const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.045, 8, 42), coreMaterial);
    ringTwo.rotation.z = Math.PI / 2;
    ringTwo.position.y = 1.42;
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 2), coreMaterial);
    orb.position.y = 1.45;
    core.add(ring, ringTwo, orb);
    core.position.y = 0.18;
    scene.add(core);

    const palette = [WORLD_CONFIG.colors.primary, WORLD_CONFIG.colors.secondary, WORLD_CONFIG.colors.accent, '#4ed6ff'];
    const modelMap = new Map<string, THREE.Group>();
    const models = agents.map((agent, index) => {
      const model = createAgent(palette[index % palette.length]);
      const radius = 3.2 + (index % 3) * 1.45;
      const angle = (index / Math.max(agents.length, 1)) * Math.PI * 2 + (index % 3) * 0.42;
      const baseX = Math.cos(angle) * radius;
      const baseZ = Math.sin(angle) * radius;
      model.position.set(baseX, 0, baseZ);
      model.rotation.y = -angle + Math.PI / 2;
      Object.assign(model.userData, {
        agentId: agent.id,
        phase: index * 0.73,
        baseX,
        baseZ,
        walkRadius: 0.22 + (index % 4) * 0.055,
        walkSpeed: 0.18 + (index % 5) * 0.025,
      });
      scene.add(model);
      modelMap.set(agent.id, model);
      return model;
    });
    modelsRef.current = modelMap;

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let downX = 0;
    let downY = 0;
    const handlePointerDown = (event: PointerEvent) => {
      downX = event.clientX;
      downY = event.clientY;
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - downX, event.clientY - downY) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(models, true)[0]?.object;
      let candidate: THREE.Object3D | null = hit ?? null;
      while (candidate && !candidate.userData.agentId) candidate = candidate.parent;
      if (candidate?.userData.agentId) onSelectRef.current(candidate.userData.agentId);
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startedAt = performance.now();
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (document.hidden) return;
      const elapsed = (performance.now() - startedAt) / 1000;

      if (!reducedMotion && !pausedRef.current) {
        core.rotation.y = elapsed * 0.34;
        ringTwo.rotation.y = elapsed * 0.46;
        orb.rotation.x = elapsed * 0.2;
        models.forEach((model) => {
          const theta = elapsed * model.userData.walkSpeed + model.userData.phase;
          model.position.x = model.userData.baseX + Math.cos(theta) * model.userData.walkRadius;
          model.position.z = model.userData.baseZ + Math.sin(theta) * model.userData.walkRadius;
          model.position.y = Math.sin(elapsed * 3.6 + model.userData.phase) * 0.025;
          model.rotation.y = -theta;
          const stride = Math.sin(elapsed * 6.2 + model.userData.phase) * 0.45;
          model.userData.leftLeg.rotation.x = stride;
          model.userData.rightLeg.rotation.x = -stride;
          model.userData.leftArm.rotation.x = -stride * 0.66;
          model.userData.rightArm.rotation.x = stride * 0.66;
        });
      }

      models.forEach((model) => {
        const selected = model.userData.agentId === selectedIdRef.current;
        model.userData.selection.visible = selected;
        const targetScale = selected ? 1.14 : 1;
        model.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), reducedMotion ? 1 : 0.12);
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.stopListenToKeyEvents();
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      controlsRef.current = null;
      cameraRef.current = null;
      modelsRef.current = new Map();
    };
  }, [agents]);

  const resetView = () => controlsRef.current?.reset();

  if (unsupported) {
    return (
      <div className="world-fallback" role="img" aria-label={`แผนผังออฟฟิศของเอเจนต์ ${agents.length} ตัว`}>
        {agents.slice(0, 12).map((agent) => <span key={agent.id}>{agent.name.slice(0, 2)}</span>)}
      </div>
    );
  }

  return (
    <div className="world-shell">
      <div
        ref={mountRef}
        className="world-canvas"
        role="application"
        aria-label="โลกออฟฟิศสามมิติ ใช้เมาส์หรือนิ้วลากเพื่อหมุน ใช้ลูกศรเพื่อเลื่อน และแตะตัวละครเพื่อเลือก"
        tabIndex={0}
      />
      <div className="world-controls">
        <button type="button" onClick={onTogglePause}>{paused ? 'เล่นต่อ' : 'หยุดการเดิน'}</button>
        <button type="button" onClick={resetView}>กลับมุมมองกลาง</button>
      </div>
      <p className="world-help">ลากเพื่อหมุน · เลื่อนเพื่อซูม · แตะตัวละครเพื่อดูข้อมูล</p>
    </div>
  );
}
