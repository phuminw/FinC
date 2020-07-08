# FinC

FinC is a web application built on Angular frontend framework, Express.js backend, and MongoDB database. FinC allows users to easily manage their financial accounts from most US institutions in one place without wasting time logging in on each institution's website.

## Building

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
