const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require("cors");
const corsOptions = {
    origin: "*", // Or pass origins you want
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
             res.send(JSON.stringify(rows));
        else
            console.log(err);
    })
});


app.get('/events', (req, res) => {
    mysqlConnection.query('SELECT * FROM event', (err, rows, fields) => {
        if (!err)
            res.json({success:true, data: rows});
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

app.get('/getPrivacyPolicyText', (req, res) => {

    console.log("CALLED")
    var text ="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor lorem at purus finibus suscipit. Vestibulum ac diam risus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n Pellentesque eu magna et nunc pulvinar interdum. In hac habitasse platea dictumst. In condimentum lectus in risus gravida accumsan. Donec sed urna a odio ultricies tincidunt.Suspendisse eget quam placerat, commodo tellus eget, placerat felis. Donec feugiat, ante ac interdum vulputate, enim nisl imperdiet quam, a euismod lacus enim nec tortor. Pellentesque nec magna sit amet elit mollis viverra. Maecenas vitae pharetra risus. Nulla sagittis vehicula lacus id congue. Integer auctor semper neque in blandit. Vestibulum elementum posuere ex, et vestibulum leo facilisis eget. Etiam sit amet odio maximus, faucibus nisi vel, fringilla justo. Praesent luctus felis aliquet eros iaculis, vitae eleifend sem viverra. In finibus nunc non malesuada aliquam. Donec ornare dapibus augue, vel laoreet libero rutrum et.Nullam sed elit non sapien lobortis blandit id nec ex. Etiam vitae felis lobortis, ullamcorper purus ac, sodales leo. Praesent porttitor lectus purus. Donec in rutrum tortor. Donec pharetra at quam non facilisis. Donec feugiat laoreet sem, in sollicitudin diam rhoncus non. Cras pharetra sit amet eros in varius. Etiam faucibus libero arcu, lacinia lacinia est porta sed. Nullam et dolor sed ante varius porta a vitae ligula. Integer at massa mattis, fringilla ipsum eget, molestie ex. Integer convallis, turpis eu eleifend mattis, nunc sapien tincidunt dolor, at dignissim nibh eros at elit. Cras enim eros, vulputate id mollis nec, sollicitudin vitae dolor. Ut ut venenatis sapien. Sed sit amet lacus viverra, laoreet mi a, dictum magna. Vestibulum nec odio nulla. Nam semper tellus ac congue iaculis.Mauris non accumsan mi. Phasellus porttitor ut neque vel posuere. Proin auctor turpis quam, sed lacinia neque suscipit vel. Donec scelerisque egestas ante, vel sodales lorem blandit tristique. Praesent vitae lobortis orci, id ullamcorper est. Praesent tempus consectetur mauris a ultricies. Praesent sodales auctor magna a sagittis. Phasellus dignissim viverra justo at tristique. Morbi egestas elit eu lacinia pharetra. Aliquam maximus, leo a viverra viverra, tellus magna malesuada ipsum, id viverra sapien ipsum eget ex.Mauris non mauris mollis, feugiat arcu vel, cursus orci. Nunc id vestibulum ex. Fusce tempor non lectus vitae imperdiet. Vivamus aliquam bibendum nisl id tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed dapibus, dolor eu efficitur rhoncus, tellus neque blandit diam, vel fermentum mi velit ullamcorper ipsum. Ut nec purus vel quam fermentum tristique. Nullam non mi efficitur, placerat velit vel, tincidunt leo. Donec sed maximus dolor. Nullam condimentum feugiat dolor eget pharetra. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum vel ultrices nibh. Aenean vulputate iaculis metus et varius. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc sagittis lacus in pellentesque ullamcorper. Aenean lobortis elementum dapibus";
    return res.json({success:true, data:text})
});


app.get('/getTables', (req, res) => {

    if(req.query['eventID'])
    {
        var eventID = req.query['eventID'];
        console.log(eventID);
        mysqlConnection.query(`SELECT * FROM tables WHERE event_id=${eventID}`, (err, rows, fields) => {
            if (!err)
                {
                  
                    res.json({success:true, data: rows, message:"Successfully Retreived"});
                }
            else
                return res.json({success:false, data:[], message:"Something wrong happened"})
        })
    }
    else
    {
        return res.json({success:false, data:[], message:"Please provide valid event ID."})
    }
   
});


app.post('/createEvent', (req, res) =>{
    var event = req.body;
    mysqlConnection.query(`INSERT into event (name, location, date, time, expiration_date, no_of_tables, cost_per_table) VALUES ('${event.name}','${event.location}','${event.date}','${event.time}','${event.expiration_date}','${event.no_of_tables}','${event.cost_per_table}')`
    ,(err, rows, fields) => {
        if (!err)
        { 
            let insertId = rows.insertId;
            createTablesForEvent(insertId)
            res.json({success:true, data: rows});
        }
        else
            res.json({success:false, data: err});
    })
})


createTablesForEvent = (eventId) => {
    var sql = "INSERT INTO tables (event_id, number, isReserved, area, tooltip) VALUES ?";
    var t_list = [];
     for (var i = 1; i <= 20; i++) {
      t_list.push([ eventId.toString(), `${i}-E`, 0, 'E', 'Available' ])
    }
     for (var i = 1; i <= 20; i++) {
      t_list.push([ eventId, `${i}-D`, 0, 'D', 'Available' ])
    }
     for (var i = 1; i <= 20; i++) {
      t_list.push([ eventId, `${i}-C`, 0, 'C', 'Available' ])
    }
     for (var i = 1; i <= 20; i++) {
      t_list.push([ eventId, `${i}-B`, 0, 'B', 'Available' ])
    }
     for (var i = 1; i <= 40; i++) {
      t_list.push([ eventId, `${i}-A`, 0, 'A', 'Available' ])
    }
    
    mysqlConnection.query(sql, [t_list], function(err) {
        if (err) throw err;
            console.log(err,"--------------------")
            mysqlConnection.end();
    });
}


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));