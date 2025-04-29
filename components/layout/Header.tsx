import { View, StyleSheet, Pressable, Image } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const showBackButton = pathname !== '/';

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <Pressable 
            onPress={() => router.back()} 
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed
            ]}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
        )}
      </View>
      
      <View style={styles.centerContainer}>
        <Image 
          source={require('../../assets/images/chattis.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  leftContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  logo: {
    width: 100,
    height: 100,
  },
}); 