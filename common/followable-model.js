FollowableModel = {};

FollowableModel.makeFollowable = function (model, type) {
    if (model.appendSchema && type) {
        LinkableModel.registerLinkableType(model, type);
        _.extend(model.prototype, followableMethods);
    } else {
        throw new Meteor.Error("makeFollowableFailed", "Could not make model followable. Please make sure you passed in a model and type");
    }
};


var followableMethods = {
    /**
     * Create and link a follower
     * @param {String} type The type of follower
     */
    follow: function (type) {
        new Follower({type: type, linkedObjectId: this._id, linkedObjectType: this._objectType}).save();
    },

    /**
     * Remove a record from the followers collection that is linked to the model
     * @memberOf LikeableModel
     */
    unfollow: function () {
        //find and then call call instance.remove() since client
        //is restricted to removing items by their _id
        var follower = Follower.collection.findOne({userId: Meteor.userId(), linkedObjectId: this._id});
        follower && follower.remove();
    },

    /**
     * Get the comments for a model that is able to be commented on
     * @param   {Number}       limit     The maximum number of records to return
     * @param   {Number}       skip      The number of records to skip
     * @param   {String}       sortBy    The field on which to sort
     * @param   {Number}       sortOrder The order in which to sort. 1 for ascending and -1 for descending
     * @returns {Mongo.Cursor} A cursor that returns comment instances
     */
    followers: function (limit, skip, sortBy, sortOrder) {
        var options = {};

        if (limit) {
            options.limit = limit;
        }

        if (skip) {
            options.skip = skip;
        }

        if (sortBy && sortOrder) {
            options.sort = {};
            options.sort[sortBy] = sortOrder;
        }

        return Follower.collection.find({linkedObjectId: this._id}, options);
    },


    /**
     * Check if the model is followed by a certain user
     * @param   {Object}  user A User instance to check against
     * @memberOf FollowableModel
     * @returns {Boolean} Whether the user likes the model or not
     */
    isFollowedBy: function (user) {
        return !!Follower.collection.findOne({linkedObjectId: this._id, userId: user._id});
    }
};