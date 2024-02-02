import ForbiddenIllustration from '@common/assets/svgs/ForbiddenIllustration';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import Routes from '@common/defs/routes';
import { Box } from '@mui/material';

const Forbidden = () => {
  return (
    <Container className="flex flex-col items-center justify-center pt-12" maxWidth="xs">
      <Typography variant="h3" paragraph className="mb-6" textAlign="center">
        Accès non autorisé
      </Typography>
      <Typography
        variant="body1"
        paragraph
        className="mb-6 text-center"
        textAlign="center"
        sx={{ color: 'text.secondary' }}
      >
        Désolé, l'accès à cette page est limité.
        <br />
        Veuillez contacter votre administrateur système.
      </Typography>
      <ForbiddenIllustration
        sx={{
          width: '100%',
          marginTop: '2rem',
          marginBottom: '4rem',
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Button component={NextLink} href={Routes.Common.Home} size="large" variant="contained">
          RETOURNER À L'ACCUEIL
        </Button>
      </Box>
    </Container>
  );
};

export default Forbidden;
