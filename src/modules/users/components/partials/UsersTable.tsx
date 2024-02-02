import Routes from '@common/defs/routes';
import ItemsTable from '@common/components/partials/ItemsTable';
import { User } from '@modules/users/defs/types';
import useUsers, { CreateOneInput, UpdateOneInput } from '@modules/users/hooks/api/useUsers';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import Namespaces from '@common/defs/namespaces';
import { CrudRow } from '@common/defs/types';

interface Row extends CrudRow {
  email: string;
  createdAt: string;
  roles: string[];
}

const UsersTable = () => {
  const columns: GridColumns<Row> = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'roles',
      headerName: 'Admin',
      type: 'boolean',
      width: 125,
      renderCell: (params) => {
        const { row: item } = params;
        const { roles } = item;
        if (roles.includes('admin')) {
          return <CheckCircleIcon color="success" />;
        }
        return <CancelIcon color="error" />;
      },
    },
    {
      field: 'createdAt',
      headerName: "Date d'inscription",
      type: 'dateTime',
      flex: 1,
      renderCell: (params) => dayjs(params.row.createdAt).format('DD/MM/YYYY hh:mm'),
    },
  ];

  const itemToRow = (item: User): Row => {
    return {
      id: item.id,
      email: item.email,
      createdAt: item.createdAt,
      roles: item.rolesNames,
    };
  };

  return (
    <>
      <ItemsTable<User, CreateOneInput, UpdateOneInput, Row>
        namespace={Namespaces.Users}
        routes={Routes.Users}
        useItems={useUsers}
        columns={columns}
        itemToRow={itemToRow}
      />
    </>
  );
};

export default UsersTable;
