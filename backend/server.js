const express = require('express');
const accountRouter = require('./routes');
const app = express();
const port = 8081;

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
const { resolve } = require('path');

require('dotenv').config();

app.use('/account', accountRouter);


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.post("/", async (req, res) => {
    // req must be an object with email and password field 
    // console.log(req.body)
    const data = {
        header: ""
    }
    let myPromise = new Promise(function(resolve, reject) {
        var headers = "";

        var Imap = require('imap'),
        inspect = require('util').inspect;

        var imap = new Imap({
            user: req.body.email, // put your mail email
            password: req.body.password, // put your mail password or your mail app password
            host: 'imap.gmail.com', // put your mail host
            port: 993, // your mail host port
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });

        function openInbox(cb) {
            imap.openBox('INBOX', true, cb);
        }

        // get the FROM header of the most recent message 
        imap.once('ready', function() { // this event will call once the imap is successfully made connection with imap host
            openInbox(function(err, box) {
                if (err) throw err;

                var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM)','TEXT'] });
                
                f.on('message', function(msg, seqno) {
                    console.log('Message #%d', seqno);
                    var prefix = '(#' + seqno + ') ';
                    msg.on('body', function(stream, info) {
                        // saying that text was found for this message 
                        if (info.which === 'TEXT')
                        console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
                        
                        // buffer is the entire message as a string 
                        var buffer = '', count = 0;
                        stream.on('data', function(chunk) {
                        count += chunk.length;
                        buffer += chunk.toString('utf8');
                        // parsing the text body 
                        // if (info.which === 'TEXT')
                        //   console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
                        });
                        stream.once('end', function() {
                        // get the FROM header of the message
                        if (info.which !== 'TEXT') {
                            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                            headers = inspect(Imap.parseHeader(buffer));
                        }
                        else
                            console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                        });
                    });
                    // msg.once('attributes', function(attrs) {
                    //   console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    // });
                    msg.once('end', function() {
                        console.log(prefix + 'Finished');
                    });
                });
                f.once('error', function(err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function() {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });

        imap.once('error', function(err) { // this event will call if there is any issue will come during making imap connection
            console.log(err);
        });

        imap.once('end', function() { // this event will call once the imap connection is closed
            console.log('Connection ended');
            resolve(headers);
        });

        imap.connect();
    })
    data.header = await myPromise;
    res.send(data);
})

app.post('/test',jsonParser, (req, res) => {
    console.log(req.body);
    res.send(req.body);
});