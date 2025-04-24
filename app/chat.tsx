import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useUser } from '../context/UserContext';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import { Message, subscribeToMessages, sendMessage, loadMoreMessages } from '../services/messages';
import { useEffect, useState, useRef } from 'react';
import { useMessageFilter } from '../hooks/useMessageFilter';
import { useScrollHandler } from '../hooks/useScrollHandler';

const LOADING_TIMEOUT = 600;

export default function Chat() {
  const { displayName } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { filterUniqueMessages, resetProcessedIds } = useMessageFilter();
  const { scrollViewRef, scrollToBottom, handleScroll, initialScrollDone } = useScrollHandler(handleLoadMore);

  useEffect(() => {
    resetProcessedIds();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessages) => {
      const uniqueMessages = filterUniqueMessages(newMessages);
      if (uniqueMessages.length > 0) {
        setMessages(prevMessages => {
          const messageMap = new Map(prevMessages.map(msg => [msg.id, msg]));
          uniqueMessages.forEach(msg => messageMap.set(msg.id, msg));
          
          return Array.from(messageMap.values())
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        });
      }
      
      if (!initialScrollDone.current) {
        scrollToBottom(false);
        initialScrollDone.current = true;
      }
    });

    return () => {
      unsubscribe();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  async function handleLoadMore() {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      const olderMessages = await loadMoreMessages();
      if (olderMessages.length > 0) {
        const uniqueMessages = filterUniqueMessages(olderMessages);
        if (uniqueMessages.length > 0) {
          setMessages(prevMessages => {
            const messageMap = new Map(prevMessages.map(msg => [msg.id, msg]));
            uniqueMessages.forEach(msg => messageMap.set(msg.id, msg));
            
            return Array.from(messageMap.values())
              .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          });
        }
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoadingMore(false);
      }, LOADING_TIMEOUT);
    }
  }

  const handleSend = async (message: string) => {
    try {
      await sendMessage(message, displayName);
      scrollToBottom();
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
        {isLoadingMore && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#175ADB" />
          </View>
        )}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              sender={msg.sender}
              timestamp={msg.timestamp.toLocaleTimeString(['sv-SE'], { hour: '2-digit', minute: '2-digit' })}
              isOwnMessage={msg.sender.toLowerCase() === displayName.toLowerCase()}
            />
          ))}
        </ScrollView>
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