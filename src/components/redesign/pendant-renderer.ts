import * as THREE from "three";
import { PENDANT, FINISHES, type PendantFinish } from "./pendant-design";
import {
  photographicStudio,
  photographicAperture,
  recessAperture,
  photographicBrushing,
} from "./pendant-photoreal";

const clamp = THREE.MathUtils.clamp;
const smooth = (a: number, b: number, p: number) =>
  THREE.MathUtils.smoothstep(p, a, b);

// Visual reconstruction from the approved photographs, not production CAD.
// A slightly narrower crown and fuller base preserve the photographic silhouette.
function capsuleShape(width: number, height: number) {
  const top = width * 0.485,
    bottom = width * 0.5;
  const shoulder = height * 0.2,
    cap = height * 0.3,
    k = 0.5522848;
  const shape = new THREE.Shape();
  // Start at the crown so equal-distance sampling is exactly mirror-symmetric.
  shape.moveTo(0, height / 2);
  shape.bezierCurveTo(
    top * k,
    height / 2,
    top,
    shoulder + cap * k,
    top,
    shoulder,
  );
  shape.lineTo(bottom, -shoulder);
  shape.bezierCurveTo(
    bottom,
    -shoulder - cap * k,
    bottom * k,
    -height / 2,
    0,
    -height / 2,
  );
  shape.bezierCurveTo(
    -bottom * k,
    -height / 2,
    -bottom,
    -shoulder - cap * k,
    -bottom,
    -shoulder,
  );
  shape.lineTo(-top, shoulder);
  shape.bezierCurveTo(
    -top,
    shoulder + cap * k,
    -top * k,
    height / 2,
    0,
    height / 2,
  );
  return shape;
}

export function createPendantScene(
  canvas: HTMLCanvasElement,
  mode: "benefits" | "hardware" | "hero",
  onFirstRender?: () => void,
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
  renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 50);
  camera.position.set(0, 0, 6.9);
  // Broad studio reflections reveal brushed metal without the old glossy light streaks.
  const studio = new THREE.Scene();
  studio.background = new THREE.Color(0x737373);
  const lightCards: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] =
    [];
  const softbox = (
    width: number,
    height: number,
    position: [number, number, number],
    intensity: number,
  ) => {
    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color().setScalar(intensity),
      }),
    );
    card.position.set(...position);
    card.lookAt(0, 0, 0);
    studio.add(card);
    lightCards.push(card);
  };
  softbox(2.2, 5.8, [-3, 1.5, 4], 4);
  softbox(3, 5, [3, 0, 3], 0.7);
  softbox(4, 0.6, [0, 4, 1], 1.2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const photoStudio = mode === "hero" ? photographicStudio() : null;
  const env = pmrem.fromScene(photoStudio?.scene ?? studio, 0.02);
  photoStudio?.dispose();
  scene.environment = env.texture;
  scene.environmentIntensity = 1.1;
  lightCards.forEach((card) => {
    card.geometry.dispose();
    card.material.dispose();
  });
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 0.1));
  const key = new THREE.DirectionalLight(0xffffff, 0.5);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.15);
  rim.position.set(4, -2, 2);
  scene.add(rim);

  const product = new THREE.Group();
  scene.add(product);
  const silver = new THREE.MeshPhysicalMaterial({
    color: 0xa7a69f,
    metalness: 1,
    roughness: 1,
    anisotropy: 0.3,
    clearcoat: 0,
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
  // The photographs show a broad caplet face with full upper/lower shoulders.
  // Preserve that front perimeter while controlling longitudinal and transverse
  // curvature separately; shrinking the complete contour through depth creates a lens.
  const bodyGeometry = new THREE.BufferGeometry();
  const segments = 192,
    rings = 120;
  const outline = capsuleShape(PENDANT.width, PENDANT.height).getSpacedPoints(
    segments,
  );
  const outward = outline.map((_, i) => {
    const prev = outline[(i + segments - 1) % segments],
      next = outline[(i + 1) % segments];
    return new THREE.Vector2(prev.y - next.y, next.x - prev.x).normalize();
  });
  const widthAtY = (y: number) => {
    let halfWidth = 0;
    for (let i = 0; i < segments; i++) {
      const a = outline[i],
        b = outline[i + 1];
      if (y < Math.min(a.y, b.y) || y > Math.max(a.y, b.y)) continue;
      const span = b.y - a.y;
      if (Math.abs(span) < 1e-10) {
        halfWidth = Math.max(halfWidth, Math.abs(a.x), Math.abs(b.x));
      } else {
        halfWidth = Math.max(
          halfWidth,
          Math.abs(a.x + ((b.x - a.x) * (y - a.y)) / span),
        );
      }
    }
    return halfWidth;
  };
  const faceZ = (x: number, y: number) => {
    const halfWidth = widthAtY(y);
    if (halfWidth < 1e-8) return 0;
    const across = clamp(Math.abs(x) / halfWidth, 0, 1);
    const along = clamp(Math.abs(y) / (PENDANT.height / 2), 0, 1);
    return (
      PENDANT.halfDepth *
      Math.sqrt(
        (1 - Math.pow(along, PENDANT.shoulderPower)) *
          (1 - Math.pow(across, PENDANT.facePower)),
      )
    );
  };
  const positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [];
  const crossSections: THREE.Vector3[][] = [];
  for (let ring = 0; ring <= rings; ring++) {
    const section: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = ((ring / rings) * Math.PI) / 2;
      const radius = Math.sin(theta);
      const point = outline[i].clone().multiplyScalar(radius);
      const z = ring === rings ? 0 : faceZ(point.x, point.y);
      positions.push(point.x, point.y, z);
      uvs.push(
        (point.x + PENDANT.width / 2) / PENDANT.width,
        (point.y + PENDANT.height / 2) / PENDANT.height,
      );
      section.push(new THREE.Vector3(point.x, point.y, z));
      if (ring < rings && i < segments) {
        const a = ring * (segments + 1) + i,
          b = a + segments + 1;
        // The crown is one point: use a triangle fan, not zero-area triangles.
        if (ring > 0) indices.push(a, a + 1, b);
        indices.push(b, a + 1, b + 1);
      }
    }
    crossSections.push(section);
  }
  bodyGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  bodyGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  bodyGeometry.setIndex(indices);
  bodyGeometry.computeVertexNormals();
  const normals = bodyGeometry.getAttribute("normal");
  // Match both shell normals at the closed join and across the contour's UV wrap.
  for (let i = 0; i <= segments; i++) normals.setXYZ(i, 0, 0, 1);
  for (let i = 0; i <= segments; i++) {
    normals.setXYZ(rings * (segments + 1) + i, outward[i].x, outward[i].y, 0);
  }
  for (let ring = 0; ring <= rings; ring++) {
    const a = ring * (segments + 1),
      b = a + segments;
    const n = new THREE.Vector3()
      .fromBufferAttribute(normals, a)
      .add(new THREE.Vector3().fromBufferAttribute(normals, b))
      .normalize();
    normals.setXYZ(a, n.x, n.y, n.z);
    normals.setXYZ(b, n.x, n.y, n.z);
  }
  // Explicit tangents keep the longitudinal metal grain coherent around the rounded sides.
  const tangents: number[] = [];
  for (let i = 0; i < normals.count; i++) {
    const n = new THREE.Vector3().fromBufferAttribute(normals, i);
    const t = new THREE.Vector3(0, 1, 0).cross(n);
    if (t.lengthSq() < 0.0001) t.set(1, 0, 0);
    t.normalize();
    tangents.push(t.x, t.y, t.z, 1);
  }
  bodyGeometry.setAttribute(
    "tangent",
    new THREE.Float32BufferAttribute(tangents, 4),
  );

  // Irregular multi-scale longitudinal grain, shared by both finishes. Mipmaps keep it stable in motion.
  const textureSize = 1024;
  const grainData = new Uint8Array(textureSize * textureSize * 4);
  const hash = (x: number, y: number) => {
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const noise = (x: number, y: number) => {
    const ix = Math.floor(x),
      iy = Math.floor(y),
      fx = x - ix,
      fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx),
      sy = fy * fy * (3 - 2 * fy);
    return THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), sx),
      THREE.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), sx),
      sy,
    );
  };
  for (let y = 0; y < textureSize; y++) {
    for (let x = 0; x < textureSize; x++) {
      const strand =
        noise(x * 0.12, y * 0.003) * 0.2 +
        noise(x * 0.58, y * 0.025) * 0.65 +
        hash(x, y) * 0.15;
      const offset = (y * textureSize + x) * 4;
      grainData[offset] = Math.round(80 + strand * 95);
      grainData[offset + 1] = Math.round((0.36 + strand * 0.14) * 255);
      grainData[offset + 2] = 128;
      grainData[offset + 3] = 255;
    }
  }
  const grain = new THREE.DataTexture(grainData, textureSize, textureSize);
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  grain.minFilter = THREE.LinearMipmapLinearFilter;
  grain.magFilter = THREE.LinearFilter;
  grain.generateMipmaps = true;
  grain.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  grain.needsUpdate = true;
  silver.bumpMap = rearSilver.bumpMap = grain;
  silver.roughnessMap = rearSilver.roughnessMap = grain;
  silver.bumpScale = rearSilver.bumpScale = 0.0015;
  // The hero uses one photographic scalar texture. No product photos or body
  // geometry are rescaled; technical and everyday renderers retain their material.
  let photoGrain: THREE.Texture | undefined;
  if (mode === "hero") {
    silver.anisotropy = rearSilver.anisotropy = 0.15;
    photoGrain = new THREE.TextureLoader().load(
      "/redesign/hero-titanium-grain.webp",
      (texture) => {
        if (disposed) return;
        for (const material of [
          silver,
          rearSilver,
          twinMaterial,
          twinRearMaterial,
        ]) {
          material.bumpMap = material.roughnessMap = texture;
          material.bumpScale = 0.004;
          material.roughness = 0.8;
          material.needsUpdate = true;
        }
        requestRender();
      },
      undefined,
      () => {
        /* Preserve the existing material if the optional texture fails. */
      },
    );
    photoGrain.wrapS = photoGrain.wrapT = THREE.MirroredRepeatWrapping;
    photoGrain.repeat.set(1, 1);
    photoGrain.anisotropy = Math.min(
      8,
      renderer.capabilities.getMaxAnisotropy(),
    );
    // Scalar data uses no sRGB conversion. Its color never tints either finish.
    photographicBrushing(silver);
    photographicBrushing(rearSilver);
    recessAperture(silver);
  }
  const frontMesh = new THREE.Mesh(bodyGeometry, silver);
  frontMesh.position.z = 0;
  front.add(frontMesh);
  const backMesh = new THREE.Mesh(bodyGeometry, rearSilver);
  backMesh.rotation.y = Math.PI;
  backMesh.position.z = 0;
  back.add(backMesh);

  // The plain aperture follows the curved body. A tessellated surface avoids the clipping
  // a single flat circle would cause on the fuller dome; no raised eyelet is introduced.
  const apertureGeometry = new THREE.BufferGeometry();
  const aperturePoints: number[] = [],
    apertureIndices: number[] = [];
  const apertureRings = 8,
    apertureSegments = 48;
  for (let ring = 0; ring <= apertureRings; ring++) {
    const radius = (PENDANT.apertureRadius * ring) / apertureRings;
    for (let i = 0; i <= apertureSegments; i++) {
      const angle = (i / apertureSegments) * Math.PI * 2;
      const x = Math.cos(angle) * radius,
        y = Math.sin(angle) * radius;
      aperturePoints.push(x, y, faceZ(x, y + PENDANT.apertureY) + 0.001);
      if (ring < apertureRings && i < apertureSegments) {
        const a = ring * (apertureSegments + 1) + i,
          b = a + apertureSegments + 1;
        if (ring > 0) apertureIndices.push(a, b, a + 1);
        apertureIndices.push(b, b + 1, a + 1);
      }
    }
  }
  apertureGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(aperturePoints, 3),
  );
  apertureGeometry.setIndex(apertureIndices);
  const aperture =
    mode === "hero"
      ? photographicAperture(faceZ)
      : new THREE.Mesh(
          apertureGeometry,
          new THREE.MeshBasicMaterial({
            color: 0x161614,
            side: THREE.DoubleSide,
          }),
        );
  if (mode === "hero") apertureGeometry.dispose();
  aperture.position.y = PENDANT.apertureY;
  front.add(aperture);

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
  // Construction contours follow the same continuous volume as the visible housing.
  for (const ring of [
    Math.round(rings * 0.5),
    Math.round(rings * 0.75),
    rings,
  ]) {
    for (const side of ring === rings ? [1] : [-1, 1]) {
      const points = crossSections[ring]
        .slice(0, segments)
        .map((p) => new THREE.Vector3(p.x, p.y, p.z * side));
      wire.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(points),
          edgeMaterial,
        ),
      );
    }
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
    const depth = d * 0.58;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth), material);
    mesh.position.set(x, y, 0.02 + depth / 2);
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
      new THREE.Vector3(x, y, 0.012),
      new THREE.Vector3(side * 0.35, y, 0.012),
      new THREE.Vector3(side * 0.5, y - 0.13, 0.012),
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
      0.025,
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

  // Intro contours are sampled from the exact housing perimeter, sharing its camera.
  // These are only visible in the hero; the technical chapter keeps its original timeline.
  const drawing = new THREE.Group();
  product.add(drawing);
  const drawingMaterial = new THREE.LineBasicMaterial({
    color: 0x9a825a,
    transparent: true,
    opacity: 1,
    depthTest: false,
  });
  const contours: THREE.Line[] = [];
  if (mode === "hero") {
    for (const scale of [1, 1.085]) {
      const points = outline.map(
        (point) => new THREE.Vector3(point.x * scale, point.y * scale, 0),
      );
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        drawingMaterial,
      );
      line.renderOrder = 5;
      drawing.add(line);
      contours.push(line);
    }
    const marks: THREE.Vector3[] = [];
    for (const [x, y] of [
      [0, (PENDANT.height / 2) * 1.085],
      [0, (-PENDANT.height / 2) * 1.085],
      [(-PENDANT.width / 2) * 1.085, 0],
      [(PENDANT.width / 2) * 1.085, 0],
    ]) {
      marks.push(
        new THREE.Vector3(x - 0.035, y, 0),
        new THREE.Vector3(x + 0.035, y, 0),
        new THREE.Vector3(x, y - 0.035, 0),
        new THREE.Vector3(x, y + 0.035, 0),
      );
    }
    drawing.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(marks),
        drawingMaterial,
      ),
    );
    const micPoints = Array.from({ length: 65 }, (_, i) => {
      const x = Math.cos((i / 64) * Math.PI * 2) * PENDANT.apertureRadius;
      const y =
        PENDANT.apertureY +
        Math.sin((i / 64) * Math.PI * 2) * PENDANT.apertureRadius;
      return new THREE.Vector3(x, y, faceZ(x, y) + 0.001);
    });
    const micLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(micPoints),
      drawingMaterial,
    );
    drawing.add(micLine);
    contours.push(micLine);
  }
  drawing.visible = false;
  const heroTwin = new THREE.Group();
  const twinMaterial = silver.clone();
  const twinRearMaterial = rearSilver.clone();
  if (mode === "hero") {
    photographicBrushing(twinMaterial);
    photographicBrushing(twinRearMaterial);
    recessAperture(twinMaterial);
    const face = new THREE.Mesh(bodyGeometry, twinMaterial);
    const rear = new THREE.Mesh(bodyGeometry, twinRearMaterial);
    rear.rotation.y = Math.PI;
    const mic = aperture.clone();
    heroTwin.add(face, rear, mic);
    scene.add(heroTwin);
    heroTwin.visible = false;
  }
  let heroIntro = 0,
    heroPointer = 0,
    heroCompact = false,
    heroFinish: PendantFinish = "silver";
  let firstRender = true;
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
    } else if (mode === "hero") {
      const toCenter = smooth(0.05, 0.23, p);
      const toBox = smooth(0.57, 0.81, p);
      const turn = smooth(0.2, 0.57, p);
      const arrive = smooth(0.82, 1, heroIntro);
      const fill = smooth(0.4, 0.72, heroIntro);
      const mobile = heroCompact;
      const halfViewHeight =
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      product.position.set(
        mobile
          ? 0
          : halfViewHeight *
              camera.aspect *
              (0.47 * (1 - toCenter) + 0.22 * toBox),
        mobile ? 0 : -0.01 + toBox * 0.22,
        0,
      );
      product.rotation.set(
        -0.055 * arrive + Math.sin(turn * Math.PI) * 0.18 - toBox * 0.16,
        -0.28 * arrive + turn * Math.PI * 2 + heroPointer * 0.12 * arrive,
        -0.085 * arrive + toBox * 0.22,
      );
      product.scale.setScalar(
        (mobile ? 1.13 : 0.86) *
          (0.25 + 0.75 * smooth(0, 0.3, heroIntro)) *
          (1 + toCenter * 0.3 - toBox * 0.55),
      );
      board.visible = wire.visible = chain.visible = false;
      front.position.set(0, 0, 0);
      back.position.set(0, 0, 0);
      silver.opacity = rearSilver.opacity = fill;
      silver.depthWrite = rearSilver.depthWrite = fill > 0.95;
      frontMesh.visible = backMesh.visible = fill > 0.001;
      aperture.visible = fill > 0.72;
      const from = new THREE.Color(FINISHES[heroFinish].color);
      const to = new THREE.Color(
        FINISHES[heroFinish === "silver" ? "gold" : "silver"].color,
      );
      from.lerp(to, smooth(0.36, 0.44, p) * (1 - smooth(0.6, 0.76, p)));
      silver.color.copy(from);
      rearSilver.color.copy(silver.color);
      heroTwin.visible = p > 0.64;
      const twinReveal = smooth(0.64, 0.82, p);
      heroTwin.position.set(
        halfViewHeight * camera.aspect * 0.62,
        -0.16 - (1 - twinReveal) * 0.7,
        -0.06,
      );
      heroTwin.rotation.set(-0.055, -0.32, 0.07);
      heroTwin.scale.setScalar(0.86 * 0.75 * (0.8 + twinReveal * 0.2));
      twinMaterial.color.setHex(
        FINISHES[heroFinish === "silver" ? "gold" : "silver"].color,
      );
      twinRearMaterial.color.copy(twinMaterial.color);
      twinMaterial.opacity = twinRearMaterial.opacity = twinReveal;
      twinMaterial.depthWrite = twinRearMaterial.depthWrite = twinReveal > 0.95;
      drawing.visible = heroIntro < 0.82;
      drawingMaterial.opacity = 1 - smooth(0.61, 0.82, heroIntro);
      for (let i = 0; i < contours.length; i++) {
        const geometry = contours[i].geometry;
        geometry.setDrawRange(
          0,
          Math.ceil(
            geometry.getAttribute("position").count *
              smooth(
                i === 2 ? 0.3 : i * 0.04,
                i === 2 ? 0.5 : 0.45 + i * 0.04,
                heroIntro,
              ),
          ),
        );
      }
    } else {
      const xray = smooth(0.2, 0.35, p) * (1 - smooth(0.66, 0.745, p));
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
      product.rotation.set(-0.04 + xray * 0.18, turn, -0.18 + xray * 0.16);
      // Only the technical chapter opens. Both shells return to the identical closed geometry.
      const open = smooth(0.18, 0.34, p) * (1 - smooth(0.48, 0.65, p));
      front.position.set(open * 0.75, open * 0.1, open * 0.85);
      back.position.set(-open * 0.75, -open * 0.1, -open * 0.85);
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
      silver.opacity = rearSilver.opacity = 1 - xray * 0.88 * (1 - open * 0.92);
      silver.depthWrite = rearSilver.depthWrite = xray < 0.5;
      aperture.visible = xray < 0.65;
      edgeMaterial.opacity = xray * 0.65;
      wire.visible = xray > 0.005;
      board.visible = xray > 0.02;
      product.scale.setScalar(1 - open * 0.14);
    }
    renderer.render(scene, camera);
    // The hero's zero-time canvas is empty. Keep its inline contour until the
    // first visible stroke (or the selected reduced-motion frame) is drawn.
    if (
      firstRender &&
      (mode !== "hero" || contours[0].geometry.drawRange.count >= 2)
    ) {
      firstRender = false;
      onFirstRender?.();
    }
  }
  const requestRender = () => {
    if (!frame && visible && !disposed) frame = requestAnimationFrame(render);
  };
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z =
      mode === "hero"
        ? 6.9
        : width < 600
          ? 8.7
          : camera.aspect < 0.85
            ? 8
            : 6.9;
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
    setHeroFrame(
      progress: number,
      intro: number,
      finish: PendantFinish,
      pointer = 0,
      compact = false,
    ) {
      target = progress;
      heroIntro = intro;
      heroFinish = finish;
      heroPointer = pointer;
      heroCompact = compact;
      requestRender();
    },
    setFinish(finish: PendantFinish) {
      silver.color.setHex(FINISHES[finish].color);
      rearSilver.color.setHex(FINISHES[finish].color);
      chain.children.forEach((object) => {
        (
          (object as THREE.Mesh).material as THREE.MeshStandardMaterial
        ).color.setHex(FINISHES[finish].chain);
      });
      requestRender();
    },
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
      materials.add(drawingMaterial);
      materials.add(twinMaterial);
      materials.add(twinRearMaterial);
      materials.forEach((m) => m.dispose());
      grain.dispose();
      photoGrain?.dispose();
      env.dispose();
      renderer.dispose();
    },
  };
}
