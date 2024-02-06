import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from '@common/components/lib/react-hook-form';
import useEvents, { CreateOneInput } from '@modules/events/hooks/api/useEvents';
import { Card, Grid, MenuItem } from '@mui/material';
import * as Yup from 'yup';
import RHFDatePicker from '@common/components/lib/react-hook-form/RHFDatePicker';
import { Category } from '@modules/categories/defs/types';
import useCategories from '@modules/categories/hooks/api/useCategories';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { LockOpen } from '@mui/icons-material';
import RHFImageDropzone from '@common/components/lib/react-hook-form/RHFImageDropzone';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import useUploads from '@modules/uploads/hooks/api/useUploads';
import { useRouter } from 'next/router';
import Routes from '@common/defs/routes';
import RHFTimePicker from '@common/components/lib/react-hook-form/RHFTimePicker';
import { useState } from 'react';
import useLocations from '@modules/locations/hooks/api/useLocations';
import { EventsInputLabels } from '@modules/events/defs/labels';
import useUtils from '@common/hooks/useUtils';

const CreateEventWithUploadForm = () => {
  const router = useRouter();

  const { items } = useCategories({ fetchItems: true });
  const { createOne } = useEvents();
  const { createOne: createOneUpload } = useUploads();
  const { createOne: createOneLocation } = useLocations();
  const [country, setCountry] = useState<string>('');
  const {
    isEndTimeLaterThanStartTime,
    formatDate,
    formatHours,
    getAllCitiesNamesOfCountry,
    getAllCountryNames,
    getAllStatesNamesOfCountry,
  } = useUtils();
  const currentDate = dayjs().startOf('day');
  const minDate = currentDate.add(1, 'day');
  const maxDate = currentDate.add(1, 'year').add(1, 'day');
  const schema = Yup.object().shape({
    name: Yup.string().required('Le champ est obligatoire'),
    country: Yup.string().required('Le champ est obligatoire'),
    city: Yup.string().required('Le champ est obligatoire'),
    stateProvince: Yup.string(),
    address: Yup.string().required('Le champ est obligatoire'),
    postalCode: Yup.string().required('Le champ est obligatoire'),
    description: Yup.string().required('Le champ est obligatoire'),
    maxNumParticipants: Yup.number()
      .min(1, 'Veuillez choisir un nombre positif supérieur ou égal à un')
      .required('Le champ est obligatoire'),
    date: Yup.date()
      .required('Le champ est obligatoire')
      .min(minDate, 'Veuillez choisir une date dans le futur')
      .max(maxDate, 'Veuillez choisir une date dans la limite')
      .typeError("La date n'est pas valide"),
    categoryId: Yup.number().required('Le champ est obligatoire'),
    image: Yup.mixed()
      .test('fileType', 'Format de fichier non valide', (value) => {
        if (!value) {
          return true; // No file provided, so no validation needed
        }
        const file = value as File;
        const acceptedFormats = [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/bmp',
          'image/svg',
          'image/webp',
        ]; // Add more formats as needed
        return acceptedFormats.includes(file.type);
      })
      .required('Le champ est obligatoire'),
    startTime: Yup.string().required('Le champ est obligatoire'),
    endTime: Yup.string()
      .required('Le champ est obligatoire')
      .test(
        'is-later-than-start',
        "L'heure de fin doit être ultérieure à l'heure de début",
        (endTime: string, { parent }) => {
          const { startTime } = parent;
          if (!startTime || !endTime) {
            // Autoriser les valeurs vides (utilisez "required" pour la validation non vide)
            return true;
          }
          return isEndTimeLaterThanStartTime(startTime, endTime);
        }
      ),
  });
  const methods = useForm<CreateOneInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      date: '',
      endTime: '',
      startTime: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data: CreateOneInput) => {
    data.date = formatDate(data.date);
    data.startTime = formatHours(data.startTime);
    data.endTime = formatHours(data.endTime);
    if (data.image) {
      const dataUpload = { file: data.image };
      const uploadResponse = await createOneUpload(dataUpload);
      if (uploadResponse.success) {
        data.imageId = uploadResponse.data?.item.id as number;
      }
    }
    const dataLocation = {
      country: data.country,
      city: data.city,
      postalCode: data.postalCode,
      address: data.address,
      stateProvince: data.stateProvince,
    };
    const locationResponse = await createOneLocation(dataLocation);
    if (locationResponse.success && locationResponse.data) {
      data.locationId = locationResponse.data.item.id;
    }
    const response = await createOne(data, { displayProgress: true, displaySuccess: true });
    if (response.success) {
      router.push(Routes.Events.ReadAll);
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: '800px', margin: 'auto' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container rowSpacing={3} columnSpacing={2} sx={{ padding: 5 }}>
            <Grid item xs={12} gap={3} display="flex" alignItems="center">
              <RHFImageDropzone name="image" label="Choisir un nouvel image. (jpeg, png, jpg)" />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <RHFTextField name="name" label={EventsInputLabels.name} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFAutocomplete
                options={getAllCountryNames()}
                name="country"
                multiple={false}
                label={EventsInputLabels.country}
                getOptionLabel={(option) => {
                  return option;
                }}
                onChange={(e, value) => setCountry(value || '')}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFAutocomplete
                multiple={false}
                options={getAllStatesNamesOfCountry(country)}
                name="stateProvince"
                label={EventsInputLabels.stateProvince}
                getOptionLabel={(option) => {
                  return option;
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFAutocomplete
                multiple={false}
                options={getAllCitiesNamesOfCountry(country)}
                name="city"
                label={EventsInputLabels.city}
                getOptionLabel={(option) => {
                  return option;
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFTextField name="postalCode" label={EventsInputLabels.postalCode} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFTextField name="address" label={EventsInputLabels.address} type="text" />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="description"
                label={EventsInputLabels.description}
                multiline
                maxRows={4}
                minRows={4}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFTextField
                name="maxNumParticipants"
                label={EventsInputLabels.maxNumParticipants}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFDatePicker
                minDate={minDate}
                disablePast
                name="date"
                label={EventsInputLabels.date}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFTimePicker disablePast name="startTime" label={EventsInputLabels.startTime} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <RHFTimePicker disablePast name="endTime" label={EventsInputLabels.endTime} />
            </Grid>
            <Grid item xs={12}>
              <RHFSelect name="categoryId" label="Catégorie">
                {items?.map((option: Category) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
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
                Créer
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default CreateEventWithUploadForm;
