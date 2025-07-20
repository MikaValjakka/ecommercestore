# Backend Instructions

To run the backend, type the following command in the terminal: npm run dev

To run the tests, type the following command in the terminal: npm run test
The test are located in the backend/**tests** folder. They are run using jest and supertest.
Test use also babel as a preprocessor to convert the .js files to .mjs files so that jest can run them.

Route: /api/auth/login
Method: POST

LOGIN:
{
"email":"bob@email.com",
"password":"1234567"
}

## 🔐 Authentication & Token Handling

### Access & Refresh Tokens

- **Access Token**:

  - Lifespan: `15 minutes`
  - Sent as an **HTTP-only cookie**
  - Used to authorize access to protected routes (short-lived for security)

- **Refresh Token**:
  - Lifespan: `7 days`
  - Sent as an **HTTP-only cookie**
  - Used to issue new access tokens when the old one expires

### 🔁 Redis Storage (Upstash)

- **Upstash Redis** is used to store and validate the refresh tokens.
- This allows fast access and revocation without querying the database.
- The refresh token is stored in Redis using the user ID as the key.

### Why Redis?

- ✅ Fast access in-memory (ideal for token/session validation)
- ✅ Easy revocation (e.g., logout just deletes the token from Redis)
- ✅ Secure token verification without re-hitting the database

### Notes

- `withCredentials: true` must be enabled in Axios to send/receive cookies.
- Tokens are set on successful login and cleared on logout.
- Backend verifies access token first; if invalid/expired, it checks the refresh token in Redis.
