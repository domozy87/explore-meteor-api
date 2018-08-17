Local set up
------------

Clone the repository to your local dev workspace
```
git clone https://github.com/domozy87/explore-meteor-api.git
```

__Note__: your folder name will be used as the site domain name in later step.

Change directory to Project path
```
cd ~/explore-meteor-api

```

Run command below to add necessary package for Meteor
```
meteor add accounts-password session accounts-ui email fourseven:scss@3.13.0 
meteor add ddp-rate-limiter ostrio:logger ostrio:loggerfile
```

Run command below to install meteor node
```
meteor npm install
```

Run Meteor server
```
meteor run --port 3001
```

Run Meteor with no hangup (for Production - need to manully apply after deployment)
```
nohup meteor --port 3001
```

Remove autopublish and insecure modules
```
meteor remove autopublish insecure
```

Connect to Meteor websocket
---------------------------

* From Mobile App
```
ws://your-url-Or-ip-address:your-port/websocket
```

* From another Meteor App
```
http(s)://your-url-Or-ip-address:your-port/
```

Authentication
--------------

We use [account-base](http://docs.meteor.com/api/accounts.html) package with [account-ui](http://docs.meteor.com/api/accounts.html#accountsui) and [account-password](http://docs.meteor.com/api/passwords.html).

* To create a new user:
```
Accounts.createUser({'email', 'password'}, [callBack]);
```

* To login into Meteor
```
Meteor.loginWithPassword('email', 'password', [callback])
```

* To change user password:
```
Accounts.changePassword('oldPassword', 'newPassword', [callBack]);
```

* To get a forgot password link in user email:
```
Accounts.forgotPassword({email: 'testUser111@test.com'}, [callBack]);
```

* To reset user password:
```
Accounts.resetPassword('token', 'newPassword', [callBack]);
```

Run code check style with `ESlint`
----------------------------------

* Overall check code style
```
./node_modules/.bin/eslint .
```

* Check code style for specific file
```
./node_modules/.bin/eslint server/main.js
```

__Note__: if you want `ESlint` fix all your breaking code styles, use `--fix` option in your command.

```
./node_modules/.bin/eslint server/main.js --fix
```

* Configuration with IDE
```
- https://guide.meteor.com/code-style.html#javascript
```

Unit Test with Mocha
--------------------

Go to project root directory and run the following command:
```
meteor npm test
```

__Note__: you can override the report path by providing a new path to `XUNIT_FILE`.
