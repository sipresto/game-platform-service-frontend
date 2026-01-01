import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { askAi } from '../services/chatApi';
import type { Chat, ChatMessageDetail } from '../model/chat';

export const AI_CHAT_ID = 'ai-assistant';

export function useAiChat() {
    const [messages, setMessages] = useState<ChatMessageDetail[]>([
        {
            id: 'welcome-msg',
            senderId: 'ai-bot',
            isMine: false,
            content: "Hello! I am your AI Assistant. I can answer questions about the platform documentation. How can I help?",
            sentAt: new Date().toISOString()
        }
    ]);

    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: async (content: string) => {
            return await askAi(content);
        },
        onMutate: async (content) => {
            const userMsg: ChatMessageDetail = {
                id: crypto.randomUUID(),
                senderId: 'current-user',
                isMine: true,
                content: content,
                sentAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, userMsg]);
        },
        onSuccess: (aiResponse) => {
            const aiMsg: ChatMessageDetail = {
                id: crypto.randomUUID(),
                senderId: 'ai-bot',
                isMine: false,
                content: aiResponse,
                sentAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMsg]);
        },
        onError: () => {
            const errorMsg: ChatMessageDetail = {
                id: crypto.randomUUID(),
                senderId: 'ai-bot',
                isMine: false,
                content: "Sorry, I'm having trouble connecting to the brain right now. Please try again.",
                sentAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        }
    });

    const aiChat: Chat = {
        id: AI_CHAT_ID,
        name: 'AI Assistant',
        participants: [{ id: 'ai-bot', username: 'AI Assistant' }],
        messages: messages
    };

    return {
        chat: aiChat,
        sendMessage,
        isPending
    };
}