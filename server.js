// # SimpleServer
// A simple chat bot server
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
});

// Day la ðoan code de tao Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'ma_xac_minh_cua_ban') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

// Xu li khi co nguoi nhan tin cho bot
app.post('/webhook', function (req, res) {
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                // If user send text
                if (message.message.text) {
                    var text = message.message.text;
                    console.log(text); // In tin nhan nguoi dung
                    sendMessage(senderId, "Tui là bot ðây: " + text);
                }
            }
        }
    }

    res.status(200).send("OK");
});


// Gui thong tin toi REST API ðe tra loi
function sendMessage(senderId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: "EAAIB4fOpZCW0BAFNRczbTqjS8SQ2b24Vpc1vv01fZASqPZBsPqNSEZAgsmZCZCmwx3npAu9OZCacZBnPxZCR5kvQNeWNOGvnMv5G4OVWlnqvXeRZCRDAngKs7nfQVhvSAZCuwQX4ypq9SEbEhtY3YgnjRhiDVFf57n5HcH1YNZCa2AaaWwZDZD",
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

server.listen(app.get('port'), app.get('ip'), function () {
    console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});