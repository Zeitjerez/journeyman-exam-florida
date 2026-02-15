export function isAdminBlocked() {
  return process.env.NODE_ENV === 'production';
}
