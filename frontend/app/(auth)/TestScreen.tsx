import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { getReversedUserName } from '../../services/api'; // Adjust path based on your project structure

export default function TestScreen() {
    const [reversedName, setReversedName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReversedName = async () => {
            try {
                setLoading(true);
                const data = await getReversedUserName();
                setReversedName(data.reversed_name);
            } catch (err) {
                console.error('Failed to fetch reversed name:', err);
                setError('Erro ao carregar nome invertido. Tente novamente mais tarde.');
                // Here you might integrate a toast notification service if available
            } finally {
                setLoading(false);
            }
        };

        fetchReversedName();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Nome Invertido' }} />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <Text style={styles.nameText}>
                    Nome do Usuário Invertido: {reversedName}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});