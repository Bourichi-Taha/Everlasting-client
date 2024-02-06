import { Box, Grid } from '@mui/material';
import React from 'react';
import { Event } from '@modules/events/defs/types';
import NoEventsFound from './NoEventsFound';
import RegisteredEventCard from './RegisteredEventCard';

interface OwnEventsProps {
  events: Event[];
  mutate: () => void;
}

const DashEvents = (props: OwnEventsProps) => {
  const { events, mutate } = props;

  return (
    <Grid container spacing={3} sx={{ padding: 1 }}>
      {events.length !== 0 ? (
        events.map((event) => (
          <Grid item key={event.id} xs={12} sm={12} md={6} lg={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RegisteredEventCard event={event} fetchEvents={mutate} />
            </Box>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <NoEventsFound create />
        </Grid>
      )}
    </Grid>
  );
};

export default DashEvents;
