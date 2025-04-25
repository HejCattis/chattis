import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useUser } from '../context/UserContext';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import { sendMessage, type ChatMessage } from '../services/messages';
import { useChatMessages } from '../hooks/useChatMessages';
import { useRef } from 'react';


const Chat = () => {
  const { displayName } = useUser();
  const { messages, loadMore, loading } = useChatMessages();
  const flatListRef = useRef<FlatList<ChatMessage>>(null) 

  const scrollToBottom = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleSend = async (message: string) => {
    try {
      await sendMessage(message, displayName);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };


return (
  <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
  >
    <View style={styles.mainContainer}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#175ADB" />
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        ref={flatListRef}
        renderItem={({ item }) => (
          <MessageBubble
            text={item.text}
            sender={item.sender}
            timestamp={item.timestamp.toLocaleTimeString(['sv-SE'], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            isOwnMessage={item.sender.toLowerCase() === displayName.toLowerCase()}
          />
        )}
        contentContainerStyle={styles.messagesContent}
        style={styles.messagesContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        inverted 
      />

      <MessageInput onSend={handleSend} />
    </View>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Chat;