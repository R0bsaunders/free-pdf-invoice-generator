const express = require('express');
const pdf = require("pdf-creator-node");
const fs = require("fs");
const html = fs.readFileSync("pdf-template.html", "utf8");
const cors = require('cors');
const app = express();
const http = require("http");
var invoiceName = "";

app.get("/", (req, res) => { 
    res.send("Express on Vercel"); 
}); 

const PORT = process.env.PORT || 5000; 

app.use(cors({
    exposedHeaders: ['X-Invoice-Name'], // add this line
}));

app.use(express.urlencoded({ 
    extended: false,
    limit: 10000,
    parameterLimit: 16,

}));

app.post('/invoice', function(request, response){

    writeCredentials(request.body)

});


const footerText = `<footer style="position: absolute; bottom: 0;">
<div>Invoice generated using Rob Saunders' free Invoice Generator: <a href="https://www.quickinvoicegenerator.co.uk">www.quickinvoicegenerator.co.uk</a></div>
</footer>`;

const writeCredentials = (data) => {

    invoiceName = data.invoice_number;
    console.log(invoiceName);

    const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        footer: {
            height: "28mm",
            contents: {
                first: footerText ,
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };

    // 1) Invoice Credentials

    const credentials = {
        name: data.company_name,
        date: data.invoice_date,
        invoiceNo: data.invoice_number,
        summary: data.invoice_summary,
        billTo: data.invoice_bill_to,
        billEmail: data.invoice_bill_to_email
    }

    // 2) Invoice Description

    const description = [
        {
            invoiceLines: [
                {
                    description: data.desc_line1,
                    amount: data.amount_line1
                },
                {
                    description: data.desc_line2,
                    amount: data.amount_line2
                },
            ],
        },
        {
            deposit: data.deposit,
            discount: data.discount, 
        },
    ];

    // 3) Math

    var subTotal = addition(description[0].invoiceLines);
    var totalDue = subTotal - parseInt(description[1].deposit) - parseInt(description[1].discount);

    function addition (calc) {

        let x = 0
        calc.forEach((e) => x += parseInt(e.amount))
        return x;
    };

    // 4) Bank Details

    const bankDetails = 
        {
            bankName: data.bankName,
            accountName: data.accountName,
            sortCode: data.sortCode,
            accountNumber: data.accountNumber,
        };

    var document = {
        html: html,
        data: {
            credentials: credentials,
            lines: description[0].invoiceLines,
            description: description[1],
            subTotal: subTotal,
            total: totalDue,
            bank: bankDetails,
        },
        path: "invoice-"+credentials.invoiceNo+".pdf",
        type: "",
    };

    
    // By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.

    function create () {

        pdf
        .create(document, options)
        .then((res) => {
            alert(res);

        })

        .catch((error) => {
            console.error(error);
        });
    
    };

    create()

}

const server = http.createServer(function(req, res) {
    // Extract invoice name from the request, assume it's in the URL query or similar
    
    let pdf = `${__dirname}/invoice-${invoiceName}.pdf`;

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
    res.setHeader("Access-Control-Expose-Headers", "X-Invoice-Name");
    res.setHeader("X-Invoice-Name", invoiceName); // Setting custom header with invoice name

    fs.readFile(pdf, function(err, content) {
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
                    alert('File was deleted successfully');
                });
        
            }, 5000);
        }
    });

});

server.listen(1234, function() {
    console.log("Server running on port 1234");
});

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
    
});

module.exports = app; // Export the Express app