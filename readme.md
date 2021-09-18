### password checker api

#### set up
step 1

```yarn install```

step 2 

- Create environment variables file with connection properties and server configurations i.e

```
##MYSQL
MY_SQL_HOST=database_host
MY_SQL_PORT=database_port
MY_SQL_DATABASE=database_name
MY_SQL_USER=db_user
MY_SQL_PASSWORD=*******************

##SERVER
HOST_URL=http://localhost:3000
HOST_PORT=3000
```
NOTE: Replace database configurations as per your setup (host, port, database and user)

step 3

```yarn start``` 

- This will start the server at a specified port

``` 
Listening on port 3000
Server started
```
This will indicate the server has started 


step 4 

on the project root directory run the password validator CLI i.e

```yarn password_validator```
