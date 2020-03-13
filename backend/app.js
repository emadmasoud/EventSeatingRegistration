const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require("cors");
const corsOptions = {
    origin: "*", // Or pass origins you want
    credentials: true
};

var app = express();
//Configuring express server
app.use(bodyparser.json());
app.use(cors(corsOptions));
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'eventsregistration',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

app.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM user', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


app.get('/events', (req, res) => {
    mysqlConnection.query('SELECT * FROM event', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.post('/register', (req, res) => {
    var user = req.body;
    mysqlConnection.query(`INSERT into user (first_name, middle_name, last_name, email, phone, class) VALUES ('${user.first_name}','${user.middle_name}','${user.last_name}','${user.email}','${user.phone}','${user.class_no}')`
    ,(err, rows, fields) => {
        if (!err)
            res.json({success:true, data: rows});
        else
            res.json({success:false, data: err});
    })
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));