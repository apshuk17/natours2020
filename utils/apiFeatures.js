const {
  filteredQuery,
  parsedQueryString,
  getInputSeperatedString,
  skipCount,
} = require('./utils');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1a) Filtering
    const queryObj = filteredQuery({ ...this.queryString }, [
      'sort',
      'page',
      'limit',
      'fields',
    ]);

    // 1b) Advanced Filtering
    const queryString = parsedQueryString(JSON.stringify(queryObj));

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = getInputSeperatedString(this.queryString.sort, ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldsBy = getInputSeperatedString(this.queryString.fields, ' ');
      this.query = this.query.select(fieldsBy);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = skipCount(page, limit);

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
