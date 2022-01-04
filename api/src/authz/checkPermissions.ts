import jwtAuthz from 'express-jwt-authz';

export const checkReadHymnPermissions = jwtAuthz(['read:hymn'], {
  customScopeKey: 'permissions',
});

export const checkWriteHymnPermissions = jwtAuthz(['write:hymn'], {
  customScopeKey: 'permissions',
});

export const checkReadMassPermissions = jwtAuthz(['read:masses'], {
  customScopeKey: 'permissions',
});

export const checkWriteMassPermissions = jwtAuthz(['read:masses'], {
  customScopeKey: 'permissions',
});
