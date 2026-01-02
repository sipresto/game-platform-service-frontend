import type {Chat, ChatList, CreateChatRequest, SendMessageRequest} from "../model/chat.ts";
import apiClient from "./axiosInstance.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getChats(): Promise<ChatList[]> {
    const { data } = await apiClient.get<ChatList[]>(
        `${BACKEND_URL}/chats`,
    );
    return data;
}

export async function getChatById(id: string): Promise<Chat> {
    const { data } = await apiClient.get<Chat>(
        `${BACKEND_URL}/chats/${id}`,
    );
    return data;
}

export async function createChat(request: CreateChatRequest): Promise<Chat> {
    const { data } = await apiClient.post<Chat>(
        `${BACKEND_URL}/chats`,
        request
    );
    return data;
}

export async function sendMessage(id: string, request: SendMessageRequest): Promise<Chat> {
    const { data } = await apiClient.post<Chat>(
        `${BACKEND_URL}/chats/${id}/message`,
        request
    );
    return data;
}

export async function askAi(message: string): Promise<string> {
    const { data } = await apiClient.post<string>(
        `${BACKEND_URL}/ai/chat`,
        { message }
    );
    return data;
}