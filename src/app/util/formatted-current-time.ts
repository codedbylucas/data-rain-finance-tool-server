export const formattedCurrentTime = (dateTime: Date): string => {
  if (!dateTime) {
    return null;
  }
  const options = { timeZone: 'America/Sao_Paulo' };
  const formattedDate = dateTime.toLocaleTimeString('pt-br', options);
  return formattedDate;
};
