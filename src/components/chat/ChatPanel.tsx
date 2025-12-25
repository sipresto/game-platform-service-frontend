import { Box } from '@mui/material';
import type { Chat } from '../../model/chat';
import { ChatHeader } from './ChatHeader.tsx';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput.tsx';

export function ChatPanel({ chat }: { chat: Chat }) {
    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ChatHeader name={chat.name} />
            <MessageList chatId={chat.id} messages={chat.messages} participants={chat.participants} />
            <MessageInput chatId={chat.id} />
        </Box>
    );
}
