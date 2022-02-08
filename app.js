const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const submodules = [
    require('./modules/discount-code/app/app'),
    require('./modules/discount-redemption-split/app/app'),
];

const app = express();

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'home')));
app.use('/assets', express.static(path.join(__dirname, '/node_modules/@salesforce-ux/design-system/assets')));

submodules.forEach((sm) => sm(app, {
    rootDirectory: __dirname,
}));

// app.listen(app.get('port'), function () {
//     console.log(`Express is running at localhost: ${app.get('port')}`);
// });

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const httpPort = process.env.PORT || 8443;
httpServer.listen(httpPort, function () {
    console.log(`Express is running at localhost: ${httpPort}`);
});

const httpsPort = process.env.PORT || 443;
httpsServer.listen(httpsPort, function () {
    console.log(`Express is running at localhost: ${httpsPort}`);
});
