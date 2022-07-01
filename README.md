# Rest api project #

This is rest api 

## Run Application ##

Rest api can be run with

```
$ docker-compose up
```

## Automation Tests ##

```
sudo docker-compose up
knex migration:latest
```

Test can be run by 

```
$ npm test
```

***

# Endpoints #

every route begins with 

`/hnnews`

## Users ##

Route for users is 

`/users`

First you have to register user if you are not already

### Request ###

`POST /register`

```
{
    "username": "example_username",
    "password": "example_password"
}
```
### Response ###

```
{
    "userId": 1,
    "username": "example_username"
}
```

After registration you can login and get jwt token for authenticiation

### Request ###

`POST /login`

```
status: 200

{    
    "username": "example_username",
    "password": "example_password"
}
```

### Response ###

```
{
    "userId": 1,
    "username": "example_username",
    "token": "eyJh.."
}
```

For all other endpoints you have authenticate and send token in authorization header with type `bearer`

### Collections ###

Route for collections is 

`/collections`

### Request

You can display your collections

`GET /`

### Response

```
HTTP response status: 200

{
    "userId": 5,
    "data": {
        "collections": [
            1,
            2
        ]
    }
}
```

### Request

You can create your own collection

`POST /`

```
{
    "name": "example"
}
```

### Response

```
HTTP response status: 201

{
    "userId": 1,
    "collectionName": "example",
    "collectionId": 1
}
```

### Request

You can rename your connection 

`PUT /:id`

```
{
    "name": "example_"
}
```

### Response

```
HTTP response status: 200 | 201

{
    "userId": 1,
    "collectionName": "example_",
    "collectionId": 1
}
```

### Request

You can delete your collection with given id

`DELETE /:id`

### Response

```
HTTP response status: 204
```

### Request

You can display one of your collections with added stories

`GET /:id`

### Response

```
HTTP response status: 200 

{
    "userId": 5,
    "collectionId": 3,
    "collectionName": "example_3",
    "type": "collection",
    "data": {
        "stories": [1]
    }
}
```

### Request

You can add stories to your collection 

`POST /:id`

```
{
    "ids": [31883621, ...]
}
```

### Response

```
HTTP status code: 200

{
    "userId": 5,
    "collectionId": 3,
    "collectionName": "example_3",
    "type": "collection",
    "data": {
        "stories": [
            31883621
        ]
    }
}
```

## Items 

Route for items is 

`/items`

### Request

You can display whole item, either is it story or comment. You can use query `whole=true` to display whole structure of item

`GET /:id`

### Response

```
HTTP status code: 200

{
    "id": 31883621,
    "parentId": null,
    "content": "Super Mario Bros warp zones were intended to work slightly differently [video]",
    "author": "raldi",
    "time": 1656249446,
    "type": "story",
    "collections": [
        1,
        ...
    ],
    "kids": [
        31893975,
        ...
    ]
}
```

`GET /:id?whole=true`

### Response

```
HTTP status code: 200

{
    "id": 31883621,
    "parentId": null,
    "content": "Super Mario Bros warp zones were intended to work slightly differently [video]",
    "author": "raldi",
    "time": 1656249446,
    "type": "story",
    "collections": [
        1,
        ...
    ],
    "kids": [
        {
            "id": 31893975,
            "parentId": 31883621,
            "content": "For those who can&#x27;t watch the video or just want a text summary:<p>The underground 1-2 level is supposed to stop scrolling as soon as the mundane return-to-surface pipe comes onto the right edge of the screen...",
            "author": "raldi",
            "time": 1656334910,
            "type": "comment",
            "kids": [
                {
                    ....
                }
            ]
        }
    ]
}
```

## Errors

You can recieve error on bad request or with conflicts in your request

```
{
    "messsage": "Internal server error",
    "status": 500
}
```
