import { Asset } from "expo-asset";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";

const DEFAULT_AVATAR_MODEL = require("../../assets/models/avatar.glb");
const SHORT_HAIR_MODEL = require("../../assets/models/avatar/hair/hair_short.glb");

type AvatarHairPreviewProps = {
  hairStyle: string;
  hairColor?: string;
  size?: number;
};

function getThreeModules() {
  try {
    const ExpoThree = require("expo-three");
    return {
      GLView: require("expo-gl").GLView,
      GLTFLoader: require("three-stdlib").GLTFLoader,
      Renderer: ExpoThree.Renderer,
      THREE: require("three"),
    };
  } catch {
    return null;
  }
}

function getWebThreeModules() {
  try {
    return {
      GLTFLoader: require("three-stdlib/loaders/GLTFLoader").GLTFLoader,
      THREE: require("three"),
    };
  } catch {
    return null;
  }
}

async function getAssetUri(assetModule: number) {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  return asset.localUri || asset.uri;
}

function base64ToArrayBuffer(base64: string) {
  const lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const cleanBase64 = base64.replace(/=+$/, "");
  const bytes: number[] = [];
  const getValue = (char: string | undefined) => {
    if (!char) return 0;
    const v = lookup.indexOf(char);
    return v >= 0 ? v : 0;
  };
  for (let i = 0; i < cleanBase64.length; i += 4) {
    const chunk =
      (getValue(cleanBase64[i]) << 18) |
      (getValue(cleanBase64[i + 1]) << 12) |
      (getValue(cleanBase64[i + 2]) << 6) |
      getValue(cleanBase64[i + 3]);
    bytes.push((chunk >> 16) & 255);
    if (i + 2 < cleanBase64.length) bytes.push((chunk >> 8) & 255);
    if (i + 3 < cleanBase64.length) bytes.push(chunk & 255);
  }
  return new Uint8Array(bytes).buffer;
}

async function loadGltfForNative(GLTFLoader: any, assetModule: number) {
  const modelUri = await getAssetUri(assetModule);
  const FileSystem = require("expo-file-system/legacy");
  const base64 = await FileSystem.readAsStringAsync(modelUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const buffer = base64ToArrayBuffer(base64);
  return new Promise<any>((resolve, reject) => {
    new GLTFLoader().parse(buffer, "", resolve, reject);
  });
}

function cloneMaterialWithColor(material: any, color: string, THREE: any) {
  if (!material?.clone) return material;
  const cloned = material.clone();
  if (cloned.color) {
    try {
      cloned.color.copy(new THREE.Color(color));
    } catch {
      return material;
    }
  }
  return cloned;
}

function applyColorToModel(model: any, color: string, THREE: any) {
  model.traverse((object: any) => {
    if (!object?.isMesh || !object.material) return;
    if (Array.isArray(object.material)) {
      object.material = object.material.map((mat: any) =>
        cloneMaterialWithColor(mat, color, THREE)
      );
    } else {
      object.material = cloneMaterialWithColor(object.material, color, THREE);
    }
  });
}

function hideNonHairObjects(model: any) {
  const isHair = (name: string | undefined) =>
    String(name || "").toLowerCase().includes("hair");
  model.traverse((object: any) => {
    if (!object.isMesh) return;
    const byName = isHair(object.name);
    const byMaterial = Array.isArray(object.material)
      ? object.material.some((m: any) => isHair(m?.name))
      : isHair(object.material?.name);
    if (!byName && !byMaterial) {
      object.visible = false;
    }
  });
}

function computeVisibleBoundingBox(model: any, THREE: any) {
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3();
  model.traverse((object: any) => {
    if (object.isMesh && object.visible) {
      bounds.union(new THREE.Box3().setFromObject(object));
    }
  });
  if (bounds.isEmpty()) {
    bounds.setFromObject(model);
  }
  return bounds;
}

function disposeModel(model: any) {
  model.traverse((object: any) => {
    if (object.geometry) object.geometry.dispose();
    const mat = object.material;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else if (mat) mat.dispose();
  });
}

function buildScene(gltfScene: any, hairStyle: string, hairColor: string | undefined, THREE: any) {
  if (hairStyle !== "short") {
    hideNonHairObjects(gltfScene);
  }
  if (hairColor) applyColorToModel(gltfScene, hairColor, THREE);

  const bounds = hairStyle !== "short"
    ? computeVisibleBoundingBox(gltfScene, THREE)
    : new THREE.Box3().setFromObject(gltfScene);

  const sizeVec = new THREE.Vector3();
  const center = new THREE.Vector3();
  bounds.getSize(sizeVec);
  bounds.getCenter(center);

  const maxAxis = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
  const scale = maxAxis > 0 ? 2.0 / maxAxis : 1;

  const group = new THREE.Group();
  gltfScene.position.set(-center.x, -center.y, -center.z);
  group.add(gltfScene);
  group.scale.setScalar(scale);
  return group;
}

export default function AvatarHairPreview({
  hairStyle,
  hairColor,
  size = 100,
}: AvatarHairPreviewProps) {
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);
  const webCanvasContainerRef = useRef<any>(null);
  const threeModules = useMemo(() => getThreeModules(), []);
  const isPreviewSupported = Platform.OS !== "web" && !!threeModules;

  useEffect(() => {
    if (Platform.OS !== "web" && !isPreviewSupported) {
      setLoading(false);
    }
  }, [isPreviewSupported]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    let renderer: any = null;
    let loadedGroup: any = null;
    let disposed = false;

    const render = async () => {
      const container = webCanvasContainerRef.current;
      const mods = getWebThreeModules();
      if (!container || !mods) {
        setLoading(false);
        return;
      }

      const { GLTFLoader, THREE } = mods;

      try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(size, size);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 1.8));
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
        keyLight.position.set(2, 4, 4);
        scene.add(keyLight);

        const assetModule = hairStyle === "short" ? SHORT_HAIR_MODEL : DEFAULT_AVATAR_MODEL;
        const uri = await getAssetUri(assetModule);
        const gltf = await new GLTFLoader().loadAsync(uri);

        if (disposed) {
          disposeModel(gltf.scene);
          return;
        }

        loadedGroup = buildScene(gltf.scene, hairStyle, hairColor, THREE);
        scene.add(loadedGroup);

        camera.position.set(0, 0, 3);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);

        if (!disposed) setLoading(false);
      } catch {
        if (!disposed) setLoading(false);
      }
    };

    render();

    return () => {
      disposed = true;
      if (loadedGroup) disposeModel(loadedGroup);
      if (renderer) {
        renderer.dispose();
        const container = webCanvasContainerRef.current;
        if (container && renderer.domElement?.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [hairStyle, hairColor, size]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleContextCreate = useCallback(
    async (gl: any) => {
      if (!isPreviewSupported || !threeModules) {
        setLoading(false);
        return;
      }

      const { GLTFLoader, Renderer, THREE } = threeModules;

      try {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          45,
          gl.drawingBufferWidth / gl.drawingBufferHeight,
          0.1,
          1000
        );

        scene.add(new THREE.AmbientLight(0xffffff, 1.8));
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
        keyLight.position.set(2, 4, 4);
        scene.add(keyLight);

        const assetModule = hairStyle === "short" ? SHORT_HAIR_MODEL : DEFAULT_AVATAR_MODEL;
        const gltf = await loadGltfForNative(GLTFLoader, assetModule);

        if (!isMountedRef.current) return;

        const group = buildScene(gltf.scene, hairStyle, hairColor, THREE);
        scene.add(group);

        camera.position.set(0, 0, 3);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        if (gl.endFrameEXP) gl.endFrameEXP();

        if (isMountedRef.current) setLoading(false);
      } catch {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [hairStyle, hairColor, isPreviewSupported, threeModules]
  );

  const GLView = isPreviewSupported ? threeModules?.GLView : null;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {Platform.OS === "web" ? (
        <View ref={webCanvasContainerRef} style={styles.fill} />
      ) : null}

      {GLView ? (
        <GLView
          key={`${hairStyle}:${hairColor}`}
          style={styles.fill}
          onContextCreate={handleContextCreate}
        />
      ) : null}

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#E65C00" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    overflow: "hidden",
    position: "relative",
  },
  fill: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  loadingOverlay: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
