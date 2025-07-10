import { createContext } from 'react';

export const FeedbackContext = createContext({
  feedback: null,
  setFeedback: () => {},
});