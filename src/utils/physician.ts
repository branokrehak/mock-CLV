export function physicianName(physician: {
  surname: string;
  given_name: string;
}) {
  return physician ? `${physician.surname} ${physician.given_name}` : undefined;
}
