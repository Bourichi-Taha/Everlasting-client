import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/router';
import usePermissions from '@modules/permissions/hooks/usePermissions';
import { Permission } from '@modules/permissions/defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';

interface WithPermissionsProps {
  requiredPermissions: Permission[];
  redirectUrl: string;
}

const withPermissions = <P extends object>(
  WrappedComponent: ComponentType<P>,
  { requiredPermissions, redirectUrl }: WithPermissionsProps
): ComponentType<P> => {
  const WithPermissions: ComponentType<P> = (props: P) => {
    const { can } = usePermissions();
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
      const permissionsToCheck = [...requiredPermissions];

      // Vérifier les permissions avec entityId si router.query.id existe
      if (router.query.id && typeof router.query.id === 'string') {
        const id = router.query.id as string;
        requiredPermissions.forEach((requiredPermission) => {
          if (!requiredPermission.entityId) {
            permissionsToCheck.push({
              ...requiredPermission,
              entityId: Number(id),
            });
          }
        });
      }
      // Vérifier les permissions avec userId si router.query.id n'existe pas
      else if (user && user.id) {
        const id = user.id;
        requiredPermissions.forEach((requiredPermission) => {
          if (!requiredPermission.entityId) {
            permissionsToCheck.push({
              ...requiredPermission,
              entityId: Number(id),
            });
          }
        });
      }

      const hasRequiredPermission = permissionsToCheck.some((permission) =>
        can(permission.entity, permission.action, permission.entityId)
      );
      if (!hasRequiredPermission) {
        router.replace(redirectUrl);
      }
    }, [requiredPermissions, redirectUrl, can, router]);

    return <WrappedComponent {...props} />;
  };

  return WithPermissions;
};

export default withPermissions;
