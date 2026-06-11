import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

export const Dashboard = () => (
    <div style={{ marginTop: '20px' }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: '#f8fafc' }}>
            Driving School Performance Central
        </Typography>
        
        <Grid container spacing={3}>
            {/* Metric Card 1 */}
            <Grid item xs={12} sm={4}>
                <Card sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>Total Bookings Received</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, my: 1 }}>142</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6 }}>+12% tracking growth this week</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Metric Card 2 */}
            <Grid item xs={12} sm={4}>
                <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white' }}>
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>Active Fleet Courses</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, my: 1 }}>8 Live</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6 }}>2 custom catalogs queued</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Metric Card 3 */}
            <Grid item xs={12} sm={4}>
                <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', color: 'white' }}>
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>Pending Review Leads</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, my: 1 }}>24</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6 }}>Action required via enlists</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>
);