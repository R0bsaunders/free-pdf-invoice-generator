const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Server

app.set("view engine", "ejs");

app.get('/make-me-a-pdf/:data', (req, res) => {
    console.log(req.params.data);
    let details = JSON.parse(decodeURIComponent(req.params.data))
    pdfGenerator(details)
    res.send(details)
    
})

app.listen(3000);


function pdfGenerator (data) {
    var pdf = require("pdf-creator-node");
    var fs = require("fs");
    var html = fs.readFileSync("pdf-template.html", "utf8");
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Yo Momma</div>'
        },
        footer: {
            height: "28mm",
            contents: {
                first: 'Cover page',
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };


    // 1) Invoice Credentials
    var credentials = {

        date: data[0].date,
        invoiceNo: data[0].invoiceNo,
        summary: data[0].summary,
        billTo: data[0].billTo,
        billEmail: data[0].billEmail,
    };

    // 2) Invoice Description
    var description = [
        
            data[1].invoiceLines,
        
        {
            deposit: data[0].deposit,
            discount: data[0].discount, 
        },
    ];



    // 4) Bank Details

    var bankDetails = 
        {
            bankName: data[0].bankName,
            accountName: data[0].accountName,
            sortCode: data[0].sortCode,
            accountNumber: data[0].accountNumber,
        };

    var document = {
        html: html,
        data: {
            credentials: credentials,
            lines: description[0].invoiceLines,
            description: description[1],
            subTotal: data[0].subTotal,
            total: data[0].totalDue,
            bank: bankDetails
        },
        path: "invoice-"+credentials.invoiceNo+".pdf",
        type: "",
    };
    // By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.

    function create () {

    pdf
    .create(document, options)
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    });

    };
    create()

    };


    const newRequest = [
        {
            date: "",
            invoiceNo: 0,
            summary: "",
            billTo: "",
            billEmail: "",
            bankName: "",
            accountName: "",
            sortCode: "",
            accountNumber: "",
            deposit: 0,
            discount: 0, 
            subTotal: 0,
            totalDue: 0,
        },
        {
            invoiceLines: [
                {
                    description: "",
                    amount: 0
                },
                {
                    description: "",
                    amount: 0
                },
            ],
        },
];