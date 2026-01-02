import { Box, IconButton, TextField, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';
import React, { useState } from 'react';
import { useSendMessage } from '../../hooks/useChats';

const MAX_LENGTH = 1000;

export function MessageInput({ chatId }: { chatId: string }) {
    const [message, setMessage] = useState('');
    const { sendChatMessage } = useSendMessage(chatId);

    const handleSend = () => {
        if (!message.trim() || message.length > MAX_LENGTH) return;
        sendChatMessage({ content: message });
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const isOverLimit = message.length > MAX_LENGTH;

    return (
        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.2) transparent',
            }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type a message…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    error={isOverLimit}
                    sx={{
                        '& .MuiInputBase-root': {
                            alignItems: 'flex-end',
                        },
                    }}
                />
                <IconButton onClick={handleSend} disabled={isOverLimit}>
                    <Send />
                </IconButton>
            </Box>
            {isOverLimit && (
                <Typography variant="caption" color="error">
                    Message exceeds {MAX_LENGTH} character limit ({message.length}/{MAX_LENGTH})
                </Typography>
            )}
        </Box>
    );
}
