Taichi Access
=============
Taichi Access is a simple access control module for node.js following \*nix like system style.

**This project is under GPL/BSD**

Simple Tutorial
---------------
If you have a blog system, you may several users, for example: admin, bloger, visiter. They are exactly roles for grouping users. So let's define several users in json format:

		{id:1, name:'yarco', roles:['admin']}
		{id:2, name:'a dog', roles:['blog']}
		{id:0, name:'anonymous', roles:['guest']}

Now we have three guys (or maybe two guys with a dog). yarco(me) is an admin, 'a dog' is a bloger and anonymous is a visiter.  
We don't care about how/where those data comes from, but in our access control system, user must has two fields: **id** and **roles**.

Let's go on defining our resource -- blog:

		{id:1000, type:'blog', title:'i\'m a good dog', owner: {id:2}}

See, the dog bloger write his first article. Let's say he is the owner of that article.  
A resource must also has two fields: **type** and **owner**.  

Finally, we need to define our permission rules.

		{id:1, type:'blog', permissions:{everyone:'read'}}

Now we could use our **Taichi Access** module to check the permission on those above guys.

```javascript
var access = require('taichi-access');

access.id = 'id'; // this indicate the key word is 'id', if you are using something like {_id:1}, then it should be _id
access.setRules([
	{id:1, type:'blog', permissions:{everyone:'read'}}
]);

var admin = {id:1, name:'yarco', roles:['admin']};
var bloger = {id:2, name:'a dog', roles:['blog']};
var visiter = {id:0, name:'anonymous', roles:['guest']};

var resource = {id:1000, type:'blog', title:'i\'m a good dog', owner: {id:2}};

access.checkUser('delete', admin, resource); // true, cause admin has delete rights 
access.checkUser('delete', bloger, resource); // true, cause bloger is the owner of the resource
access.checkUser('write', visiter, resource); // false, cause visiter don't have rights to write blog
access.checkUser('read', visiter, resource); // true, cause everyone = read is set in permissions

// you could also do

access.user = visiter;
access.check('delete', resource); 
access.check('read', resource);

var user = access.anonymous(); // set user as anonymous
```

How to install
---------------
Like other module in node.js, just do:

		npm install taichi-access

Interface
----------
* Getter/Setter
	* id -- set/get the key name
	* user -- set/get the user you want to check
	* rules -- get rules
* Methods
    * setRules(rules) -- set access rules
	* check(permission, resource) -- check permission on some resource
	* checkUser(permission, user, resource) -- check permission on some resource for someone
	* anonymous() -- get an anonymous user for checking in the small system

Notice
--------
* You could only set one rule for one resource type
* resource type == role name except three predefined role names: "guest", "user", "admin"

ChangeLog
---------
* 0.0.1 - 0.0.2
  * modern js style
  * setRules(xxx) intead of .rules=xxx

About Author
------------
You could contact <yarco.wang@gmail.com> for this extension.
Or for programming related things, whatever.

This guy currently works in Wiredcraft.com. So you could also get him by <yarco@wiredcraft.com>

All rights reserved by [yarco].

[yarco]:http://bbish.net
