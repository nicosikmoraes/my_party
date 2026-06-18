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
import {
  ActivityIndicator,
  PanResponder,
  Platform,
  StyleSheet,
  View,
} from "react-native";

const DEFAULT_AVATAR_MODEL = require("../../assets/models/avatar.glb");
const SHORT_HAIR_MODEL = require("../../assets/models/avatar/hair/hair_short.glb");

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
  hairStyle?: string;
  shirtModel?: string;
  pantsModel?: string;
  shoesModel?: string;
  showLoadingBackground?: boolean;
  onPress?: () => void;
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
    const ExpoThree = require("expo-three");

    return {
      GLView: require("expo-gl").GLView,
      GLTFLoader: require("three-stdlib").GLTFLoader,
      Renderer: ExpoThree.Renderer,
      loadAsync: ExpoThree.loadAsync,
      THREE: require("three"),
    };
  } catch (error) {
    console.log("Avatar 3D modules error:", error);
    return null;
  }
}

function getWebThreeModules() {
  try {
    return {
      GLTFLoader: require("three-stdlib/loaders/GLTFLoader").GLTFLoader,
      THREE: require("three"),
    };
  } catch (error) {
    console.log("Avatar web 3D modules error:", error);
    return null;
  }
}

async function getDefaultAvatarUri() {
  return getAssetUri(DEFAULT_AVATAR_MODEL);
}

async function getAssetUri(assetModule: number) {
  const asset = Asset.fromModule(assetModule);

  await asset.downloadAsync();

  return asset.localUri || asset.uri;
}

function base64ToArrayBuffer(base64: string) {
  const lookup =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const cleanBase64 = base64.replace(/=+$/, "");
  const bytes: number[] = [];
  const getValue = (character: string | undefined) => {
    if (!character) {
      return 0;
    }

    const value = lookup.indexOf(character);

    return value >= 0 ? value : 0;
  };

  for (let index = 0; index < cleanBase64.length; index += 4) {
    const chunk =
      (getValue(cleanBase64[index]) << 18) |
      (getValue(cleanBase64[index + 1]) << 12) |
      (getValue(cleanBase64[index + 2]) << 6) |
      getValue(cleanBase64[index + 3]);

    bytes.push((chunk >> 16) & 255);

    if (index + 2 < cleanBase64.length) {
      bytes.push((chunk >> 8) & 255);
    }

    if (index + 3 < cleanBase64.length) {
      bytes.push(chunk & 255);
    }
  }

  return new Uint8Array(bytes).buffer;
}

async function loadAssetForNative(GLTFLoader: any, assetModule: number) {
  const modelUri = await getAssetUri(assetModule);
  const FileSystem = require("expo-file-system/legacy");
  const base64Model = await FileSystem.readAsStringAsync(modelUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const modelBuffer = base64ToArrayBuffer(base64Model);

  return new Promise<any>((resolve, reject) => {
    new GLTFLoader().parse(modelBuffer, "", resolve, reject);
  });
}

async function loadDefaultAvatarForNative(GLTFLoader: any) {
  return loadAssetForNative(GLTFLoader, DEFAULT_AVATAR_MODEL);
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

function applyColorToModel(model: any, color: string, threeRuntime: any) {
  model.traverse((object: any) => {
    if (!object?.isMesh || !object.material) {
      return;
    }

    if (Array.isArray(object.material)) {
      object.material = object.material.map((material: any) =>
        cloneMaterialWithColor(material, color, threeRuntime),
      );
      return;
    }

    object.material = cloneMaterialWithColor(
      object.material,
      color,
      threeRuntime,
    );
  });
}

function hideBaseHair(model: any) {
  const hasHairName = (name: string | undefined) =>
    String(name || "").toLowerCase().includes("hair");

  model.traverse((object: any) => {
    if (hasHairName(object.name)) {
      object.visible = false;
      return;
    }

    if (!object?.isMesh) {
      return;
    }

    if (Array.isArray(object.material)) {
      object.material.forEach((material: any) => {
        if (hasHairName(material?.name)) {
          material.visible = false;
        }
      });
    } else if (hasHairName(object.material?.name)) {
      object.visible = false;
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
  hairStyle,
  showLoadingBackground = true,
  onPress,
}: Avatar3DProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const modelRef = useRef<any>(null);
  const avatarGroupRef = useRef<any>(null);
  const webCanvasContainerRef = useRef<any>(null);
  const rotationRef = useRef({ x: 0, y: -Math.PI / 2 });
  const isMountedRef = useRef(true);
  const loadIdRef = useRef(0);

  const modelSource = useMemo(() => {
    const source = avatarUrl?.trim();

    if (!source || !/\.(glb|gltf)(\?.*)?$/i.test(source)) {
      return null;
    }

    return source;
  }, [avatarUrl]);
  const avatarWidth = width ?? size;
  const avatarHeight = height ?? size;
  const isAndroidNewArchitecture =
    Platform.OS === "android" && !!(global as any).nativeFabricUIManager;
  const threeModules = useMemo(() => getThreeModules(), []);
  const isPreviewSupported = Platform.OS !== "web" && !!threeModules;

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
        onPanResponderRelease: (_event, gestureState) => {
          if (
            onPress &&
            Math.abs(gestureState.dx) < 6 &&
            Math.abs(gestureState.dy) < 6
          ) {
            onPress();
          }

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
    [onPress],
  );

  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" && !isPreviewSupported) {
      const message = "Modulos 3D indisponiveis";

      console.log("Avatar 3D preview unsupported:", {
        platform: Platform.OS,
        isAndroidNewArchitecture,
        hasThreeModules: !!threeModules,
        message,
      });
      setLoading(false);
      setLoadError(true);
      setLoadErrorMessage(message);
    }
  }, [isAndroidNewArchitecture, isPreviewSupported, threeModules]);

  useEffect(() => {
    if (Platform.OS === "web" || !loading || !isPreviewSupported) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        setLoading(false);
        setLoadError(true);
        setLoadErrorMessage("Timeout ao abrir/carregar o GL");
      }
    }, 20000);

    return () => clearTimeout(timeoutId);
  }, [isPreviewSupported, loading]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const currentLoadId = loadIdRef.current + 1;
    let renderer: any = null;
    let model: any = null;
    let frameId: number | null = null;
    let disposed = false;

    loadIdRef.current = currentLoadId;
    setLoading(true);
    setLoadError(false);
    setLoadErrorMessage(null);

    const renderWebAvatar = async () => {
      const container = webCanvasContainerRef.current;
      const threeRuntime = getWebThreeModules();

      if (!container || !threeRuntime) {
        setLoading(false);
        setLoadError(true);
        setLoadErrorMessage("Web: container ou Three indisponivel");
        return;
      }

      const { GLTFLoader, THREE: ThreeRuntime } = threeRuntime;

      try {
        const widthValue = Number(avatarWidth) || size;
        const heightValue = Number(avatarHeight) || size;
        const scene = new ThreeRuntime.Scene();
        const camera = new ThreeRuntime.PerspectiveCamera(
          35,
          widthValue / heightValue,
          0.1,
          1000,
        );

        renderer = new ThreeRuntime.WebGLRenderer({
          alpha: !showLoadingBackground,
          antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(widthValue, heightValue);
        renderer.setClearColor(backgroundColor, showLoadingBackground ? 1 : 0);
        container.appendChild(renderer.domElement);

        camera.position.set(0, 0.2, 4);
        camera.lookAt(0, 0, 0);

        const ambientLight = new ThreeRuntime.AmbientLight(0xffffff, 1.6);
        const keyLight = new ThreeRuntime.DirectionalLight(0xffffff, 1.8);
        const fillLight = new ThreeRuntime.DirectionalLight(0xfff0dc, 0.9);

        keyLight.position.set(2, 4, 4);
        fillLight.position.set(-3, 2, 2);
        scene.add(ambientLight);
        scene.add(keyLight);
        scene.add(fillLight);

        const modelUri = modelSource || (await getDefaultAvatarUri());
        const gltf = await new GLTFLoader().loadAsync(modelUri);

        model = gltf.scene;
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

        if (disposed || loadIdRef.current !== currentLoadId) {
          disposeModel(model);
          return;
        }

        const bounds = new ThreeRuntime.Box3().setFromObject(model);
        const sizeVector = new ThreeRuntime.Vector3();
        const center = new ThreeRuntime.Vector3();

        bounds.getSize(sizeVector);
        bounds.getCenter(center);

        const maxAxis = Math.max(sizeVector.x, sizeVector.y, sizeVector.z);
        const scale = maxAxis > 0 ? 2.2 / maxAxis : 1;
        const avatarGroup = new ThreeRuntime.Group();

        model.position.set(-center.x, -center.y, -center.z);
        avatarGroup.add(model);

        if (hairStyle === "short") {
          try {
            const hairUri = await getAssetUri(SHORT_HAIR_MODEL);
            const hairGltf = await new GLTFLoader().loadAsync(hairUri);
            const hairModel = hairGltf.scene;

            if (hairColor) {
              applyColorToModel(hairModel, hairColor, ThreeRuntime);
            }

            hairModel.position.copy(model.position);
            avatarGroup.add(hairModel);
            hideBaseHair(model);
          } catch (error) {
            console.log("Avatar short hair load error:", error);
          }
        }

        if (disposed || loadIdRef.current !== currentLoadId) {
          disposeModel(avatarGroup);
          return;
        }

        avatarGroup.scale.setScalar(scale);
        avatarGroup.rotation.x = rotationRef.current.x;
        avatarGroup.rotation.y = rotationRef.current.y;
        scene.add(avatarGroup);

        avatarGroupRef.current = avatarGroup;
        model = avatarGroup;
        modelRef.current = model;

        setLoading(false);
        setLoadError(false);

        const animate = () => {
          if (disposed || loadIdRef.current !== currentLoadId) {
            return;
          }

          renderer.render(scene, camera);
          frameId = requestAnimationFrame(animate);
        };

        animate();
      } catch (error) {
        console.log("Avatar web 3D load error:", error);
        setLoading(false);
        setLoadError(true);
        setLoadErrorMessage(
          error instanceof Error ? error.message : "Erro ao carregar avatar web",
        );
      }
    };

    renderWebAvatar();

    return () => {
      disposed = true;

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      if (model) {
        disposeModel(model);
      }

      if (renderer) {
        renderer.dispose();
      }

      const container = webCanvasContainerRef.current;

      if (container && renderer?.domElement?.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    avatarHeight,
    avatarWidth,
    backgroundColor,
    hairColor,
    hairStyle,
    modelSource,
    pantsColor,
    shirtColor,
    shoesColor,
    showLoadingBackground,
    size,
    skinColor,
  ]);

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

      console.log("Avatar 3D GL context created:", {
        platform: Platform.OS,
        drawingBufferWidth: gl?.drawingBufferWidth,
        drawingBufferHeight: gl?.drawingBufferHeight,
        isAndroidNewArchitecture,
      });

      loadIdRef.current = currentLoadId;
      setLoading(true);
      setLoadError(false);
      setLoadErrorMessage(null);
      stopAnimation();

      if (modelRef.current) {
        disposeModel(modelRef.current);
        modelRef.current = null;
        avatarGroupRef.current = null;
      }

      if (!isPreviewSupported || !threeModules) {
        setLoading(false);
        setLoadError(true);
        setLoadErrorMessage("Preview 3D nao suportado neste runtime");
        return;
      }

      const {
        GLTFLoader,
        Renderer,
        THREE: ThreeRuntime,
      } = threeModules;

      try {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(backgroundColor, showLoadingBackground ? 1 : 0);

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

        const gltf = modelSource
          ? await new GLTFLoader().loadAsync(modelSource)
          : await loadDefaultAvatarForNative(GLTFLoader);
        const model = gltf.scene;

        console.log("Avatar 3D model loaded:", {
          platform: Platform.OS,
          source: modelSource || "default-avatar",
          hasScene: !!model,
        });

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

        if (hairStyle === "short") {
          try {
            const hairGltf = await loadAssetForNative(
              GLTFLoader,
              SHORT_HAIR_MODEL,
            );
            const hairModel = hairGltf.scene;

            if (hairColor) {
              applyColorToModel(hairModel, hairColor, ThreeRuntime);
            }

            hairModel.position.copy(model.position);
            avatarGroup.add(hairModel);
            hideBaseHair(model);
          } catch (error) {
            console.log("Avatar short hair load error:", error);
          }
        }

        if (!isMountedRef.current || loadIdRef.current !== currentLoadId) {
          disposeModel(avatarGroup);
          return;
        }

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
          setLoadErrorMessage(
            error instanceof Error
              ? error.message
              : "Erro ao carregar avatar 3D",
          );
        }
      }
    },
    [
      backgroundColor,
      hairColor,
      hairStyle,
      modelSource,
      pantsColor,
      shirtColor,
      shoesColor,
      showLoadingBackground,
      skinColor,
      stopAnimation,
      threeModules,
      isPreviewSupported,
      isAndroidNewArchitecture,
    ],
  );

  const GLView = isPreviewSupported ? threeModules?.GLView : null;
  const glViewKey = [
    modelSource || "default-avatar",
    skinColor || "",
    hairColor || "",
    hairStyle || "",
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
          backgroundColor:
            showLoadingBackground || !loading ? backgroundColor : "transparent",
        },
      ]}
    >
      {Platform.OS === "web" ? (
        <View ref={webCanvasContainerRef} style={styles.webCanvasContainer} />
      ) : null}

      {GLView ? (
        <GLView
          key={glViewKey}
          style={styles.glView}
          onContextCreate={handleContextCreate}
        />
      ) : null}

      {showLoadingBackground ? (
        <Loading visible={loading} color="#E65C00" />
      ) : loading ? (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color="#E65C00" />
        </View>
      ) : null}

      {loadError ? (
        <View style={styles.fallback}>
          <TextComponent
            message={
              loadErrorMessage
                ? `Avatar indisponivel: ${loadErrorMessage}`
                : "Avatar indisponivel"
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
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
  },

  webCanvasContainer: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },

  hiddenLoadingGlView: {
    opacity: 0,
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

  loadingIndicator: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
