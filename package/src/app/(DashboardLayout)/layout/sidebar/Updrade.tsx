import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export const Upgrade = () => {
    return (
        <Box
            display='flex'
            alignItems="center"
            gap={2}
            sx={{ mt: 3, p: 3, bgcolor: 'primary.light', borderRadius: '8px' }}
        >
            <Box>
                <Typography variant="h5" sx={{ width: "120px" }} fontSize='16px' mb={1}>
                    ¿Necesitas ayuda?
                </Typography>
                <Button 
                    color="primary" 
                    target="_blank" 
                    disableElevation 
                    component={Link} 
                    href="/support" 
                    variant="contained" 
                    aria-label="support" 
                    size="small"
                >
                    Soporte
                </Button>
            </Box>
        </Box>
    );
};
