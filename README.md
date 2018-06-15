![Berlin Logo](./berlin-logo.png)

---

# terminale: <small>Berlin.de Appointment Finder</small>

```sh
# install
npm i -g terminale
# use
URL=https://service.berlin.de/terminvereinbarung/termin/tag.php?buergerID=&buergername=webreservierung&id=106&behoerde=&anliegen%5B%5D=120702&herkunft= \
DATE=2018-07-15 \
WAIT=30 \
    terminale
```

It will poll each 30 seconds to check if any spot is open in your desired date for the page that you give. Just copy paste the url from browser for the appointment page (where you see two months' calendar).

When an appointment is available, a new browser tab will be opened for the page that you can book the appointment.

## Note

You should keep waiting time over 30 seconds at least to not to reach rate limiting.

## License

See [LICENSE](./LICENSE) file. Feel free.
