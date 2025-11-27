import { useState, useRef, useEffect } from 'react';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

export const useChat = () => {
  const [messages, setMessages] = useState([
    { text: "Maayong Pasko! 🎄 I'm the PGAS Smart Assistant. Unsa akong matabang nimo?", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageText = input;
    setMessages((prev) => [...prev, { text: userMessageText, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageText, chatId: 'unique-user-id' }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const botResponse = data.output || data.text || data.response || data.message || JSON.stringify(data);
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);

    } catch (error) {
      console.error('Webhook Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: "Pasensya, naay problema sa connection sa server. Please try again later.", sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    isLoading,
    messagesEndRef,
    setInput,
    handleSendMessage,
  };
};
