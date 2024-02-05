import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  CardActions,
  Button,
  useTheme,
  Grid,
  Tooltip,
  Divider,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useRouter } from 'next/router';
import Routes from '@common/defs/routes';
import useEvents from '@modules/events/hooks/api/useEvents';
import { Event } from '@modules/events/defs/types';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';
import CategoryIcon from '@mui/icons-material/Category';
import useUtils from '@common/hooks/useUtils';

// Define the interface for the component's props
interface EventCardProps {
  event: Event;
  fetchEvents: () => void;
}

// EventCard component
const UserEventCard: React.FC<EventCardProps> = (props: EventCardProps) => {
  const router = useRouter();
  const { formatDateTime } = useUtils();
  const { event, fetchEvents } = props;
  const { deleteOne } = useEvents();
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const theme = useTheme();

  const cancelHandler = async () => {
    if (toDeleteId !== null) {
      const res = await deleteOne(toDeleteId, {
        displayProgress: true,
        displaySuccess: true,
        softDelete: true,
      });
      if (res.success) {
        setToDeleteId(null);
        fetchEvents();
      }
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        m: 2,
        boxShadow: 4,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        },
      }}
    >
      {event.image && (
        <CardMedia
          component="img"
          height="140"
          image={process.env.NEXT_PUBLIC_API_URL + event.image.path}
          alt={event.name}
        />
      )}
      <CardContent sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={event.name}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                textTransform: 'capitalize',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                WebkitLineClamp: 1,
                maxHeight: 30,
              }}
            >
              {event.name}
            </Typography>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Tooltip title={formatDateTime(event.date, event.startTime)}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CalendarMonthIcon />
              <Box
                sx={{
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  WebkitLineClamp: 1,
                  maxHeight: 30,
                }}
              >
                {formatDateTime(event.date, event.startTime)}
              </Box>
            </Typography>
          </Tooltip>
          <Tooltip title={event.location.country + ', ' + event.location.city}>
            <Box
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'flex-end',
                width: '40%',
              }}
            >
              <LocationOnIcon />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  minWidth: 'calc(100% - 24px - 8px)',
                  textTransform: 'capitalize',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  WebkitLineClamp: 1,
                  maxHeight: 30,
                }}
              >
                {event.location.country + ', ' + event.location.city}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Tooltip title={`${event.registeredNumber}/${event.maxNumParticipants}`}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <GroupIcon /> {`${event.registeredNumber}/${event.maxNumParticipants}`}
            </Typography>
          </Tooltip>
          <Tooltip title={event.categoryName}>
            <Box
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'flex-end',
                width: '40%',
              }}
            >
              <CategoryIcon />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  minWidth: 'calc(100% - 24px - 8px)',
                  textTransform: 'capitalize',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  WebkitLineClamp: 1,
                  maxHeight: 30,
                }}
              >
                {event.categoryName}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        <Divider sx={{ mt: 1 }} />
        <Typography
          variant="body1"
          color="black"
          sx={{
            mt: 1,
            minHeight: 102,
            maxHeight: 116,
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            WebkitLineClamp: 5,
            [theme.breakpoints.up('sm')]: {
              minHeight: 116,
              maxHeight: 116,
              WebkitLineClamp: 5,
            },
            [theme.breakpoints.up('md')]: {
              minHeight: 116,
              maxHeight: 116,
              WebkitLineClamp: 5,
            },
            [theme.breakpoints.up('lg')]: {
              minHeight: 102,
              maxHeight: 102,
              WebkitLineClamp: 4,
            },
          }}
        >
          {event.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, bgcolor: '#e0e0e0' }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() =>
                router.push(Routes.Events.ViewOne.replace('{id}', event.id.toString()))
              }
            >
              Détails
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() =>
                router.push(Routes.Events.UpdateOne.replace('{id}', event.id.toString()))
              }
            >
              Modifier
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => setToDeleteId(event.id)}
            >
              Annuler
            </Button>
          </Grid>
        </Grid>
        <ConfirmDialog
          open={toDeleteId !== null}
          onClose={() => setToDeleteId(null)}
          title="Annuler"
          content={
            <Typography variant="body1" color="textSecondary">
              Êtes-vous sûr de vouloir annuler cet événement ? <br /> Cette action est irréversible.
            </Typography>
          }
          action={
            <Button variant="contained" color="error" onClick={cancelHandler}>
              Confirmer
            </Button>
          }
        />
      </CardActions>
    </Card>
  );
};

export default UserEventCard;
