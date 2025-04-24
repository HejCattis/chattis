import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const CHATTIS_COLLECTION = 'chattis';
const MESSAGES_PER_PAGE = 25;

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

export const messagesCollection = collection(db, CHATTIS_COLLECTION);

// Keep track of the last document for pagination
let lastVisibleDoc: QueryDocumentSnapshot | null = null;

export const subscribeToMessages = (callback: (messages: Message[]) => void) => {
  const q = query(
    messagesCollection, 
    orderBy('timestamp', 'desc'),
    limit(MESSAGES_PER_PAGE)
  );
  
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
    }
    
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as Message[];
    
    callback(messages);
  });
};

export const loadMoreMessages = async (): Promise<Message[]> => {
  if (!lastVisibleDoc) {
    return [];
  }
  
  const q = query(
    messagesCollection,
    orderBy('timestamp', 'desc'),
    startAfter(lastVisibleDoc),
    limit(MESSAGES_PER_PAGE)
  );
  
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
  }
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate()
  })) as Message[];
};

export const sendMessage = async (text: string, sender: string) => {
  try {
    await addDoc(messagesCollection, {
      text,
      sender,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}; 