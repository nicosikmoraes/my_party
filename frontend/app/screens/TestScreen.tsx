import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { TestService } from '../../services/TestService';

interface TestData {
  message: string;
  timestamp: string;
}

export default function TestScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TestData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await TestService.getTestData();
        setData(result);
        Alert.alert('Sucesso', 'Dados de teste carregados com sucesso!');
      } catch (err: any) {
        console.error("Failed to fetch test data:", err);
        setError(err.response?.data?.message || 'Erro ao carregar dados de teste.');
        Alert.alert('Erro', err.response?.data?.message || 'Erro ao carregar dados de teste.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Screen</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>Erro: {error}</Text>
      ) : (
        <View>
          <Text style={styles.dataText}>Mensagem: {data?.message}</Text>
          <Text style={styles.dataText}>Timestamp: {data?.timestamp}</Text>
        </View>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dataText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});