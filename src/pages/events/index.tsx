import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useRouter } from 'next/router';
import { Add } from '@mui/icons-material';
import PageHeader from '@common/components/lib/partials/PageHeader';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import OwnEvents from '@modules/events/components/partials/OwnEvents';
import useProgressBar from '@common/hooks/useProgressBar';
import useEvents from '@modules/events/hooks/api/useEvents';
import { useEffect, useState } from 'react';
import { Event } from '@modules/events/defs/types';

const EventsPage: NextPage = () => {
  const router = useRouter();
  const { start, stop } = useProgressBar();
  const { readAllOwn } = useEvents();
  const [loaded, setLoaded] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (loaded) {
      stop();
    } else {
      start();
    }
  }, [loaded]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await readAllOwn();
    if (res.success) {
      if (res.data && res.data.items) {
        setEvents(res.data.items);
      }
    } else {
      router.back();
    }
    setLoaded(true);
  };
  return (
    <>
      <PageHeader
        title={Labels.Events.ReadAll}
        action={{
          label: Labels.Events.NewOne,
          startIcon: <Add />,
          onClick: () => router.push(Routes.Events.CreateOne),
          permission: {
            entity: Namespaces.Events,
            action: CRUD_ACTION.CREATE,
          },
        }}
      />
      <CustomBreadcrumbs
        links={[{ name: 'Dashboard', href: Routes.Common.Home }, { name: Labels.Events.Items }]}
      />
      <OwnEvents events={events} fetchEvents={fetchEvents} loaded={loaded} />
    </>
  );
};

export default withAuth(
  withPermissions(EventsPage, {
    requiredPermissions: [
      {
        entity: Namespaces.Events,
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
