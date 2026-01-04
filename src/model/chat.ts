export interface Chat {
    id: string;
    name: string;
    participants: ChatParticipant[];
    messages: ChatMessageDetail[];
    blocked: boolean;
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

export interface RagUploadResponse {
    success: boolean;
    code: string;
    message: string;
    data: {
        filename: string;
        document_id: string;
        chunks_indexed: number;
    };
}