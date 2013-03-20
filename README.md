# bcrypt-nodejs
===========================================
[![Build Status](https://secure.travis-ci.org/shaneGirish/bcrypt-nodejs.png)](http://travis-ci.org/shaneGirish/bcrypt-nodejs)
[![Dependency Status](https://david-dm.org/shaneGirish/bcrypt-nodejs.png)](https://david-dm.org/shaneGirish/bcrypt-nodejs)


Native javascript implementation of BCrypt for Node.

Has the same functionality as [node.bcrypt.js] except for a few differences. Mainly, it doesn't let you set the seed length for creating the random byte array.

I created this version due to a small [problem](https://github.com/ncb000gt/node.bcrypt.js/issues/102) I faced with [node.bcrypt.js].
Basically, it proved too difficult to compile using [node-gyp] in Windows x64 platforms (Win7 and Win8, in my case).

This code is based on [javascript-bcrypt] and uses [crypto] to create random byte arrays.

##Warnings
### UTF8 strings
Support for UTF8 strings was only added in v0.0.3. This also means that strings encoded by v0.0.2 and below are not compatible with v0.0.3 and above.
### Asynchronous Functions
The asynchronous functions use [process.nextTick()]. They don't actually run in separate threads and thus will block the node process when they do execute.
There are 2 ways to do proper asynchronous call in node:
#### 1. Multiple threads in one process
[webworker-threads] implements WebWorker API and more.
```javascript
var WebWorker = require('webworker-threads').Worker;

var worker = new WebWorker(function() {
    this.bcrypt = require('bcrypt-nodejs');
    this.onmessage = function(event) {
        postMessage(this.bcrypt.hashSync(event.data));
        self.close();
    };
});

worker.onmessage = function(event) {
    console.log("bCrypt Hash : "  + event.data);
}

worker.postMessage('bacon');
```
The above code won't block the event loop like [process.nextTick()], because for each request, the worker will run in parallel in a separate background thread. The disadvantage to this method is that [webworker-threads] require compilation with [node-gyp]. If this is an option, please consider using [node.bcrypt.js] instead of this module as it implements threads by itself and this means your project won't need another dependancy.

#### 2. A pool of processes
Whole new instances of V8 can be started in parallel to your main application to compute intensive tasks using [process.fork()].
Assume at least 30ms startup and 10mb memory for each new Node. That is, you cannot create many thousands of them and to be significantly efficient, you need to have a pool of processes ready to work at any given time. [process.fork()] is native, so it needs no compilation.
```javascript
var child = require('child_process').fork(__dirname + '/worker.js');

child.on('message', function(message) {
    console.log("bCrypt Hash : "  + message.data);
});

child.send({ data: 'bacon' });
```
The child script `worker.js` would look like this :
```javascript
var bCrypt = require('bcrypt-nodejs');

process.on('message', function(message) {
    process.send({ data: bcrypt.hashSync(message.data) });
});

```
The above example only shows how to start one child process and get the result. For starting and maintaining a pool of child processes you could use [compute-cluster].
*I just found that the last commit in [compute-cluster] was 2 months ago. There are some bugs to squash and it seriously needs support of events.*

## Basic usage:
Synchronous
```javascript
var hash = bcrypt.hashSync("bacon");

bcrypt.compareSync("bacon", hash); // true
bcrypt.compareSync("veggies", hash); // false
```

Asynchronous
```javascript
bcrypt.hash("bacon", null, null, function(err, hash) {
    if(err) { /* Something went wrong. */ }

    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, result) {
    if(err) { /* Something went wrong. */ }

    console.log(result); // true
});

bcrypt.compare("veggies", hash, function(err, result) {
    if(err) { /* Something went wrong. */ }

    console.log(result); // false
});
```

In the above examples, the salt is automatically generated and attached to the hash.
Though you can use your custom salt and there is no need for salts to be persisted as it will always be included in the final hash result and can be retrieved.

## API
* `genSaltSync(rounds)`
    * `rounds` - [OPTIONAL] - the number of rounds to process the data for. (default - 10)
* `genSalt(rounds, callback)`
    * `rounds` - [OPTIONAL] - the number of rounds to process the data for. (default - 10)
    * `callback` - [REQUIRED] - a callback to be fired once the salt has been generated.
        * `error` - First parameter to the callback detailing any errors.
        * `result` - Second parameter to the callback providing the generated salt.
* `hashSync(data, salt)`
    * `data` - [REQUIRED] - the data to be encrypted.
    * `salt` - [REQUIRED] - the salt to be used in encryption.
* `hash(data, salt, progress, cb)`
    * `data` - [REQUIRED] - the data to be encrypted.
    * `salt` - [REQUIRED] - the salt to be used to hash the password.
    * `progress` - a callback to be called during the hash calculation to signify progress
    * `callback` - [REQUIRED] - a callback to be fired once the data has been encrypted.
        * `error` - First parameter to the callback detailing any errors.
        * `result` - Second parameter to the callback providing the encrypted form.
* `compareSync(data, encrypted)`
    * `data` - [REQUIRED] - data to compare.
    * `encrypted` - [REQUIRED] - data to be compared to.
* `compare(data, encrypted, cb)`
    * `data` - [REQUIRED] - data to compare.
    * `encrypted` - [REQUIRED] - data to be compared to.
    * `callback` - [REQUIRED] - a callback to be fired once the data has been compared.
        * `error` - First parameter to the callback detailing any errors.
        * `result` - Second parameter to the callback providing whether the data and encrypted forms match [true | false].
* `getRounds(encrypted)` - return the number of rounds used to encrypt a given hash
    * `encrypted` - [REQUIRED] - hash from which the number of rounds used should be extracted.

## Contributors
* [Alex Murray][alexmurray]
* [Nicolas Pelletier][NicolasPelletier]
* [Josh Rogers][geekymole]
* [Noah Isaacson][nisaacson]

## Credits
I heavily reused code from [javascript-bcrypt]. Though "Clipperz Javascript Crypto Library" was removed and its functionality replaced with [crypto].

[crypto]:http://nodejs.org/api/crypto.html
[node.bcrypt.js]:https://github.com/ncb000gt/node.bcrypt.js.git
[javascript-bcrypt]:http://code.google.com/p/javascript-bcrypt/
[process.nextTick()]:http://nodejs.org/api/process.html#process_process_nexttick_callback
[node-gyp]:https://github.com/TooTallNate/node-gyp
[webworker-threads]:https://github.com/audreyt/node-webworker-threads
[process.fork()]:http://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options
[compute-cluster]:https://github.com/lloyd/node-compute-cluster

[alexmurray]:https://github.com/alexmurray
[NicolasPelletier]:https://github.com/NicolasPelletier
[geekymole]:https://github.com/geekymole
[nisaacson]:https://github.com/nisaacson
