DO $$ BEGIN
    CREATE TYPE AccountType AS ENUM ('CHAIR', 'REVIEWER', 'AUTHOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE AccountStatus AS ENUM ('PENDING', 'REJECTED', 'ACCEPTED', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE PaperStatus AS ENUM ('ACCEPTED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS conference(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    conferenceName TEXT NOT NULL, 
    conferenceLocation TEXT NOT NULL,
    submissionDeadline TIMESTAMP NOT NULL,
    biddingDeadline TIMESTAMP NOT NULL,
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
    conferenceId INTEGER NOT NULL,
    CONSTRAINT conferenceId FOREIGN KEY(conferenceId) REFERENCES conference(id)
);


ALTER TABLE account
ADD CONSTRAINT uniqueEmailAndConference UNIQUE(email, conferenceId);

CREATE TABLE IF NOT EXISTS reviewer(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    accountId INTEGER,
    bidPoints INTEGER,
    CONSTRAINT accountId FOREIGN KEY(accountId) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS author(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    accountId INTEGER,
    CONSTRAINT accountId FOREIGN KEY(accountId) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS chair(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    accountId INTEGER,
    CONSTRAINT accountId FOREIGN KEY(accountId) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS paper(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT,
    fileLocation TEXT,
    authorId INTEGER,
    ownerReviewerId INTEGER UNIQUE,
    CONSTRAINT ownerReviewerId FOREIGN KEY(ownerReviewerId) REFERENCES reviewer(id),
    CONSTRAINT authorId FOREIGN KEY(authorId) REFERENCES author(id)
);

CREATE TABLE IF NOT EXISTS bids(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    bidAmount INTEGER,
    reviewerId INTEGER,
    paperId INTEGER,
    CONSTRAINT reviewerId FOREIGN KEY(reviewerId) REFERENCES reviewer(id),
    CONSTRAINT paperId FOREIGN KEY(paperId) REFERENCES paper(id)
);

CREATE TABLE IF NOT EXISTS review(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reviewerId INTEGER,
    paperId INTEGER,
    score INTEGER,
    CONSTRAINT paperId FOREIGN KEY(paperId) REFERENCES paper(id),
    CONSTRAINT reviewerId FOREIGN KEY(reviewerId) REFERENCES paper(ownerReviewerId)
);