yp-crawler
==========


A basic crawler for yellow pages. Built with NodeJS

## Getting Started

Clone the repo, then run npm install inside the directory:

```javascript
  npm install
```

Create a database, then set your DB info in the configuration file:

```javascript
    conf.db = {
      name: 'your-db-name',
      user: 'root',
      pass: 'root',
      host: 'localhost',
      port: 3306
    };
```

Run the crawler:

```javascript
    node crawler_server.js crawl
```
