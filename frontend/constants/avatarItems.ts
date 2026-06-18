import type {
  AvatarCustomization,
  AvatarItemOption,
  AvatarItemPart,
  AvatarPart,
} from "@/types/avatar";

export const AVATAR_DEFAULT_CUSTOMIZATION = {
  skin_color: "#F2C6A0",
  hair_color: "#2B1A10",
  shirt_color: "#E65C00",
  pants_color: "#333333",
  shoes_color: "#111111",
  hair_style: "default",
  shirt_model: "basic_shirt",
  pants_model: "jeans",
  shoes_model: "sneakers",
} satisfies AvatarCustomization;

export const AVATAR_PARTS: ReadonlyArray<{
  label: string;
  value: AvatarPart;
}> = [
  { label: "Skin", value: "skin" },
  { label: "Hair", value: "hair" },
  { label: "Shirt", value: "shirt" },
  { label: "Pants", value: "pants" },
  { label: "Shoes", value: "shoes" },
];

export const HAIR_STYLE_OPTIONS: AvatarItemOption[] = [
  { id: "default", label: "Default", part: "hair", assetKey: "hair_default" },
  { id: "short", label: "Short", part: "hair", assetKey: "hair_short" },
];

export const SHIRT_MODEL_OPTIONS: AvatarItemOption[] = [
  { id: "basic_shirt", label: "Basic Shirt", part: "shirt", assetKey: "shirt_basic" },
  { id: "hoodie", label: "Hoodie", part: "shirt", assetKey: "shirt_hoodie" },
  { id: "jacket", label: "Jacket", part: "shirt", assetKey: "shirt_jacket" },
];

export const PANTS_MODEL_OPTIONS: AvatarItemOption[] = [
  { id: "jeans", label: "Jeans", part: "pants", assetKey: "pants_jeans" },
  { id: "shorts", label: "Shorts", part: "pants", assetKey: "pants_shorts" },
  { id: "joggers", label: "Joggers", part: "pants", assetKey: "pants_joggers" },
];

export const SHOES_MODEL_OPTIONS: AvatarItemOption[] = [
  { id: "sneakers", label: "Sneakers", part: "shoes", assetKey: "shoes_sneakers" },
  { id: "boots", label: "Boots", part: "shoes", assetKey: "shoes_boots" },
  { id: "casual", label: "Casual Shoes", part: "shoes", assetKey: "shoes_casual" },
];

export const AVATAR_ITEM_OPTIONS: Record<AvatarItemPart, AvatarItemOption[]> = {
  hair: HAIR_STYLE_OPTIONS,
  shirt: SHIRT_MODEL_OPTIONS,
  pants: PANTS_MODEL_OPTIONS,
  shoes: SHOES_MODEL_OPTIONS,
};

// These paths are placeholders for future separated GLB item loading.
export const AVATAR_MODEL_ASSETS = {
  base: "assets/models/avatar/base/base_body.glb",
  hair_default: "assets/models/avatar/hair/hair_default.glb",
  hair_short: "assets/models/avatar/hair/hair_short.glb",
  hair_medium: "assets/models/avatar/hair/hair_medium.glb",
  hair_curly: "assets/models/avatar/hair/hair_curly.glb",
  shirt_basic: "assets/models/avatar/shirts/shirt_basic.glb",
  shirt_hoodie: "assets/models/avatar/shirts/shirt_hoodie.glb",
  shirt_jacket: "assets/models/avatar/shirts/shirt_jacket.glb",
  pants_jeans: "assets/models/avatar/pants/pants_jeans.glb",
  pants_shorts: "assets/models/avatar/pants/pants_shorts.glb",
  pants_joggers: "assets/models/avatar/pants/pants_joggers.glb",
  shoes_sneakers: "assets/models/avatar/shoes/shoes_sneakers.glb",
  shoes_boots: "assets/models/avatar/shoes/shoes_boots.glb",
  shoes_casual: "assets/models/avatar/shoes/shoes_casual.glb",
} as const;
