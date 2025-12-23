export interface Chat {
    id: string;
    name: string;
    participants: ChatParticipant[];
    messages: ChatMessageDetail[];
}

export interface ChatParticipant {
    id: string;
    username: string;
}

export interface ChatMessageDetail {
    id: string;
    senderId: string;
    isMine: boolean;
    content: string;
    sentAt: string;
}

export interface CreateChatRequest {
    participantUserIds: string[];
}

export interface SendMessageRequest {
    content: string;
}

export interface ChatList {
    id: string;
    name: string;
    lastMessage: ChatListMessage;
}

export interface ChatListMessage {
    content: string;
    sentAt: string;
    isMine: boolean;
    senderName: string;
}