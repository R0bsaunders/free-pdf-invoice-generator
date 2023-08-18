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

var users = [
    {
        name: "Shyam",
        age: "26",
    },
    {
        name: "Navjot",
        age: "26",
    },
    {
        name: "Vitthal",
        age: "26",
    },
];

var document = {
    html: html,
    data: {
        users: users,
    },
    path: "./YoYo.pdf",
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

var credentials = [
    {
        date: "18/07/2023",
        invoiceNo: "000121",
        summary: "SEO Work August 2023",
        billTo: "Meladore",
        billEmail: "info@meladoredevelopments.co.uk"
    }
];

const description = [
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

var subTotal = addition(description[0].invoiceLines);
var totalDue = subTotal - description[1].deposit - description[1].discount



function addition (calc) {
    let x = 0
    calc.forEach((e) => x += e.amount)
    return x;
}
