import { RHFTextField } from '@common/components/lib/react-hook-form';
import UpdateCrudItemForm from '@common/components/partials/UpdateCrudItemForm';
import Routes from '@common/defs/routes';
import { Category } from '@modules/categories/defs/types';
import useCategories, { UpdateOneInput } from '@modules/categories/hooks/api/useCategories';
import { Grid } from '@mui/material';
import * as Yup from 'yup';

interface UpdateCategoryFormProps {
  item: Category;
}

const UpdateCategoryForm = (props: UpdateCategoryFormProps) => {
  const { item } = props;
  const schema = Yup.object().shape({
    name: Yup.string().required('Le champ est obligatoire'),
  });
  const defaultValues: UpdateOneInput = {
    name: item.name,
  };
  return (
    <>
      <UpdateCrudItemForm<Category, UpdateOneInput>
        item={item}
        routes={Routes.Categories}
        useItems={useCategories}
        schema={schema}
        defaultValues={defaultValues}
      >
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={6}>
            <RHFTextField name="name" label="Name" />
          </Grid>
        </Grid>
      </UpdateCrudItemForm>
    </>
  );
};

export default UpdateCategoryForm;
