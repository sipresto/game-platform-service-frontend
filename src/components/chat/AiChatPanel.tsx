import { Box, LinearProgress } from '@mui/material';
import type { Chat } from '../../model/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

type Props = {
    chat: Chat;
    onSend: (content: string) => void;
    onUpload: (file: File) => void;
    isThinking: boolean;
};

export function AiChatPanel({ chat, onSend, onUpload, isThinking }: Props) {
    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ChatHeader name={chat.name} />

            {isThinking && <LinearProgress />}

            <MessageList
                chatId={chat.id}
                messages={chat.messages}
                participants={chat.participants}
            />

            <MessageInput
                chatId={chat.id}
                onSendOverride={onSend}
                enableUpload={true}
                onUpload={onUpload}
                isUploading={isThinking}
            />
        </Box>
    );
}