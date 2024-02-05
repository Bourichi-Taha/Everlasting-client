import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import Routes from '@common/defs/routes';
import PageHeader from '@common/components/lib/partials/PageHeader';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import { CRUD_ACTION, Id } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import UpdateEventWithUploadForm from '@modules/events/components/pages/UpdateEventWithUploadForm';
import { useRouter } from 'next/router';
import useProgressBar from '@common/hooks/useProgressBar';
import useEvents from '@modules/events/hooks/api/useEvents';
import { useEffect, useState } from 'react';
import { Event } from '@modules/events/defs/types';

const EventsPage: NextPage = () => {
  const router = useRouter();
  const { start, stop } = useProgressBar();
  const { readOne } = useEvents();
  const [loaded, setLoaded] = useState(false);
  const [event, setEvent] = useState<null | Event>(null);
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
          setEvent(res.data.item);
        }
      } else {
        router.back();
      }
      setLoaded(true);
    }
  };
  return (
    <>
      <PageHeader title={Labels.Events.EditOne} />
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: Routes.Common.Home },
          { name: Labels.Events.Items, href: Routes.Events.ReadAll },
          { name: Labels.Events.EditOne },
        ]}
      />
      {event && <UpdateEventWithUploadForm event={event} />}
    </>
  );
};

export default withAuth(
  withPermissions(EventsPage, {
    requiredPermissions: [
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
