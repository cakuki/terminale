#!/usr/bin/env node

const cheerio = require('cheerio');
const got = require('got');
const opn = require('opn');

const sleep = require('util').promisify(setTimeout)

const WAIT = (process.env.WAIT || 30) * 1000;
const URL = process.argv[2] || process.env.URL;
const DATE = process.argv[3] || process.env.DATE || "2018-06-18";

if (!URL)
    throw new TypeError('URL must be given as env param or 2nd CLI argument')

async function getBookingUrl(date) {
    const { body } = await got(URL);
    console.log(`Fetched page from "${URL}".`);
    console.log(`Parsing page contents.`);
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

async function run() {
    const date = new Date(DATE);
    let bookingUrl = await getBookingUrl(date);

    while (!bookingUrl) {
        console.log(`Not bookable. Waiting for ${(WAIT/1000)} seconds before retrying...`);
        await sleep(WAIT);
        console.log('Trying again...');
        bookingUrl = await getBookingUrl(date);
    }

    opn(`https://service.berlin.de/terminvereinbarung/termin/${bookingUrl}`);
    process.exit(0);
}
run();
