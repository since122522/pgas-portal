import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const useChatManager = (user) => {
    // Stores the list of conversations (id and title)
    const [conversations, setConversations] = useState([]);
    // Stores the currently active chat, including all messages
    const [activeConversation, setActiveConversation] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Initial load
    const [isReplying, setIsReplying] = useState(false); // For bot replies

    const userId = user?.sub; // Using Google's 'sub' as the unique user ID

    // Fetch initial data (recent chats)
    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        };

        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/chat/recent/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch recent chats');
                
                const recentChats = await response.json();
                setConversations(recentChats);

                // If there are recent chats, load the most recent one
                if (recentChats.length > 0) {
                    await switchConversation(recentChats[0].id);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
                // Handle error state if needed
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [userId]);

    const handleSendMessage = async (input) => {
        if (!input.trim() || !userId) return;

        setIsReplying(true);

        const currentChatId = activeConversation?._id;

        // Optimistically update UI with user message
        const userMessage = { sender: 'user', text: input, _id: Date.now().toString() };
        if (activeConversation) {
            setActiveConversation(prev => ({ ...prev, messages: [...prev.messages, userMessage] }));
        } else {
            setActiveConversation({ messages: [userMessage], title: 'New Chat' });
        }


        try {
            const response = await fetch(`${API_URL}/api/chat/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    text: input,
                    chatId: currentChatId,
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const updatedChat = await response.json();
            
            // Update the entire active conversation with the authoritative server response
            setActiveConversation(updatedChat);

            // Also, update the title in the conversation list if it's a new chat
            setConversations(prev => {
                const chatExists = prev.some(c => c.id === updatedChat._id);
                if (!chatExists) {
                    return [{ id: updatedChat._id, title: updatedChat.title }, ...prev];
                }
                return prev;
            });

        } catch (error) {
            console.error('Send Message Error:', error);
            // Optionally, add an error message to the chat
        } finally {
            setIsReplying(false);
        }
    };
    
    const createNewChat = () => {
        setActiveConversation(null); // Set to null to indicate a new chat
    };
    
    const switchConversation = useCallback(async (id) => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/chat/${id}`);
            if (!response.ok) throw new Error('Failed to fetch conversation');
            const chatData = await response.json();
            setActiveConversation(chatData);
        } catch (error) {
            console.error("Error switching conversation:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        conversations,
        activeConversation,
        isLoading,
        isReplying,
        handleSendMessage,
        createNewChat,
        switchConversation,
    };
};

export default useChatManager;
