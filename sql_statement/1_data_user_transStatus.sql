GO
SET IDENTITY_INSERT [dbo].[User] ON 
GO
INSERT [dbo].[User] ([id], [firstName], [lastName], [email], [address], [userName], [password], [isAdmin], [lastLoginDate], [createdAt], [updatedAt], [deactivatedAt]) 
VALUES (1, N'Lam', N'Nguyen', N'lam@gmail.com', N'Vn', N'lam', N'1b36dfd2244af33c4387975a0d504099', 1, CAST(N'2021-07-12T13:01:01.0000000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[User] ([id], [firstName], [lastName], [email], [address], [userName], [password], [isAdmin], [lastLoginDate], [createdAt], [updatedAt], [deactivatedAt]) 
VALUES (2, N'Nhan', N'Nguyen', N'nhan@gmail.com', N'Vn', N'nhan', N'02cc64e024567d8bcffc999ca17d2bdb', 1, CAST(N'2021-07-12T13:01:18.0000000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:18.0740000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:18.0750000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[User] ([id], [firstName], [lastName], [email], [address], [userName], [password], [isAdmin], [lastLoginDate], [createdAt], [updatedAt], [deactivatedAt]) 
VALUES (3, N'Nathan', N'Nathan', N'nathan@gmail.com', N'Us', N'nathan', N'22212288c77c90a0db28d0570609c39f', 1, CAST(N'2021-07-12T13:01:38.0000000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:38.3810000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:38.3820000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[User] ([id], [firstName], [lastName], [email], [address], [userName], [password], [isAdmin], [lastLoginDate], [createdAt], [updatedAt], [deactivatedAt]) 
VALUES (4, N'Vinh', N'Hoang', N'vinhoang@gmail.com', N'Vn', N'vinh', N'715105604127b9763b2f5b61663401ee', 0, CAST(N'2021-07-12T13:02:09.0000000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:02:09.6180000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:02:09.6180000+00:00' AS DateTimeOffset), NULL)
SET IDENTITY_INSERT [dbo].[User] OFF
GO
SET IDENTITY_INSERT [dbo].[TransactionStatus] ON 
GO
INSERT [dbo].[TransactionStatus] ([id], [name], [createdAt], [updatedAt], [deletedAt]) 
VALUES (1, N'New', CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[TransactionStatus] ([id], [name], [createdAt], [updatedAt], [deletedAt]) 
VALUES (2, N'In Progress', CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[TransactionStatus] ([id], [name], [createdAt], [updatedAt], [deletedAt]) 
VALUES (3, N'Review', CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[TransactionStatus] ([id], [name], [createdAt], [updatedAt], [deletedAt]) 
VALUES (4, N'Complete', CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[TransactionStatus] ([id], [name], [createdAt], [updatedAt], [deletedAt]) 
VALUES (5, N'Error', CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
SET IDENTITY_INSERT [dbo].[TransactionStatus] OFF