# BigLab 2 - Class: 2022 AW1

## Team name: APP4FUN

Team members:
* s306017 MASON ALESSIO
* s294937 BARBERA MARIO 
* s303383 GIANOLA STEFANO
* s303357 MALLEMACI SALVATORE

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://polito-wa1-aw1-2022.github.io/materials/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://polito-wa1-aw1-2022.github.io/materials/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once you cloned this repository, please write the group name and names of the members of the group in the above section.

In the `client` directory, do **NOT** create a new folder for the project, i.e., `client` should directly contain the `public` and `src` folders and the `package.json` files coming from BigLab1.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but please double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.
Remember that `npm install` should be executed inside the `client` and `server` folders (not in the `BigLab2` root directory).

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## Registered Users

Here you can find a list of the users already registered inside the provided database. This information will be used during the fourth week, when you will have to deal with authentication.
If you decide to add additional users, please remember to add them to this table (with **plain-text password**)!

| email | password | name |
|-------|----------|------|
| john.doe@polito.it | password | John |
| mario.rossi@polito.it | password | Mario |
| testuser@polito.it | password | Test |

## List of APIs offered by the server

Provide a short description of the API you designed, with the required parameters. Please follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [A (small) sample request, with body (if any)]
* [A (small) sample response, with body (if any)]
* [Error responses, if any]

## List all Films
URL: /api/films

Method: _GET_

Description: Retrieve the list of all the available films.

Request body: None

Response: 200 OK (success) or 500 Internal Server Error (generic error).

Response body: An array of objects, each describing a film.
```
[{
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchdate": "2022-03-11",
    "rating" : 5 
    "user" : 1
}, {
    "title": "21 Grams",
    "favorite": 1,
    "watchdate": "2022-03-17",
    "rating" : 4 
    "user" : 1
},
...
]
```
## List all filtered Films
URL: /api/films/:filter

Method: _GET_

Description: Retrieve a list of all the films that fulfill a given filter.
Possible filters: all, favorites, bestrated, seenlastmonth, unseen

Request body: None

Response: 200 OK (success), 400 Bad Request (filter doesn't exist) or 500 Internal Server Error (generic error).

Response body: An array of objects, each describing a film.
```
[{
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchdate": "2022-03-11",
    "rating" : 5 
    "user" : 1
}, {
    "title": "21 Grams",
    "favorite": 1,
    "watchdate": "2022-03-17",
    "rating" : 4,
    "user" : 1
},
...
]
```

## Film by id
URL: /api/film/:id

Method: _GET_

Description: Retrieve a film, given its “id”.

Request body: None

Response: 200 OK (success), 404 Not Found (no film associated to id), 422 Unprocessable Entity (validation of id failed) or 500 Internal Server Error (generic error).

Response body: An object, describing a film.
```
{
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchdate": "2022-03-11",
    "rating" : 5 
    "user" : 1
}
```

## Create a new film
URL: /api/films

Method: _POST_

Description: Create a new film, by providing all relevant information – except the “id” that will be automatically assigned by the back-end.

Request body: a JSON object containing title, favorite, watchdate, rating and user.
```
{
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchdate": "2022-03-11",
    "rating" : 5 
    "user" : 1
}
```

Response: 200 OK (success), 404 Not Found (no film associated to id), 422 Unprocessable Entity (validation of id failed) or 500 Internal Server Error (generic error).

Response body: none

## Update a film
URL: /api/film/:id

Method: _PUT_

Description: Update an existing film, by providing all the relevant information, i.e., all the properties except the “id” will overwrite the current properties of the existing film. The “id” will not change after the update.

Request body: a JSON object containing title, favorite, watchdate, rating and user.
```
{
    "title": "Pulp Fiction",
    "favorite": 0,
    "watchdate": "2022-03-11",
    "rating" : 4 
    "user" : 1
}
```

Response: 200 OK (success), 404 Not Found (no film associated to id), 422 Unprocessable Entity (validation of id failed) or 500 Internal Server Error (generic error).

Response body: none

## Delete a film
URL: /api/films/:id

Method: _DELETE_

Description: Delete an existing film, given its “id”.

Request body: none

Response: 204 OK (success), or 500 Internal Server Error (generic error).

Response body: none

