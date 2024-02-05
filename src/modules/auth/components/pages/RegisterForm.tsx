import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth, { RegisterInput } from '@modules/auth/hooks/api/useAuth';
import { LockOpen } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Link from '@mui/material/Link';
import Routes from '@common/defs/routes';

const RegisterForm = () => {
  const { register } = useAuth();
  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email("Le format de l'email est incorrect")
      .required('Le champ est obligatoire'),
    password: Yup.string().required('Le champ est obligatoire'),
    username: Yup.string().required('Le champ est obligatoire'),
  });
  const methods = useForm<RegisterInput>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data: RegisterInput) => {
    await register(
      {
        email: data.email,
        password: data.password,
        username: data.username,
      },
      { displayProgress: true, displaySuccess: true }
    );
  };
  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Registration
      </Typography>
      <Card sx={{ maxWidth: '450px', margin: 'auto' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} sx={{ padding: 5 }}>
            <Grid item xs={12}>
              <RHFTextField name="email" label="Email" />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="username" label="Username" />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="password" label="Mot de passe" type="password" />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <LoadingButton
                size="large"
                variant="contained"
                type="submit"
                startIcon={<LockOpen />}
                loadingPosition="start"
                loading={isSubmitting}
              >
                Enregistrer
              </LoadingButton>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Vous avez déja un compte ? {` `}
                <Link href={Routes.Auth.Login}>Cliquez ici</Link>
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default RegisterForm;
