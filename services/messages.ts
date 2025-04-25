import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    limit,
    startAfter,
    getDocs,
    QueryDocumentSnapshot,
    type DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const CHATTIS_COLLECTION = 'chattis';
const MESSAGES_PER_PAGE = 25;

export interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
}

export const messagesCollection = collection(db, CHATTIS_COLLECTION);


export const listenToMessages = (
    callback: (docs: QueryDocumentSnapshot<DocumentData>[], messages: ChatMessage[]) => void,
    limitCount: number | undefined = MESSAGES_PER_PAGE
) => {
    const q = query(messagesCollection, orderBy('timestamp', 'desc'), limit(limitCount));

    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        })) as ChatMessage[];
  
        callback(snapshot.docs, messages);
      },
      (error) => {
        console.error("onSnapshot error:", error);
      }
    );
};

export const loadMoreMessages = async (
  after: QueryDocumentSnapshot<DocumentData>,
  limitCount: number | undefined = MESSAGES_PER_PAGE
): Promise<{ messages: ChatMessage[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
      const q = query(
      messagesCollection, 
      orderBy('timestamp', 'desc'), 
      startAfter(after), 
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return { messages: [], lastDoc: null };
    }
    
    const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
    })) as ChatMessage[]; 
        
    return {
        messages,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    };
  } catch (error) {
    console.error('Error loading more messages:', error);
    throw error;
  }
};

export const sendMessage = async (text: string, sender: string) => {
    try {
        await addDoc(messagesCollection, {
            text,
            sender,
            timestamp: Timestamp.now(),
        });
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
