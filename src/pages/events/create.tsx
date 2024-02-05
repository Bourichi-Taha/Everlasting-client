import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import CreateEventWithUploadForm from '@modules/events/components/pages/CreateEventWithUploadForm';

const EventsPage: NextPage = () => {
  return (
    <>
      <PageHeader title={Labels.Events.CreateNewOne} />
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: Routes.Common.Home },
          { name: Labels.Events.Items, href: Routes.Events.ReadAll },
          { name: Labels.Events.NewOne },
        ]}
      />
      <CreateEventWithUploadForm />
    </>
  );
};

export default withAuth(
  withPermissions(EventsPage, {
    requiredPermissions: [
      {
        entity: Namespaces.Events,
        action: CRUD_ACTION.CREATE,
      },
    ],
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
