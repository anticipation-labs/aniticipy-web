import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const clamp = THREE.MathUtils.clamp;
const smooth = (a: number, b: number, p: number) =>
  THREE.MathUtils.smoothstep(p, a, b);

// Proportions are a visual reconstruction from the prototype photographs, not production CAD.
function capsuleShape(width: number, height: number) {
  const r = width / 2,
    straight = height / 2 - r;
  const shape = new THREE.Shape();
  shape.moveTo(-r, -straight);
  shape.lineTo(-r, straight);
  shape.absarc(0, straight, r, Math.PI, 0, true);
  shape.lineTo(r, -straight);
  shape.absarc(0, -straight, r, 0, -Math.PI, true);
  return shape;
}

export function createPendantScene(
  canvas: HTMLCanvasElement,
  mode: "benefits" | "hardware",
) {
  // Preserve the last frame: this renderer sleeps at rest, including during the CSS reveal.
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 50);
  camera.position.set(0, 0, 6.9);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(environment, 0.035);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.9;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xfff8ec, 0x625f59, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffead0, 1.3);
  rim.position.set(4, -2, 2);
  scene.add(rim);

  const product = new THREE.Group();
  scene.add(product);
  const silver = new THREE.MeshStandardMaterial({
    color: 0xa7a69f,
    metalness: 1,
    roughness: 0.31,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const rearSilver = silver.clone();
  const dark = new THREE.MeshStandardMaterial({
    color: 0x252522,
    metalness: 0.55,
    roughness: 0.38,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: 0xbba477,
    metalness: 0.8,
    roughness: 0.3,
  });
  const componentMetal = new THREE.MeshStandardMaterial({
    color: 0xadafac,
    metalness: 0.75,
    roughness: 0.3,
  });
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0x292f2d,
    metalness: 0.2,
    roughness: 0.63,
  });
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x514a40,
    transparent: true,
    opacity: 0,
  });

  const front = new THREE.Group(),
    back = new THREE.Group(),
    board = new THREE.Group();
  product.add(front, back, board);
  // A continuous pillow surface avoids the artificial raised border of a bevelled badge.
  const bodyGeometry = new THREE.BufferGeometry();
  const outline = capsuleShape(1.58, 2.46).getSpacedPoints(160);
  const positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [];
  const segments = 160,
    rings = 32;
  for (let ring = 0; ring <= rings; ring++) {
    const radius = Math.max(0.0001, ring / rings);
    const z = 0.42 * Math.sqrt(Math.max(0, 1 - Math.pow(radius, 8)));
    for (let i = 0; i <= segments; i++) {
      const point = outline[i % segments];
      positions.push(point.x * radius, point.y * radius, z);
      uvs.push(
        (point.x * radius + 0.79) / 1.58,
        (point.y * radius + 1.23) / 2.46,
      );
      if (ring < rings && i < segments) {
        const a = ring * (segments + 1) + i,
          b = a + segments + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  bodyGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  bodyGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  bodyGeometry.setIndex(indices);
  bodyGeometry.computeVertexNormals();
  // Deterministic, very fine longitudinal grain; no external texture or render-time randomness.
  const grainData = new Uint8Array(256 * 256 * 4);
  for (let y = 0; y < 256; y++)
    for (let x = 0; x < 256; x++) {
      const value =
        125 +
        Math.round(
          Math.sin(x * 16.29) * 35 + Math.sin(x * 2.79 + y * 0.07) * 12,
        );
      const offset = (y * 256 + x) * 4;
      grainData[offset] = grainData[offset + 1] = grainData[offset + 2] = value;
      grainData[offset + 3] = 255;
    }
  const grain = new THREE.DataTexture(grainData, 256, 256);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.repeat.set(4, 1);
  grain.needsUpdate = true;
  silver.bumpMap = rearSilver.bumpMap = grain;
  silver.bumpScale = rearSilver.bumpScale = 0.008;
  const frontMesh = new THREE.Mesh(bodyGeometry, silver);
  frontMesh.position.z = 0.008;
  front.add(frontMesh);
  const backMesh = new THREE.Mesh(bodyGeometry, rearSilver);
  backMesh.rotation.y = Math.PI;
  backMesh.position.z = -0.008;
  back.add(backMesh);

  // The prototype has a plain dark aperture; it is not a lens or a separate metal eyelet.
  const aperture = new THREE.Mesh(
    new THREE.CircleGeometry(0.067, 32),
    new THREE.MeshBasicMaterial({ color: 0x161614, side: THREE.DoubleSide }),
  );
  aperture.position.set(0, 0.65, 0.432);
  front.add(aperture);

  const outlinePoints = capsuleShape(1.57, 2.45)
    .getPoints(100)
    .map((p) => new THREE.Vector3(p.x, p.y, 0));
  const seam = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(outlinePoints),
    new THREE.LineBasicMaterial({
      color: 0x63615c,
      transparent: true,
      opacity: 0.55,
    }),
  );
  product.add(seam);
  const wire = new THREE.Group();
  product.add(wire);
  const frontLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(bodyGeometry, 12),
    edgeMaterial,
  );
  frontLines.position.z = 0.008;
  const backLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(bodyGeometry, 12),
    edgeMaterial,
  );
  backLines.rotation.y = Math.PI;
  backLines.position.z = -0.008;
  wire.add(frontLines, backLines);
  // Sparse construction contours convey the curved shell without a noisy triangulated mesh.
  for (let z = -0.24; z <= 0.24; z += 0.12) {
    const factor = 1 - Math.abs(z) * 0.34;
    const points = capsuleShape(1.55 * factor, 2.43 * factor)
      .getPoints(90)
      .map((p) => new THREE.Vector3(p.x, p.y, z));
    wire.add(
      new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        edgeMaterial,
      ),
    );
  }

  const pcbGeometry = new THREE.ExtrudeGeometry(capsuleShape(1.17, 2.1), {
    depth: 0.045,
    bevelEnabled: false,
    curveSegments: 24,
  });
  const pcb = new THREE.Mesh(pcbGeometry, boardMaterial);
  pcb.position.z = -0.035;
  board.add(pcb);
  const chip = (
    x: number,
    y: number,
    w: number,
    h: number,
    d: number,
    material: THREE.Material,
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, 0.04 + d / 2);
    board.add(mesh);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({
        color: 0x79746a,
        transparent: true,
        opacity: 0.35,
      }),
    );
    mesh.add(edges);
    return mesh;
  };
  // Conceptual layout based on the supplied elongated PCB: microphone, processor, shield and radio.
  chip(0, 0.67, 0.69, 0.35, 0.12, componentMetal);
  chip(-0.09, 0.17, 0.4, 0.39, 0.09, dark);
  chip(0.08, -0.3, 0.56, 0.43, 0.09, componentMetal);
  chip(0.02, -0.79, 0.62, 0.34, 0.12, componentMetal);
  for (let i = 0; i < 16; i++) {
    const side = i % 2 ? 1 : -1;
    const y = 0.78 - Math.floor(i / 2) * 0.22;
    chip(side * 0.43, y, 0.065, 0.095, 0.05, i % 3 ? componentMetal : dark);
  }
  for (let i = 0; i < 28; i++) {
    const side = i % 2 ? 1 : -1,
      y = 0.92 - Math.floor(i / 2) * 0.145;
    const x = side * (0.16 + (i % 4) * 0.04);
    const points = [
      new THREE.Vector3(x, y, 0.016),
      new THREE.Vector3(side * 0.35, y, 0.016),
      new THREE.Vector3(side * 0.5, y - 0.13, 0.016),
    ];
    board.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: 0x998970,
          transparent: true,
          opacity: 0.65,
        }),
      ),
    );
  }
  const pins = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.035, 0.022, 0.018),
    gold,
    28,
  );
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 28; i++) {
    dummy.position.set(
      i % 2 ? 0.13 : -0.31,
      -0.015 + Math.floor(i / 2) * 0.028,
      0.06,
    );
    dummy.updateMatrix();
    pins.setMatrixAt(i, dummy.matrix);
  }
  board.add(pins);

  // Fine shoulder-attached chain, used only in the everyday product chapter.
  const chain = new THREE.Group();
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.57, 0.99, -0.1),
      new THREE.Vector3(side * 0.85, 1.65, -0.18),
      new THREE.Vector3(side * 1.55, 3.75, -0.35),
    ]);
    const chainMaterial = new THREE.MeshStandardMaterial({
      color: 0xbebdb7,
      metalness: 0.9,
      roughness: 0.27,
    });
    chain.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 50, 0.009, 5, false),
        chainMaterial,
      ),
    );
  }
  chain.visible = mode === "benefits";
  product.add(chain);

  let target = 0,
    current = -1,
    frame = 0,
    visible = false,
    disposed = false;
  function render() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    current = target; // Scroll already supplies a continuous timeline; no lingering idle animation.
    const p = clamp(current, 0, 1);
    if (mode === "benefits") {
      product.rotation.set(
        -0.08 + Math.sin(p * Math.PI * 2) * 0.24,
        -0.24 + p * Math.PI * 2,
        -0.12 + Math.sin(p * Math.PI) * 0.25,
      );
      product.position.y = -0.13;
      board.visible = false;
    } else {
      const opening = smooth(0.19, 0.39, p) * (1 - smooth(0.78, 0.96, p));
      const xray = smooth(0.43, 0.53, p) * (1 - smooth(0.69, 0.8, p));
      const turn =
        p < 0.4
          ? THREE.MathUtils.lerp(-0.45, 0.8, smooth(0, 0.4, p))
          : p < 0.7
            ? THREE.MathUtils.lerp(0.8, -0.75, smooth(0.4, 0.7, p))
            : THREE.MathUtils.lerp(
                -0.75,
                -Math.PI * 2 - 0.45,
                smooth(0.7, 1, p),
              );
      product.rotation.set(
        -0.04 + opening * 0.25,
        turn,
        -0.18 + opening * 0.23,
      );
      front.position.set(opening * 0.4, opening * 0.36, opening * 1.2);
      back.position.set(-opening * 0.4, -opening * 0.36, -opening * 1.0);
      frontLines.position.set(
        front.position.x,
        front.position.y,
        front.position.z + 0.008,
      );
      backLines.position.set(
        back.position.x,
        back.position.y,
        back.position.z - 0.008,
      );
      silver.opacity = rearSilver.opacity = 1 - xray * 0.94;
      silver.depthWrite = rearSilver.depthWrite = xray < 0.5;
      aperture.visible = xray < 0.65;
      edgeMaterial.opacity = xray * 0.65;
      board.visible = opening > 0.02;
      seam.visible = opening < 0.04;
      product.scale.setScalar(1 - opening * 0.06);
    }
    renderer.render(scene, camera);
  }
  const requestRender = () => {
    if (!frame && visible && !disposed) frame = requestAnimationFrame(render);
  };
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 600 ? 8.7 : camera.aspect < 0.85 ? 8 : 6.9;
    camera.updateProjectionMatrix();
    requestRender();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestRender();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  visibilityObserver.observe(canvas);
  document.addEventListener("visibilitychange", requestRender);
  resize();
  return {
    update(progress: number) {
      if (target !== progress || current < 0) {
        target = progress;
        requestRender();
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", requestRender);
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        const renderable = object as THREE.Mesh;
        if (renderable.geometry) geometries.add(renderable.geometry);
        if (renderable.material)
          (Array.isArray(renderable.material)
            ? renderable.material
            : [renderable.material]
          ).forEach((m) => materials.add(m));
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      grain.dispose();
      env.dispose();
      renderer.dispose();
    },
  };
}
