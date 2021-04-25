drop table [User]

CREATE TABLE [User] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [first_name] VARCHAR (50) NOT NULL,
    [last_name] VARCHAR (50) NOT NULL,
	[address] VARCHAR (100) NOT NULL, 
    [document ] varbinary(max),
    [username] VARCHAR (50) NOT NULL, 
	[password] VARCHAR (255) NOT NULL,
	[is_admin] BIT DEFAULT 0, 
	[is_deleted] BIT DEFAULT 0, 
	[create_date] DATETIME NULL DEFAULT GETDATE(),
	[last_login_date] DATETIME NULL DEFAULT GETDATE(),
);

SELECT * FROM [User]