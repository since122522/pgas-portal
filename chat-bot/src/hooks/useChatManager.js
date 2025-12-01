import { useState, useEffect } from 'react';

const generateId = () => Math.random().toString(36).substr(2, 9);

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "https://workflow.pgas.ph/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat";

const useChatManager = () => {
    const [conversations, setConversations] = useState(() => {
        try {
            const savedConversations = localStorage.getItem('chatConversations');
            if (savedConversations) {
                const parsed = JSON.parse(savedConversations);
                // Basic validation
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Failed to load conversations from localStorage", error);
        }
        // Return default if nothing in localStorage or if parsing fails
        const initialConversationId = generateId();
        return [{ 
            id: initialConversationId, 
            title: 'New Chat', 
            messages: [] 
        }];
    });

    const [activeConversationId, setActiveConversationId] = useState(() => {
        const savedActiveId = localStorage.getItem('activeChatId');
        const initialConversation = conversations[0];
        return savedActiveId || initialConversation.id;
    });
    
    const [isLoading, setIsLoading] = useState(false);

    // Persist to localStorage whenever conversations or active ID change
    useState(() => {
        try {
            localStorage.setItem('chatConversations', JSON.stringify(conversations));
            localStorage.setItem('activeChatId', activeConversationId);
        } catch (error) {
            console.error("Failed to save conversations to localStorage", error);
        }
    }, [conversations, activeConversationId]);

    const getActiveConversation = () => {
        return conversations.find(c => c.id === activeConversationId) || conversations[0];
    };

    const handleSendMessage = async (input) => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user', id: generateId() };
        
        // Update the state for the active conversation
        const updatedConversations = conversations.map(c => 
            c.id === activeConversationId
                ? { ...c, messages: [...c.messages, userMessage] }
                : c
        );
        setConversations(updatedConversations);
        setIsLoading(true);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, chatId: activeConversationId }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const botResponseText = data.output || data.text || data.response || data.message || JSON.stringify(data);
            const botMessage = { text: botResponseText, sender: 'bot', id: generateId() };

            const finalConversations = updatedConversations.map(c => 
                c.id === activeConversationId
                    ? { ...c, messages: [...c.messages, botMessage] }
                    : c
            );
            setConversations(finalConversations);

        } catch (error) {
            console.error('Webhook Error:', error);
            const errorMessage = { text: "Pasensya, naay problema sa connection sa server.", sender: 'bot', id: uuidv4() };
            const errorConversations = updatedConversations.map(c => 
                c.id === activeConversationId
                    ? { ...c, messages: [...c.messages, errorMessage] }
                    : c
            );
            setConversations(errorConversations);
        } finally {
            setIsLoading(false);
        }
    };

    const createNewChat = () => {
        const newId = uuidv4();
        const newConversation = {
            id: newId,
            title: 'New Chat',
            messages: [],
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newId);
    };

    const switchConversation = (id) => {
        setActiveConversationId(id);
    };

    return {
        conversations,
        activeConversation: getActiveConversation(),
        isLoading,
        handleSendMessage,
        createNewChat,
        switchConversation,
    };
};

export default useChatManager;
