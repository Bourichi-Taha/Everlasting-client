import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import useAuth from '@modules/auth/hooks/api/useAuth';
import UpdateUserForm from '@modules/users/components/pages/UpdateUserForm';

const UserPage: NextPage = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader title="Mon Profil" />
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: Routes.Common.Home },
          { name: 'Mon profil', href: Routes.Users.Profile },
          { name: 'Modifier' },
        ]}
      />

      {user && <UpdateUserForm item={user} />}
    </>
  );
};

export default withAuth(
  withPermissions(UserPage, {
    requiredPermissions: [
      {
        entity: Namespaces.Users,
        action: CRUD_ACTION.UPDATE,
      },
      {
        entity: Namespaces.Users,
        action: CRUD_ACTION.READ,
      },
    ],
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
