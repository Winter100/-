export function daysSinceLastLogin(
  lastLoginDate: string,
  lastLogoutDate: string
): number {
  const lastLogin = new Date(lastLoginDate);
  const lastLogout = new Date(lastLogoutDate);

  const now = new Date();
  const koreanTimeOffset = 9 * 60;
  const nowInKorea = new Date(now.getTime() + koreanTimeOffset * 60 * 1000);

  const lastLoginInKorea = new Date(
    lastLogin.getTime() + koreanTimeOffset * 60 * 1000
  );
  const lastLogoutInKorea = new Date(
    lastLogout.getTime() + koreanTimeOffset * 60 * 1000
  );

  const mostRecentDate =
    lastLoginInKorea > lastLogoutInKorea ? lastLoginInKorea : lastLogoutInKorea;

  const diffInMs = nowInKorea.getTime() - mostRecentDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}
