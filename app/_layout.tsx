import { Stack } from "expo-router";
import { View, StyleSheet } from 'react-native';
import Header from '../components/layout/Header';
import { UserProvider } from '../context/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <View style={styles.container}>
        <Header />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#fff' },
          }}
        />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
});
