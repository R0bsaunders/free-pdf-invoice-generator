const express = require('express');
const app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Server

app.set("view engine", "ejs");

app.get('/make-me-a-pdf/:data', (req, res) => {
    let details = JSON.parse(decodeURIComponent(req.params.data))
    console.log("Request sent");
    pdfGenerator(details);
    res.send("File Created");
    
});

app.listen(3000);


function pdfGenerator (data) {
    var pdf = require("pdf-creator-node");
    var fs = require("fs");
    var html = fs.readFileSync("pdf-template.html", "utf8");
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
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
            lines: data[1].invoiceLines,
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
            date: "05/89/65",
            invoiceNo: 123456789,
            summary: "BLABLABLABL",
            billTo: "Me",
            billEmail: "YoYo@ghj.com",
            bankName: "TLloyds",
            accountName: "Rob",
            sortCode: "50-45-00",
            accountNumber: "1234567",
            deposit: 25,
            discount: 25, 
            subTotal: 1300,
            totalDue: 1800,
        },
        {
            invoiceLines: [
                {
                    description: "Higgedlfy",
                    amount: 75
                },
                {
                    description: "Higgedlfy",
                    amount: 75
                },
                {
                    description: "Higgedlfy",
                    amount: 75
                },
                {
                    description: "Higgedlfy",
                    amount: 75
                },
            ],
        },
    ]
    function sendData () {
        let transmit = encodeURIComponent(JSON.stringify(newRequest));
        const Http = new XMLHttpRequest();
        const url= `http://localhost:3000/make-me-a-pdf/${transmit}`;
        Http.open("GET", url);
        Http.send();
    
        Http.onreadystatechange =(e)=>{
        console.log(Http.responseText);
        };
    };

    sendData()