import { useFormContext, Controller } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormControl, FormHelperText } from '@mui/material';
import 'dayjs/locale/fr';
import { Dayjs } from 'dayjs';
import { frFR } from '@mui/x-date-pickers';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';

type Props = TimePickerProps<Dayjs> & {
  name: string;
  helperText?: string;
};

const frenchLocale = frFR.components.MuiLocalizationProvider.defaultProps.localeText;
frenchLocale.fieldDayPlaceholder = () => 'JJ';
frenchLocale.fieldYearPlaceholder = (params: { digitAmount: number }) =>
  'A'.repeat(params.digitAmount);

const RHFTimePicker = ({ name, helperText, ...other }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="fr"
          localeText={frenchLocale}
        >
          <FormControl fullWidth error={!!error} color="error">
            <TimePicker
              {...field}
              value={field.value ? field.value : null}
              onChange={(date) => field.onChange(date)}
              {...other}
              slotProps={{
                ...other.slotProps,
                textField: {
                  error: !!error,
                },
              }}
            />
            {error && <FormHelperText>{error?.message}</FormHelperText>}
            {!error && helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        </LocalizationProvider>
      )}
    />
  );
};

export default RHFTimePicker;
