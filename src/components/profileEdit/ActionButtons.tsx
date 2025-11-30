import { Button, Box, Grid, CircularProgress } from '@mui/material';

interface FormState {
    username: string;
    firstName: string;
    displayName: string;
}

interface ActionButtonsProps {
    isDirty: boolean;
    isSubmitting: boolean;
    formState: FormState;
    onReset: () => void;
}

export function ActionButtons({
                                  isDirty,
                                  isSubmitting,
                                  formState,
                                  onReset
                              }: ActionButtonsProps) {
    const isFormValid =
        formState.username.trim() &&
        formState.firstName.trim() &&
        formState.displayName.trim();

    return (
        <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    type="button"
                    variant="outlined"
                    onClick={onReset}
                    disabled={!isDirty || isSubmitting}
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!isDirty || !isFormValid || isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Grid>
    );
}