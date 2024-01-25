const express = require('express');
const router = express.Router();
const path = require ('path')
const fs = require("fs");
const invoiceName = "Hello"

router.get('/', (req, res) => {

    // Extract invoice name from the request, assume it's in the URL query or similar
    console.log("Download router works");
    let pdf = path.join(__dirname, '..', 'public', 'pdf', `invoice-${invoiceName}.pdf`);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "X-Invoice-Name");
    res.setHeader("X-Invoice-Name", invoiceName); // Setting custom header with invoice name

    fs.readFile(pdf, (err, content) => {
        
        if (err) {
            console.error(err); // Log the error to the server console
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("Not Found");

        } else {
            res.writeHead(200, { "Content-Type": "application/pdf" });

            res.end(content); // Send the PDF content to the client

            setTimeout(() => {
        
                fs.unlink(pdf, (err) => {
                    if (err) {
                      console.error('There was an error:', err.message);
                      return;

                    }
                    console.log('File was deleted successfully');

                });
        
            }, 5000);
        };
    });
});

module.exports = router;
