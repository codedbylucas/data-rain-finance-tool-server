export const formattedCurrentTime = (dateTime: Date): string => {
  if (!dateTime) {
    return null;
  }
  const formattedDate = dateTime.toLocaleTimeString('pt-br');
  return formattedDate;
};
