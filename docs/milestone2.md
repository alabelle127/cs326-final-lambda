# API Documentation

## Search

Search for classes

**URL** : `/api/classes/search`

**URL Parameters** : `q=[string]` where `q` is the search query.

**Method** : `GET`

### Response

A list of Class results

**Example**

```json
[
  {
    "display_text": "CS 326 (Not current)",
    "current": false,
    "department": "CS",
    "class_number": 326,
    "class_perma_id": "NC-CS326"
  },
  {
    "display_text": "CS 326 (Berger) TuTh 1:00-2:15 [44866]",
    "current": true,
    "department": "CS",
    "class_number": 326,
    "class_id": 44866,
    "class_perma_id": "2022F-44866",
    "professor": "Emery Berger",
    "meeting_times": [
      {
        "day": "Tu",
        "start_time": 1300,
        "end_time": 1415
      },
      {
        "day": "Th",
        "start_time": 1300,
        "end_time": 1415
      }
    ]
  },
  {
    "display_text": "CS 326 (Klemperer) TuTh 1:00-2:15 [57113]",
    "current": true,
    "department": "CS",
    "class_number": 326,
    "class_id": 57113,
    "class_perma_id": "2022F-57113",
    "professor": "Peter Klemperer",
    "meeting_times": [
      {
        "day": "Tu",
        "start_time": 1300,
        "end_time": 1415
      },
      {
        "day": "Th",
        "start_time": 1300,
        "end_time": 1415
      }
    ]
  }
]
```

## Login

Attempt to login a user

**URL** : `/api/login`

**Method** : `POST`

**Payload** :

```json
{
  "username": "[string]",
  "password": "[string]"
}
```

### Success Response

**Example**

```json
{
  "success": true,
  "userID": 1001
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "userID": null
}
```

## Logout

Logout a user

**URL** : `/api/logout`

**Method** : `POST`

## Me

Get the current logged in user

**URL** : `/api/me`

**Method** : `GET`

### Response

**Logged in example**

```json
{
  "loggedIn": true,
  "userID": 1001
}
```

**Not logged in example**

```json
{
  "loggedIn": false,
  "userID": null
}
```

## Register

Attempt to register a new user

**URL** : `/api/register`

**Method** : `POST`

**Payload** :

```json
{
  "username": "[string]",
  "password": "[string]",
  "real_name": "[string]",
  "classes": "Array(Class)"
}
```

### Success Response

**Example**

```json
{
  "success": true
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "Username already exists"
}
```

## User registered classes

Get user's registered classes

**URL** : `/api/users/:userID/registered_classes`

**Method** : `GET`

### Success Response

**Example**

```json
{
  "success": true,
  "data": [
    {
      "display_text": "CS 453 (Not current)",
      "current": false,
      "department": "CS",
      "class_number": 453,
      "class_perma_id": "NC-CS453"
    },
    {
      "display_text": "CS 326 (Berger) TuTh 1:00-2:15 [44866]",
      "current": true,
      "department": "CS",
      "class_number": 326,
      "class_id": 44866,
      "class_perma_id": "2022F-44866",
      "professor": "Emery Berger",
      "meeting_times": [
        {
          "day": "Tu",
          "start_time": 1300,
          "end_time": 1415
        },
        {
          "day": "Th",
          "start_time": 1300,
          "end_time": 1415
        }
      ]
    },
    {
      "display_text": "MATH 551 (Johnston) MoWeFr 10:10-11:00 [01001]",
      "current": true,
      "department": "MATH",
      "class_number": 551,
      "class_id": 1001,
      "class_perma_id": "2022F-01001",
      "professor": "Hans Johnston",
      "meeting_times": [
        {
          "day": "Mo",
          "start_time": 1010,
          "end_time": 1100
        },
        {
          "day": "We",
          "start_time": 1010,
          "end_time": 1100
        },
        {
          "day": "Fr",
          "start_time": 1010,
          "end_time": 1100
        }
      ]
    }
  ]
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "User's profile is private"
}
```

## User registered classes

Set user's registered classes

**URL** : `/api/users/:userID/registered_classes`

**Method** : `POST`

**Payload** :

```json
{
  "classes": "Array(Class)"
}
```

### Success Response

**Example**

```json
{
  "success": true
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

## User

Get user data

**URL** : `/api/users/:userID`

**Method** : `GET`

### Success Response

**Example**

```json
{
  "success": true,
  "data": {
    "username": "gkcho",
    "real_name": "Gavin Cho",
    "userID": 1001,
    "profile_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png",
    "description": "Senior CS & Math major",
    "contact_info": "Call or text me 413-555-5555",
    "looking_for_partners": true,
    "private_profile": true
  }
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "User's profile is private"
}
```

## User

Set user data

**URL** : `/api/users/:userID`

**Method** : `POST`

**Payload** :

```json
{
    "username": "[string]",
    "real_name": "[string]",
    "userID": "[number]",
    "profile_picture": "[URL]",
    "description": "[string]",
    "contact_info": "[string]",
    "looking_for_partners": "[boolean]",
    "private_profile": "[boolean]
}
```

### Success Response

**Example**

```json
{
  "success": true
}
```

### Error Response

**Example**

```json
{
  "success": false,
  "message": "Not authorized"
}
```

# Screenshots

# Heroku URL

# Division of Labor

Gavin:

- Initial express server setup
- Navbar with API
- Login/logout with API
- Register new account with API
- Class search with API
- Update account settings with API
