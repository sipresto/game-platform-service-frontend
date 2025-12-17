import type { Session } from "../model/session";

export interface EnhancedSession extends Session {
    enhancedUserResult: 'WIN' | 'LOSS' | 'DRAW';
    isAgainstAI: boolean;
    userResultLabel: string;
}

export function getEnhancedUserResult(
    session: Session,
    currentUserId: string | undefined
): 'WIN' | 'LOSS' | 'DRAW' {
    if (!currentUserId) return 'DRAW';

    if (session.result === 'AI_WIN') {
        return 'LOSS';
    }

    if (session.result === 'DRAW') {
        return 'DRAW';
    }

    if (session.result === 'PLAYER_WIN') {
        if (session.winnerId === currentUserId) {
            return 'WIN';
        } else if (session.playerIds?.length === 1 && session.playerIds[0] === currentUserId) {
            return 'WIN';
        } else if (session.playerIds?.includes(currentUserId)) {
            return 'LOSS';
        } else {
            return 'LOSS';
        }
    }

    return 'DRAW';
}

export function isAgainstAI(session: Session): boolean {
    return session.result === 'AI_WIN' || (session.playerIds && session.playerIds.length === 1);
}

export function enhanceSession(
    session: Session,
    currentUserId: string | undefined
): EnhancedSession {
    const enhancedResult = getEnhancedUserResult(session, currentUserId);
    const userResultLabel = enhancedResult === 'WIN' ? 'Win' :
        enhancedResult === 'LOSS' ? 'Loss' : 'Draw';

    return {
        ...session,
        enhancedUserResult: enhancedResult,
        isAgainstAI: isAgainstAI(session),
        userResultLabel
    };
}