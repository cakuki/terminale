const cheerio = require('cheerio');
const got = require('got');

module.exports = async function getBookingUrl({ url, date }) {
    const { body } = await got(url);
    let $ = cheerio.load(body);

    let monthTables = $('.calendar-month-table');

    if (monthTables.length != 2)
        throw new Error('Something went wrong, two month tables were expected.');

    let monthHeader = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(date);
    let monthTable = $(monthTables.filter((i, el) => $(el).find('.month').text().trim() == monthHeader)[0]);
    let el = $(monthTable.find('td').filter((i, el) => $(el).text() == date.getDate())[0]);

    let bookable = el.hasClass('buchbar');

    if (!bookable) return null;

    return el.find('a').attr('href');
}
