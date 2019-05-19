// Dependencies
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const favicon = require('serve-favicon')

const app = express();

//app.use(function (req, res, next) {
    //console.log(req.url);
    //next();
//});

app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use('/', express.static('/home/admin/blog'));

app.get('/cam/*', (req, res) => {
    const port = req.url.substr(5)
    res.redirect(`http://colincloud.duckdns.org:${port}/`)
});

app.use('/.well-known', express.static('/home/admin/.well-known'));

// Starting both http & https servers
const httpServer = http.createServer(app);

httpServer.listen(80, () => {
    //console.log('HTTP server running on port 80');
});

 //Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/colinholzman.xyz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/colinholzman.xyz/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/colinholzman.xyz/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
    //console.log('HTTPS server running on port 443');
});

