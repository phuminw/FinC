# FinC

## Implementation List

- [x] Fix no account message (should be more informative whether not logged in or no account)
- [x] Redirect to login page if not login on all components
- [x] Centralize interface accross Angular components
- [x] Check username instead of account number (Angular component checking whether no account)
- [ ] Prevent /login from loggedin user and same for /logout
- [x] Change jQuery to fetch API
- [x] Move Plaid account query to back-end. No access token must be sent to the front-end
- [x] Batch institutions query on back-end
- [x] Use some kind of id to identify to-be-removed institutions on remove-account
- [x] .then() and .catch() to async/await
- [ ] Strong password check
- [ ] Add support for multiple accounts from same institution.
- [ ] Forgot username/password

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
