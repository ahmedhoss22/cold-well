const slugify = require('slugify');

async function generateUniqueSlug(document, field, locale) {
  let slugBase = slugify(document[field][locale], { lower: true, locale: locale === 'ar' ? 'ar' : 'en' });
  let slug = slugBase;
  let count = 1;

  while (true) {
    const query = {};
    query[`slug.${locale}`] = slug;

    const existingDoc = await document.constructor.findOne(query);

    if (!existingDoc || existingDoc._id.equals(document._id)) {
      break;
    }
    slug = `${slugBase}-${count}`;
    count++;
  }

  return slug;
}

module.exports = generateUniqueSlug;
