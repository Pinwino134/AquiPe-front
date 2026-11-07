
import { View, Text } from 'react-native';

export default function PerfilScreen() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F6F7F3',
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#146C67',
      }}>
        Mi perfil
      </Text>
      <Text>Próximamente</Text>
    </View>
  );
}
