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
import PressableComponent from "@/components/ui/Pressable";
import TextComponent from "@/components/ui/Text";
import TitleComponent from "@/components/ui/Title";
import {
    getAvatarCustomization,
    updateAvatarCustomization,
} from "@/services/avatarCustomizationService";
import { showToast } from "@/utils/toast";

const defaultCustomization = {
    skin_color: "#F2C6A0",
    hair_color: "#2B1A10",
    shirt_color: "#E65C00",
    pants_color: "#333333",
    shoes_color: "#111111",
};

const partLabels: Record<AvatarPart, string> = {
    skin: "Skin",
    hair: "Hair",
    shirt: "Shirt",
    pants: "Pants",
    shoes: "Shoes",
};

const partColorFields: Record<AvatarPart, keyof typeof defaultCustomization> = {
    skin: "skin_color",
    hair: "hair_color",
    shirt: "shirt_color",
    pants: "pants_color",
    shoes: "shoes_color",
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
        useState<typeof defaultCustomization>(defaultCustomization);

    const selectedColorField = partColorFields[selectedPart];
    const selectedPartLabel = partLabels[selectedPart];

    const fetchAvatarCustomization = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAvatarCustomization();
            setCustomization({
                skin_color: data.skin_color || defaultCustomization.skin_color,
                hair_color: data.hair_color || defaultCustomization.hair_color,
                shirt_color: data.shirt_color || defaultCustomization.shirt_color,
                pants_color: data.pants_color || defaultCustomization.pants_color,
                shoes_color: data.shoes_color || defaultCustomization.shoes_color,
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

    const handleReset = () => {
        setCustomization(defaultCustomization);
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
    actions: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "space-between",
        width: "100%",
    },
});

export default CustomizeAvatarScreen;
