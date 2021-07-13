IF OBJECT_ID('[dbo].[User]', 'U') IS NULL CREATE TABLE [dbo].[User]
(
    [id] INTEGER NOT NULL IDENTITY(1,1) ,
    [firstName] NVARCHAR(15) NOT NULL,
    [lastName] NVARCHAR(15) NOT NULL,
    [email] NVARCHAR(30) NOT NULL,
    [address] NVARCHAR(100) NOT NULL,
    [userName] NVARCHAR(30) NOT NULL,
    [password] NVARCHAR(100) NOT NULL,
    [isAdmin] BIT NOT NULL DEFAULT 0,
    [lastLoginDate] DATETIMEOFFSET NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL,
    [updatedAt] DATETIMEOFFSET NOT NULL,
    [deletedAt] DATETIMEOFFSET NULL,
    PRIMARY KEY ([id])
);


IF OBJECT_ID('[dbo].[DocumentUser]', 'U') IS NULL CREATE TABLE [dbo].[DocumentUser]
(
    [id] INTEGER NOT NULL IDENTITY(1,1) ,
    [container] NVARCHAR(10) NOT NULL,
    [folder] NVARCHAR(10) NOT NULL,
    [fileName] NVARCHAR(50) NOT NULL,
    [userId] INTEGER NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL,
    [updatedAt] DATETIMEOFFSET NOT NULL,
    [deletedAt] DATETIMEOFFSET NULL,
    PRIMARY KEY ([id]),
    FOREIGN KEY ([userId]) REFERENCES [User] ([id]) ON DELETE NO ACTION
);


IF OBJECT_ID('[dbo].[TransactionStatus]', 'U') IS NULL CREATE TABLE [dbo].[TransactionStatus]
(
    [id] SMALLINT NOT NULL IDENTITY(1,1) ,
    [name] NVARCHAR(10) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL,
    [updatedAt] DATETIMEOFFSET NOT NULL,
    [deletedAt] DATETIMEOFFSET NULL,
    PRIMARY KEY ([id])
);


IF OBJECT_ID('[dbo].[Transaction]', 'U') IS NULL CREATE TABLE [dbo].[Transaction]
(
    [id] INTEGER NOT NULL IDENTITY(1,1) ,
    [userId] INTEGER NOT NULL,
    [address] NVARCHAR(100) NOT NULL,
    [city] NVARCHAR(15) NOT NULL,
    [state] NVARCHAR(2) NOT NULL,
    [zipCode] NVARCHAR(10) NOT NULL,
    [mlsId] NVARCHAR(20) NOT NULL,
    [apn] NVARCHAR(50) NOT NULL,
    [listingPrice] DECIMAL(20,10) NOT NULL,
    [commissionAmount] DECIMAL(20,10) NOT NULL,
    [buyerName] NVARCHAR(50) NOT NULL,
    [sellerName] NVARCHAR(50) NOT NULL,
    [canComplete] BIT NOT NULL DEFAULT 0,
    [transactionStatusId] SMALLINT NOT NULL,
    [listingStartDate] DATETIMEOFFSET NOT NULL,
    [listingEndDate] DATETIMEOFFSET NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL,
    [updatedAt] DATETIMEOFFSET NOT NULL,
    [deletedAt] DATETIMEOFFSET NULL,
    PRIMARY KEY ([id]),
    FOREIGN KEY ([userId]) REFERENCES [User] ([id]) ON DELETE NO ACTION,
    FOREIGN KEY ([transactionStatusId]) REFERENCES [dbo].[TransactionStatus] ([id]) ON DELETE NO ACTION
);


IF OBJECT_ID('[dbo].[DocumentType]', 'U') IS NULL CREATE TABLE [dbo].[DocumentType]
(
    [id] INTEGER NOT NULL IDENTITY(1,1) ,
    [name] NVARCHAR(100) NOT NULL,
    [isRequired] BIT NOT NULL DEFAULT 0,
    [createdAt] DATETIMEOFFSET NOT NULL,
    [updatedAt] DATETIMEOFFSET NOT NULL,
    [deletedAt] DATETIMEOFFSET NULL,
    PRIMARY KEY ([id])
);


IF OBJECT_ID('[dbo].[TransactionDocumentType]', 'U') IS NULL CREATE TABLE [dbo].[TransactionDocumentType]
(
    [transactionId] INTEGER ,
    [documentTypeId] INTEGER ,
    [container] NVARCHAR(10) NOT NULL,
    [folder] NVARCHAR(10) NOT NULL,
    [fileName] NVARCHAR(50) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL,
    [updatedAt] DATETIMEOFFSET NOT NULL,
    [deletedAt] DATETIMEOFFSET NULL,
    PRIMARY KEY ([transactionId], [documentTypeId]),
    FOREIGN KEY ([transactionId]) REFERENCES [dbo].[Transaction] ([id]) ON DELETE NO ACTION,
    FOREIGN KEY ([documentTypeId]) REFERENCES [dbo].[DocumentType] ([id]) ON DELETE NO ACTION
);


IF OBJECT_ID('[dbo].[TransactionComment]', 'U') IS NULL CREATE TABLE [dbo].[TransactionComment]
(
    [id] INTEGER NOT NULL IDENTITY(1,1) ,
    [transactionId] INTEGER NOT NULL,
    [userId] INTEGER NOT NULL,
    [comment] NVARCHAR(MAX) NOT NULL,
    [createdAt] DATETIMEOFFSET NOT NULL,
    [updatedAt] DATETIMEOFFSET NOT NULL,
    [deletedAt] DATETIMEOFFSET NULL,
    PRIMARY KEY ([id]),
    FOREIGN KEY ([transactionId]) REFERENCES [Transaction] ([id]) ON DELETE NO ACTION,
    FOREIGN KEY ([userId]) REFERENCES [User] ([id]) ON DELETE NO ACTION
);
