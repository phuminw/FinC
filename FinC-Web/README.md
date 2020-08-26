# FinC on Web

FinC is a web application built on Angular frontend framework, Express.js backend, and MongoDB database. FinC allows users to easily manage their financial accounts from most US institutions in one place without wasting time logging in on each institution's website.

## Docker Way Launching

Instead from building from scratch, Docker can help spinning up Finc with in a few minutes. Before follow the steps below, please make sure Docker is installed. Another thing is to get the Plaid API credentials ready.

1. Navigate to [`src/docker-compose.yml`](src/docker-compose.yml) and copy in Plaid API credentials to appropiate line under finc environment.

2. Put some long random string to `JWT_SECRET` under finc environment.

3. Run commands below in your terminal

```bash
cd src
docker-compose up
```

*Optionally, you are free to MongoDB password that FinC uses to access by changing username and password under finc enviromment in [`src/docker-compose.yml`](src/docker-compose.yml) and [`src/mongo-entrypoint/adduser.sh`](src/mongo-entrypoint/adduser.sh)*

## Building from Scratch

### MongoDB

MongoDB installation instruction can be found [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials). After installed MongoDB, enter Mongo shell by `mongo` command and run the following commands in the Mongo shell to instantiate database and collection

```JavaScript
> use FinC
switched to db FinC
> db.user.insert({})
...
> db.user.remove({})
```

### Angular/Express/Node

Install Node.js

[Downloads](https://nodejs.org/en/download/)

Install dependencies

```bash
npm install
npm install --dev
```

Start up backend

```bash
node src/server/server.js
```

Start up frontend

```bash
npm start
```

The application should be available at <http://localhost:4200> or the address printed by the above command

### Plaid

Plaid is used to link financial institutions to the app without letting app receive any sensitive credentials. Visit Plaid and follow the instruction to get API key and other necessary info. Creare file src/server/plaid/key.json with the following structure

```JSON
{
    "client_id": "CLIENT_ID",
    "secret": "SECRET",
    "public_key": "PUBLIC_KEY"
}
```

## Implementation List

- [x] Fix no account message (should be more informative whether not logged in or no account)
- [x] Redirect to login page if not login on all components
- [x] Centralize interface accross Angular components
- [x] Check username instead of account number (Angular component checking whether no account)
- [x] Prevent /login from loggedin user and same for /logout
- [x] Change jQuery to fetch API
- [x] Move Plaid account query to back-end. No access token must be sent to the front-end
- [x] Batch institutions query on back-end
- [x] Use some kind of id to identify to-be-removed institutions on remove-account
- [x] .then() and .catch() to async/await
- [ ] Centralize username variable using @Input/@Output
- [ ] Strong password check
- [ ] Add support for multiple accounts from same institution.
- [ ] Forgot username/password
- [ ] View transactions for each account
