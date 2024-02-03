import Card from '@mui/material/Card';
import { Stack } from '@mui/system';
import Grid from '@mui/material/Grid';
import FormProvider from '@common/components/lib/react-hook-form';
import * as Yup from 'yup';
import { DeepPartial, FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import React, { Ref, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Any, AnyObject, CrudObject, CrudRoutes } from '@common/defs/types';
import { ItemResponse, UseItems } from '@common/hooks/useItems';
import { useSnackbar } from 'notistack';
import { Tab, Tabs } from '@mui/material';

export interface CurrentFormStepRef {
  submit: () => Promise<FormSubmitResponse<AnyObject>>;
}

export interface FormSubmitResponse<T> {
  data: T;
  errors: AnyObject;
  hasErrors: boolean;
}
export interface PresubmitResponse<CreateOneInput, UpdateOneInput> {
  error?: string;
  data: CreateOneInput | UpdateOneInput;
}

enum FORM_MODE {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

export interface FormTabs<TAB_ENUM> {
  items: {
    label: string;
    value: TAB_ENUM;
    component?: React.ReactNode;
  }[];
  formItem: TAB_ENUM;
}

export interface UpsertCrudItemFormProps<
  Item,
  CreateOneInput extends FieldValues = Any,
  UpdateOneInput extends FieldValues = Any,
  TAB_ENUM = Any
> {
  item?: Item;
  routes: CrudRoutes;
  useItems: UseItems<Item, CreateOneInput, UpdateOneInput>;
  schema: Yup.ObjectSchema<AnyObject>;
  defaultValues: DeepPartial<CreateOneInput | UpdateOneInput>;
  children: JSX.Element;
  displayCard?: boolean;
  displayFooter?: boolean;
  tabs?: FormTabs<TAB_ENUM>;
  onPreSubmit?: (
    data: CreateOneInput | UpdateOneInput
  ) => PresubmitResponse<CreateOneInput, UpdateOneInput>;
  onPostSubmit?: (
    data: CreateOneInput | UpdateOneInput,
    response: ItemResponse<Item>,
    methods: UseFormReturn<CreateOneInput | UpdateOneInput>
  ) => void;
}

const UpsertCrudItemForm = <
  Item extends CrudObject,
  CreateOneInput extends FieldValues = Any,
  UpdateOneInput extends FieldValues = Any,
  TAB_ENUM = Any
>(
  {
    displayCard = true,
    displayFooter = true,
    ...props
  }: UpsertCrudItemFormProps<Item, CreateOneInput, UpdateOneInput, TAB_ENUM>,
  ref: Ref<CurrentFormStepRef | undefined>
) => {
  const {
    item,
    routes,
    useItems,
    schema,
    defaultValues,
    children,
    tabs,
    onPreSubmit,
    onPostSubmit,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const { createOne, updateOne } = useItems();
  const mode = item ? FORM_MODE.UPDATE : FORM_MODE.CREATE;
  const methods = useForm<CreateOneInput | UpdateOneInput>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const [currentTab, setCurrentTab] = useState(tabs?.formItem);

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = methods;

  useEffect(() => {
    setLoaded(true);
  }, []);
  const onSubmit = async (data: CreateOneInput | UpdateOneInput) => {
    if (onPreSubmit) {
      const preSubmitResponse = onPreSubmit(data);
      const error = preSubmitResponse.error;
      if (error) {
        enqueueSnackbar(error, { variant: 'error' });
        return;
      }
      data = preSubmitResponse.data;
    }
    let response;
    if (mode === FORM_MODE.UPDATE && item) {
      response = await updateOne(item.id, data as UpdateOneInput, {
        displayProgress: true,
        displaySuccess: true,
      });
    } else {
      response = await createOne(data as CreateOneInput, {
        displayProgress: true,
        displaySuccess: true,
      });
    }
    if (response.success) {
      if (onPostSubmit) {
        onPostSubmit(data, response, methods);
      }
    }
  };

  const currentTabComponent = tabs
    ? tabs.items.find((tab) => tab.value === currentTab)?.component
    : null;

  useImperativeHandle(ref, () => ({
    submit: async () => {
      let errors = {};
      await handleSubmit(
        async () => {},
        async (formErrors) => {
          errors = formErrors;
        }
      )();
      const data = getValues();
      const hasErrors = Object.keys(methods.formState.errors).length > 0;
      return { data, errors, hasErrors };
    },
  }));

  const displayForm = () => {
    return (
      <>
        {loaded ? (
          <>
            {tabs && mode === FORM_MODE.UPDATE && (
              <>
                <Tabs
                  value={currentTab}
                  onChange={(_event, tab) => {
                    setCurrentTab(tab);
                  }}
                >
                  {tabs.items.map((tab) => (
                    <Tab label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
                {currentTabComponent}
              </>
            )}
            {(!tabs || mode === FORM_MODE.CREATE || currentTab === tabs.formItem) && (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                {children}
                {displayFooter && (
                  <Stack direction="row" justifyContent="center" alignItems="center" paddingY={2}>
                    <Button
                      size="large"
                      variant="text"
                      onClick={() => router.back()}
                      sx={{ marginRight: 2 }}
                    >
                      Retour
                    </Button>
                    <LoadingButton
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Enregistrer
                    </LoadingButton>
                  </Stack>
                )}
              </FormProvider>
            )}
          </>
        ) : (
          <Stack justifyContent="center" alignItems="center" spacing={4} padding={4}>
            <Grid container spacing={2} columns={{ xs: 1, md: 2 }} paddingX={4}>
              {Array.from(Array(4)).map((_, index) => (
                <Grid item xs={1} key={index}>
                  <Skeleton variant="rectangular" height={35} />
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <Skeleton variant="rectangular" height={35} width={150} />
              <Skeleton variant="rectangular" height={35} width={150} />
            </Stack>
          </Stack>
        )}
      </>
    );
  };
  return <>{displayCard ? <Card>{displayForm()}</Card> : displayForm()}</>;
};

type ForwardRefFn<T> = <
  Item,
  CreateOneInput extends FieldValues = Any,
  UpdateOneInput extends FieldValues = Any,
  TAB_ENUM = Any
>(
  props: UpsertCrudItemFormProps<Item, CreateOneInput, UpdateOneInput, TAB_ENUM> & {
    ref?: Ref<T | undefined>;
  }
) => JSX.Element;

export default forwardRef(UpsertCrudItemForm) as ForwardRefFn<CurrentFormStepRef>;
