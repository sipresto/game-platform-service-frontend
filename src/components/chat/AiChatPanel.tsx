import { Box } from '@mui/material';
import type { Chat } from '../../model/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { LinearProgress } from '@mui/material';

type Props = {
    chat: Chat;
    onSend: (content: string) => void;
    isThinking: boolean;
};

export function AiChatPanel({ chat, onSend, isThinking }: Props) {
    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ChatHeader name={chat.name} />

            {isThinking && <LinearProgress />}

            <MessageList
                chatId={chat.id}
                messages={chat.messages}
                participants={chat.participants}
            />

            <MessageInput chatId={chat.id} onSendOverride={onSend} />
        </Box>
    );
}
