import React from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import TextComponent from '../ui/Text';

type ColorOption = {
    hex: string;
    label: string;
};

type AvatarColorSelectorProps = {
    label: string;
    colors: ColorOption[];
    selectedColor: string;
    onSelectColor: (hex: string) => void;
};

const AvatarColorSelector: React.FC<AvatarColorSelectorProps> = ({
    label,
    colors,
    selectedColor,
    onSelectColor,
}) => {
    return (
        <View style={styles.container}>
            <TextComponent message={label} color="#F8FAFC" fontSize={16} fontWeight="bold" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorOptionsContainer}>
                {colors.map((color) => (
                    <Pressable
                        key={color.hex}
                        onPress={() => onSelectColor(color.hex)}
                        style={[
                            styles.colorBox,
                            { backgroundColor: color.hex },
                            selectedColor === color.hex && styles.selectedColorBox,
                        ]}
                        accessibilityLabel={`Select ${label} color ${color.label}`}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    colorOptionsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
    colorBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedColorBox: {
        borderColor: '#E65C00',
        borderWidth: 4,
    },
});

export default AvatarColorSelector;
