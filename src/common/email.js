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
            return error;
        }
    }

    newUserSubject() {
        return "Welcome Newbie To Blukey";
    }

    reviewTransactionSubject(transactionId) {
        try {
            return `[Review] Transaction Number: ${transactionId}`;
        } catch (error) {
            return "Something went wrong when init subject for review transaction";
        }
    }

    completedTransactionSubject(transactionId) {
        try {
            return `[Completed] Transaction Number: ${transactionId}`;
        } catch (error) {
            return "Something went wrong when init subject for completed transaction";
        }
    }

    errorTransactionSubject(transactionId) {
        try {
            return `[Error] Transaction Number: ${transactionId}`;
        } catch (error) {
            return "Something went wrong when init subject for error transaction";
        }
    }

    newUserContent(user) {
        try {
            return `<p>Hi <strong>${user.firstName} ${user.lastName}</strong>,</p>
                    <p>This is information about your account:</p>
                    <ul>
                        <li>First name:&nbsp;${user.firstName}</li>
                        <li>Last name: ${user.lastName}</li>
                        <li>Email:&nbsp;${user.email}</li>
                        <li>Username:&nbsp;${user.userName}</li>
                        <li>Password:&nbsp;${user.password}</li>
                    </ul>
                    <p>Regards,<br>
                        Admin</p>`;
        } catch (error) {
            return "Something went wrong when init content for new user. Please contact the administrator immediately";
        }
    }

    reviewTransactionContent(transaction) {
        try {
            return `<p>Hi all <strong>Admin</strong>,</p>
                    <p>Your transaction has change status to Review:</p>
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
            return "Something went wrong when init content for review transaction. Please contact the administrator immediately";
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
            return "Something went wrong when init content for completed transaction. Please contact the administrator immediately";
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
            return "Something went wrong when init content for error transaction. Please contact the administrator immediately";
        }
    }
}

module.exports = EmailService;