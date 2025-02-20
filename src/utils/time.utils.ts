export function get_relative_time_string(date_string: string): string {
  const date = new Date(date_string);
  const now = new Date();
  const diff_in_minutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diff_in_minutes < 60) {
    return `${diff_in_minutes} min`;
  }

  const diff_in_hours = Math.floor(diff_in_minutes / 60);
  if (diff_in_hours < 24) {
    return `${diff_in_hours} h`;
  }

  const diff_in_days = Math.floor(diff_in_hours / 24);
  if (diff_in_days < 7) {
    return `${diff_in_days} d`;
  }

  const diff_in_weeks = Math.floor(diff_in_days / 7);
  if (diff_in_weeks < 4) {
    return `${diff_in_weeks} w`;
  }

  const diff_in_months = Math.floor(diff_in_days / 30);
  if (diff_in_months < 12) {
    return `${diff_in_months} m`;
  }

  const diff_in_years = Math.floor(diff_in_days / 365);
  return `${diff_in_years} y`;
}
