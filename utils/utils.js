exports.filteredQuery = (queryObject, itemsToBeExcluded) => {
  const queryKeys = Object.keys(queryObject);
  return queryKeys.reduce((acc, item) => {
    if (!itemsToBeExcluded.includes(item)) {
      acc[item] = queryObject[item];
    }
    return acc;
  }, {});
};

exports.filteredObject = (input, ...filteredParams) => {
  return Object.keys(input).reduce((acc, item) => {
    if (filteredParams.includes(item)) {
      acc[item] = input[item];
    }
    return acc;
  }, {});
};

exports.parsedQueryString = (queryString) => {
  return queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
};

exports.getInputSeperatedString = (inputString, seperate) =>
  inputString.split(',').join(seperate);

exports.skipCount = (page, limit) => (page - 1) * limit;
