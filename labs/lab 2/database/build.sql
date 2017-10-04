CREATE TABLE Users(
	User_ID SERIAL NOT NULL PRIMARY KEY,
	Username VARCHAR(32) NOT NULL,
	Password VARCHAR(60) NOT NULL,
	Phone    VARCHAR(10) NOT NULL
);

CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
