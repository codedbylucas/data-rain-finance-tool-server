export const formattedCurrentDate = (dateTime: Date): string => {
  if (!dateTime) {
    return null;
  }
  const formattedDate = dateTime.toLocaleDateString('pt-br');
  return formattedDate;
};
