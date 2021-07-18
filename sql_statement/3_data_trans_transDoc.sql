
SET IDENTITY_INSERT [dbo].[Transaction] ON 
GO
INSERT [dbo].[Transaction] ([id], [userId], [address], [city], [state], [zipCode], [mlsId], [apn], [listingPrice], [commissionAmount], [buyerName], [sellerName], [canComplete], [transactionStatusId], [listingStartDate], [listingEndDate], [createdAt], [updatedAt], [deletedAt]) VALUES (1, 1, N'Ho Chi Minh', N'HCM', N'TP', N'700000', N'mlsId001', N'apn001', CAST(2002.1000 AS Decimal(20, 4)), CAST(4002.1900 AS Decimal(20, 4)), N'buyerName001', N'sellerName001', 0, 2, CAST(N'2021-07-12T06:01:01.6890000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T06:01:01.6890000+00:00' AS DateTimeOffset), CAST(N'2021-07-14T18:49:19.3890000+00:00' AS DateTimeOffset), CAST(N'2021-07-14T18:49:19.3910000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[Transaction] ([id], [userId], [address], [city], [state], [zipCode], [mlsId], [apn], [listingPrice], [commissionAmount], [buyerName], [sellerName], [canComplete], [transactionStatusId], [listingStartDate], [listingEndDate], [createdAt], [updatedAt], [deletedAt]) VALUES (2, 1, N'Ho Chi Minh', N'HCM', N'TP', N'700000', N'mlsId002', N'apn002', CAST(2002.1000 AS Decimal(20, 4)), CAST(4002.1900 AS Decimal(20, 4)), N'buyerName002', N'sellerName002', 0, 1, CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), CAST(N'2021-07-15T18:42:33.3430000+00:00' AS DateTimeOffset), CAST(N'2021-07-15T18:42:33.3450000+00:00' AS DateTimeOffset), NULL)
GO
SET IDENTITY_INSERT [dbo].[Transaction] OFF
GO
INSERT [dbo].[TransactionDocumentType] ([transactionId], [documentTypeId], [container], [folder], [fileName], [createdAt], [updatedAt], [deletedAt]) VALUES (1, 1, N'userinfo', N'folder1', N'file1', CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[TransactionDocumentType] ([transactionId], [documentTypeId], [container], [folder], [fileName], [createdAt], [updatedAt], [deletedAt]) VALUES (1, 2, N'userinfo', N'folder2', N'file2', CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[TransactionDocumentType] ([transactionId], [documentTypeId], [container], [folder], [fileName], [createdAt], [updatedAt], [deletedAt]) VALUES (1, 4, N'userinfo', N'folder3', N'file3', CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
