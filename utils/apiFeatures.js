exports.applyQueryFeatures = (baseQuery, query, tableAlias = '') => {
  let whereClause = [];
  let values = [];
  let sortClause = '';
  let limitClause = '';
  let offsetClause = '';
  let valueIndex = 1;

  // Filtering
  for (let key in query) {
    if (!['page', 'limit', 'sort'].includes(key)) {
      const value = query[key];
      whereClause.push(`${tableAlias}"${key}" = $${valueIndex}`);
      values.push(value);
      valueIndex++;
    }
  }

  // Sorting
  if (query.sort) {
    const sortFields = query.sort
      .split(',')
      .map((field) => {
        const order = field.startsWith('-') ? 'DESC' : 'ASC';
        const column = field.replace(/^-/, '');
        return `${tableAlias}"${column}" ${order}`;
      })
      .join(', ');
    sortClause = `ORDER BY ${sortFields}`;
  } else {
    sortClause = `ORDER BY ${tableAlias}id DESC`;
  }

  // Pagination
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 50;
  const offset = (page - 1) * limit;
  limitClause = `LIMIT ${limit}`;
  offsetClause = `OFFSET ${offset}`;

  const where = whereClause.length ? `WHERE ${whereClause.join(' AND ')}` : '';

  return {
    sql: `${baseQuery} ${where} ${sortClause} ${limitClause} ${offsetClause}`,
    values,
    pagination: {
      currentPage: page,
      limit,
    },
  };
};
