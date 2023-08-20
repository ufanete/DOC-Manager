CREATE TABLE Organisation (organisationID INT, name VARCHAR,
  description VARCHAR,establishedDate TIMESTAMP, logo VARCHAR, createdOn TIMESTAMP);

CREATE TABLE Page(organisationID INT, pageID INT, name VARCHAR,
  description VARCHAR, type INT, displayOrder INT, isHomePage BIT, createDate TIMESTAMP);

CREATE TABLE PageDetails(pageID INT, columnIndex INT,
  columnSize INT, columnName VARCHAR, dataType INT);

CREATE TABLE PageEntries(pageID INT, columnIndex INT,
  rowIndex INT, value VARCHAR);

INSERT INTO Organisation VALUES (1, 'DOC', '', null, null, null);

INSERT INTO Page VALUES (1, 1, 'Accounts', '', 1, 1, 1, null);
INSERT INTO Page VALUES (1, 2, 'Active Projects', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 3, 'Employees', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 4, 'Reports', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 5, 'Settings', '', 1, 1, 0, null);

INSERT INTO Page VALUES (1, 6, 'Accounts2', '', 1, 1, 1, null);
INSERT INTO Page VALUES (1, 7, 'Active Projects2', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 8, 'Employees2', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 9, 'Reports2', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 10, 'Settings2', '', 1, 1, 0, null);

INSERT INTO Page VALUES (1, 11, 'Accounts3', '', 1, 1, 1, null);
INSERT INTO Page VALUES (1, 12, 'Active Projects3', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 13, 'Employees3', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 14, 'Reports3', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 15, 'Settings3', '', 1, 1, 0, null);

INSERT INTO Page VALUES (1, 16, 'Accounts4', '', 1, 1, 1, null);
INSERT INTO Page VALUES (1, 17, 'Active Projects4', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 18, 'Employees4', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 19, 'Reports4', '', 1, 1, 0, null);
INSERT INTO Page VALUES (1, 20, 'Settings4', '', 1, 1, 0, null);

INSERT INTO PageDetails VALUES (1, 1, 3, 'Name', 1);
INSERT INTO PageDetails VALUES (1, 2, 4, 'Address', 1);
INSERT INTO PageDetails VALUES (1, 3, 2, 'Phone Number', 1);

INSERT INTO PageEntries VALUES (1, 1, 1, 'John');
INSERT INTO PageEntries VALUES (1, 2, 1, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (1, 3, 1, '289-684-8324');

INSERT INTO PageEntries VALUES (1, 1, 2, 'John');
INSERT INTO PageEntries VALUES (1, 2, 2, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (1, 3, 2, '289-684-8324');

INSERT INTO PageEntries VALUES (1, 1, 3, 'John');
INSERT INTO PageEntries VALUES (1, 2, 3, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (1, 3, 3, '289-684-8324');

INSERT INTO PageEntries VALUES (1, 1, 4, 'John');
INSERT INTO PageEntries VALUES (1, 2, 4, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (1, 3, 4, '289-684-8324');

INSERT INTO PageEntries VALUES (1, 1, 5, 'John');
INSERT INTO PageEntries VALUES (1, 2, 5, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (1, 3, 5, '289-684-8324');

INSERT INTO PageEntries VALUES (2, 1, 6, 'John');
INSERT INTO PageEntries VALUES (2, 2, 6, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (2, 3, 6, '289-684-8324');

INSERT INTO PageEntries VALUES (2, 1, 7, 'John');
INSERT INTO PageEntries VALUES (2, 2, 7, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (2, 3, 7, '289-684-8324');

INSERT INTO PageEntries VALUES (3, 1, 8, 'John');
INSERT INTO PageEntries VALUES (3, 2, 8, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (3, 3, 8, '289-684-8324');
--4
INSERT INTO PageEntries VALUES (4, 1, 6, 'John');
INSERT INTO PageEntries VALUES (4, 2, 6, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (4, 3, 6, '289-684-8324');

INSERT INTO PageEntries VALUES (5, 1, 7, 'John');
INSERT INTO PageEntries VALUES (5, 2, 7, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (5, 3, 7, '289-684-8324');

INSERT INTO PageEntries VALUES (5, 1, 8, 'John');
INSERT INTO PageEntries VALUES (5, 2, 8, '15 James Finlay Way');
INSERT INTO PageEntries VALUES (5, 3, 8, '289-684-8324');
