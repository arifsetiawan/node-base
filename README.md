
Node.js project base 
==========

This is template for Node.js based app.

## Components

* MongoDB as database
* Passport to manage authentication with session stored in MongoDB
* Formidable for multipart post
* Swig as templating engine
* Generic MongoDB query
* Front end components
    * Bootstrap
    * Font awesome
    * jQuery
* Web.config for IIS deployment. All static contents served through IIS

## Project Structure

* **/config.** app config, routes, database init and others
* **/controllers.** controller to handle request-response from routes
* **/lib.** common functions
* **/middleware.** express middleware functions
* **/models.** model data
* **/public.** public assets
* **/test.** test codes
* **/tools.** some tools
* **/views.** html views with swig template engine

## How to Use

* (Optional) Fork the repo
* Clone the repo to your local

```
$ git clone https://github.com/arifsetiawan/node-base.git my-node-project
```

* (Optional) update repo remote url
* Update package.json data (name, description, repository, author, etc)
* Update config/app.js data (database, appname, etc)
* `cd` into project folder and run `npm install` 

```
$ cd my-node-project
$ npm install
```

* Start the server app

```
$ node server.js
```

## Note

The config is tailored for deployment on IIS. If you are using nodejs directly or using nginx as front, config might be different.
