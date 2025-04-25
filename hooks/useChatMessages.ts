import { useEffect, useRef, useState, useCallback } from 'react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { listenToMessages, loadMoreMessages, type ChatMessage } from '../services/messages';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const unsubscribe = listenToMessages((docs, msgs) => {
      if (isFirstLoad.current) {
        setMessages(msgs);
        // For initial load with desc order, we need the last document (oldest in the set)
        setLastDoc(docs[docs.length - 1] ?? null);
        isFirstLoad.current = false;
      } else {
        setMessages(prev => {
          const prevIds = new Set(prev.map(m => m.id));
          const newMsgs = msgs.filter(m => !prevIds.has(m.id));
          return [...newMsgs, ...prev]; 
        });
      }
    });

    return unsubscribe;
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastDoc || loading) return;
    setLoading(true);
    try {
      const result = await loadMoreMessages(lastDoc, 10);
      
      if (result.messages.length === 0) {
        setLoading(false);
        return;
      }
      
      setMessages(prev => {
        const prevIds = new Set(prev.map(m => m.id));
        const uniqueNew = result.messages.filter(m => !prevIds.has(m.id));
        return [...prev, ...uniqueNew];
      });
      
      setLastDoc(result.lastDoc);
      
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading]);

  return {
    messages,
    loadMore,
    loading
  };
};