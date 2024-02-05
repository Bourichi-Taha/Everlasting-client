import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { useEffect, useState } from 'react';
import useProgressBar from '@common/hooks/useProgressBar';
import { CRUD_ACTION, Id } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import useEvents from '@modules/events/hooks/api/useEvents';
import { Event } from '@modules/events/defs/types';
import EventDetails from '@modules/events/components/pages/EventDetails';

const EventsPage: NextPage = () => {
  const router = useRouter();
  const { start, stop } = useProgressBar();
  const { readOne } = useEvents();
  const [loaded, setLoaded] = useState(false);
  const [item, setItem] = useState<null | Event>(null);
  const id: Id = Number(router.query.id);

  useEffect(() => {
    if (loaded) {
      stop();
    } else {
      start();
    }
  }, [loaded]);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    if (id) {
      const res = await readOne(id);
      if (res.success) {
        if (res.data && res.data.item) {
          setItem(res.data.item);
        }
      } else {
        router.back();
      }
      setLoaded(true);
    }
  };

  return (
    <>
      <PageHeader title={Labels.Events.ViewOne || ''} />
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: Routes.Common.Home },
          { name: Labels.Events.Items, href: Routes.Events.ReadAll },
          { name: item ? item.name : Labels.Events.ViewOne },
        ]}
      />
      {item && <EventDetails item={item} fetchEvent={fetchEvent} />}
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
      {
        entity: Namespaces.Events,
        action: CRUD_ACTION.UPDATE,
      },
    ],
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
