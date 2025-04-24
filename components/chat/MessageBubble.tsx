import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
  text: string;
  sender: string;
  timestamp: string;
  isOwnMessage: boolean;
}

export default function MessageBubble({ text, sender, timestamp, isOwnMessage }: MessageBubbleProps) {
  return (
    <View 
      style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}
    >
      <View style={styles.messageHeader}>
        <Text style={[
          styles.sender,
          isOwnMessage ? styles.ownSender : styles.otherSender
        ]}>
          {sender}
        </Text>
        <Text style={[
          styles.timestamp,
          isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
        ]}>
          {timestamp}
        </Text>
      </View>
      <Text style={[
        styles.messageText,
        isOwnMessage ? styles.ownMessageText : styles.otherMessageText
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sender: {
    fontSize: 12,
    fontWeight: '600',
  },
  ownSender: {
    color: '#fff',
  },
  otherSender: {
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
  },
  ownTimestamp: {
    color: '#E1E1E1',
  },
  otherTimestamp: {
    color: '#666',
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
}); 