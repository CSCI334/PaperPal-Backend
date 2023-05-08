DO $$ BEGIN
    CREATE TYPE AccountType AS ENUM ('CHAIR', 'REVIEWER', 'AUTHOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE AccountStatus AS ENUM ('PENDING', 'REJECTED', 'ACCEPTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE PaperStatus AS ENUM ('ACCEPTED', 'REJECTED', 'TBD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS conference(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    conferenceName TEXT NOT NULL, 
    conferenceLocation TEXT NOT NULL,
    submissionDeadline TIMESTAMP NOT NULL,
    biddingDeadline TIMESTAMP NOT NULL,
    reviewDeadline TIMESTAMP NOT NULL,
    announcementTime TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS account(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email TEXT NOT NULL, 
    username TEXT NOT NULL, 
    hashedPassword TEXT,
    salt TEXT,
    accountType AccountType NOT NULL,
    accountStatus AccountStatus NOT NULL,
    conferenceId INTEGER,
    CONSTRAINT conferenceId FOREIGN KEY(conferenceId) REFERENCES conference(id)
);

ALTER TABLE account
ADD CONSTRAINT uniqueEmailAndConference UNIQUE(email, conferenceId);

INSERT INTO account(email, username, hashedPassword, salt, accountType, accountStatus) 
VALUES('admin@email.com', 'Admin', 'e3d22c3c4ea69d5612ffab07e55d9a40e46f187c3bdee401a71019cbae4e1b84', '89946a', 'ADMIN', 'ACCEPTED');

CREATE TABLE IF NOT EXISTS reviewer(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    bidPoints INTEGER,
  	paperWorkload INTEGER,
    accountId INTEGER NOT NULL,
    CONSTRAINT accountId FOREIGN KEY(accountId) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS chair(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    accountId INTEGER NOT NULL,
    CONSTRAINT accountId FOREIGN KEY(accountId) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS author(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    accountId INTEGER NOT NULL,
    CONSTRAINT accountId FOREIGN KEY(accountId) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS paper(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT,
    fileLocation TEXT,
  	paperStatus PaperStatus NOT NULL,
    authorId INTEGER NOT NULL,
  	coauthors TEXT,
    CONSTRAINT authorId FOREIGN KEY(authorId) REFERENCES author(id)
);

CREATE TABLE IF NOT EXISTS bids(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    bidAmount INTEGER,
    reviewerId INTEGER NOT NULL,
    paperId INTEGER NOT NULL,
    CONSTRAINT reviewerId FOREIGN KEY(reviewerId) REFERENCES reviewer(id),
    CONSTRAINT paperId FOREIGN KEY(paperId) REFERENCES paper(id)
);

CREATE TABLE IF NOT EXISTS comment(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    comment TEXT NOT NULL,
    reviewerId INTEGER NOT NULL,
    paperId INTEGER NOT NULL,
    CONSTRAINT paperId FOREIGN KEY(paperId) REFERENCES paper(id),
    CONSTRAINT reviewerId FOREIGN KEY(reviewerId) REFERENCES reviewer(id)
);

CREATE TABLE IF NOT EXISTS review(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    review TEXT,
    paperRating INTEGER,
    reviewRating INTEGER,
    reviewerId INTEGER NOT NULL,
    paperId INTEGER NOT NULL,
    CONSTRAINT paperId FOREIGN KEY(paperId) REFERENCES paper(id),
    CONSTRAINT reviewerId FOREIGN KEY(reviewerId) REFERENCES reviewer(id)
);

CREATE VIEW paperconference AS
SELECT paper.id AS paperid, conference.id AS conferenceId, account.id AS accountId, paper.title, conference.conferencename,
    conference.conferencelocation, account.username, paper.coauthors
FROM conference
JOIN account ON conference.id = account.conferenceid
JOIN author ON account.id = author.accountid
JOIN paper ON author.id = paper.authorid;

-- ReviewerId and PaperId combined must be unique, 
-- you cannot get allocated the same paper twice, nor submit a review twice for the same paper
ALTER TABLE review
ADD CONSTRAINT uniqueReviewerAndPaper UNIQUE(reviewerId, paperId);
