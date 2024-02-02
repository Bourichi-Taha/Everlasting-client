import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';
import { Category } from '@modules/categories/defs/types';
import useCategories, {
  CreateOneInput,
  UpdateOneInput,
} from '@modules/categories/hooks/api/useCategories';

interface Row extends CrudRow {
  name: string;
  createdAt: string;
}

const CategoriesTable = () => {
  const columns: GridColumns<Row> = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: "Date d'inscription",
      type: 'dateTime',
      flex: 1,
      renderCell: (params) => dayjs(params.row.createdAt).format('DD/MM/YYYY hh:mm'),
    },
  ];

  const itemToRow = (item: Category): Row => {
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
    };
  };

  return (
    <>
      <ItemsTable<Category, CreateOneInput, UpdateOneInput, Row>
        namespace={Namespaces.Categories}
        routes={Routes.Categories}
        useItems={useCategories}
        columns={columns}
        itemToRow={itemToRow}
      />
    </>
  );
};

export default CategoriesTable;
