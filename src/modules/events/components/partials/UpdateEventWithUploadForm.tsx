import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from '@common/components/lib/react-hook-form';
import { Event } from '@modules/events/defs/types';
import useEvents, { UpdateOneInput } from '@modules/events/hooks/api/useEvents';
import { Box, Card, Grid, MenuItem, Tooltip } from '@mui/material';
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
import useUtils from '@common/hooks/useUtils';
import useLocations from '@modules/locations/hooks/api/useLocations';
import { EventsInputLabels } from '@modules/events/defs/labels';
import { useState } from 'react';
import RHFTimePicker from '@common/components/lib/react-hook-form/RHFTimePicker';

interface UpdateEventFormProps {
  event: Event;
}

const UpdateEventWithUploadForm = (props: UpdateEventFormProps) => {
  const { event } = props;
  const router = useRouter();
  const {
    formatDate,
    formatHours,
    isEndTimeLaterThanStartTime,
    transformToCustomFormat,
    getAllCitiesNamesOfCountry,
    getAllCountryNames,
    getAllStatesNamesOfCountry,
    isEventDateGreaterThanToday,
  } = useUtils();
  const { items } = useCategories({ fetchItems: true });
  const { createOne: createOneLocation, updateOne: updateOneLocation } = useLocations();
  const { updateOne: updateOneEvent } = useEvents();
  const { createOne: createOneUpload, updateOne: updateOneUpload } = useUploads();
  const [country, setCountry] = useState<string>(event.location.country);
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
    image: Yup.mixed().test('fileType', 'Format de fichier non valide', (value) => {
      if (!value) {
        return true; // No file provided, so no validation needed
      }
      const file = value as File;
      const acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg']; // Add more formats as needed
      return acceptedFormats.includes(file.type);
    }),
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
  const methods = useForm<UpdateOneInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: event.name,
      locationId: event.locationId,
      description: event.description,
      maxNumParticipants: event.maxNumParticipants,
      date: dayjs(event.date),
      imageId: event.imageId,
      categoryId: event.categoryId,
      endTime: transformToCustomFormat(event.endTime),
      startTime: transformToCustomFormat(event.startTime),
      address: event.location.address,
      postalCode: event.location.postalCode,
      stateProvince: event.location.stateProvince,
      city: event.location.city,
      country: event.location.country,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data: UpdateOneInput) => {
    if (!event) return;
    data.date = formatDate(data.date);
    data.startTime = formatHours(data.startTime);
    data.endTime = formatHours(data.endTime);
    if (data.image) {
      let uploadResponse;
      const dataUpload = { file: data.image as File };
      if (event.imageId) {
        uploadResponse = await updateOneUpload(event.imageId, dataUpload);
      } else {
        uploadResponse = await createOneUpload(dataUpload);
      }
      if (uploadResponse.success) {
        data.imageId = uploadResponse.data?.item.id;
      }
    }
    const dataLocation = {
      country: data.country,
      city: data.city,
      postalCode: data.postalCode,
      address: data.address,
      stateProvince: data.stateProvince,
    };
    let locationResponse;
    if (event.locationId) {
      locationResponse = await updateOneLocation(event.locationId, dataLocation);
    } else {
      locationResponse = await createOneLocation(dataLocation);
    }
    if (locationResponse.success && locationResponse.data) {
      data.locationId = locationResponse.data.item.id;
    }
    const response = await updateOneEvent(event.id, data, {
      displayProgress: true,
      displaySuccess: true,
    });
    if (response.success) {
      router.push(Routes.Events.ReadAll);
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
                  }}
                >
                  {event.image && (
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
                      src={process.env.NEXT_PUBLIC_API_URL + event.image.path}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item md={8} xs={12} gap={3} display="flex" alignItems="center">
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
              <Tooltip
                title={
                  isEventDateGreaterThanToday(event.date)
                    ? ''
                    : 'Vous pouvez uniquement mettre à jour les événements à venir.'
                }
              >
                <Box>
                  <LoadingButton
                    size="large"
                    variant="contained"
                    type="submit"
                    startIcon={<LockOpen />}
                    loadingPosition="start"
                    loading={isSubmitting}
                    disabled={!isEventDateGreaterThanToday(event.date)}
                  >
                    Mettre à jour les données
                  </LoadingButton>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default UpdateEventWithUploadForm;
