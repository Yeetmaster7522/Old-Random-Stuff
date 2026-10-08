[Gunpla dataset](https://www.kaggle.com/datasets/marzho/gunpla-dataset?select=sdbb.csv)



Fields:

Order

Product Name

Release Date

Continuity

First Appearance

Grade

MSRP



1613 gunpla kits

11,291 cells in total



Filters it will have

Rank in order

Search by Product Name

Rank by release date

filter by before/after release date

filter by continuity

filter by first appearance

filter by grade

filter by msrp range

show N entries



MSRP in yen

release date in year-month-day



CREATE TABLE gunpla ( 'Order' TEXT, 'Product Name' TEXT, 'Release Date' TEXT, Continuity TEXT, 'First Appearance' TEXT, Grade TEXT, MSRP FLOAT );



table.js for tables

bootstrap for page design

UI slider for double ended slider





Stuff done

downloaded gunpla database

fixed all of the tables to have the same columns

created a new table to store grades and its scale

changed all column headings to have \_ instead of spaces

filled in missing values such as continuities, first appearances, grade, msrp with research into the gundam fandom wiki and other sources

fixed product name encoding issues by asking copilot to fix it e.g. Gatesâ€™ Bound Doc

created grades table in order to give more context to the grades and complexity to the project

created batch file in order to import all of the data into sql

after importing I realised I need to fix the dates up still

excel messed up my dates, to fix it I used excel to format it into yyyy-mm-d

reimported everything

trying to import grades but it isn't importing properly

rewrote it and it works now

created the html and js for the webpage and based my code off of the given sample

put a text box where I can insert sql queries for testing

data from buildseries table is missing so I have to reinstall the table from kaggle and reclean it and re-import it into the sql database

did some more work on the website

realised excel ruined my dates AGAIN





Commands:

CREATE TABLE gunpla ( Order TEXT, Product\_name TEXT, Release\_date DATE, First\_appearance TEXT, Grade TEXT, MSRP FLOAT )



CREATE TABLE grades ( Grade TEXT, Scale TEXT, Full\_name TEXT )



CREATE TABLE series ( First\_appearance TEXT, Continuity TEXT, Production\_year INT, Series\_type TEXT, Episode\_count INT, Volume\_count INT )



.import --csv --skip 1 C:/work/somedata.csv table1



CREATE VIEW catalog AS
SELECT * FROM NGseed
UNION ALL
SELECT * FROM advancedgrade
UNION ALL
SELECT * FROM buildseries
UNION ALL
SELECT * FROM hg00
UNION ALL
SELECT * FROM hgage
UNION ALL
SELECT * FROM hgibo
UNION ALL
SELECT * FROM hgreconguista
UNION ALL
SELECT * FROM hgseed
UNION ALL
SELECT * FROM hgtheorigin
UNION ALL
SELECT * FROM hgthunderbolt
UNION ALL
SELECT * FROM hgwfm
UNION ALL
SELECT * FROM highgrade
UNION ALL
SELECT * FROM ibofullmechanics
UNION ALL
SELECT * FROM mastergrade
UNION ALL
SELECT * FROM perfectgrade
UNION ALL
SELECT * FROM re100
UNION ALL
SELECT * FROM realgrade
UNION ALL
SELECT * FROM sdbb
UNION ALL
SELECT * FROM sdcs
UNION ALL
SELECT * FROM sdexs
UNION ALL
SELECT * FROM sdgg;
