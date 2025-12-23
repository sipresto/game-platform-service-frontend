import { Box } from '@mui/material';
import { useParams } from 'react-router';
import { useChat } from '../../hooks/useChats';
import { ChatSidebar } from "./ChatSidebar.tsx";
import { ChatPanel } from "./ChatPanel.tsx";

export function ChatScreen() {
    const { id } = useParams<{ id: string }>();
    const { chat } = useChat(id!);

    return (
        <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
            <ChatSidebar selectedChatId={chat.id} />
            <ChatPanel chat={chat} />
        </Box>
    );
}