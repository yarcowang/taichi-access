Taichi Access
=============
Taichi Access is a simple nodejs access control module which is following \*nix system style.

**License: This project is under GPL/BSD**

Simple Tutorial
---------------
If you have a blog system, you may have several users, for example: admin and blogger, and also those who read your blogs -- visiters. They are exactly roles for grouping users. Let's define them in json format:

```
var admin = {id:1, name:'yarco', roles:['admin']};
var blogger = {id:2, name:'a dog', roles:['blog']};
var visiter = {id:0, name:'anonymous', roles:['guest']};
```

Now we have three guys (or maybe two guys with a dog). yarco(me) is an admin, 'a dog' is a blogger and visiter is just a visiter.  
We don't care about how/where those data comes from. In our access control system, **id** and **roles** are both required.  
_notice: the key `id` is configured by `access.id`, you will see it below_

Let's go on defining our resource -- the blog, it should be an article with a type:

```
var resource = {id:1000, type:'blog', title:'i\'m a good dog', owner: {id:2}};
```

See, blogger dog wrote his first article. Let's say he is the owner of the article.  
In normal case, a `resource` will also have two fields: **type** and **owner**.  
_notice: user table and system table are in not this case._

Finally, we need to define our permission rules.

```
var rules = [
	{id:1, type:'blog', permissions:{everyone:'read'}}
];
``` 

Now, we could use our **Taichi Access** module to check the permission on those guys:

```
access.id = 'id'; // this indicate the keyword is 'id', if you are using something like {_id:1}, then it should be _id. default value is '_id', so in this case, you dont have to include this line

// set rules
access.setRules(rules);

// check user
access.checkUser('delete', admin, resource); // true, cause admin has delete rights 
access.checkUser('delete', blogger, resource); // true, cause blogger is the owner of the resource
access.checkUser('write', visiter, resource); // false, cause visiter don't have rights to write blog
access.checkUser('read', visiter, resource); // true, cause everyone = read is set in permissions in access rules

// or you could also set user first, then do check
access.user = visiter;
access.check('delete', resource); 
access.check('read', resource);
```

Details
--------
* we make role name equal to resource type to make things simple, though they are really different things.
* roles "admin", "user" and "guest" are all reserved, they have their internal meanings.
* there are several types of resource: normal resource, system resource and user table. normal resource should have fields "type" and "owner"; system resource don't have those two fields; user table is special resource, has type "users".
* if you didn't set rule on some resource for some role: for an admin, he could delete/write/read the resource; for those whose role equals to the resource type have write/read permission; and for a guest, he can't access that resource except you set a rule for "everyone"; for a user with "user" role, he always can read the resource.
* system resource can only be managed by "admin" and also readable to all
* You could only set one rule for one resource type
* "admin" role default has full permission on everything
* "user" role default has read permission on everything
* set a rule on some resource `{type:'xxxx', permissions:{everyone:'read'}}` could make the resource public read to everyone

How to install
---------------
Like other module in nodejs, just do:

```
npm install taichi-access
```

APIs
----------
* Attributes
	* id -- set/get the keyword name
	* user -- set/get the user you want to check
	* rules -- get rules
* Methods
    * setRules(rules) -- set access rules
	* check(permission, resource) -- check permission on some resource
	* checkUser(permission, user, resource) -- check permission on some resource for someone
	* http2perm(method) -- utility function, map http method to permission


ChangeLog
---------
* 0.0.2 - 0.0.3
  * add check on `system` resource type (if a resource doest set a `type` field, the resource will have `system` type which is readable to everyone and writable only to admin)
  * remove extra methods for set default user/resource, add mapping http method to permission utility function
* 0.0.1 - 0.0.2
  * modern js style
  * use setRules(xxx) replace obj.rules=xxx

Sugguestion
-----------
You could contact [me][] through <yarco.wang@gmail.com> for this extension.
Or for programming related things, whatever.

This guy currently works in Wiredcraft.com. So you could also get him by <yarco@wiredcraft.com>

All rights reserved.

[me]:http://bbish.net
