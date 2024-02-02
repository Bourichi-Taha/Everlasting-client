import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import RequestPasswordReset from '@modules/auth/components/pages/RequestPasswordReset';

const RequestPasswordResetPage: NextPage = () => {
  return (
    <>
      <RequestPasswordReset />
    </>
  );
};

export default withAuth(RequestPasswordResetPage, {
  mode: AUTH_MODE.LOGGED_OUT,
  redirectUrl: Routes.Common.Home,
});
