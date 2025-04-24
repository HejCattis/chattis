import { useRef } from 'react';
import { ScrollView } from 'react-native';

export const useScrollHandler = (onLoadMore: () => void) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const lastScrollY = useRef(0);
  const initialScrollDone = useRef(false);

  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    }, 100);
  };

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }) => {
    if (!initialScrollDone.current) return;
    
    const { y } = event.nativeEvent.contentOffset;
    const isScrollingUp = y < lastScrollY.current;
    
    if (isScrollingUp && y <= 10) {
      onLoadMore();
    }
    
    lastScrollY.current = y;
  };

  return { scrollViewRef, scrollToBottom, handleScroll, initialScrollDone };
}; 