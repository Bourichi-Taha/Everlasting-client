import { NextPage } from 'next';
import LoginForm from '@modules/auth/components/pages/LoginForm';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';

const LoginPage: NextPage = () => {
  return (
    <>
      <LoginForm />
    </>
  );
};

export default withAuth(LoginPage, { mode: AUTH_MODE.LOGGED_OUT, redirectUrl: Routes.Common.Home });
