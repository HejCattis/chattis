import { View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import Button from "../components/common/Button";
import { useUser } from "../context/UserContext";

const DisplayName = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const { setDisplayName } = useUser();

  const handlePress = () => {
    if (name.trim()) {
      setDisplayName(name.trim());
      router.push("/chat");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Välj ditt alias</Text>
        <Text style={styles.subtitle}>Detta är namnet som andra kommer att se</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Skriv ditt alias här"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Button
          style={styles.button}
          text="Fortsätt"
          disabled={!name.trim()}
          onPress={handlePress}
        />
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
    marginTop: -150,
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
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  button: {
    width: "100%",
  },
}); 

export default DisplayName;
