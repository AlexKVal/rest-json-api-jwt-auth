#### User's roles

- `user` - can only read `Accounts`
- `admin` - can do all REST operations with `Accounts`

#### Routes for auth

- GET `/api/users` - to choose user_id
- POST `/api/auth` - to authenticate and get JWT

#### Protected routes

`/api/accounts`:
- GET - get all the accounts
- POST - create an account

`/api/accounts/:account_id`:
- GET - get a single account
- PUT - update an account with new data
- DELETE - delete an account
