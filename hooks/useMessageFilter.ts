import { useRef } from 'react';
import { Message } from '../services/messages';

export const useMessageFilter = () => {
  const processedMessageIds = useRef(new Set<string>());

  const filterUniqueMessages = (newMessages: Message[]) => {
    return newMessages.filter(msg => {
      if (processedMessageIds.current.has(msg.id)) return false;
      processedMessageIds.current.add(msg.id);
      return true;
    });
  };

  const resetProcessedIds = () => {
    processedMessageIds.current.clear();
  };

  return { filterUniqueMessages, resetProcessedIds };
}; 