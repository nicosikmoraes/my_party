import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";

import Avatar3D from "@/components/avatar/Avatar3D";
import AvatarColorSelector from "@/components/avatar/AvatarColorSelector";
import {
    AvatarPart,
    AvatarPartSelector,
} from "@/components/avatar/AvatarPartSelector";
import BlankTemplate from "@/components/template/Blank";
import SelectModal from "@/components/ui/ModalSelect";
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import {
    AVATAR_DEFAULT_CUSTOMIZATION,
    AVATAR_ITEM_OPTIONS,
} from "@/constants/avatarItems";
import {
    getAvatarCustomization,
    updateAvatarCustomization,
} from "@/services/avatarCustomizationService";
import type {
    AvatarItemPart,
    UpdateAvatarCustomizationPayload,
} from "@/types/avatar";
import { showToast } from "@/utils/toast";

type AvatarCustomizationForm = {
    [Field in keyof UpdateAvatarCustomizationPayload]-?: Exclude<
        UpdateAvatarCustomizationPayload[Field],
        null | undefined
    >;
};

type AvatarColorField =
    | "skin_color"
    | "hair_color"
    | "shirt_color"
    | "pants_color"
    | "shoes_color";

type AvatarItemField =
    | "hair_style"
    | "shirt_model"
    | "pants_model"
    | "shoes_model";

const partLabels: Record<AvatarPart, string> = {
    skin: "Skin",
    hair: "Hair",
    shirt: "Shirt",
    pants: "Pants",
    shoes: "Shoes",
};

const partColorFields: Record<AvatarPart, AvatarColorField> = {
    skin: "skin_color",
    hair: "hair_color",
    shirt: "shirt_color",
    pants: "pants_color",
    shoes: "shoes_color",
};

const partItemFields: Record<AvatarItemPart, AvatarItemField> = {
    hair: "hair_style",
    shirt: "shirt_model",
    pants: "pants_model",
    shoes: "shoes_model",
};

const partColors = {
    skin: [
        { hex: "#F2C6A0", label: "Light" },
        { hex: "#D9A066", label: "Medium" },
        { hex: "#8D5524", label: "Dark" },
        { hex: "#FFDBAC", label: "Pale" },
    ],
    hair: [
        { hex: "#2B1A10", label: "Brown" },
        { hex: "#000000", label: "Black" },
        { hex: "#6B4423", label: "Dark Brown" },
        { hex: "#D6B370", label: "Blonde" },
        { hex: "#E5E5E5", label: "White" },
    ],
    shirt: [
        { hex: "#E65C00", label: "Orange" },
        { hex: "#2563EB", label: "Blue" },
        { hex: "#16A34A", label: "Green" },
        { hex: "#DC2626", label: "Red" },
        { hex: "#9333EA", label: "Purple" },
        { hex: "#F8FAFC", label: "White" },
    ],
    pants: [
        { hex: "#111827", label: "Dark Gray" },
        { hex: "#333333", label: "Gray" },
        { hex: "#1E3A8A", label: "Dark Blue" },
        { hex: "#4B5563", label: "Light Gray" },
    ],
    shoes: [
        { hex: "#111111", label: "Black" },
        { hex: "#F8FAFC", label: "White" },
        { hex: "#7C2D12", label: "Brown" },
        { hex: "#1F2937", label: "Dark Blue" },
    ],
};

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || fallback;
}

const CustomizeAvatarScreen: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedPart, setSelectedPart] = useState<AvatarPart>("skin");
    const [customization, setCustomization] =
        useState<AvatarCustomizationForm>({
            ...AVATAR_DEFAULT_CUSTOMIZATION,
        });

    const selectedColorField = partColorFields[selectedPart];
    const selectedPartLabel = partLabels[selectedPart];
    const selectedItemPart = selectedPart === "skin" ? null : selectedPart;
    const selectedItemField = selectedItemPart
        ? partItemFields[selectedItemPart]
        : null;
    const selectedItemOptions = selectedItemPart
        ? AVATAR_ITEM_OPTIONS[selectedItemPart].map((option) => ({
              label: option.label,
              value: option.id,
          }))
        : [];

    const fetchAvatarCustomization = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAvatarCustomization();
            setCustomization({
                skin_color: data.skin_color || AVATAR_DEFAULT_CUSTOMIZATION.skin_color,
                hair_color: data.hair_color || AVATAR_DEFAULT_CUSTOMIZATION.hair_color,
                shirt_color: data.shirt_color || AVATAR_DEFAULT_CUSTOMIZATION.shirt_color,
                pants_color: data.pants_color || AVATAR_DEFAULT_CUSTOMIZATION.pants_color,
                shoes_color: data.shoes_color || AVATAR_DEFAULT_CUSTOMIZATION.shoes_color,
                hair_style: data.hair_style || AVATAR_DEFAULT_CUSTOMIZATION.hair_style,
                shirt_model: data.shirt_model || AVATAR_DEFAULT_CUSTOMIZATION.shirt_model,
                pants_model: data.pants_model || AVATAR_DEFAULT_CUSTOMIZATION.pants_model,
                shoes_model: data.shoes_model || AVATAR_DEFAULT_CUSTOMIZATION.shoes_model,
            });
        } catch (error: any) {
            showToast(getErrorMessage(error, "Failed to load avatar customization."), "danger");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAvatarCustomization();
        }, [fetchAvatarCustomization])
    );

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateAvatarCustomization({
                skin_color: customization.skin_color,
                hair_color: customization.hair_color,
                shirt_color: customization.shirt_color,
                pants_color: customization.pants_color,
                shoes_color: customization.shoes_color,
                hair_style: customization.hair_style,
                shirt_model: customization.shirt_model,
                pants_model: customization.pants_model,
                shoes_model: customization.shoes_model,
            });
            showToast("Avatar updated successfully", "success");
        } catch (error: any) {
            showToast(getErrorMessage(error, "Failed to update avatar."), "danger");
        } finally {
            setSaving(false);
        }
    };

    const handleColorChange = (color: string) => {
        setCustomization((currentCustomization) => ({
            ...currentCustomization,
            [selectedColorField]: color,
        }));
    };

    const handleItemChange = (itemId: string) => {
        if (!selectedItemField) {
            return;
        }

        setCustomization((currentCustomization) => ({
            ...currentCustomization,
            [selectedItemField]: itemId,
        }));
    };

    const handleReset = () => {
        setCustomization({ ...AVATAR_DEFAULT_CUSTOMIZATION });
    };

    const avatarColors = useMemo(
        () => ({
            skinColor: customization.skin_color,
            hairColor: customization.hair_color,
            shirtColor: customization.shirt_color,
            pantsColor: customization.pants_color,
            shoesColor: customization.shoes_color,
        }),
        [customization],
    );

    return (
        <BlankTemplate>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TitleComponent message="Customize Avatar" fontSize={24} />

                    <View style={styles.avatarPreview}>
                        <Avatar3D
                            size={280}
                            skinColor={avatarColors.skinColor}
                            hairColor={avatarColors.hairColor}
                            shirtColor={avatarColors.shirtColor}
                            pantsColor={avatarColors.pantsColor}
                            shoesColor={avatarColors.shoesColor}
                            hairStyle={customization.hair_style}
                            shirtModel={customization.shirt_model}
                            pantsModel={customization.pants_model}
                            shoesModel={customization.shoes_model}
                            showLoadingBackground={false}
                        />
                        {loading ? (
                            <View style={styles.avatarDataLoading}>
                                <ActivityIndicator size="small" color="#E65C00" />
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.editorPanel}>
                        <TextComponent
                            message="Choose a part to edit"
                            color="#B3B3B3"
                            fontSize={13}
                        />

                        <AvatarPartSelector
                            selectedPart={selectedPart}
                            onSelectPart={setSelectedPart}
                        />

                        <View style={styles.sectionHeader}>
                            <TextComponent
                                message={`${selectedPartLabel} Color`}
                                fontSize={18}
                                fontWeight="bold"
                                textAlign="left"
                            />
                            <TextComponent
                                message="Changes update the preview immediately."
                                color="#B3B3B3"
                                fontSize={12}
                                textAlign="left"
                            />
                        </View>

                        <AvatarColorSelector
                            label={`Select ${selectedPartLabel} Color`}
                            colors={partColors[selectedPart]}
                            selectedColor={customization[selectedColorField]}
                            onChange={handleColorChange}
                        />

                        {selectedItemField ? (
                            <View style={styles.itemSelector}>
                                <SelectModal
                                    label={`${selectedPartLabel} Model`}
                                    options={selectedItemOptions}
                                    value={customization[selectedItemField]}
                                    onChange={handleItemChange}
                                    placeholder={`Select ${selectedPartLabel} Model`}
                                />
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.actions}>
                        <PressableComponent
                            message="Reset Default"
                            onPress={handleReset}
                            backgroundColor="#2A2A2A"
                            color="#F8FAFC"
                            width="48%"
                        />
                        <PressableComponent
                            message="Save Changes"
                            onPress={handleSave}
                            loading={saving}
                            width="48%"
                        />
                    </View>
                </ScrollView>
            </View>
        </BlankTemplate>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    scrollContent: {
        alignItems: "center",
        gap: 20,
        paddingHorizontal: 20,
        paddingBottom: 50,
        width: '100%',
    },
    avatarPreview: {
        alignItems: "center",
        backgroundColor: "transparent",
        height: 300,
        justifyContent: 'center',
        overflow: "hidden",
        position: "relative",
        width: "100%",
    },
    avatarDataLoading: {
        alignItems: 'center',
        bottom: 10,
        height: 28,
        justifyContent: "center",
        position: "absolute",
        width: 28,
    },
    editorPanel: {
        alignItems: "center",
        backgroundColor: "#151515",
        borderRadius: 12,
        padding: 16,
        width: "100%",
    },
    sectionHeader: {
        gap: 4,
        marginBottom: 12,
        width: "100%",
    },
    itemSelector: {
        marginTop: 16,
        width: "100%",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
        width: "100%",
    },
});

export default CustomizeAvatarScreen;
