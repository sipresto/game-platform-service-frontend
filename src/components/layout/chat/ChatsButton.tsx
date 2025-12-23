import { useState } from 'react';
import { Box, IconButton, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import { ChatBubble } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useChats, useCreateChat } from '../../../hooks/useChats.ts';
import { useAllUsers } from "../../../hooks/useUserProfile.ts";
import { useFilteredFriends } from "../../../hooks/useFilteredFriends.ts";
import { ChatPopup } from "./ChatPopup.tsx";
import { ChatListItem } from "../../chat/ChatListItem.tsx";

export function ChatsButton() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const { chats } = useChats();
    const { friends } = useAllUsers();
    const navigate = useNavigate();
    const { createNewChat } = useCreateChat();

    const toggleOpen = () => setOpen(prev => !prev);

    const filteredFriends = useFilteredFriends(friends, search);

    const handleStartChat = (friendId: string) => {
        createNewChat(
            { participantUserIds: [friendId] },
            {
                onSuccess: (chat) => navigate(`/chat/${chat.id}`),
            }
        );
        setOpen(false);
        setSearch('');
    };

    return (
        <>
            <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }}>
                <IconButton
                    size="large"
                    sx={{
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark' },
                        cursor: 'pointer',
                    }}
                    onClick={toggleOpen}
                >
                    <ChatBubble fontSize="large" sx={{ color: 'white' }} />
                </IconButton>
            </Box>

            {open && (
                <ChatPopup>
                    <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Chats</Typography>

                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search friends..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        sx={{ mb: 1 }}
                    />

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
                            {chats?.slice(0, 6).map(chat => (
                                <ChatListItem
                                    key={chat.id}
                                    chat={chat}
                                    onClick={() => navigate(`/chat/${chat.id}`)}
                                />
                            ))}

                            {!chats?.length && (
                                <Typography sx={{ p: 1, color: 'text.secondary' }}>
                                    No chats yet
                                </Typography>
                            )}
                        </>
                    )}
                </ChatPopup>
            )}
        </>
    );
}