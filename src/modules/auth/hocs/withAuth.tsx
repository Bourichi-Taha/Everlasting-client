import React from 'react';
import { useRouter } from 'next/router';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Routes from '@common/defs/routes';

type Props = Record<string, unknown>;

export enum AUTH_MODE {
  LOGGED_IN = 'LOGGED_IN',
  LOGGED_OUT = 'LOGGED_OUT',
}

interface WithAuthOptions {
  mode?: AUTH_MODE;
  redirectUrl?: string;
}

const withAuth = (Component: React.ComponentType<Props>, options: WithAuthOptions = {}) => {
  // create a new component that renders the original component with auth checking
  const WrappedComponent = (props: Props) => {
    const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';
    if (authEnabled) {
      const router = useRouter();
      const { user } = useAuth();
      const mode = options.mode ?? AUTH_MODE.LOGGED_IN;
      if (mode === AUTH_MODE.LOGGED_IN && !user) {
        router.push(options.redirectUrl ?? Routes.Auth.Login);
        return null;
      }
      if (mode === AUTH_MODE.LOGGED_OUT && user) {
        router.push(options.redirectUrl ?? Routes.Common.Home);
        return null;
      }
    }

    return <Component {...(props as Props)} />;
  };

  // set the display name of the wrapped component for debugging purposes
  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default withAuth;
