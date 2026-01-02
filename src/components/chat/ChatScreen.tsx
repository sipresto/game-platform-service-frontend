import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useChat } from '../../hooks/useChats';
import { ChatSidebar } from "./ChatSidebar.tsx";
import { ChatPanel } from "./ChatPanel.tsx";
import { useAiChat, AI_CHAT_ID } from '../../hooks/useAiChat';
import { AiChatPanel } from './AiChatPanel';

function RealChatContainer({ id }: { id: string }) {
    const { chat } = useChat(id);
    return <ChatPanel chat={chat} />;
}

function AiChatContainer() {
    const { chat, sendMessage, isPending } = useAiChat();
    return (
        <AiChatPanel
            chat={chat}
            onSend={sendMessage}
            isThinking={isPending}
        />
    );
}

export function ChatScreen() {
    const { id } = useParams<{ id: string }>();

    return (
        <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
            <ChatSidebar selectedChatId={id} />

            {id === AI_CHAT_ID ? (
                <AiChatContainer />
            ) : id ? (
                <RealChatContainer id={id} />
            ) : (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        p: 4,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" color="text.secondary">
                        Welcome to chats
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Select a chat from the sidebar or start a new chat to get started
                    </Typography>
                </Box>
            )}
        </Box>
    );
}