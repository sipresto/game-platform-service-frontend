import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { useChats } from '../../hooks/useChats';
import { ChatListItem } from "./ChatListItem.tsx";

export function ChatSidebar({ selectedChatId }: { selectedChatId: string }) {
    const { chats } = useChats();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: 280,
                borderRight: '1px solid',
                borderColor: 'divider',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.3) transparent',
            }}
        >
            <Typography sx={{ p: 2, fontWeight: 600 }}>Chats</Typography>

            {chats?.map(chat => (
                <ChatListItem
                    key={chat.id}
                    chat={chat}
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    selected={chat.id === selectedChatId}
                />
            ))}

            {!chats?.length && (
                <Typography sx={{ p: 2, color: 'text.secondary' }}>
                    No chats yet
                </Typography>
            )}
        </Box>
    );
}
