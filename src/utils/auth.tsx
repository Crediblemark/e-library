// User roles
export enum UserRole {
  READER = "reader",
  LIBRARIAN = "librarian",
  ADMIN = "admin",
}

// Permission check function
export const hasPermission = (
  requiredRole: UserRole,
  userRole: UserRole,
): boolean => {
  // Role hierarchy: ADMIN > LIBRARIAN > READER
  if (userRole === UserRole.ADMIN) return true;
  if (userRole === UserRole.LIBRARIAN && requiredRole !== UserRole.ADMIN)
    return true;
  if (userRole === UserRole.READER && requiredRole === UserRole.READER)
    return true;
  return false;
};
