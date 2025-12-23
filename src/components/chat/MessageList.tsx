import { Box, Chip } from '@mui/material';
import { useEffect, useRef } from 'react';
import type { ChatMessageDetail, ChatParticipant } from '../../model/chat';
import { MessageBubble } from './MessageBubble';
import { isSameDay } from 'date-fns';

type Props = {
    messages: ChatMessageDetail[];
    participants: ChatParticipant[];
};

export function MessageList({ messages, participants }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    let lastSenderId: string | null = null;
    let lastDate: Date | null = null;

    const getName = (msg: ChatMessageDetail) => {
        if (msg.isMine) return 'You';
        return participants.find(p => p.id === msg.senderId)?.username ?? 'User';
    };

    // 🔽 Auto scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        el.scrollTo({
            top: el.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages.length]);

    return (
        <Box
            ref={containerRef}
            sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
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
            {messages.map(msg => {
                const date = new Date(msg.sentAt);
                const showDate = !lastDate || !isSameDay(lastDate, date);
                const showName = msg.senderId !== lastSenderId;

                lastSenderId = msg.senderId;
                lastDate = date;

                return (
                    <Box key={msg.id}>
                        {showDate && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <Chip label={date.toLocaleDateString()} size="small" />
                            </Box>
                        )}

                        <MessageBubble
                            message={msg}
                            showName={showName}
                            senderName={getName(msg)}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}
