CREATE TABLE Organisation (organisationID INT, name VARCHAR,
  description VARCHAR,establishedDate TIMESTAMP, logo VARCHAR, createdOn TIMESTAMP);

CREATE TABLE Page(organisationID INT, pageID INT, name VARCHAR,
  description VARCHAR, type INT, displayOrder INT, isHomePage BIT, createDate TIMESTAMP);

CREATE TABLE PageDetails(pageID INT, columnIndex INT,
  columnSize INT, columnName VARCHAR, dataType INT);

CREATE TABLE PageEntries(pageID INT, columnIndex INT,
  rowIndex INT, value VARCHAR);

INSERT INTO Organisation VALUES (1, 'Dan Oku & CO', '', null, null, null);

INSERT INTO Page VALUES (1, 1, 'Accounts', '', 1, 1, 1, null);
INSERT INTO PageDetails VALUES (1, 1, 3, 'Name', 1);
INSERT INTO PageDetails VALUES (1, 2, 4, 'Address', 1);
INSERT INTO PageDetails VALUES (1, 3, 2, 'Phone Number', 1);

INSERT INTO Page VALUES (1, 2, 'Employees', '', 1, 1, 0, null);
INSERT INTO PageDetails VALUES (2, 1, 3, 'Name', 1);
INSERT INTO PageDetails VALUES (2, 2, 4, 'Address', 1);
INSERT INTO PageDetails VALUES (2, 3, 2, 'Phone Number', 1);
INSERT INTO PageDetails VALUES (2, 4, 2, 'DOB', 1);
INSERT INTO PageDetails VALUES (2, 5, 2, 'Days Active', 1);
INSERT INTO PageDetails VALUES (2, 6, 2, 'Days Skipped', 1);
INSERT INTO PageDetails VALUES (2, 7, 2, 'Status', 1);

INSERT INTO Page VALUES (1, 3, 'San Antonio', '', 1, 1, 0, null);
INSERT INTO PageDetails VALUES (3, 1, 3, 'Name', 1);
INSERT INTO PageDetails VALUES (3, 2, 4, 'Address', 1);
INSERT INTO PageDetails VALUES (3, 3, 2, 'Phone Number', 1);

INSERT INTO Page VALUES (1, 4, 'Reports', '', 1, 1, 0, null);
INSERT INTO PageDetails VALUES (4, 1, 3, 'Name', 1);
INSERT INTO PageDetails VALUES (4, 2, 4, 'Address', 1);
INSERT INTO PageDetails VALUES (4, 3, 2, 'Phone Number', 1);

INSERT INTO Page VALUES (1, 5, 'Settings', '', 1, 1, 0, null);
INSERT INTO PageDetails VALUES (5, 1, 3, 'Name', 1);
INSERT INTO PageDetails VALUES (5, 2, 4, 'Address', 1);
INSERT INTO PageDetails VALUES (5, 3, 2, 'Phone Number', 1);
