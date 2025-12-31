import { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { EmptyFriendRequestsState } from './EmptyFriendRequestsState';
import { FriendRequestsListHeader } from './FriendRequestsListHeader';
import { FriendRequestItem } from './FriendRequestItem';
import type {FriendRequest} from "../../model/userProfile.ts";
import {sortFriendRequestsByDate} from "../../utils/FriendRequestUtils.ts";

interface FriendRequestsListProps {
    friendRequests: FriendRequest[];
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

export function FriendRequestsList({
                                       friendRequests,
                                       onRefresh,
                                       isRefreshing = false
                                   }: FriendRequestsListProps) {
    const [sortedRequests, setSortedRequests] = useState<FriendRequest[]>([]);

    useEffect(() => {
        const sorted = sortFriendRequestsByDate(friendRequests);
        setSortedRequests(sorted);
    }, [friendRequests]);

    if (friendRequests.length === 0) {
        return (
            <EmptyFriendRequestsState
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
            />
        );
    }

    return (
        <Box>
            <FriendRequestsListHeader
                friendRequestCount={friendRequests.length}
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
            />

            <Grid container spacing={3}>
                {sortedRequests.map((request) => (
                    <FriendRequestItem key={request.senderId} request={request} />
                ))}
            </Grid>
        </Box>
    );
}