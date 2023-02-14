export const formattedCurrentTime = (dateTime: Date): string => {
  if (!dateTime) {
    return null;
  }
  const formattedDate = dateTime.toLocaleString('pt-br');
  const dateSplit = formattedDate.split(' ');
  return dateSplit[1];
};
