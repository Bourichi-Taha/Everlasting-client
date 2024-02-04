import { Box, Card, Grid } from '@mui/material';
import React from 'react';
import UserEventCard from './UserEventCard';
import { Event } from '@modules/events/defs/types';
import NoEventsFound from './NoEventsFound';

interface OwnEventsProps {
  events: Event[];
  fetchEvents: () => void;
}

const OwnEvents = (props: OwnEventsProps) => {
  const { events, fetchEvents } = props;

  return (
    <Card sx={{ minHeight: 150 }}>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        {events.length !== 0 ? (
          events.map((event) => (
            <Grid item key={event.id} xs={12} sm={12} md={6} lg={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserEventCard event={event} fetchEvents={fetchEvents} />
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <NoEventsFound create={false} />
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default OwnEvents;
