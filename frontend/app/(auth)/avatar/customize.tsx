import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';

import Avatar3D from '@/components/avatar/Avatar3D';
import AvatarColorSelector from '@/components/avatar/AvatarColorSelector';
import BlankTemplate from '@/components/template/Blank';
import Loading from '@/components/ui/Loading';
import PressableComponent from '@/components/ui/Pressable';
import TitleComponent from '@/components/ui/Title';
import { getAvatarCustomization, updateAvatarCustomization } from '@/services/avatarCustomizationService';
import { showToast } from '@/utils/toast';

const skinColors = [
    { hex: '#F2C6A0', label: 'Light' },
    { hex: '#D9A066', label: 'Medium' },
    { hex: '#8D5524', label: 'Dark' },
    { hex: '#FFDBAC', label: 'Pale' },
];

const hairColors = [
    { hex: '#2B1A10', label: 'Brown' },
    { hex: '#000000', label: 'Black' },
    { hex: '#6B4423', label: 'Dark Brown' },
    { hex: '#D6B370', label: 'Blonde' },
    { hex: '#E5E5E5', label: 'White' },
];

const shirtColors = [
    { hex: '#E65C00', label: 'Orange' },
    { hex: '#2563EB', label: 'Blue' },
    { hex: '#16A34A', label: 'Green' },
    { hex: '#DC2626', label: 'Red' },
    { hex: '#9333EA', label: 'Purple' },
    { hex: '#F8FAFC', label: 'White' },
];

const pantsColors = [
    { hex: '#111827', label: 'Dark Gray' },
    { hex: '#333333', label: 'Gray' },
    { hex: '#1E3A8A', label: 'Dark Blue' },
    { hex: '#4B5563', label: 'Light Gray' },
];

const shoesColors = [
    { hex: '#111111', label: 'Black' },
    { hex: '#F8FAFC', label: 'White' },
    { hex: '#7C2D12', label: 'Brown' },
    { hex: '#1F2937', label: 'Dark Blue' },
];

function getErrorMessage(error: any, fallback: string) {
    return error?.response?.data?.message || fallback;
}

const CustomizeAvatarScreen: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [skinColor, setSkinColor] = useState(skinColors[0].hex);
    const [hairColor, setHairColor] = useState(hairColors[0].hex);
    const [shirtColor, setShirtColor] = useState(shirtColors[0].hex);
    const [pantsColor, setPantsColor] = useState(pantsColors[0].hex);
    const [shoesColor, setShoesColor] = useState(shoesColors[0].hex);

    const fetchAvatarCustomization = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAvatarCustomization();
            setSkinColor(data.skin_color || skinColors[0].hex);
            setHairColor(data.hair_color || hairColors[0].hex);
            setShirtColor(data.shirt_color || shirtColors[0].hex);
            setPantsColor(data.pants_color || pantsColors[0].hex);
            setShoesColor(data.shoes_color || shoesColors[0].hex);
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
                skin_color: skinColor,
                hair_color: hairColor,
                shirt_color: shirtColor,
                pants_color: pantsColor,
                shoes_color: shoesColor,
            });
            showToast("Avatar updated successfully", "success");
        } catch (error: any) {
            showToast(getErrorMessage(error, "Failed to update avatar."), "danger");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <BlankTemplate>
                <View style={styles.container}>
                    <Loading visible={true} color="#E65C00" />
                </View>
            </BlankTemplate>
        );
    }

    return (
        <BlankTemplate>
            <View style={styles.container}>
                <TitleComponent message="Customize Avatar" />
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.avatarPreview}>
                        <Avatar3D
                            size={250}
                            skinColor={skinColor}
                            hairColor={hairColor}
                            shirtColor={shirtColor}
                            pantsColor={pantsColor}
                            shoesColor={shoesColor}
                        />
                    </View>

                    <AvatarColorSelector
                        label="Skin Color"
                        colors={skinColors}
                        selectedColor={skinColor}
                        onSelectColor={setSkinColor}
                    />
                    <AvatarColorSelector
                        label="Hair Color"
                        colors={hairColors}
                        selectedColor={hairColor}
                        onSelectColor={setHairColor}
                    />
                    <AvatarColorSelector
                        label="Shirt Color"
                        colors={shirtColors}
                        selectedColor={shirtColor}
                        onSelectColor={setShirtColor}
                    />
                    <AvatarColorSelector
                        label="Pants Color"
                        colors={pantsColors}
                        selectedColor={pantsColor}
                        onSelectColor={setPantsColor}
                    />
                    <AvatarColorSelector
                        label="Shoes Color"
                        colors={shoesColors}
                        selectedColor={shoesColor}
                        onSelectColor={setShoesColor}
                    />

                    <PressableComponent
                        message="Save"
                        onPress={handleSave}
                        loading={saving}
                        marginTop={20}
                        width="90%"
                    />
                </ScrollView>
            </View>
        </BlankTemplate>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
        alignItems: 'center',
        paddingTop: 50,
    },
    scrollContent: {
        paddingBottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    avatarPreview: {
        width: 250,
        height: 250,
        marginBottom: 30,
        backgroundColor: '#1A1A1A',
        borderRadius: 15,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CustomizeAvatarScreen;
