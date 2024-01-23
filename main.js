const path = require('path');
const express = require('express');
const app = express();

// Telling the express module that the public dir has all of our site assets
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/pages/index.html'));

});


app.listen(1);

console.log("Server is running at: http://127.0.0.1:1");