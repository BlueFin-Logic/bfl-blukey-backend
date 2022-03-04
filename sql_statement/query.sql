drop database blukey

create database blukey

USE [BluKey-SQL]

drop table [Users]
go
TRUNCATE TABLE [Users];
go
drop table [Documents]
go
TRUNCATE TABLE [Documents];
go
CREATE TABLE [Users] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [first_name] VARCHAR (50) NOT NULL,
    [last_name] VARCHAR (50) NOT NULL,
	[email] VARCHAR (50) NOT NULL,
	[address] VARCHAR (100) NOT NULL, 
    [username] VARCHAR (50) NOT NULL, 
	[password] VARCHAR (255) NOT NULL,
	[salt] VARCHAR (255) NOT NULL,
	[is_admin] BIT DEFAULT 0 NOT NULL,
	[is_deleted] BIT DEFAULT 0 NOT NULL, 
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
	[last_login_date] DATETIME NOT NULL,
);
go
CREATE TABLE [UsersDocuments] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [container] VARCHAR(30) NOT NULL,
	[file_name] VARCHAR(50) NOT NULL,
    [user_id] INT NOT NULL,
	[is_deleted] BIT DEFAULT 0 NOT NULL, 
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
CREATE TABLE [TransactionComments] (
	[id] INT PRIMARY KEY IDENTITY (1, 1),
	[transactions_id] INT NOT NULL,
	[user_id] INT NOT NULL,
	[commnet] TEXT NOT NULL,
	[is_deleted] BIT DEFAULT 0 NOT NULL,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
CREATE TABLE [Transactions] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
	[user_id] INT NOT NULL,
	[address] VARCHAR (100) NOT NULL,
	[city] VARCHAR (20) NOT NULL,
	[state] VARCHAR (2) NOT NULL,
	[zip_code] VARCHAR (10) NOT NULL,
    [mls_id] VARCHAR (20) NOT NULL,
	[apn] VARCHAR (50) NOT NULL,
	[listing_price] DECIMAL(20,10) NOT NULL,
	[commission_amount] DECIMAL(20,10) NOT NULL,
	[buyer_name] VARCHAR (50) NOT NULL,
	[seller_name] VARCHAR (50) NOT NULL,
	[transactionstatus_id] TINYINT NOT NULL,
	[listing_start_date] DATETIME NOT NULL,
	[listing_end_date] DATETIME NOT NULL,
	[can_complete] BIT DEFAULT 0 NOT NULL, 
	[is_deleted] BIT DEFAULT 0 NOT NULL, 
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
	[container] VARCHAR(30) NOT NULL,
	[file_name] VARCHAR(50) NOT NULL,
	[is_deleted] BIT DEFAULT 0 NOT NULL,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
CREATE TABLE [DocumentTypes] (
	[id] TINYINT PRIMARY KEY IDENTITY (1, 1),
	[document_name] VARCHAR(150) NOT NULL,
	[is_deleted] BIT DEFAULT 0 NOT NULL,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go
CREATE TABLE [TransactionStatus] (
	[id] TINYINT PRIMARY KEY IDENTITY (1, 1),
	[status_name] VARCHAR(20) NOT NULL,
	[is_deleted] BIT DEFAULT 0 NOT NULL,
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
);
go

-- Multi upload -> Can not detect document type
-- User have deleted file on UI by icon [x]
--CREATE TABLE [TransactionFiles] (
--  [id] INT PRIMARY KEY IDENTITY (1, 1),
--  [container] VARCHAR(30) NOT NULL,
--	[file_name] VARCHAR(50) NOT NULL,
--  [transactions_id] INT NOT NULL,
--	[is_deleted] BIT DEFAULT 0, 
--	[created_at] DATETIME NOT NULL,
--	[updated_at] DATETIME NOT NULL,
--);


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
	[created_at] DATETIME NULL DEFAULT GETDATE(),
	[updated_at] DATETIME NULL DEFAULT GETDATE(),
	[last_login_date] DATETIME NULL DEFAULT GETDATE(),
);
go
CREATE TABLE [Users] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [first_name] VARCHAR (50) NULL,
    [last_name] VARCHAR (50) NULL,
	[email] VARCHAR (50) NULL,
	[address] VARCHAR (100) NULL, 
    [username] VARCHAR (50) NULL, 
	[password] VARCHAR (255) NULL,
	[salt] VARCHAR (255) NULL,
	[is_admin] BIT DEFAULT 0, 
	[is_deleted] BIT DEFAULT 0, 
	[created_at] DATETIME NULL,
	[updated_at] DATETIME NULL,
	[last_login_date] DATETIME NULL,
);


--Listing price, Commision rate

--Monday May 3rd 2021, 12:27:14 pm
--2021-05-03 12:37:34.3734

INSERT INTO [Users] ([first_name],[last_name],[email],[address],[username],[password],[salt],[is_admin],[created_at],[updated_at],[last_login_date]) 
VALUES ('Lam','Nguyen','lam@gmail.com','Us','lam','Qq4Xh5gN0+O7/9+euNiJOQ==','$2b$15$c/34mP1e9XM1zRQ7D6UZpe',1, '2021-05-03 12:37:34.373','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')
go
INSERT INTO [Users] ([first_name],[last_name],[email],[address],[username],[password],[salt],[is_admin],[created_at],[updated_at],[last_login_date]) 
VALUES ('Nathan','Nguyen','nathan@gmail.com','Us','nathan','QQV9maR9RLIh2CfSpTnUGw==','$2b$15$55yyKez0y1tqEe.pOIOIbO',1, '2021-05-03 12:37:34.373','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')
go
INSERT INTO [Users] ([first_name],[last_name],[email],[address],[username],[password],[salt],[is_admin],[created_at],[updated_at],[last_login_date]) 
VALUES ('Nhan','Nguyen','nhan@gmail.com','Us','nhan','D5SsAvX8FIkqCwQp+tdqxA==','$2b$15$BkH9RVfydKHI3pLl0BCg/e',+1, '2021-05-03 12:37:34.373','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')

INSERT INTO [Documents] ([container], [file_name], [user_id], [created_at], [updated_at]) VALUES ('pdf','a.pdf','1','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')
INSERT INTO [Documents] ([container], [file_name], [user_id], [created_at], [updated_at]) VALUES ('pdf','b.pdf','1','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')
INSERT INTO [Documents] ([container], [file_name], [user_id], [created_at], [updated_at]) VALUES ('pdf','c.pdf','1','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')

SELECT * 
FROM [Documents]

drop table [UserTest]
drop table [DocumentTest]

TRUNCATE TABLE [UserTest];
TRUNCATE TABLE [DocumentTest];

SELECT * 
FROM [UserTest]

SELECT [firstName], [lastName], COUNT([cash]) AS [total_cash] 
FROM [UserTest] AS [UserTest]
GROUP BY [firstName], [lastName]

SELECT * 
FROM [DocumentTest]

INSERT INTO [UserTest] ([firstName], [lastName]) VALUES ('lam', 'lam')
INSERT INTO [UserTest] ([firstName], [lastName]) VALUES ('nhan', 'nhan')

INSERT INTO [DocumentTest] ([fileName], [user_id]) VALUES ('lam', 1)
INSERT INTO [DocumentTest] ([fileName], [user_id]) VALUES ('lam2', 1)
INSERT INTO [DocumentTest] ([fileName], [user_id]) VALUES ('nhan', 2)

INSERT INTO [DocumentTest] ([fileName], [UserTestID]) VALUES ('lam', 1)
INSERT INTO [DocumentTest] ([fileName], [UserTestID]) VALUES ('lam2', 1)
INSERT INTO [DocumentTest] ([fileName], [UserTestID]) VALUES ('nhan', 2)

SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON 
UPDATE [Users] 
SET [is_deleted] = 0
WHERE [id] = 1

SELECT COUNT(1) as total FROM [Users]
 
SELECT * 
FROM [Users]
left outer JOIN [Documents] ON [Users].[id] = [Documents].[user_id]
FOR JSON AUTO, INCLUDE_NULL_VALUES

-- better
SELECT *, (SELECT [Documents].[id], [Documents].[link]
      FROM [Documents]  
      WHERE [Documents].[user_id] = [Users].[id]
     FOR JSON PATH) AS docs
FROM [Users]
FOR JSON PATH, INCLUDE_NULL_VALUES



SELECT * FROM [DocumentUser]

truncate table [DocumentUser]

SELECT * FROM [Users]

SET QUOTED_IDENTIFIER ON

SELECT * FROM [Users] WHERE "first_name" = 'Lam'

SELECT *
FROM [Users]
WHERE [first_name] like 'Nathan'
ORDER BY id ASC
OFFSET 0 ROWS
FETCH NEXT 1 ROWS ONLY

SELECT *
FROM [Users]

ORDER BY [updated_at] DESC
OFFSET 0 ROWS
FETCH NEXT 4 ROWS ONLY


SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON 

INSERT INTO [Users] ([first_name],[last_name],[address],[username],[password],[is_admin],[is_deleted]) 
VALUES ('tesst ne 2','Nguyen','Us','haha','haha','1','0')


SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON 
UPDATE [Users] SET [first_name] = 'Nathan',[last_name] = 'Nathan',[address] = 'Us',[username] = 'haha',[password] = 'haha',[is_admin] = '0',[is_deleted] = '0' WHERE id = @id

CREATE TABLE [Test] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [firstName] VARCHAR (50) NOT NULL,
    [lastName] VARCHAR (50) NULL
);

SELECT * FROM [Test]
drop table [Test]

JSON_QUERY

SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON UPDATE [Users]
SET [created_at] = '2021-05-11 04:09:37.768',[updated_at] = '2021-05-11 04:09:37.768',[first_name] = 'undefined',[last_name] = 'undefined',[email] = 'undefined',[address] = 'undefined',[username] = 'vincen',[password] = 'AY9t5vmr43WZSjN6pUlNCg==',[salt] = '$2b$15$gsqbGw14lcWj6ycGB38r4u',[is_admin] = 'NaN',[is_deleted] = 'NaN',[last_login_date] = '2021-05-11 04:09:38.180'
WHERE [id] = 5

SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON 
UPDATE [Users]
SET [created_at] = '2021-05-11 04:17:44.411',[updated_at] = '2021-05-11 04:17:44.411',[first_name] = NULL,[last_name] = NULL,[email] = NULL,[address] = NULL,[username] = 'vincen',[password] = '3rwuMekA5u3ohN3hPnxUag==',[salt] = '$2b$15$OlJC.zLo81kcrjQP23mm1.',[is_admin] = NULL,[is_deleted] = NULL,[last_login_date] = '2021-05-11 04:17:44.783'
WHERE [id] = 3

SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON 
UPDATE [Users]
SET [created_at] = '"2021-05-11T04:21:46.357Z"',[updated_at] = '2021-05-11 04:26:14.390',[username] = 'vincen',[password] = 'AIloQ6IG2UyBICZ8bbivUw==',[salt] = '$2b$15$XBndOPpC3bxsb7y/eJWpt.',[last_login_date] = '"2021-05-11T04:21:46.757Z"'
WHERE [id] = 5

SET QUOTED_IDENTIFIER OFF SET ANSI_NULLS ON 
                    UPDATE [Users] 
                    SET [username] = @username,[password] = @password,[salt] = @salt 
                    WHERE [id] = @[id]

SELECT [id]
FROM [Users]
--WHERE [email] = 'lam6@gmail.com' selct by lam haha' AND [is_deleted] = 0

SELECT [id]
FROM [Users]
WHERE [email] = @email AND [is_deleted] = 0


SELECT [id],[container],[file_name]
FROM [Documents]
WHERE [user_id] = 1 AND [is_deleted] = 0


SELECT [DocumentTest].[id], [DocumentTest].[fileName], [DocumentTest].[user_id], [DocumentTest].[UserTestId], [UserTest].[id] AS [UserTest.id], [UserTest].[firstName] AS [UserTest.firstName], [UserTest].[lastName] AS [UserTest.lastName], [UserTest].[age] AS [UserTest.age], [UserTest].[cash] AS [UserTest.cash] 
FROM [DocumentTest] AS [DocumentTest] LEFT OUTER JOIN [UserTest] AS [UserTest] 
ON [DocumentTest].[UserTestId] = [UserTest].[id]

DROP TABLE TransactionComment
DROP TABLE TransactionDocumentType
DROP TABLE DocumentType
DROP TABLE [Transaction]
DROP TABLE TransactionStatus
DROP TABLE DocumentUser
DROP TABLE [User]
DROP TABLE [LoggingDb]

TRUNCATE TABLE LoggingDb
DELETE FROM DocumentType

ALTER TABLE [dbo].[LoggingDb] DROP COLUMN [table]
ALTER TABLE [dbo].[LoggingDb]
ADD [table] Nvarchar(50);

SELECT * 
FROM DocumentUser

SELECT * 
FROM TransactionStatus

SELECT * 
FROM [LoggingDb]

SELECT * 
FROM [Transaction]

SELECT * 
FROM DocumentType
WHERE [name] like '%''%'

SELECT * 
FROM [User] 
WHERE id != 1

SELECT * 
FROM [TransactionDocumentType]
WHERE [documentTypeId] = 37

SELECT * 
FROM [TransactionComment]

DELETE FROM [User] 
WHERE id IN (18)

DELETE FROM [DocumentType] 
WHERE id IN (7,8,9,10,11,12)

DELETE FROM [Transaction] 
WHERE id = 5

DELETE FROM TransactionDocumentType 
WHERE transactionId = 1 AND documentTypeId = 1

-- Update rows in table '[TableName]' in schema '[dbo]'
UPDATE [dbo].[Transaction]
SET
	[transactionStatusId] = 2
WHERE id = 1
GO

-- Update rows in table '[TableName]' in schema '[dbo]'
UPDATE [dbo].[Transaction]
SET
	[userId] = 3
WHERE id = 1
GO
--
UPDATE [dbo].[User]
SET
	[deactivatedAt] = null
WHERE id = 1
GO

UPDATE [dbo].[DocumentType]
SET
	[isRequired] = 0
WHERE id = 37 in (select id from [dbo].[DocumentType] where id <48)


ALTER TABLE [dbo].[Transaction]
ADD CONSTRAINT DF__Transacti__trans__1C873BEC DEFAULT 1 FOR transactionStatusId;

ALTER TABLE [dbo].[DocumentType] DROP CONSTRAINT DF__DocumentT__isBot__607251E5
ALTER TABLE [dbo].[DocumentType] DROP COLUMN [isBoth]

ALTER TABLE [dbo].[DocumentType]
ADD [isBoth] BIT DEFAULT 1 NOT NULL;

ALTER TABLE [dbo].[DocumentType]
ADD [isListing] BIT DEFAULT 1 NOT NULL;

ALTER TABLE [dbo].[Transaction]
ADD [isListing] BIT DEFAULT 1 NOT NULL;

UPDATE [dbo].[DocumentType]
SET
	[isListing] = 1


DECLARE @sql NVARCHAR(max)=''

SELECT @sql += ' Drop table ' + QUOTENAME(TABLE_SCHEMA) + '.'+ QUOTENAME(TABLE_NAME) + '; '
FROM   INFORMATION_SCHEMA.TABLES
WHERE  TABLE_TYPE = 'BASE TABLE'

Exec Sp_executesql @sql