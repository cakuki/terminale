#!/usr/bin/env node

const opn = require('opn');
const ora = require('ora');
const sleep = require('util').promisify(setTimeout)

const getBookingUrl = require('.');

const wait = (process.env.WAIT || 30) * 1000;
const url = process.argv[2] || process.env.URL;
const today = new Date(new Date().setHours(0, 0, 0, 0));
const date = process.argv[3] ? new Date(process.argv[3]) : today;

const help = `
    Usage
        $ terminale <url> [date=today]

    Examples
        $ terminale \\
            'https://service.berlin.de/terminvereinbarung/termin/tag.php?buergerID=&buergername=webreservierung&id=106&behoerde=&anliegen%5B%5D=120702&herkunft=' \\
            2018-01-01
`;

if (['help', '-h', '--help', '-?'].includes(url)) {
    console.log(help);
    process.exit(0);
}

try {
    if (!url)
        throw new TypeError('URL argument is missing.');
    if (!/https:\/\/service\.berlin\.de\/terminvereinbarung\/termin\/tag\.php/.test(url))
        throw new TypeError('Only service.berlin.de urls are supported.');
    if (isNaN(date))
        throw new TypeError('Invalid date string');
    if (date < today)
        throw new TypeError('Date cannot be earlier than today.');
    if (date >= new Date(today.getUTCFullYear(), today.getUTCMonth()+2, 0, 0, 0, 0, 0))
        throw new TypeError('Date cannot be later than next month\'s last day.');
} catch (err) {
    die(err, true);
}

const spinner = ora('Fetching page...').start();

async function run({ url, date, wait }) {
    let n = 1;
    let bookingUrl = await getBookingUrl({ url, date });

    while (!bookingUrl) {
        n++;
        spinner.warn(`No available appointment on ${date.toLocaleDateString()} as for ${new Date().toLocaleTimeString()}`);
        spinner.start();
        await sleepWithSpinner(spinner, wait);
        spinner.start(`Trying again (iteration: ${n}), fetching page...`);
        bookingUrl = await getBookingUrl({ url, date });
    }

    spinner.succeed('Found an appointment!');
    opn(`https://service.berlin.de/terminvereinbarung/termin/${bookingUrl}`, { wait: false });
}

run({ url, date, wait }).catch(die);

function die(err, printUsage) {
    console.error(err.message);
    if (printUsage)
        console.log(help);

    process.exit(1);
}

async function sleepWithSpinner(spinner, wait) {
    for (let i = 0; i < wait; i += 1000) {
        await sleep(1000);
        spinner.text = `Waiting for ${Math.floor((wait - i) / 1000)} seconds before retrying...`;
    }
}
