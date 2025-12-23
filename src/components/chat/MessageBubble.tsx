import { Box, Typography } from '@mui/material';
import type { ChatMessageDetail } from "../../model/chat.ts";

type Props = {
    message: ChatMessageDetail;
    showName: boolean;
    senderName: string;
};

export function MessageBubble({ message, showName, senderName }: Props) {
    const time = new Date(message.sentAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.isMine ? 'flex-end' : 'flex-start',
                mb: 0.5,
            }}
        >
            {showName && (
                <Typography variant="caption" color="text.secondary">
                    {senderName}
                </Typography>
            )}

            <Box
                sx={{
                    bgcolor: message.isMine ? 'primary.main' : 'grey.300',
                    color: message.isMine ? 'white' : 'black',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                }}
            >
                <Typography
                    sx={{
                        whiteSpace: 'pre-wrap',
                        textAlign: message.isMine ? 'right' : 'left',
                    }}
                >
                    {message.content}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, float: 'right' }}>
                    {time}
                </Typography>
            </Box>
        </Box>
    );
}
