const express = require('express');
const app = express();
var pdf = require("pdf-creator-node");
var fs = require("fs");
var html = fs.readFileSync("pdf-template.html", "utf8");


// Server

app.set("view engine", "ejs");

app.get('/make-me-a-pdf/:data', (req, res) => {
    pdfGenerator(req.params.data)
    console.log(req.params.data);
    res.send("Done")
    
})

app.listen(3000);


function pdfGenerator (data) {

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

        date: "",
        invoiceNo: data,
        summary: "",
        billTo: "",
        billEmail: ""
    }


// 2) Invoice Description

var description = [
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
    {
        deposit: 0,
        discount: 0, 
    },
];

// 3) Math

var subTotal = addition(description[0].invoiceLines);
var totalDue = subTotal - description[1].deposit - description[1].discount;

function addition (calc) {

    let x = 0
    calc.forEach((e) => x += e.amount)
    return x;
};

// 4) Bank Details

var bankDetails = 
    {
        bankName: "",
        accountName: "",
        sortCode: "",
        accountNumber: "",
    };

var document = {
    html: html,
    data: {
        credentials: credentials,
        lines: description[0].invoiceLines,
        description: description[1],
        subTotal: subTotal,
        total: totalDue,
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