drop table [Users]

CREATE TABLE [Users] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [first_name] VARCHAR (50) NOT NULL,
    [last_name] VARCHAR (50) NOT NULL,
	[email] VARCHAR (50) NOT NULL,
	[address] VARCHAR (100) NOT NULL, 
    [document ] varbinary(max),
    [username] VARCHAR (50) NOT NULL, 
	[password] VARCHAR (255) NOT NULL,
	[salt] VARCHAR (255) NOT NULL,
	[is_admin] BIT DEFAULT 0, 
	[is_deleted] BIT DEFAULT 0, 
	[create_date] DATETIME NULL DEFAULT GETDATE(),
	[last_login_date] DATETIME NULL DEFAULT GETDATE(),
);

SELECT * FROM [Users]

SET QUOTED_IDENTIFIER ON

SELECT * FROM [Users] WHERE "first_name" = 'Lam'

SELECT *
FROM [Users]
ORDER BY id ASC
OFFSET 12 ROWS
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