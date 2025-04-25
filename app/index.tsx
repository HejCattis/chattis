import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Button from "../components/common/Button";

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Välkommen till Chattis!</Text>
        <Text style={styles.subtitle}>Skapa ditt alias för att börja chatta</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            text="Välj alias"
            onPress={() => router.push('/display-name')}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
        Chat + Cattis = Chattis
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: -100,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    width: "100%",
  },
  footer: {
    padding: 24,
    paddingBottom: 60,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default Index;
