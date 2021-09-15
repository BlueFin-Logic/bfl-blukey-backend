const nodemailer = require("nodemailer");

class EmailService {
    constructor(user, pass) {
        this.user = user,
            this.transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: user,
                    pass: pass
                },
            });
    }

    async sendMail(listOfReceiver, subject, content) {
        try {
            return await this.transporter.sendMail({
                from: `"System BluKey" <${this.user}>`,
                to: listOfReceiver,
                subject: subject,
                html: content
            });
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    newUserSubject() {
        return "Welcome Newbie To Blukey";
    }

    reviewTransactionSubject(transactionId) {
        try {
            return `[Review] Transaction Number: ${transactionId}`;
        } catch (error) {
            console.log("Something went wrong when init subject for review transaction");
            return null;
        }
    }

    completedTransactionSubject(transactionId) {
        try {
            return `[Completed] Transaction Number: ${transactionId}`;
        } catch (error) {
            console.log("Something went wrong when init subject for completed transaction");
            return null;
        }
    }

    errorTransactionSubject(transactionId) {
        try {
            return `[Error] Transaction Number: ${transactionId}`;
        } catch (error) {
            console.log("Something went wrong when init subject for error transaction");
            return null;
        }
    }

    newUserContent(user, password) {
        try {
            return `<p>Hi <strong>${user.firstName} ${user.lastName}</strong>,</p>
                    <p>This is information about your account:</p>
                    <ul>
                        <li>First name: ${user.firstName}</li>
                        <li>Last name: ${user.lastName}</li>
                        <li>Email: ${user.email}</li>
                        <li>Username: ${user.userName}</li>
                        <li>Password: ${password}</li>
                    </ul>
                    <p>Regards,<br>
                        Admin</p>`;
        } catch (error) {
            console.log("Something went wrong when init content for new user. Please contact the administrator immediately");
            return null;
        }
    }

    reviewTransactionContent(transaction) {
        try {
            return `<p>Hi <strong>Admin</strong>,</p>
                    <p>Transaction with ID: ${transaction.id} has change status to Review:</p>
                    <ul>
                        <li>ID: ${transaction.id}</li>
                        <li>Address: ${transaction.address}</li>
                        <li>City: ${transaction.city}</li>
                        <li>State: ${transaction.state}</li>
                        <li>ZipCode: ${transaction.zipCode}</li>
                        <li>MLS ID: ${transaction.mlsId}</li>
                        <li>APN: ${transaction.apn}</li>
                        <li>Listing Price: ${transaction.listingPrice}</li>
                        <li>Commission Amount: ${transaction.commissionAmount}</li>
                        <li>Buyer Name: ${transaction.buyerName}</li>
                        <li>Seller Name: ${transaction.sellerName}</li>
                        <li>Start Date: ${transaction.listingStartDate}</li>
                        <li>End Date: ${transaction.listingEndDate}</li>
                        <li>Status: Review</li>
                    </ul>
                    <p>Regards,<br />
                        ${transaction.user.firstName} ${transaction.user.lastName}</p>`;
        } catch (error) {
            console.log("Something went wrong when init content for review transaction. Please contact the administrator immediately");
            return null;
        }
    }

    completedTransactionContent(transaction) {
        try {
            return `<p>Hi <strong>${transaction.user.firstName} ${transaction.user.lastName}</strong>,</p>
                    <p>Your transaction has change status to Complete:</p>
                    <ul>
                        <li>ID: ${transaction.id}</li>
                        <li>Address: ${transaction.address}</li>
                        <li>City: ${transaction.city}</li>
                        <li>State: ${transaction.state}</li>
                        <li>ZipCode: ${transaction.zipCode}</li>
                        <li>MLS ID: ${transaction.mlsId}</li>
                        <li>APN: ${transaction.apn}</li>
                        <li>Listing Price: ${transaction.listingPrice}</li>
                        <li>Commission Amount: ${transaction.commissionAmount}</li>
                        <li>Buyer Name: ${transaction.buyerName}</li>
                        <li>Seller Name: ${transaction.sellerName}</li>
                        <li>Start Date: ${transaction.listingStartDate}</li>
                        <li>End Date: ${transaction.listingEndDate}</li>
                        <li>Status: Complete</li>
                    </ul>
                    <p>Regards,<br />
                        Admin</p>`;
        } catch (error) {
            console.log("Something went wrong when init content for completed transaction. Please contact the administrator immediately");
            return null;
        }
    }

    errorTransactionContent(transaction) {
        try {
            return `<p>Hi <strong>${transaction.user.firstName} ${transaction.user.lastName}</strong>,</p>
                    <p>Your transaction has change status to Error:</p>
                    <ul>
                        <li>ID: ${transaction.id}</li>
                        <li>Address: ${transaction.address}</li>
                        <li>City: ${transaction.city}</li>
                        <li>State: ${transaction.state}</li>
                        <li>ZipCode: ${transaction.zipCode}</li>
                        <li>MLS ID: ${transaction.mlsId}</li>
                        <li>APN: ${transaction.apn}</li>
                        <li>Listing Price: ${transaction.listingPrice}</li>
                        <li>Commission Amount: ${transaction.commissionAmount}</li>
                        <li>Buyer Name: ${transaction.buyerName}</li>
                        <li>Seller Name: ${transaction.sellerName}</li>
                        <li>Start Date: ${transaction.listingStartDate}</li>
                        <li>End Date: ${transaction.listingEndDate}</li>
                        <li>Status: Error</li>
                    </ul>
                    <p>Regards,<br />
                        Admin</p>`;
        } catch (error) {
            console.log("Something went wrong when init content for error transaction. Please contact the administrator immediately");
            return null;
        }
    }
}

module.exports = EmailService;