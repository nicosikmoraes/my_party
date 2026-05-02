import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { TitleComponent } from '../../components/ui/Title';
import { TextComponent } from '../../components/ui/Text';
import { PressableComponent } from '../../components/ui/Pressable';
import { Loading } from '../../components/ui/Loading';
import { ErrorComponent } from '../../components/ui/Error';

import { testService } from '../../services/testService';

export default function TestScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reversedName, setReversedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReversedName = async () => {
      try {
        setLoading(true);
        const data = await testService.getReversedName();
        setReversedName(data.reversed_name);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar nome invertido.');
      } finally {
        setLoading(false);
      }
    };

    fetchReversedName();
  }, []);

  if (loading) {
    return <Loading visible={loading} />;
  }

  return (
    <View style={styles.container}>
      <TitleComponent message="Tela de Teste" />

      {error ? (
        <ErrorComponent message={error} />
      ) : (
        <>
          <TextComponent message="Seu nome invertido é:" fontSize={18} marginTop={20} />
          <TextComponent message={reversedName || ''} fontSize={24} fontWeight="bold" marginTop={10} />
        </>
      )}

      <PressableComponent
        message="Voltar"
        onPress={() => router.back()}
        marginTop={30}
        width="90%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    padding: 20,
  },
});

# MANUAL_UPDATE: frontend/app/(auth)/events.tsx
Adicionar os imports:
import { PressableComponent } from '../../components/ui/Pressable';
import { useRouter } from 'expo-router';

Dentro do componente EventsScreen, adicione o seguinte logo abaixo de outros PressableComponents ou em um local apropriado dentro do layout:
  const router = useRouter();
  // ...
  // Dentro do seu return, por exemplo:
  <PressableComponent
    message="Ir para TestScreen"
    onPress={() => router.push('/(auth)/TestScreen')}
    marginTop={20}
  />