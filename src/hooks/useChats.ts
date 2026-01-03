import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { Chat, ChatList, CreateChatRequest, SendMessageRequest } from "../model/chat.ts";
import { createChat, getChatById, getChats, sendMessage } from "../services/chatApi.ts";
import { useEffect } from "react";
import {AI_CHAT_ID} from "./useAiChat.ts";

export function useChats() {
    const { data: chats, isLoading, error } = useQuery<ChatList[]>({
        queryKey: ['chats'],
        queryFn: getChats,
    })
    return {
        chats,
        isLoading,
        error
    }
}

export function useChat(id: string) {
    const { data: chat } = useSuspenseQuery<Chat>({
        queryKey: ['chat', id],
        queryFn: () => getChatById(id),
    })
    return { chat }
}

export function useCreateChat() {
    const queryClient = useQueryClient();

    const { mutate: createNewChat, isPending, isError, error } = useMutation({
        mutationFn: (request: CreateChatRequest) => createChat(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['chats'] });
        }
    });

    return { createNewChat, isPending, isError, error };
}

export function useSendMessage(chatId: string) {
    const queryClient = useQueryClient();

    const { mutate: sendChatMessage, isPending } = useMutation({
        mutationFn: (request: SendMessageRequest) => sendMessage(chatId, request),
        onSuccess: async (updatedChat: Chat) => {
            await queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
            await queryClient.invalidateQueries({ queryKey: ['chats'] });
            queryClient.setQueryData(['chat', chatId], updatedChat);
        }
    });

    return { sendChatMessage, isPending };
}

export function usePollChat(chatId: string, intervalMs: number = 1000) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (chatId === AI_CHAT_ID) return;
        const intervalId = setInterval(async () => {
            await queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
        }, intervalMs);

        return () => clearInterval(intervalId);
    }, [chatId, intervalMs, queryClient]);
}