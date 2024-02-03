import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import RHFImageDropzone from '@common/components/lib/react-hook-form/RHFImageDropzone';
import Routes from '@common/defs/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import useUploads from '@modules/uploads/hooks/api/useUploads';
import { UserInputLabels } from '@modules/users/defs/labels';
import { User } from '@modules/users/defs/types';
import useUsers, { UpdateOneInput } from '@modules/users/hooks/api/useUsers';
import { LockOpen } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface UpdateUserFormProps {
  item: User;
}

const UpdateUserForm = (props: UpdateUserFormProps) => {
  const { item } = props;
  const router = useRouter();
  const { createOne: createOneUpload, updateOne: updateOneUpload } = useUploads();
  const { updateOne: updateOneUser } = useUsers();
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Le format de l'email est incorrect")
      .required('Le champ est obligatoire'),
    password: Yup.string(),
    username: Yup.string().required('Le champ est obligatoire'),
    avatar: Yup.mixed().test('fileType', 'Format de fichier non valide', (value) => {
      if (!value) {
        return true; // No file provided, so no validation needed
      }
      const file = value as File;
      const acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg']; // Add more formats as needed
      return acceptedFormats.includes(file.type);
    }),
  });

  const methods = useForm<UpdateOneInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: item.email,
      password: '',
      username: item.username,
      role: item.rolesNames[0],
      imageId: item.imageId,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data: UpdateOneInput) => {
    if (!item) return;
    if (data.avatar) {
      let uploadResponse;
      const dataUpload = { file: data.avatar };
      if (item.imageId) {
        uploadResponse = await updateOneUpload(item.imageId, dataUpload);
      } else {
        uploadResponse = await createOneUpload(dataUpload);
      }
      console.log(uploadResponse);
      if (uploadResponse.success) {
        data.imageId = uploadResponse.data?.item.id;
      }
    }
    const response = await updateOneUser(item.id, data, {
      displayProgress: true,
      displaySuccess: true,
    });
    if (response.success) {
      router.push(Routes.Users.Profile);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: '800px', margin: 'auto' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container rowSpacing={3} columnSpacing={2} sx={{ padding: 5 }}>
            <Grid item md={4} sm={12} gap={3} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    borderWidth: 2,
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
                  {item.avatar && (
                    <Box
                      component="img"
                      sx={{
                        height: 233,
                        width: 350,
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                        position: 'inherit !important',
                      }}
                      alt="avatar."
                      src={'http://127.0.0.1:8000' + item.avatar.path}
                    />
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item md={8} sm={12}>
              <RHFImageDropzone name="avatar" label="Choisir un nouvel avatar" />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFTextField name="username" label={UserInputLabels.username} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFTextField name="email" label={UserInputLabels.email} type="email" />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFTextField name="password" label={UserInputLabels.password} type="password" />
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
                Mettre à jour les données
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default UpdateUserForm;
