SET IDENTITY_INSERT [dbo].[DocumentType] ON
GO
INSERT [dbo].[DocumentType] ([id], [name], [isRequired], [createdAt], [updatedAt], [deletedAt])  VALUES (1, N'Purchase Agreement - RPA/CA', 1, CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[DocumentType] ([id], [name], [isRequired], [createdAt], [updatedAt], [deletedAt])  VALUES (2, N'Buyers Inspection Advisory BIA', 1, CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[DocumentType] ([id], [name], [isRequired], [createdAt], [updatedAt], [deletedAt])  VALUES (3, N'Agency Disclosure - AD', 1, CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO

INSERT [dbo].[DocumentType] ([id], [name], [isRequired], [createdAt], [updatedAt], [deletedAt])  VALUES (4, N'Mello-Roos Tax Notice/1915 Bond Act Assess Notice', 0, CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO
INSERT [dbo].[DocumentType] ([id], [name], [isRequired], [createdAt], [updatedAt], [deletedAt])  VALUES (5, N'Copy of Deposit Check (If applicable Both Sides )', 0, CAST(N'2021-07-12T13:01:01.6840000+00:00' AS DateTimeOffset), CAST(N'2021-07-12T13:01:01.6890000+00:00' AS DateTimeOffset), NULL)
GO

SET IDENTITY_INSERT [dbo].[DocumentType] OFF
