Taichi Access
=============
Taichi Access is a simple access control module for nodejs following \*nix like system style.

**License: This project is under GPL/BSD**

Simple Tutorial
---------------
If you have a blog system, you may have several users, for example: admin, bloger, and those who visit your blog system -- visiter. They are exactly roles for grouping users. Let's define several users in json format:

```
{id:1, name:'yarco', roles:['admin']}
{id:2, name:'a dog', roles:['blog']}
{id:0, name:'anonymous', roles:['guest']}
```

Now we have three guys (or maybe two guys with a dog). yarco(me) is an admin, 'a dog' is a bloger and anonymous is a visiter.  
We don't care about how/where those data comes from, but in our access control system, `user` must has two fields: **id** and **roles**.

Let's go on defining our resource -- the blog:

```
{id:1000, type:'blog', title:'i\'m a good dog', owner: {id:2}}
```

See, the dog bloger write his first article. Let's say he is the owner of that article.  
A `resource` must also has two fields: **type** and **owner**.  
_notice: we said something in normal case. `user` resource and system resource are not in this case._

Finally, we need to define our permission rules.

```
{id:1, type:'blog', permissions:{everyone:'read'}}
``` 

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

```
npm install taichi-access
```

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

Extra notice
--------------
* You could only set one rule for one resource type
* resource type equal to role name except the following three predefined roles: **guest**, **user**, **admin**
* special resources may don't have the fields: **type**, **owner**. they can be read by **everyone**, and can only be modified by users with **admin** role. Type of those resources is **system**, you dont need to define the field.(for example, access rule table itself)
* special resource `users` only has one field: **type**, and   the value is fixed to **users**. cause user himself is the owner of him, you don't need to define an extra field **owner**
* `admin` role default has full permission on everything
* `user` role default has read permission on everything
* set a rule on some resource `{type:'xxxx', permissions:{everyone:'read'}}` could make the resource public read to everyone

ChangeLog
---------
* 0.0.2 - 0.0.3
  * add check on `system` resource type (if a resource doest set a `type` field, the resource will have `system` type which is readable to everyone and writable only to admin)
* 0.0.1 - 0.0.2
  * modern js style
  * setRules(xxx) intead of .rules=xxx

Sugguestion
-----------
You could contact [me][] through <yarco.wang@gmail.com> for this extension.
Or for programming related things, whatever.

This guy currently works in Wiredcraft.com. So you could also get him by <yarco@wiredcraft.com>

All rights reserved.

[me]:http://bbish.net
