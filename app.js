const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodeMailer = require('nodemailer');

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body parser middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    //res.send('hello');
    res.render('contact', { layout: false });
});

app.post('/send', function(req, res) {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email Address: ${req.body.email}</li>
        <li>Phone Number: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.messae}</p>
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false  //for the localhost
        }
    });

    // send mail with defined transport object
    const mailerOptions = {
        from: '"Nodemailer Contact" <foo@example.com>', // sender address
        to: "rkbhardwaj88@gmail.com", // list of receivers
        subject: "Node Contact Request", // Subject line
        text: "Hello world", // plain text body
        html: output // html body
    };
    transporter.sendMail(mailerOptions, function(error, info) {
        if (error) {
            return console.log(error)
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview Url: %s", nodeMailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Email has been sent' });
    });
});

app.listen(3000, function() {
    console.log('Server started..');
})