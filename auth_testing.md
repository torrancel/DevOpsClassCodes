# Let It Go AI — Auth Testing Playbook (saved from integration_playbook_expert_v2)

## Step 1: Create Test User & Session
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Backend curl
- GET `/api/auth/me` with `Authorization: Bearer <session_token>`
- GET/POST `/api/checkins` with same header
- POST `/api/suggestion` with `{check_in_id}` body

## Step 3: Browser
Inject `session_token` cookie before navigating to `/app`.

## Notes
- Cookie name: `session_token`, httpOnly, secure, samesite=none, path=/
- Sessions live in `db.user_sessions`, users in `db.users`. All queries use `{"_id": 0}` projection.
- Token also accepted via `Authorization: Bearer <token>` header.
