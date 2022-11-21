# API Documentation

## Student

get_student

**URL** : `/api/student?studentID`

**URL Parameters** : `studentID=[string]` where `studentID` is the search query.

**Method** : `GET`

### Response

A student profile info to display, only displays if the current logged in user is the requested student or the profile is not private

**Example**

if the requested student exists

```json
[
  "_id": "ObjectId('63796db00d2cb3075765f4db')"
  "studentID": "Student0"
  "realName": "J Doe"
  "currentClasses": "[CS 326]"
  "previousClasses": "[CS 311]"
  "bio": "man/woman of mystery"
  "contactInfo": "123-456-7890"
  "privateProfile": "false"
  "lookingForPartners": "false"
  "partners": "[Chris Manning, Andrew LaBelle, Gavin Cho]"
]
```

if the requested student does not exist

```json
[
  "success": "false",
  "message": "Student does not exist",
]
```

# Deployment

(https://young-inlet-68897.herokuapp.com/)

# Division of Labor

Gavin:

- placeholder

Andrew:

- placeholder

Chris:
- created Student API which serves as a collection of previous API calls that were unsorted
- aggregated previousCourses api call functionality to get_student API call
- implemented back-end functionality to the database for getting a users notifications
- aggregated getting current study partners API call functionality to get_student API call
- implemented back-end functionality for getting a students information
- reformatting heroku deployment to coincide with the transition to an actual database (MongoDB) 
- created the MongoDB database and connected it to the Heroku app for use in deployment
