export const userRole = {
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
} as const;

export const userStatus = {
  active: 'Active',
  inactive: 'Inactive',
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];
export type UserStatus = (typeof userStatus)[keyof typeof userStatus];
