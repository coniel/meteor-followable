Followable
========

A package enabling users to follow other models (e.g. other users).

### Static Methods

**FollowableModel.makeSortable(model, typeAsString, options)** - Make a model followable

### Prototypal Methods

**Model.prototype.follow(type)** - Add the current user as a follower (you can specify an optional type if you want to categorize followers)
**Model.prototype.unfollow()** - Remove the current user from the followers
**Model.prototype.followers()** - Get the followers for this model
**Model.prototype.isFollowedBy(user)** - Check if the specified user is a follower

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ javascript
FollowableModel.makeFollowable(User, "user");

var user = Meteor.users.findOne({_id: "3j4gfw8af8fw"});
user.follow();
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

## Follower (class) - Extends [BaseModel][1] - Implements [LinkableModel][2]##

### Instance Methods ###

**user()** - The user that made the follower.
**isDuplicate()** - Check if the user has already followed the linked object.


## Publications ##

There are no publications to allow the use of your choice of publication package.

[1]: https://github.com/coniel/meteor-base-model
[2]: https://github.com/coniel/meteor-linkable-model