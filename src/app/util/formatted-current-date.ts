export const formattedCurrentDate = (data: Date) => {
  const day = data.getDate().toString(),
    dayformatted = day.length == 1 ? '0' + day : day,
    month = (data.getMonth() + 1).toString(),
    monthformatted = month.length == 1 ? '0' + month : month,
    yearformatted = data.getFullYear();
  return dayformatted + '/' + monthformatted + '/' + yearformatted;
};
