export const ADMIN_EMAIL_DOMAIN = '@nexuscareer.com';

export const isAdminEmail = (email?: string | null) =>
  email?.trim().toLowerCase().endsWith(ADMIN_EMAIL_DOMAIN) ?? false;
