import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth, { ResetPasswordInput } from '@modules/auth/hooks/api/useAuth';
import { LockOpen } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';

interface ResetPasswordProps {
  token: string;
}
type ResetPasswordInputForm = Omit<ResetPasswordInput, 'token'>;
const ResetPassword = (props: ResetPasswordProps) => {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Le format de l'email est incorrect")
      .required('Le champ est obligatoire'),
    password: Yup.string().required('Le champ est obligatoire'),
    passwordConfirmation: Yup.string()
      .required('Le champ est obligatoire')
      .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas'),
  });
  const methods = useForm<ResetPasswordInputForm>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data: ResetPasswordInputForm) => {
    const res = await resetPassword(
      {
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        token: props.token,
      },
      { displayProgress: true, displaySuccess: true }
    );
    if (res.success) {
      router.push(Routes.Auth.Login);
    }
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
        Modifier le mot de passe
      </Typography>
      <Card sx={{ maxWidth: '450px', margin: 'auto' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} sx={{ padding: 5 }}>
            <Grid item xs={12}>
              <RHFTextField name="email" label="Email" />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="password" label="Mot de passe" type="password" />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="passwordConfirmation"
                label="Confirmation du mot de passe"
                type="password"
              />
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
                Modifier mon mot de passe
              </LoadingButton>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Vous avez retrouvé votre mot de passe ? {` `}
                <Link href={Routes.Auth.Login}>Cliquez ici</Link>
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default ResetPassword;
