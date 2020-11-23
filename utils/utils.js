exports.filteredQuery = (queryObject, itemsToBeExcluded) => {
  const queryKeys = Object.keys(queryObject);
  return queryKeys.reduce((acc, item) => {
    if (!itemsToBeExcluded.includes(item)) {
      acc[item] = queryObject[item];
    }
    return acc;
  }, {});
};

exports.parsedQueryString = (queryString) => {
  return queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
};
