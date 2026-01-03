import {Box, Divider, ListItemButton, ListItemText, TextField, Typography} from '@mui/material';
import { useNavigate } from 'react-router';
import { useChats, useCreateChat } from '../../hooks/useChats';
import { ChatListItem } from "./ChatListItem.tsx";
import { useFilteredFriends } from "../../hooks/useFilteredFriends.ts";
import { useAllUsers } from "../../hooks/useUserProfile.ts";
import { useState } from "react";
import { SmartToy } from "@mui/icons-material";
import {AI_CHAT_ID} from "../../hooks/useAiChat.ts";

export function ChatSidebar({ selectedChatId }: { selectedChatId?: string }) {
    const [search, setSearch] = useState('');
    const { chats } = useChats();
    const { friends } = useAllUsers();
    const navigate = useNavigate();
    const { createNewChat } = useCreateChat();

    const filteredFriends = useFilteredFriends(friends, search);

    const handleStartChat = (friendId: string) => {
        createNewChat(
            { participantUserIds: [friendId] },
            {
                onSuccess: (chat) => navigate(`/chat/${chat.id}`),
            }
        );
        setSearch('');
    };

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
                scrollbarColor: 'rgba(0,0,0,0.2) transparent',
            }}
        >
            <Typography sx={{ p: 2, fontWeight: 600 }}>Chats</Typography>

            <TextField
                size="small"
                fullWidth
                placeholder="Search friends..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ mb: 1, px: 2 }}
            />

            {!search && (
                <>
                    <ListItemButton
                        onClick={() => navigate(`/chat/${AI_CHAT_ID}`)}
                        selected={selectedChatId === AI_CHAT_ID}
                        sx={{ mb: 1 }}
                    >
                        <SmartToy sx={{ mr: 2, color: 'primary.main' }} />
                        <ListItemText
                            primary="AI Assistant"
                            secondary="Ask me anything..."
                        />
                    </ListItemButton>
                    <Divider sx={{ my: 1 }} />
                </>
            )}

            {search ? (
                filteredFriends.slice(0, 5).map(friend => (
                    <ListItemButton
                        key={friend.id}
                        onClick={() => handleStartChat(friend.id)}
                    >
                        <ListItemText primary={friend.profile?.displayName || friend.username} />
                    </ListItemButton>
                ))
            ) : (
                <>
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
                </>
            )}
        </Box>
    );
}