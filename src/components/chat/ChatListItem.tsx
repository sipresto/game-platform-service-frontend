import { Box, ListItemButton, Typography } from '@mui/material';
import { formatDistanceToNowStrict } from 'date-fns';
import type { ChatList } from "../../model/chat.ts";

type Props = {
    chat: ChatList;
    onClick: () => void;
    selected?: boolean;
};

export function ChatListItem({ chat, onClick, selected = false }: Props) {
    const lastMessage = chat.lastMessage;

    const secondaryText = lastMessage
        ? `${lastMessage.isMine ? 'You' : lastMessage.senderName}: ${lastMessage.content}`
        : '';

    const timeAgo = lastMessage
        ? formatDistanceToNowStrict(new Date(lastMessage.sentAt))
        : '';

    return (
        <ListItemButton
            onClick={onClick}
            selected={selected}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', py: 1 }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {chat.name || 'Chat'}
                </Typography>

                {timeAgo && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                        {timeAgo}
                    </Typography>
                )}
            </Box>

            {secondaryText && (
                <Typography
                    variant="body2"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'text.secondary',
                    }}
                >
                    {secondaryText}
                </Typography>
            )}
        </ListItemButton>
    );
}
