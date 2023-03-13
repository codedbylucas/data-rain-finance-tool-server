export const formattedCurrentDate = (dateTime: Date): string => {
  if (!dateTime) {
    return null;
  }
  const options = { timeZone: 'America/Sao_Paulo' };
  const formattedDate = dateTime.toLocaleDateString('pt-br', options);
  return formattedDate;
};
