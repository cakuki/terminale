![Berlinale Logo](./logo.png)

---

# terminale: <small>Berlin.de Appointment Finder</small>

## Usage

```sh
# terminale <url> [date=today]
npx terminale \
    https://service.berlin.de/terminvereinbarung/... \
    2019-01-02
```

Or you can install it if you need frequently:

```sh
# install
npm i -g terminale
# use
terminale
```

It will poll each 30 seconds to check if any spot is open in your desired date for the page that you give. Just copy paste the url from browser for the appointment page (where you see two months' calendar).

When an appointment is available, a new browser tab will be opened for the page that you can book the appointment.

## Note

You should keep waiting time over 30 seconds at least to not to reach rate limiting. You can change the wait time by `WAIT` environment variable like: `WAIT=10 terminale https://services.berlin.de/...`


## License

See [LICENSE](./LICENSE) file. Feel free.
