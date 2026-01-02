import { Box, IconButton, TextField, Typography, CircularProgress } from '@mui/material';
import { Send, AttachFile } from '@mui/icons-material';
import React, { useState, useRef } from 'react';
import { useSendMessage } from '../../hooks/useChats';

const MAX_LENGTH = 1000;

type Props = {
    chatId: string;
    onSendOverride?: (msg: string) => void;
    enableUpload?: boolean;
    onUpload?: (file: File) => void;
    isUploading?: boolean;
};

export function MessageInput({ chatId, onSendOverride, enableUpload = false, onUpload, isUploading = false }: Props) {
    const [message, setMessage] = useState('');
    const { sendChatMessage: sendDbMessage } = useSendMessage(chatId);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (!message.trim() || message.length > MAX_LENGTH) return;

        if (onSendOverride) {
            onSendOverride(message);
        } else {
            sendDbMessage({ content: message });
        }

        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && onUpload) {
            onUpload(e.target.files[0]);
        }
        if (e.target.value) e.target.value = '';
    };

    const isOverLimit = message.length > MAX_LENGTH;

    return (
        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
            }}>
                {enableUpload && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".pdf,.txt,.md,.docx"
                        />
                        <IconButton
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            color="primary"
                        >
                            {isUploading ? <CircularProgress size={24} /> : <AttachFile />}
                        </IconButton>
                    </>
                )}

                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type a message…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    error={isOverLimit}
                    disabled={isUploading}
                    sx={{
                        '& .MuiInputBase-root': {
                            alignItems: 'flex-end',
                        },
                    }}
                />
                <IconButton onClick={handleSend} disabled={isOverLimit || isUploading || !message.trim()}>
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