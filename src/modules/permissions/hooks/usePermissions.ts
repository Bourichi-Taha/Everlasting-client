import { Id } from '@common/defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useMemo } from 'react';

interface PermissionsAPI {
  can: (entityName: string, action: string, entityId?: Id) => boolean;
  canNot: (entityName: string, action: string, entityId?: Id) => boolean;
}

const usePermissions = (): PermissionsAPI => {
  const { user } = useAuth();

  const can = (entityName: string, action: string, entityId?: Id): boolean => {
    if (!user) {
      return false;
    }
    const permission = `${entityName}.${action}`;

    // Vérifie le droit de faire l'action "action" sur toutes les "entity"
    if (user.permissionsNames.includes(permission)) {
      return true;
    }

    // Vérifie le droit de faire toutes les actions sur toutes les "entity"
    if (user.permissionsNames.includes(`${entityName}.*`)) {
      return true;
    }

    if (entityId) {
      // Vérifie l'id de l'entity sur laquelle on a la permission de "action"
      const specificPermission = `${entityName}.${entityId}.${action}`;
      if (user.permissionsNames.includes(specificPermission)) {
        return true;
      }
    }

    // Aucune correspondance trouvée
    return false;
  };

  const canNot = (entityName: string, action: string, entityId?: Id): boolean => {
    return !can(entityName, action, entityId);
  };

  return useMemo(() => ({ can, canNot }), [user?.permissionsNames]);
};

export default usePermissions;
