CREATE TABLE [Users] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [first_name] VARCHAR (50) NOT NULL,
    [last_name] VARCHAR (50) NOT NULL,
	[email] VARCHAR (50) NOT NULL,
	[address] VARCHAR (100) NOT NULL, 
    [username] VARCHAR (50) NOT NULL, 
	[password] VARCHAR (255) NOT NULL,
	[salt] VARCHAR (255) NOT NULL,
	[is_admin] BIT DEFAULT 0, 
	[is_deleted] BIT DEFAULT 0, 
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
	[last_login_date] DATETIME NOT NULL,
);
go
CREATE TABLE [Documents] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [container] VARCHAR(30) NOT NULL,
	[file_name] VARCHAR(50) NOT NULL,
    [user_id] INT NOT NULL,
	[is_deleted] BIT DEFAULT 0, 
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
CREATE TABLE [TransactionComments] (
	[id] INT PRIMARY KEY IDENTITY (1, 1),
	[transactions_id] INT NOT NULL,
	[author_name] VARCHAR(20) NOT NULL,
	[commnet] TEXT NULL,
	[is_deleted] BIT DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
)
go
CREATE TABLE [Transactions] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
	[user_id] INT NOT NULL,
	[address] VARCHAR (100) NULL,
	[city] VARCHAR (30) NULL,
	[state] VARCHAR (2) NULL,
	[zip_code] VARCHAR (10) NULL, 
    [mls_id] VARCHAR (50) NULL, 
	[apn] VARCHAR (50) NULL,
	[listing_price] VARCHAR (50) NULL,
	[commision_rate] VARCHAR (50) NULL,
	[buyer_name] VARCHAR (50) NULL,
	[seller_name] VARCHAR (50) NULL,
	[transactionstatus_id] INT NOT NULL, 
	[is_deleted] BIT DEFAULT 0, 
	[listing_start_date] DATETIME NOT NULL,
	[listing_end_date] DATETIME NOT NULL,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
--  Single upload -> Can detect document type
--	User have not deleted file on UI -> file will be re-writes
CREATE TABLE [Transactions_DocumentTypes] (
	[id] INT PRIMARY KEY IDENTITY (1, 1),
    [transactions_id] INT NOT NULL,
	[documenttypes_id] INT NOT NULL,
	[uploaded] BIT DEFAULT 1,
	[is_deleted] BIT DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
CREATE TABLE [DocumentTypes] (
	[id] INT PRIMARY KEY IDENTITY (1, 1),
	[document_name] VARCHAR(150) NOT NULL,
	[is_deleted] BIT DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
CREATE TABLE [TransactionStatus] (
	[id] INT PRIMARY KEY IDENTITY (1, 1),
	[status_name] VARCHAR(20) NOT NULL,
	[is_deleted] BIT DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go

-- Multi upload -> Can not detect document type
-- User have deleted file on UI by icon [x]
CREATE TABLE [TransactionFiles] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [container] VARCHAR(30) NOT NULL,
	[file_name] VARCHAR(50) NOT NULL,
    [transactions_id] INT NOT NULL,
	[is_deleted] BIT DEFAULT 0, 
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
-- fetch data
-- [Users]
INSERT INTO [Users] ([first_name],[last_name],[email],[address],[username],[password],[salt],[is_admin],[created_at],[updated_at],[last_login_date]) 
VALUES ('Nathan','nathan','nathan@gmail.com','Us','nathan','QQV9maR9RLIh2CfSpTnUGw==','$2b$15$55yyKez0y1tqEe.pOIOIbO',1, '2021-05-03 12:37:34.373','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')
go
-- [DocumentTypes]
INSERT INTO [Users] ([first_name],[last_name],[email],[address],[username],[password],[salt],[is_admin],[created_at],[updated_at],[last_login_date]) 
VALUES ('Nathan','nathan','nathan@gmail.com','Us','nathan','QQV9maR9RLIh2CfSpTnUGw==','$2b$15$55yyKez0y1tqEe.pOIOIbO',1, '2021-05-03 12:37:34.373','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')
go
-- [DocumentStatus]