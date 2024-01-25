const express = require('express');
const app = express();
const websitePort = 3000

// Serve static files from the 'public' directory
// Telling the express module that the public dir has all of our site assets
app.use(express.static('public'));

// Require route modules
const indexRouter = require('./routes/index');
const formReceiverRouter = require('./routes/formReceiver');
const downloadRouter = require('./routes/download');

// Use routes
app.use('/', indexRouter);
app.use('/form-receiver', formReceiverRouter);
app.use('/download', downloadRouter);


app.listen(websitePort, () => {
    console.log(`Download Server running on port: ${websitePort}`);

});


module.exports = app;