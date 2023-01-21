# Getting started
1. git clone
2. Run `docker compose up -d`

To run the project outside of a docker container
1. git clone
2. On the root folder, create an `.env` file containing the `DB_URL` variable, a postgres connection string to some postgres istance
3. Run `npm run dev`

This will run database migrations and start an HTTP server on port `3000`.
You can then perform a `GET` or `DELETE` request to `http://localhost:3000/ip/8.8.8.8`

You can run unit tests with `npm run test`

# Project structure
In the `src` code, there is some convenient layering that makes the code testable and extensible. Main layers are:  
- `routes`: here http routes are defined and all relative middlewares are mounted  
- `custom_middlewares`: here you can define custom middlewares. Here a fake auth middleware was implemented  
- `validators`: here user input stateless validation occours  
- `controllers`: controller responsability is just to handle http communication using `req` and `res` express response object as well as `next` function if errors occours  
- `services`: here you can find the business logic. Each controller should call the relative service. Services take as inputs and give as output only variables with primitive (or custom) types; services can't see the context of the express application. They can use `utils` or `data_layer` for their business  
- `data_layer`: a set of functions that perform database queries. Thoose function wraps our query builder ([knex](https://knexjs.org/))  
- `utils`: utilities used by services or data_layer.

### Types
In the `types` directory you can find custom types. Here all used types and interfaces are defined. Request and Response object are extended with generics too.

# Database
I reused a boilerplate made by me for node + postgres api services to speedup the development of this task.

For the given task, the fastest way to lookup for an IP address is by using an hash index. Postgres implements hash indexes but, according to Postgres [documentation](https://www.postgresql.org/docs/15/indexes-unique.html), you can not force the UNIQUE costraints for an hashed index column. So I used the default primary key index (b-tree) that is still incredibly fast for lookup operation even with billions of raws (postgres scales by design).

Probably a faster (but not such reliable) solution was using Redis. Redis should be faster for lookup operations, but it's not durable (queries are not WAL logged unless you specify it explicity, by loosing performances dramatically).

## Migrations
Database migrations were implemented, you can find the code in `src/database/migrations`
# Docker
I created a simple custom docker image and I defined a docker-compose file using the custom api image and the postgres official docker image.

# APIs
The service runs by default on `http://localhost:3000`  

`GET /ip/8.8.8.8`
Output:
Status code: `200`
Response Body:
```
{
    "ip": "8.8.8.8",
    "success": true,
    "type": "IPv4",
    "continent": "North America",
    "continent_code": "NA",
    "country": "United States",
    "country_code": "US",
    "region": "California",
    "region_code": "CA",
    "city": "Mountain View",
    "latitude": 37.3860517,
    "longitude": -122.0838511,
    "is_eu": false,
    "postal": "94039",
    "calling_code": "1",
    "capital": "Washington D.C.",
    "borders": "CA,MX",
    "flag": {
        "img": "https://cdn.ipwhois.io/flags/us.svg",
        "emoji": "🇺🇸",
        "emoji_unicode": "U+1F1FA U+1F1F8"
    },
    "connection": {
        "asn": 15169,
        "org": "Google LLC",
        "isp": "Google LLC",
        "domain": "google.com"
    },
    "timezone": {
        "id": "America/Los_Angeles",
        "abbr": "PST",
        "is_dst": false,
        "offset": -28800,
        "utc": "-08:00",
        "current_time": "2023-01-21T07:49:50-08:00"
    }
}
```  


`DELETE /ip/8.8.8.8`
Output:
Status code: `200`
Response Body: empty

The delete method will always return 200, even if the IP was not found (and therefore not deleted)

# Tests
Some unit tests were implemented.  
Coverage is quite low, more tests should be added and some e2e tests could be implemented as well.