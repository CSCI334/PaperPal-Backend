CREATE TYPE accountType AS ENUM ('sad', 'ok', 'happy');
CREATE TABLE IF NOT EXISTS account(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email TEXT NOT NULL, 
    username TEXT NOT NULL, 
    hashedPassword TEXT NOT NULL,
    accountType accountType NOT NULL,
    salt TEXT NOT NULL,
    UNIQUE(email)
);
    
CREATE TABLE IF NOT EXISTS todo(
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    accountId INTEGER,
	body TEXT NOT NULL,
	isDone BOOL,
    CONSTRAINT accountId FOREIGN KEY(accountId) REFERENCES account(id)
);