const express = require('express');
const cors = require('cors');
const path = require('path');

const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (_, res) => {
  res.sendFile(path.join(`${__dirname}/../dist/index.html`));
});

app.listen(port, ip, () => {
  console.log(`running at ${ip}:${port}`);
});
