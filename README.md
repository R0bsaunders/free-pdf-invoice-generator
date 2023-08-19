# free-pdf-invoice-generator
A quick way to create pdf invoices

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