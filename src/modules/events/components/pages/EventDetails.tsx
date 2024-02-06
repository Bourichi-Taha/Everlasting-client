import { Event, STATUS } from '@modules/events/defs/types';
import useEvents from '@modules/events/hooks/api/useEvents';
import { Box, Button, Card, Divider, Grid, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import useAuth from '@modules/auth/hooks/api/useAuth';
import CategoryIcon from '@mui/icons-material/Category';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import useUtils from '@common/hooks/useUtils';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';

interface EventDetailsProps {
  item: Event;
  fetchEvent: () => void;
}
const EventDetails = (props: EventDetailsProps) => {
  const { item, fetchEvent } = props;
  const router = useRouter();
  const { subscribe, unsubscribe } = useEvents();
  const { formatDateTime, formatReadableDuration } = useUtils();
  const { user } = useAuth();
  const onSubscribe = async () => {
    const res = await subscribe(
      { eventId: item.id },
      { displayProgress: true, displaySuccess: true }
    );
    if (res.success) {
      fetchEvent();
    }
  };
  const onUnsubscribe = async () => {
    const res = await unsubscribe(
      { eventId: item.id },
      { displayProgress: true, displaySuccess: true }
    );
    if (res.success) {
      fetchEvent();
    }
  };
  const renderStatusNAme = (): string => {
    if (item.statusName === STATUS.UPCOMING) {
      return 'Avenir';
    }
    if (item.statusName === STATUS.TODAY) {
      return "Aujourd'hui";
    }
    if (item.statusName === STATUS.PAST) {
      return 'Passé';
    }
    return 'Annulé';
  };
  return (
    <Grid container spacing={3}>
      <Grid item md={8} sm={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                width: '100%',
                height: '50vh',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                '.avatar': {
                  position: 'inherit !important',
                },
              }}
            >
              {item?.image && (
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    objectFit: 'contain',
                  }}
                  alt="event image."
                  src={process.env.NEXT_PUBLIC_API_URL + item.image.path}
                  className="avatar"
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Description:</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{item.description}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={4} sm={12}>
        <Card sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Tooltip title="Créé par">
                <CoPresentIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {item.owner.username}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Pays, Ville">
                <LocationOnIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {item.location.country + ', ' + item.location.city}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Lieu">
                <MapsHomeWorkIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {item.location.address}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Participants">
                <GroupIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {`${item.registeredNumber}/${item.maxNumParticipants}`}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Date et Heure">
                <CalendarMonthIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {formatDateTime(item.date, item.startTime)}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Durée">
                <AccessTimeIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {formatReadableDuration(item.duration)}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Catégorie">
                <CategoryIcon />
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {item.categoryName}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Status">
                {item.statusName === STATUS.UPCOMING || item.statusName === STATUS.TODAY ? (
                  <EventAvailableIcon />
                ) : (
                  <EventBusyIcon />
                )}
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              {renderStatusNAme()}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => router.back()}
                  sx={{ marginTop: 2 }}
                >
                  Retour
                </Button>
                {user && item.registeredIds.includes(user?.id) ? (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={onUnsubscribe}
                    sx={{ marginTop: 2 }}
                  >
                    Annuler
                  </Button>
                ) : (
                  <Button
                    disabled={
                      item.maxNumParticipants === item.registeredNumber ||
                      item.statusName === STATUS.CANCELED
                    }
                    variant="contained"
                    color="primary"
                    onClick={onSubscribe}
                    sx={{ marginTop: 2 }}
                  >
                    {item.maxNumParticipants === item.registeredNumber ? 'Complet' : "S'inscrire"}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EventDetails;
