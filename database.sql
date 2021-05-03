drop table [Users]
go
drop table [Documents]
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
	[is_admin] BIT DEFAULT 0, 
	[is_deleted] BIT DEFAULT 0, 
	[created_at] DATETIME NULL DEFAULT GETDATE(),
	[updated_at] DATETIME NULL DEFAULT GETDATE(),
	[last_login_date] DATETIME NULL DEFAULT GETDATE(),
);
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
	[is_admin] BIT DEFAULT 0, 
	[is_deleted] BIT DEFAULT 0, 
	[created_at] DATETIME NOT NULL,
	[updated_at] DATETIME NOT NULL,
	[last_login_date] DATETIME NOT NULL,
);


CREATE TABLE [Documents] (
    [id] INT PRIMARY KEY IDENTITY (1, 1),
    [link] VARCHAR(max) NOT NULL,
    [user_id] INT NOT NULL,
	[is_deleted] BIT DEFAULT 0, 
	[created_at] DATETIME NOT NULL DEFAULT GETDATE(),
	[updated_at] DATETIME NOT NULL DEFAULT GETDATE(),
);

Monday May 3rd 2021, 12:27:14 pm
2021-05-03 12:37:34.3734

INSERT INTO [Users] ([first_name],[last_name],[email],[address],[username],[password],[salt],[is_admin],[created_at],[updated_at],[last_login_date]) 
VALUES ('Lam','Nguyen','lam@gmail.com','Us','lam','Qq4Xh5gN0+O7/9+euNiJOQ==','$2b$15$c/34mP1e9XM1zRQ7D6UZpe',1, '2021-05-03 12:37:34.373','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')
go
INSERT INTO [Users] ([first_name],[last_name],[email],[address],[username],[password],[salt],[is_admin],[created_at],[updated_at],[last_login_date]) 
VALUES ('Nathan','Nguyen','nathan@gmail.com','Us','nathan','QQV9maR9RLIh2CfSpTnUGw==','$2b$15$55yyKez0y1tqEe.pOIOIbO',1, '2021-05-03 12:37:34.373','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')
go
INSERT INTO [Users] ([first_name],[last_name],[email],[address],[username],[password],[salt],[is_admin],[created_at],[updated_at],[last_login_date]) 
VALUES ('Nhan','Nguyen','nhan@gmail.com','nhan','lam','D5SsAvX8FIkqCwQp+tdqxA==','$2b$15$BkH9RVfydKHI3pLl0BCg/e',1, '2021-05-03 12:37:34.373','2021-05-03 12:37:34.373','2021-05-03 12:37:34.373')

INSERT INTO [Documents] ([link],[user_id]) VALUES ('a.com','1')
INSERT INTO [Documents] ([link],[user_id]) VALUES ('b.com','1')
INSERT INTO [Documents] ([link],[user_id]) VALUES ('c.com','2')



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



SELECT * FROM [Documents]

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
drop table [Test]

JSON_QUERY