var pdf = require("pdf-creator-node");
var fs = require("fs");
var html = fs.readFileSync("index.html", "utf8");

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



// PDF Invoice Generator

/* PDF split into sections for easy variable creation (The below will be objects of data): 

    1) Invoice credentials:
        Date
        Invoice #
        Summary
        Bill to Company
        Bill to Company Email

    2) Invoice Description (Multiple lines - Array of objects)
        Description
        Amount
        Deposit 
        Discount (can be used for discount)


    3) Math
        Subtotal
        Total Due (Subtotal Less Deposit, Less Other)

    4) Bank Details
        Bank
        Account Name
        Sort Code
        Account Number

*/

// 1) Invoice Credentials

var credentials = {

        date: "18/07/2023",
        invoiceNo: "000121",
        summary: "SEO Work August 2023",
        billTo: "email@email.com",
        billEmail: "email@email.com"
    }


// 2) Invoice Description

var description = [
    {
        invoiceLines: [
            {
                description: "Lots and lots of work that is the best",
                amount: 175
            },
            {
                description: "Another load of stuff",
                amount: 254
            },
        ],
    },
    {
        deposit: 50,
        discount: 10, 
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
        bankName: "Lloyds Bank",
        accountName: "Robert Saunders",
        sortCode: "40-55-99",
        accountNumber: "15228965",
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
    path: "./invoice-"+credentials.invoiceNo+".pdf",
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

}

create()