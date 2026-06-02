import Loading from "@/components/ui/Loading";
import TextComponent from "@/components/ui/Text";
import { Asset } from "expo-asset";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PanResponder, Platform, StyleSheet, View } from "react-native";

const DEFAULT_AVATAR_MODEL = require("../../assets/models/avatar.glb");

type Avatar3DProps = {
  avatarUrl?: string | null;
  width?: number;
  height?: number;
  size?: number;
  backgroundColor?: string;
  skinColor?: string;
  hairColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  shoesColor?: string;
};

type AvatarColorProps = Pick<
  Avatar3DProps,
  "skinColor" | "hairColor" | "shirtColor" | "pantsColor" | "shoesColor"
>;

const AVATAR_PART_KEYWORDS = [
  {
    colorKey: "skinColor",
    keywords: ["skin", "head", "face", "arm", "hand", "neck"],
  },
  { colorKey: "hairColor", keywords: ["hair"] },
  { colorKey: "shirtColor", keywords: ["shirt", "body", "torso"] },
  { colorKey: "pantsColor", keywords: ["pants", "leg"] },
  { colorKey: "shoesColor", keywords: ["shoe", "shoes", "foot"] },
] as const;

function getThreeModules() {
  try {
    return {
      GLView: require("expo-gl").GLView,
      GLTFLoader: require("three-stdlib").GLTFLoader,
      Renderer: require("expo-three").Renderer,
      THREE: require("three"),
    };
  } catch (error) {
    console.log("Avatar 3D modules error:", error);
    return null;
  }
}

async function getDefaultAvatarUri() {
  const asset = Asset.fromModule(DEFAULT_AVATAR_MODEL);

  await asset.downloadAsync();

  console.log("Avatar asset:", {
    uri: asset.uri,
    localUri: asset.localUri,
    downloaded: asset.downloaded,
    name: asset.name,
    type: asset.type,
  });

  return asset.uri;
}

function disposeModel(model: any) {
  model.traverse((object: any) => {
    if (object.geometry) {
      object.geometry.dispose();
    }

    const material = object.material;

    if (Array.isArray(material)) {
      material.forEach((currentMaterial) => currentMaterial.dispose());
    } else if (material) {
      material.dispose();
    }
  });
}

function getMatchingAvatarColor(
  names: Array<string | undefined>,
  colors: AvatarColorProps,
) {
  const normalizedNames = names
    .filter(Boolean)
    .map((name) => String(name).toLowerCase());

  for (const part of AVATAR_PART_KEYWORDS) {
    const color = colors[part.colorKey];

    if (
      color &&
      normalizedNames.some((name) =>
        part.keywords.some((keyword) => name.includes(keyword)),
      )
    ) {
      return color;
    }
  }

  return undefined;
}

function cloneMaterialWithColor(material: any, color: string, threeRuntime: any) {
  if (!material?.clone) {
    return material;
  }

  const clonedMaterial = material.clone();

  if (clonedMaterial.color) {
    try {
      clonedMaterial.color.copy(new threeRuntime.Color(color));
    } catch {
      return material;
    }
  }

  return clonedMaterial;
}

function applyAvatarColors(
  model: any,
  colors: AvatarColorProps,
  threeRuntime: any,
) {
  model.traverse((object: any) => {
    if (!object?.isMesh || !object.material) {
      return;
    }

    const meshColor = getMatchingAvatarColor([object.name], colors);

    if (Array.isArray(object.material)) {
      object.material = object.material.map((material: any) => {
        const materialColor =
          meshColor || getMatchingAvatarColor([material?.name], colors);

        return materialColor
          ? cloneMaterialWithColor(material, materialColor, threeRuntime)
          : material;
      });

      return;
    }

    const materialColor =
      meshColor || getMatchingAvatarColor([object.material?.name], colors);

    if (materialColor) {
      object.material = cloneMaterialWithColor(
        object.material,
        materialColor,
        threeRuntime,
      );
    }
  });
}

export default function Avatar3D({
  avatarUrl,
  width,
  height,
  size = 300,
  backgroundColor = "#0F0F0F",
  skinColor,
  hairColor,
  shirtColor,
  pantsColor,
  shoesColor,
}: Avatar3DProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const animationFrameRef = useRef<number | null>(null);
  const modelRef = useRef<any>(null);
  const avatarGroupRef = useRef<any>(null);
  const rotationRef = useRef({ x: 0, y: -Math.PI / 2 });
  const isMountedRef = useRef(true);
  const loadIdRef = useRef(0);

  const modelSource = useMemo(() => avatarUrl?.trim() || null, [avatarUrl]);
  const avatarWidth = width ?? size;
  const avatarHeight = height ?? size;
  const threeModules = useMemo(() => getThreeModules(), []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          if (avatarGroupRef.current) {
            rotationRef.current.y = avatarGroupRef.current.rotation.y;
            rotationRef.current.x = avatarGroupRef.current.rotation.x;
          }
        },
        onPanResponderMove: (_event, gestureState) => {
          if (avatarGroupRef.current) {
            const newRotationY = rotationRef.current.y + gestureState.dx * 0.01;
            let newRotationX = rotationRef.current.x + gestureState.dy * 0.01;

            newRotationX = Math.max(-0.6, Math.min(0.6, newRotationX));

            avatarGroupRef.current.rotation.y = newRotationY;
            avatarGroupRef.current.rotation.x = newRotationX;
          }
        },
        onPanResponderRelease: () => {
          if (avatarGroupRef.current) {
            rotationRef.current.y = avatarGroupRef.current.rotation.y;
            rotationRef.current.x = avatarGroupRef.current.rotation.x;
          }
        },
        onPanResponderTerminate: () => {
          if (avatarGroupRef.current) {
            rotationRef.current.y = avatarGroupRef.current.rotation.y;
            rotationRef.current.x = avatarGroupRef.current.rotation.x;
          }
        },
      }),
    [],
  );

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!threeModules) {
      setLoading(false);
      setLoadError(true);
    }
  }, [threeModules]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopAnimation();

      if (modelRef.current) {
        disposeModel(modelRef.current);
        modelRef.current = null;
        avatarGroupRef.current = null;
      }
    };
  }, [stopAnimation]);

  const handleContextCreate = useCallback(
    async (gl: any) => {
      const currentLoadId = loadIdRef.current + 1;

      loadIdRef.current = currentLoadId;
      setLoading(true);
      setLoadError(false);
      stopAnimation();

      if (modelRef.current) {
        disposeModel(modelRef.current);
        modelRef.current = null;
        avatarGroupRef.current = null;
      }

      if (!threeModules) {
        setLoading(false);
        setLoadError(true);
        return;
      }

      const { GLTFLoader, Renderer, THREE: ThreeRuntime } = threeModules;

      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(backgroundColor, 1);

      const scene = new ThreeRuntime.Scene();

      const camera = new ThreeRuntime.PerspectiveCamera(
        35,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000,
      );

      camera.position.set(0, 0.2, 4);
      camera.lookAt(0, 0, 0);

      const ambientLight = new ThreeRuntime.AmbientLight(0xffffff, 1.6);

      const keyLight = new ThreeRuntime.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(2, 4, 4);

      const fillLight = new ThreeRuntime.DirectionalLight(0xfff0dc, 0.9);
      fillLight.position.set(-3, 2, 2);

      scene.add(ambientLight);
      scene.add(keyLight);
      scene.add(fillLight);

      const renderScene = () => {
        renderer.render(scene, camera);

        if (gl.endFrameEXP) {
          gl.endFrameEXP();
        }
      };

      try {
        const loader = new GLTFLoader();

        let modelUri = modelSource;

        if (!modelUri) {
          modelUri = await getDefaultAvatarUri();
        }

        if (!modelUri) {
          throw new Error("Avatar model URI not found");
        }

        console.log("Loading 3D avatar model:", modelUri);

        const gltf = await loader.loadAsync(modelUri);
        const model = gltf.scene;
        applyAvatarColors(
          model,
          {
            skinColor,
            hairColor,
            shirtColor,
            pantsColor,
            shoesColor,
          },
          ThreeRuntime,
        );

        if (!isMountedRef.current || loadIdRef.current !== currentLoadId) {
          disposeModel(model);
          return;
        }

        const bounds = new ThreeRuntime.Box3().setFromObject(model);
        const sizeVector = new ThreeRuntime.Vector3();
        const center = new ThreeRuntime.Vector3();

        bounds.getSize(sizeVector);
        bounds.getCenter(center);

        console.log("Avatar bounds:", {
          size: {
            x: sizeVector.x,
            y: sizeVector.y,
            z: sizeVector.z,
          },
          center: {
            x: center.x,
            y: center.y,
            z: center.z,
          },
        });

        const maxAxis = Math.max(sizeVector.x, sizeVector.y, sizeVector.z);
        const scale = maxAxis > 0 ? 2.2 / maxAxis : 1;

        const avatarGroup = new ThreeRuntime.Group();

        model.position.set(-center.x, -center.y, -center.z);

        avatarGroup.add(model);
        avatarGroup.scale.setScalar(scale);
        avatarGroup.position.set(0, 0, 0);
        avatarGroup.rotation.x = rotationRef.current.x;
        avatarGroup.rotation.y = rotationRef.current.y;

        scene.add(avatarGroup);
        modelRef.current = avatarGroup;
        avatarGroupRef.current = avatarGroup;

        camera.position.set(0, 0.2, 4);
        camera.lookAt(0, 0, 0);

        if (isMountedRef.current) {
          setLoading(false);
          setLoadError(false);
        }

        const animate = () => {
          if (!isMountedRef.current || loadIdRef.current !== currentLoadId) {
            return;
          }

          renderScene();

          animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
      } catch (error) {
        console.log("Avatar 3D load error:", error);

        if (isMountedRef.current) {
          setLoading(false);
          setLoadError(true);
        }

        renderScene();
      }
    },
    [
      backgroundColor,
      hairColor,
      modelSource,
      pantsColor,
      shirtColor,
      shoesColor,
      skinColor,
      stopAnimation,
      threeModules,
    ],
  );

  const GLView = threeModules?.GLView;
  const glViewKey = [
    modelSource || "default-avatar",
    skinColor || "",
    hairColor || "",
    shirtColor || "",
    pantsColor || "",
    shoesColor || "",
  ].join(":");

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          width: avatarWidth,
          height: avatarHeight,
          backgroundColor,
        },
      ]}
    >
      {GLView ? (
        <GLView
          key={glViewKey}
          style={styles.glView}
          onContextCreate={handleContextCreate}
        />
      ) : null}

      <Loading visible={loading} color="#E65C00" />

      {loadError ? (
        <View style={styles.fallback}>
          <TextComponent
            message={
              Platform.OS === "web"
                ? "3D avatar preview is available on mobile"
                : "Avatar model unavailable"
            }
            color="#B3B3B3"
            fontSize={12}
            textAlign="center"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#0F0F0F",
    borderRadius: 8,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },

  glView: {
    height: "100%",
    width: "100%",
  },

  fallback: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    padding: 8,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
