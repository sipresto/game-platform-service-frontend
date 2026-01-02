import {
    Container,
    Paper,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import React, { useState, useContext } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import SecurityContext from '../context/SecurityContext';
import { useProfileForm } from '../hooks/useProfileForm';
import { ProfileTab } from "../components/profileEdit/ProfileTab.tsx";
import { PrivacyTab } from "../components/profileEdit/PrivacyTab.tsx";
import { NotificationPreferencesSection } from "../components/profileEdit/NotificationPreferencesSection.tsx";
import type { FormState } from '../hooks/useProfileForm';

function LoadingState() {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        </Container>
    );
}

function ErrorState({ error }: { error: Error }) {
    const formatErrorMessage = (errorInstance: Error): string => {
        const apiError = errorInstance as { status?: number; statusText?: string; message: string };
        if (apiError.status) {
            const statusText = apiError.statusText ? ` ${apiError.statusText}` : '';
            return `(HTTP ${apiError.status}${statusText}) ${apiError.message}`;
        }
        return errorInstance.message;
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Alert severity="error">Error loading profile: {formatErrorMessage(error)}</Alert>
        </Container>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export function ProfileEditPage() {
    const [currentTab, setCurrentTab] = useState(0);
    const { profile: userProfile, isLoading, error } = useUserProfile();
    const { loggedInUser } = useContext(SecurityContext);

    const loggedInUserOrNull = loggedInUser || null;

    const {
        formState,
        isDirty,
        updateProfileMutation,
        handleFieldChange,
        handleReset,
        handleSubmit
    } = useProfileForm({ userProfile, loggedInUser: loggedInUserOrNull });

    if (isLoading && !loggedInUser) {
        return <LoadingState />;
    }

    if (error && !loggedInUser) {
        return <ErrorState error={error} />;
    }

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const adaptedHandleFieldChange = (field: string, value: string) => {
        handleFieldChange(field as keyof FormState, value);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Settings
            </Typography>

            <Paper sx={{ mt: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="profile settings tabs"
                    sx={{
                        '& .MuiTab-root': {
                            color: 'custom.tabs.inactive',

                            '&:hover': {
                                color: 'custom.tabs.hover',
                            },
                        },
                        '& .Mui-selected': {
                            color: 'custom.tabs.active'
                        },
                    }}
                >
                    <Tab label="Profile" id="profile-tab-0" aria-controls="profile-tabpanel-0" />
                    <Tab label="Privacy" id="profile-tab-1" aria-controls="profile-tabpanel-1" />
                    <Tab label="Notifications" id="profile-tab-2" aria-controls="profile-tabpanel-2" />
                </Tabs>

                <TabPanel value={currentTab} index={0}>
                    <ProfileTab
                        formState={formState}
                        loggedInUser={loggedInUserOrNull}
                        isLoading={isLoading}
                        error={error}
                        isDirty={isDirty}
                        updateProfileMutation={updateProfileMutation}
                        onFieldChange={adaptedHandleFieldChange}
                        onReset={handleReset}
                        onSubmit={handleSubmit}
                    />
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <PrivacyTab />
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                    <NotificationPreferencesSection />
                </TabPanel>
            </Paper>
        </Container>
    );
}