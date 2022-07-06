-- User Schema
CREATE SCHEMA IF NOT EXISTS users;

CREATE TABLE IF NOT EXISTS users.users (
    email       VARCHAR(64) PRIMARY KEY,
    firstname   VARCHAR(64) NOT NULL,
    prefname    VARCHAR(64),
    lastname    VARCHAR(64) NOT NULL,
    age         INTEGER NOT NULL,
    signup      DATE NOT NULL
);

CREATE TYPE users.FILETYPE AS ENUM ('pdf', 'jpg', 'png');

CREATE TYPE users.FILE AS (
    filetype    users.FILETYPE,
    content     BYTEA
);

CREATE TABLE IF NOT EXISTS users.upload (
    email       VARCHAR(64) NOT NULL,
    upload      users.FILE NOT NULL,
    uploadtime  TIMESTAMP NOT NULL,

    FOREIGN KEY (email) REFERENCES users.users(email)
);

CREATE TABLE IF NOT EXISTS users.login (
    email       VARCHAR(64) NOT NULL,
    password    VARCHAR(64) NOT NULL,
    active      BOOLEAN NOT NULL,

    FOREIGN KEY (email) REFERENCES users.users(email)
);

CREATE TABLE IF NOT EXISTS users.preferences (
    email       VARCHAR(64) PRIMARY KEY,
    pricerange  INT4RANGE,
    timerange   DATERANGE,
    location    TEXT[],
    rating      NUMERIC,

    FOREIGN KEY (email) REFERENCES users.users(email)
);

CREATE TABLE IF NOT EXISTS users.settings (
    email       VARCHAR(64) PRIMARY KEY,
    visible     BOOLEAN DEFAULT TRUE,
    chatOn      BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (email) REFERENCES users.users(email)
);

-- Listing Schema
CREATE SCHEMA IF NOT EXISTS listing;

CREATE TABLE IF NOT EXISTS listing.property (
    ID          SERIAL PRIMARY KEY,
    name        VARCHAR(64) NOT NULL,
    address     VARCHAR(128) NOT NULL,
    city        VARCHAR(64) NOT NULL,
    country     VARCHAR(64) NOT NULL
);

CREATE TYPE listing.LISTING_STATUS AS ENUM ('available', 'sold', 'unavailable');

CREATE TABLE IF NOT EXISTS listing.listing (
    ID          SERIAL PRIMARY KEY,
    owner       VARCHAR(64),
    propertyID  INTEGER NOT NULL,
    unit        VARCHAR(16),
    duration    DATERANGE,
    rate        INT4RANGE,
    utilities   TEXT[],
    floorplan   users.FILE,
    status      listing.LISTING_STATUS,
    proof       users.FILE,

    FOREIGN KEY (propertyID) REFERENCES listing.property(ID)
);

CREATE TYPE listing.INTEREST_STATUS AS ENUM ('closed', 'sold', 'pending');

CREATE TABLE IF NOT EXISTS listing.interest (
    buyer       VARCHAR(64),
    seller      VARCHAR(64),
    listingID   INTEGER,
    status      listing.INTEREST_STATUS,

    FOREIGN KEY (buyer) REFERENCES users.users(email),
    FOREIGN KEY (seller) REFERENCES users.users(email),
    FOREIGN KEY (listingID) REFERENCES listing.listing(ID)
);

CREATE TABLE IF NOT EXISTS listing.propertyReview (
    ID          SERIAL PRIMARY KEY,
    propertyID  INTEGER NOT NULL,
    rating      INTEGER NOT NULL,
    comments    TEXT,
    timestamp   TIMESTAMP,

    FOREIGN KEY (propertyID) REFERENCES listing.property(ID)
);

CREATE TYPE listing.FLAGGEDLISTING_TYPE AS ENUM ('Illegal', 'Unethical', 'Inappropriate');

CREATE TABLE IF NOT EXISTS listing.flaggedListing (
    listingID   INTEGER NOT NULL,
    flagger     VARCHAR(64),
    timestamp   TIMESTAMP,
    type        listing.FLAGGEDLISTING_TYPE,

    PRIMARY KEY (listingID, flagger),
    FOREIGN KEY (listingID) REFERENCES listing.listing(ID),
    FOREIGN KEY (flagger) REFERENCES users.users(email)
);

-- Messaging Schema
CREATE SCHEMA IF NOT EXISTS messaging;

CREATE TYPE messaging.MESSAGE AS (
    sender      BOOLEAN,
    message     TEXT,
    timestamp   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messaging.chat (
    user1       VARCHAR(64),
    user2       VARCHAR(64),
    history     messaging.MESSAGE[],

    PRIMARY KEY (user1, user2),
    FOREIGN KEY (user1) REFERENCES users.users(email),
    FOREIGN KEY (user2) REFERENCES users.users(email)
);

CREATE TABLE IF NOT EXISTS messaging.blocks (
    blocker     VARCHAR(64),
    blocked     VARCHAR(64),
    timestamp   TIMESTAMP NOT NULL,

    PRIMARY KEY (blocker, blocked),
    FOREIGN KEY (blocker) REFERENCES users.users(email),
    FOREIGN KEY (blocked) REFERENCES users.users(email)
);
