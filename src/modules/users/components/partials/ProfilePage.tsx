import Routes from '@common/defs/routes';
import useProgressBar from '@common/hooks/useProgressBar';
import useAuth from '@modules/auth/hooks/api/useAuth';
// import EventCard from '@modules/events/components/partials/EventCard';
// import NoEventsFound from '@modules/events/components/partials/NoEventsFound';
import { Event } from '@modules/events/defs/types';
import useEvents from '@modules/events/hooks/api/useEvents';
import { User } from '@modules/users/defs/types';
import { Box, Button, Card, Divider, Grid, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserInputLabels } from '@modules/users/defs/labels';
import { Email } from '@mui/icons-material';

interface ProfilePageProps {
  item: User;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { item } = props;
  const { readAllRegistered, mutate } = useEvents();
  const { start, stop } = useProgressBar();
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState<null | Event[]>(null);
  const [refetch, setRefetch] = useState<number>(0);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (loaded) {
      stop();
    } else {
      start();
    }
  }, [loaded]);

  useEffect(() => {
    fetchMyEvents();
  }, [refetch]);

  const fetchMyEvents = async () => {
    const { data } = await readAllRegistered();
    if (data) {
      if (data.items) {
        setItems(data.items);
      }
    }
    setLoaded(true);
  };

  const startEdit = () => {
    if (user?.id) {
      router.push(Routes.Users.UpdateProfile);
    }
  };

  return (
    <>
      {/* <Card sx={{ minHeight: 150, width: '100%' }}>
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Événements enregistrés
            </Typography>
          </Grid>
          {/* {items && items?.length !== 0 ? (
            items.map((event) => (
              <Grid item key={event.id} xs={12} sm={12} md={6} lg={4}>
                <EventCard {...event} mutate={mutate} setRefetch={setRefetch} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <NoEventsFound create={false} register />
            </Grid>
          )} 
        </Grid>
      </Card>  */}
      <Grid container spacing={1} sx={{ padding: 1 }}>
        <Grid item lg={9} sx={{ border: '1px solid red' }}></Grid>
        <Grid item lg={3} sx={{ border: '1px solid black' }}>
          <Card
            sx={{
              paddingX: 3,
              paddingY: 3,
              pt: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                right: '50%',
                height: 80,
                width: 80,
                backgroundColor: 'transparent',
                transform: 'translateY(-50%) translateX(-50%)',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `4px solid #f2f2f2`,
              }}
            >
              <Box
                component="img"
                sx={{
                  height: 80,
                  objectFit: 'cover',
                }}
                alt="avatar."
                src={
                  item.avatar
                    ? 'http://127.0.0.1:8000' + item.avatar.path
                    : '/images/illustrations/Image_not_available_icon.png'
                }
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={2}>
                <Tooltip title={UserInputLabels.email}>
                  <Email />
                </Tooltip>
              </Grid>
              <Grid item xs={10}>
                {item.email}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={2}>
                <Tooltip title={UserInputLabels.username}>
                  <AccountCircleIcon />
                </Tooltip>
              </Grid>
              <Grid item xs={10} textTransform="capitalize">
                {item.username}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button variant="contained" color="primary" onClick={startEdit}>
                    Modifier
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfilePage;
