import { FieldValues } from 'react-hook-form';
import { Any, AnyObject, CrudObject } from '@common/defs/types';
import UpsertCrudItemForm, {
  CurrentFormStepRef,
  UpsertCrudItemFormProps,
} from '@common/components/partials/UpsertCrudItemForm';
import { Ref, forwardRef } from 'react';

interface UpdateCrudItemProps<Item, UpdateOneInput extends FieldValues>
  extends UpsertCrudItemFormProps<Item, Any, UpdateOneInput> {}

const UpdateCrudItem = <Item extends CrudObject, UpdateOneInput extends AnyObject>(
  props: UpdateCrudItemProps<Item, UpdateOneInput>,
  ref: Ref<CurrentFormStepRef>
) => {
  return (
    <>
      <UpsertCrudItemForm<Item, UpdateOneInput> {...props} ref={ref}>
        {props.children}
      </UpsertCrudItemForm>
    </>
  );
};

type ForwardRefFn<T> = <Item, UpdateOneInput extends FieldValues = Any>(
  props: UpdateCrudItemProps<Item, UpdateOneInput> & {
    ref?: Ref<T | undefined>;
  }
) => JSX.Element;

export default forwardRef(UpdateCrudItem) as ForwardRefFn<CurrentFormStepRef>;
