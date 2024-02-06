import { Box, Card, CircularProgress, Grid } from '@mui/material';
import React from 'react';
import UserEventCard from './UserEventCard';
import { Event } from '@modules/events/defs/types';
import NoEventsFound from './NoEventsFound';

interface OwnEventsProps {
  events: Event[];
  fetchEvents: () => void;
  loaded: boolean;
}

const OwnEvents = (props: OwnEventsProps) => {
  const { events, fetchEvents, loaded } = props;
  const renderEvents = () => {
    if (!loaded) {
      return (
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress color="primary" />
        </Grid>
      );
    }
    if (events.length !== 0) {
      return events.map((event) => (
        <Grid item key={event.id} xs={12} sm={12} md={6} lg={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserEventCard event={event} fetchEvents={fetchEvents} />
          </Box>
        </Grid>
      ));
    }
    return (
      <Grid item xs={12}>
        <NoEventsFound create={false} />
      </Grid>
    );
  };
  return (
    <Card sx={{ minHeight: 150 }}>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        {renderEvents()}
      </Grid>
    </Card>
  );
};

export default OwnEvents;
