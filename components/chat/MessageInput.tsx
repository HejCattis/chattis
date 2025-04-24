import { View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Skriv ett meddelande..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          textAlignVertical="center"
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled
          ]} 
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={message.trim() ? "#175ADB" : "#999"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9E9EB',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    minHeight: 44,
    maxHeight: 120,
    color: '#000',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
  },
  sendButtonDisabled: {
    backgroundColor: '#F2F2F7',
  },
}); 