import * as THREE from "three";
import { PENDANT } from "./pendant-design";

// Hero photography rig. These cards are reflected light sources, never visible
// scene objects. Feathered edges keep the reflections soft around the shoulders.
export function photographicStudio() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setScalar(0.16);
  const cards: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
  const maps: THREE.DataTexture[] = [];
  const card = (
    width: number,
    height: number,
    position: [number, number, number],
    intensity: number,
  ) => {
    const size = 64;
    const pixels = new Uint16Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const edge = Math.min(x, y, size - 1 - x, size - 1 - y) / 12;
        const feather = THREE.MathUtils.smoothstep(edge, 0, 1);
        const value = THREE.MathUtils.lerp(0.16, intensity, feather);
        const offset = (y * size + x) * 4;
        pixels[offset] =
          pixels[offset + 1] =
          pixels[offset + 2] =
            THREE.DataUtils.toHalfFloat(value);
        pixels[offset + 3] = THREE.DataUtils.toHalfFloat(1);
      }
    }
    const map = new THREE.DataTexture(
      pixels,
      size,
      size,
      THREE.RGBAFormat,
      THREE.HalfFloatType,
    );
    map.magFilter = map.minFilter = THREE.LinearFilter;
    map.needsUpdate = true;
    maps.push(map);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map, toneMapped: false }),
    );
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    cards.push(mesh);
    scene.add(mesh);
  };
  card(3.5, 7, [-3.8, 2, 5], 5);
  card(5, 6, [4, 1, 4], 0.7);
  card(8, 5, [0, 5, 1], 1.4);
  card(3, 5, [4, -1, 1], 0.035);
  card(8, 3, [0, -4, 3], 0.1);
  card(4, 6, [-1, 1, -4], 1.5);
  return {
    scene,
    dispose() {
      cards.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      maps.forEach((map) => map.dispose());
    },
  };
}

// Fine photographic variation in reflectance complements the height and roughness
// channels. It is scalar, so the reference texture cannot recolor the metal.
export function photographicBrushing(material: THREE.MeshPhysicalMaterial) {
  material.onBeforeCompile = (shader) => {
    // Wrap the brushing around the depth of the enclosure. Front projection
    // alone compresses into fingerprint-like ridges when the side turns toward us.
    shader.vertexShader = shader.vertexShader.replace(
      "#include <uv_vertex>",
      `#include <uv_vertex>
      vec2 wrappedBrushUv = vec2(atan(position.x, max(position.z, 0.000001)) / 3.14159265 + 0.5, position.y / ${PENDANT.height.toFixed(6)} + 0.5);
      #ifdef USE_ROUGHNESSMAP
        vRoughnessMapUv = (roughnessMapTransform * vec3(wrappedBrushUv, 1.0)).xy;
      #endif
      #ifdef USE_BUMPMAP
        vBumpMapUv = (bumpMapTransform * vec3(wrappedBrushUv, 1.0)).xy;
      #endif`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>
      #ifdef USE_ROUGHNESSMAP
        float brushing = texture2D(roughnessMap, vRoughnessMapUv).g;
        diffuseColor.rgb *= clamp(0.2 + brushing * 1.25, 0.7, 1.22);
      #endif`,
    );
  };
  material.customProgramCacheKey = () => "anticipy-photographic-brushing-v1";
}

// Cut the existing aperture through the front material without moving any
// housing vertices. The rear material remains continuous.
export function recessAperture(material: THREE.MeshPhysicalMaterial) {
  const applySurface = material.onBeforeCompile.bind(material);
  material.onBeforeCompile = (shader, renderer) => {
    applySurface(shader, renderer);
    shader.uniforms.apertureCenter = { value: PENDANT.apertureY };
    shader.uniforms.apertureRadius = { value: PENDANT.apertureRadius };
    shader.vertexShader =
      "varying vec2 vHousingPosition;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvHousingPosition = position.xy;",
    );
    shader.fragmentShader =
      "varying vec2 vHousingPosition;\nuniform float apertureCenter;\nuniform float apertureRadius;\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <clipping_planes_fragment>",
      "#include <clipping_planes_fragment>\nif (length(vHousingPosition - vec2(0.0, apertureCenter)) < apertureRadius) discard;",
    );
  };
  material.customProgramCacheKey = () => "anticipy-recessed-aperture-v1";
}

export function photographicAperture(faceZ: (x: number, y: number) => number) {
  const group = new THREE.Group();
  group.position.y = PENDANT.apertureY;
  const points: number[] = [],
    colors: number[] = [],
    indices: number[] = [];
  const segments = 64;
  // A flush machined lip, shallow bevel, and shadowed inner bore. No raised ring.
  const profile = [
    [1, 0, 0.72],
    [0.96, 0.005, 0.6],
    [0.9, 0.017, 0.36],
    [0.88, 0.075, 0.035],
  ];
  profile.forEach(([radius, depth, shade], ring) => {
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * PENDANT.apertureRadius * radius;
      const y = Math.sin(theta) * PENDANT.apertureRadius * radius;
      points.push(x, y, faceZ(x, y + PENDANT.apertureY) - depth);
      colors.push(shade, shade, shade);
      if (ring < profile.length - 1 && i < segments) {
        const a = ring * (segments + 1) + i,
          b = a + segments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const wall = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0x88857e,
      metalness: 0.85,
      roughness: 0.48,
      vertexColors: true,
      side: THREE.DoubleSide,
    }),
  );
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(PENDANT.apertureRadius * 0.89, segments),
    new THREE.MeshStandardMaterial({
      color: 0x080807,
      metalness: 0,
      roughness: 1,
      envMapIntensity: 0.05,
      side: THREE.DoubleSide,
    }),
  );
  floor.position.z = faceZ(0, PENDANT.apertureY) - 0.078;
  group.add(wall, floor);
  return group;
}
