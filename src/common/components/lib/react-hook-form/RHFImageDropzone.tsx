import { useFormContext, Controller } from 'react-hook-form';
import { Box, Chip, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { DragEvent, useRef, useState } from 'react';

type Props = {
  name: string;
  label: string;
  helperText?: string;
};

const RHFImageDropzone = ({ name, label, helperText, ...other }: Props) => {
  const { control } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            border: '1px dashed transparent',
            borderRadius: 1,
            height: 175,
            padding: 2,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: 'secondary.dark',
              color: 'common.white',
            },
            ...(dragActive && {
              backgroundColor: 'secondary.dark',
              color: 'common.white',
            }),
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(event) => handleDrag(event)}
          onDragLeave={(event) => handleDrag(event)}
          onDragOver={(event) => handleDrag(event)}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const files = e.dataTransfer.files;
              const file = files[0];
              field.onChange(file);
            }
          }}
        >
          <CloudUpload fontSize="large" sx={{ marginBottom: 1 }} />
          <Typography variant="h6" sx={{ cursor: 'pointer' }} textAlign="center">
            {label}
          </Typography>
          <Typography variant="body1" sx={{ cursor: 'pointer' }} textAlign="center">
            Faites glisser votre image SVG ici ou cliquez pour sélectionner un fichier
          </Typography>
          <input
            onChange={() => {
              if (
                fileInputRef.current &&
                fileInputRef.current.files &&
                fileInputRef.current.files[0]
              ) {
                const files = fileInputRef.current?.files;
                const file = files[0];
                field.onChange(file);
              }
            }}
            {...other}
            type="file"
            accept="image/svg+xml"
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          {field.value && (
            <Chip
              label={field.value.name}
              variant="filled"
              sx={{
                marginTop: 2,
                height: 30,
                backgroundColor: 'grey.800',
                color: 'common.white',
              }}
            />
          )}
          {error && (
            <Chip
              label={error.message}
              color="error"
              variant="filled"
              sx={{
                marginTop: 2,
                height: 30,
              }}
            />
          )}
          {!error && helperText && (
            <Chip
              label={helperText}
              color="error"
              variant="filled"
              sx={{
                marginTop: 2,
                height: 30,
              }}
            />
          )}
        </Box>
      )}
    />
  );
};

export default RHFImageDropzone;
