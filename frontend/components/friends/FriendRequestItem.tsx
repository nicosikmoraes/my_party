import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextComponent from '@/components/ui/Text';
import PressableComponent from '@/components/ui/Pressable';
import { FriendshipRequest } from '@/types/friendship';

interface FriendRequestItemProps {
  request: FriendshipRequest;
  onAccept: (friendshipId: number) => void;
  loading?: boolean;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({ request, onAccept, loading }) => {
  return (
    <View style={styles.container}>
      <TextComponent message={request.sender.name} fontSize={16} />
      <PressableComponent
        message="Aceitar"
        onPress={() => onAccept(request.id)}
        loading={loading}
        width={100}
        height={35}
        borderRadius={8}
        backgroundColor="#E65C00"
        color="#F8FAFC"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});

export default FriendRequestItem;