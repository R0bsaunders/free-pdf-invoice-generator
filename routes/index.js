const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const index = path.join(__dirname, '..', 'views', 'index.html');

console.log("Index page reached");

router.get('/', (req, res) => {


    fs.readFile(index, (error, data) => {

        if (error) {
            res.writeHead(404);
            res.write("There was an error");

        } else {
            res.writeHead(200, { 'content-Type' : 'text/html' });
            res.write(data);

        };

        res.end();
    });

});

module.exports = router;