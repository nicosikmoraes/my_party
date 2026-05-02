import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router'; // Ensure 'router' is imported from 'expo-router'

export default function EventsScreen() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Eventos' }} />
            <Text style={styles.title}>Bem-vindo à tela de Eventos!</Text>
            <Text style={styles.description}>
                Aqui você poderá ver seus eventos e interações futuras.
            </Text>

            {/* ADD THE NEW BUTTON HERE */}
            <Button
                title="Ver Nome Invertido do Usuário"
                onPress={() => router.push('/testscreen')}
            />

            {/* Existing content continues below */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#34495e',
    },
    // Add any other existing styles here
});