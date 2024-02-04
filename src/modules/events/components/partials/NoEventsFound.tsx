import Routes from '@common/defs/routes';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

interface NoEventsFoundProps {
  create?: boolean;
  register?: boolean;
}

const NoEventsFound: React.FC<NoEventsFoundProps> = ({ create = true, register = false }) => {
  const router = useRouter();

  const handleClick = () => {
    if (register) {
      router.push(Routes.Common.Home);
    } else {
      router.push(Routes.Events.CreateOne);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <Box
        component="img"
        sx={{
          height: 250,
          width: 260,
        }}
        alt="event not found image."
        src="/images/illustrations/Image_not_available_icon.png"
      />
      <Typography variant="subtitle2" color="#7f8c8d">
        Il n'y a pas d'événement trouvé.
      </Typography>
      {create && (
        <Button size="large" type="button" variant="contained" onClick={handleClick}>
          Créer un événement
        </Button>
      )}
      {register && (
        <Button size="large" type="button" variant="contained" onClick={handleClick}>
          S'inscrire à un événement
        </Button>
      )}
    </Box>
  );
};

export default NoEventsFound;
