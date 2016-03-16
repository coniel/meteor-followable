/**
 * A model for a follower which can be linked to many other database objects
 * @class Follower
 */
Follower = BaseModel.extendAndSetupCollection("followers", {userId: true});
LinkableModel.makeLinkable(Follower);

/**
 * The user that made the follower
 * @returns {User} A User instance representing the followering user.
 */
Follower.prototype.user = function () {
    return Meteor.users.findOne(this.userId);
};

/**
 * Check if the user has already followed the linked object
 * @memberOf Follower
 * @returns {[[Type]]} [[Description]]
 */
Follower.prototype.isDuplicate = function () {
    return !!Follower.collection.findOne({userId: this.userId, linkedObjectId: this.linkedObjectId});
};

//create the schema
Follower.appendSchema({
    "type": {
        type: String,
        max: 30
    }
});

Follower.meteorMethods({
    insert: new ValidatedMethod({
        name: 'followers.insert',
        mixins: [CallPromiseMixin, LoggedInMixin],
        validate: new SimpleSchema({
            doc: {
                type: Object
            },
            'doc.linkedObjectId': Follower.getSchemaKey('linkedObjectId'),
            'doc.linkedObjectType': Follower.getSchemaKey('linkedObjectType'),
            'doc.type': Follower.getSchemaKeyAsOptional('type')
        }).validator(),
        checkLoggedInError: {
            error: 'notLogged',
            message: 'You need to be logged in to call this method',//Optional
            reason: 'You need to login' //Optional
        },
        run({doc}) {
            // Set userId of to current user
            doc.userId = this.userId;
            var follower = new Follower(doc);

            if (follower.isDuplicate()) {
                throw new Meteor.Error("alreadyFollowerdByUser");
            }

            return Follower.collection.insert(doc);
        }
    }),
    remove: new ValidatedMethod({
        name: 'followers.remove',
        mixins: [CallPromiseMixin, LoggedInMixin],
        validate: Follower.getSubSchema(["_id"], null, true),
        checkLoggedInError: {
            error: 'notLogged',
            message: 'You need to be logged in to call this method',//Optional
            reason: 'You need to login' //Optional
        },
        run({_id}) {
            var follower = Follower.collection.findOne({_id: _id});

            if (follower.checkOwnership()) {
                Follower.collection.remove({_id: _id});
            }
        }
    })
});