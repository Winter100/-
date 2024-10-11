export function convertToKoreanTime(utcTimeStr: any) {
  const utcDate = new Date(utcTimeStr);

  // 한국 시간으로 변환 (UTC+9)
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  // 원하는 형식으로 포맷팅
  const year = kstDate.getUTCFullYear();
  const month = kstDate.getUTCMonth() + 1; // getUTCMonth()는 0부터 시작하므로 1을 더함
  const day = kstDate.getUTCDate();
  const hours = kstDate.getUTCHours();
  const minutes = kstDate.getUTCMinutes();

  // 포맷된 문자열 반환
  return `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

export function convertToRelativeTime(utcTimeStr: string): string {
  const utcDate = new Date(utcTimeStr);
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - kstDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}개월 전`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}년 전`;
  }
}
