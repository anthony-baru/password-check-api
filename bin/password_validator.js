const dotenv = require("dotenv");
const mysql = require('mysql');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.MY_SQL_HOST,
    user: process.env.MY_SQL_USER,
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.MY_SQL_DATABASE
});

if (!connection._connectCalled) {
    connection.connect();
}

const checkPasswordValidity = () => {
    connection.query("SELECT * FROM `passwords`", function (err, result, fields) {
        if (err)
            throw err;
        makeHttpCallToServer(result)
    })
}

const updatePassword = (password, valid) => {
    const sql = "UPDATE `passwords` SET `valid` = '" + valid + "' WHERE `passwords`.`password` = '" + password + "'";
    connection.query(sql, function (err, result) {
        if (err)
            throw err;
    });
}

const makeHttpCallToServer = (data) => {
    const rep = JSON.parse(JSON.stringify(data));
    for (const x of rep) {
        setTimeout(() => {
            const unirest = require('unirest');
            unirest('POST', `${process.env.HOST_URL}/passwords`)
                .headers({
                    'Content-Type': 'application/json'
                })
                .send(JSON.stringify({
                    "password": `${x.password}`
                }))
                .end(function (res) {
                    const resp = JSON.parse(JSON.stringify(res))
                    if (resp.statusCode === 200) {
                        console.log(`\n ${x.password} :> ${resp.body.message}`)
                        updatePassword(x.password, 1)
                    } else {
                        console.log(`\n ${x.password} :> \n ${resp.body.errors}`)
                        updatePassword(x.password, 0)
                    }
                });
        }, 3000)
    }
}
checkPasswordValidity();
