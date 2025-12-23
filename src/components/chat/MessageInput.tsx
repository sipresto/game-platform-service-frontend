import { Box, IconButton, TextField } from '@mui/material';
import { Send } from '@mui/icons-material';
import React, { useState } from 'react';
import { useSendMessage } from '../../hooks/useChats';

const MAX_LENGTH = 2000;

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

    return (
        <Box
            sx={{
                p: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'flex-end',
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
            <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type a message…"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                helperText={`${message.length}/${MAX_LENGTH}`}
            />
            <IconButton onClick={handleSend}>
                <Send />
            </IconButton>
        </Box>
    );
}
