import { useParams } from 'react-router';
import { Alert, Button, Container, Typography } from '@mui/material';
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton';
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { ProfilePageContent } from "../components/profile/ProfilePageContent.tsx";

export function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    console.log(`received id: ${userId}`);
    if (!userId) {
        return (
            <Container maxWidth="md" sx={ { py: 4 } }>
                <Alert severity="error">
                    <Typography variant="h6" gutterBottom>
                        Profile Not Found
                    </Typography>
                    <Typography variant="body2">
                        Invalid profile ID.
                    </Typography>
                </Alert>
            </Container>
        );
    }

    return (
        <ErrorBoundary
            fallbackRender={ ({ error, resetErrorBoundary }) => (
                <Container maxWidth="md" sx={ { py: 4 } }>
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={ resetErrorBoundary }>
                                Retry
                            </Button>
                        }
                    >
                        <Typography variant="h6" gutterBottom>
                            Profile Not Found
                        </Typography>
                        <Typography variant="body2">
                            { error?.message || 'This profile does not exist or is not available.' }
                        </Typography>
                    </Alert>
                </Container>
            ) }
        >
            <Suspense fallback={ <ProfileSkeleton/> }>
                <ProfilePageContent userId={ userId }/>
            </Suspense>
        </ErrorBoundary>
    )
}
