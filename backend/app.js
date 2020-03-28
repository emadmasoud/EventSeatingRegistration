const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require("cors");
const nodemailer = require("nodemailer");
const corsOptions = {
    origin: "*", // Or pass origins you want
};
require("dotenv").config();


var app = express();
//Configuring express server
app.use(bodyparser.json());
app.use(cors(corsOptions));


var mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    database:  process.env.DB_DATABASE,
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
            res.json({ success: true, data: rows });
        else
            console.log(err);
    })
});

app.get('/getClasses', (req, res) => {
var list = [];

    var cep ="CEP";
    var omp ="OMP";
    var amp ="AMP";
    var smp ="SMP";
    var map ="MAP";
    var agmp ="AgMP";
    var emba ="EMBA";
    var ftmba ="FTMBA";
    var memba ="MEMBA";

    for(var i=1;i<=27;i++)
        list.push(`${cep}${i}`);

    for(var i=1;i<=30;i++)
        list.push(`${omp}${i}`);

    for(var i=1;i<=30;i++)
        list.push(`${amp}${i}`);

    for(var i=1;i<=75;i++)
        list.push(`${smp}${i}`);

    for(var i=1;i<=10;i++)
        list.push(`${map}${i}`);

    for(var i=1;i<=15;i++)
        list.push(`${agmp}${i}`);

    for(var i=1;i<=25;i++)
        list.push(`${emba}${i}`);

    for(var i=1;i<=19;i++)
        list.push(`${ftmba}${i}`);

    for(var i=1;i<=9;i++)
        list.push(`${memba}${i}`);
    

  return res.json(list);
});

app.post('/register', (req, res) => {
    var user = req.body;
    var email = user.email;
    isUserExist(email).then(obj=>{
        if(!obj.exist)
        {
            mysqlConnection.query(`INSERT into user (first_name, middle_name, last_name, email, phone, class, password) VALUES ('${user.first_name}','${user.middle_name}','${user.last_name}','${user.email}','${user.phone}','${user.class_no}', '${user.password}')`
            , (err, rows, fields) => {
                if (!err)
                    res.json({ success: true, data: rows, message:"User Registered Successfully" }, status=200);
                else
                    res.json({ success: false, data: err });
            })
        }else
        {
            res.json({ success: false, data: {}, message:"This email is already registered with our site" });
        }
    });
    
 
});
app.post('/login', (req, res) => {
    var user = req.body;
    var email = user.email;
    sendReservationConfirmationEmail(email).then (()=>{

    }).catch(err=>{
        console.log(err, "ERROR")
    })
    isUserExist(email).then(obj=>{
        if(!obj.exist)
        {
            res.json({ success: false, data: {}, message:"This email is not registered with our site" });
        }else
        {
            console.log(obj)
            if(obj.user.password == user.password)
                res.json({ success: true, data:obj, message:"Logged in" });
            else
                res.json({ success: false, data: {}, message:"Wrong Password" });
        }
    });
    
 
});

app.get('/getPrivacyPolicyText', (req, res) => {

    console.log("CALLED")
    var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor lorem at purus finibus suscipit. Vestibulum ac diam risus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n Pellentesque eu magna et nunc pulvinar interdum. In hac habitasse platea dictumst. In condimentum lectus in risus gravida accumsan. Donec sed urna a odio ultricies tincidunt.Suspendisse eget quam placerat, commodo tellus eget, placerat felis. Donec feugiat, ante ac interdum vulputate, enim nisl imperdiet quam, a euismod lacus enim nec tortor. Pellentesque nec magna sit amet elit mollis viverra. Maecenas vitae pharetra risus. Nulla sagittis vehicula lacus id congue. Integer auctor semper neque in blandit. Vestibulum elementum posuere ex, et vestibulum leo facilisis eget. Etiam sit amet odio maximus, faucibus nisi vel, fringilla justo. Praesent luctus felis aliquet eros iaculis, vitae eleifend sem viverra. In finibus nunc non malesuada aliquam. Donec ornare dapibus augue, vel laoreet libero rutrum et.Nullam sed elit non sapien lobortis blandit id nec ex. Etiam vitae felis lobortis, ullamcorper purus ac, sodales leo. Praesent porttitor lectus purus. Donec in rutrum tortor. Donec pharetra at quam non facilisis. Donec feugiat laoreet sem, in sollicitudin diam rhoncus non. Cras pharetra sit amet eros in varius. Etiam faucibus libero arcu, lacinia lacinia est porta sed. Nullam et dolor sed ante varius porta a vitae ligula. Integer at massa mattis, fringilla ipsum eget, molestie ex. Integer convallis, turpis eu eleifend mattis, nunc sapien tincidunt dolor, at dignissim nibh eros at elit. Cras enim eros, vulputate id mollis nec, sollicitudin vitae dolor. Ut ut venenatis sapien. Sed sit amet lacus viverra, laoreet mi a, dictum magna. Vestibulum nec odio nulla. Nam semper tellus ac congue iaculis.Mauris non accumsan mi. Phasellus porttitor ut neque vel posuere. Proin auctor turpis quam, sed lacinia neque suscipit vel. Donec scelerisque egestas ante, vel sodales lorem blandit tristique. Praesent vitae lobortis orci, id ullamcorper est. Praesent tempus consectetur mauris a ultricies. Praesent sodales auctor magna a sagittis. Phasellus dignissim viverra justo at tristique. Morbi egestas elit eu lacinia pharetra. Aliquam maximus, leo a viverra viverra, tellus magna malesuada ipsum, id viverra sapien ipsum eget ex.Mauris non mauris mollis, feugiat arcu vel, cursus orci. Nunc id vestibulum ex. Fusce tempor non lectus vitae imperdiet. Vivamus aliquam bibendum nisl id tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed dapibus, dolor eu efficitur rhoncus, tellus neque blandit diam, vel fermentum mi velit ullamcorper ipsum. Ut nec purus vel quam fermentum tristique. Nullam non mi efficitur, placerat velit vel, tincidunt leo. Donec sed maximus dolor. Nullam condimentum feugiat dolor eget pharetra. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum vel ultrices nibh. Aenean vulputate iaculis metus et varius. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc sagittis lacus in pellentesque ullamcorper. Aenean lobortis elementum dapibus";
    return res.json({ success: true, data: text })
});


app.get('/getTables', (req, res) => {

    if (req.query['eventID']) {
        var eventID = req.query['eventID'];
        console.log(eventID);
        mysqlConnection.query(`SELECT * FROM tables WHERE event_id=${eventID}`, (err, rows, fields) => {
            if (!err) {

                res.json({ success: true, data: rows, message: "Successfully Retreived" });
            }
            else
                return res.json({ success: false, data: [], message: "Something wrong happened" })
        })
    }
    else {
        return res.json({ success: false, data: [], message: "Please provide valid event ID." })
    }

});

app.post('/reserveTables', (req, res) => {

    console.log("here")
    if (req.body['eventID']) {
        var eventID = req.body['eventID'];
        var userID  = req.body['tables'][0].user_id;
        createBulkReservations(req.body.tables).then(data => {
            updateTablesStatus(req.body.tables).then(data => {
                mysqlConnection.query(`SELECT * FROM event_registrations WHERE event_id=${eventID}`, (err, rows, fields) => {
                    if (!err) {
                        updateEventTableCount(eventID, rows.length)
                        updatePaidTablesCount(eventID, userID, req.body.tables.length).then(data =>{
                            console.log(data, '--------------------')
                            return res.json({ success: true, data: rows, message: "Successfully Retreived" });
                        }).catch(err=>{
                            console.log(err, '--------------------')
                        })
                       
                    }
                    else
                        return res.json({ success: false, data: [], message: "Something wrong happened" })
                })
            }).catch(err => {
                return res.json({ success: false, data: [], message: err.message })
            })
        }).catch(err => {
            return res.json({ success: false, data: [], message: err.message })
        })
    }
    else {
        return res.json({ success: false, data: [], message: "Please provide valid event ID." })
    }

});

app.post('/getPaidTablesInfo', (req, res) => {
    var info = req.body;
    console.log(info)
    mysqlConnection.query(`SELECT * from user_registration_payment where user_id=${info.userID} and event_id=${info.eventID}`, (err, rows, fields)=>{
        if(!err && rows.length)
            return res.json({success: true, data: rows[0].paid_tables});
        else
            return res.json({success: false, data: 0});
        
        console.log(err, "paid")
       
    })
})
app.post('/createEvent', (req, res) => {
    var event = req.body;
    mysqlConnection.query(`INSERT into event (name, location, date, time, expiration_date, no_of_tables, cost_per_table) VALUES ('${event.name}','${event.location}','${event.date}','${event.time}','${event.expiration_date}','${event.no_of_tables}','${event.cost_per_table}')`
        , (err, rows, fields) => {
            if (!err) {
                let insertId = rows.insertId;
                createTablesForEvent(insertId)
                res.json({ success: true, data: rows });
            }
            else
                res.json({ success: false, data: err });
        })
})


createTablesForEvent = (eventId) => {
    var sql = "INSERT INTO tables (event_id, number, isReserved, area, tooltip) VALUES ?";
    var t_list = [];
    for (var i = 1; i <= 20; i++) {
        t_list.push([eventId.toString(), `${i}-E`, 0, 'E', 'Available'])
    }
    for (var i = 1; i <= 20; i++) {
        t_list.push([eventId, `${i}-D`, 0, 'D', 'Available'])
    }
    for (var i = 1; i <= 20; i++) {
        t_list.push([eventId, `${i}-C`, 0, 'C', 'Available'])
    }
    for (var i = 1; i <= 20; i++) {
        t_list.push([eventId, `${i}-B`, 0, 'B', 'Available'])
    }
    for (var i = 1; i <= 40; i++) {
        t_list.push([eventId, `${i}-A`, 0, 'A', 'Available'])
    }

    mysqlConnection.query(sql, [t_list], function (err) {
        if (err) throw err;
      
    });
}

createBulkReservations = (data) => {
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO event_registrations (event_id, table_id, user_id, area, number) VALUES ?";
        var t_list = [];

        t_list = data.map(row => {
            return [row.event_id, row.table_id, row.user_id, row.area, row.number];
        })
        mysqlConnection.query(sql, [t_list], function (err) {
            if (err) {
                reject({ success: false, message: "Error in creating reservation" })
            }
            resolve({ success: true, message: "Done" })
        });
    });


}

updateTablesStatus = (tables) => {
    return new Promise((resolve, reject) => {
        var user_id = tables[0].user_id;
        var userName = "";
        mysqlConnection.query(`Select * from user where id = '${user_id}'`, (err, rows, fields) => {
            if (!err && rows.length) {
                userName = `${rows[0].first_name}  ${rows[0].last_name}`;
                let tooltip = `Reserved by ${userName}`;
                var sql = "UPDATE tables set isReserved = ?, tooltip = ? WHERE id IN (?)";
                let tableIDs = tables.map(table => {
                    return table.table_id;
                })
                mysqlConnection.query(sql, [1, tooltip, tableIDs], function (err, rows) {
                    if (err) throw err;
                    resolve({ success: true, message: `${rows.affectedRows} tables reserved` });
                });
            }
            else
                reject({ success: false, message: "User not found" });
        })
    });
}

updateEventTableCount = (eventID, reservedTablesCountTotal) =>{
    mysqlConnection.query(`SELECT * FROM event WHERE id=${eventID}`, (err, rows, fields) => {
        if (!err) {
            var info = rows[0];
            var leftCount = info.no_of_tables - reservedTablesCountTotal;
            mysqlConnection.query(`UPDATE event set available_tables = ${leftCount}  WHERE id=${eventID}`, (err, rows, fields) => {
                if(!err)
                    {
                        console.log(rows)
                    }
                    else
                    {
                        console.log(err)
                    }
            });
        }
    })
}
updatePaidTablesCount = (eventID, userID, paidCount) =>{
    console.log(eventID, userID, paidCount, "LEFT TABLES PAIDDDDDDDDDDDD")
    return new Promise((resolve, reject)=>{
        mysqlConnection.query(`SELECT * from user_registration_payment where user_id=${userID} and event_id=${eventID}`, (err, rows, fields) => {
            if (!err && rows.length) {
                var info = rows[0];
                var leftCount = info.paid_tables - paidCount;
                console.log(leftCount, "LEFT TABLES PAIDDDDDDDDDDDD")
                mysqlConnection.query(`UPDATE user_registration_payment set paid_tables = ${leftCount}  WHERE user_id=${userID} and event_id=${eventID}`, (err, rows, fields) => {
                    if(!err)
                        {
                           resolve(true)
                        }
                        else
                        {
                            reject(false)
                        }
                });
            }
        })
    })
   
}

isUserExist = (email) => {
    return new Promise((resolve, reject)=>{
        var sql = `SELECT * from user where email='${email}'`;

        mysqlConnection.query(sql, (err, rows, fields) => {
            if (!err && rows.length)
            {
                let userObj = rows[0];
                resolve({exist:true, user: userObj})
             
                
            }          
            else
                resolve({exist:false})
        })
    })
  
}


function sendReservationConfirmationEmail(recepientEmail)
{
    return new Promise((resolve, reject) => {

        var bURL = process.env.BASE_URL;
        console.log(bURL,"PROCESS URL")
        // test account 
        nodemailer.createTestAccount().then(testAccount =>{
            var mailOptions = new Object();
            mailOptions = {
                to: recepientEmail,
                subject: "Reservation Confirmed",
                html: "<h1>Hello</h1>,<br> You have reserved following tables for event",
               
            }
            var smtpTransport = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                },
                tls:{
                    rejectUnauthorized: false
                }
            });
            smtpTransport.sendMail(mailOptions)
                .then((response) => {
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(response));
                    resolve(true);
                }).catch((error) => {
                   console.log(error, "------------ error");
                    reject(false);
                })
        });
        // email sending 
    
    })
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}..`));