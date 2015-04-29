Things = new Mongo.Collection('things');

if (Meteor.isClient) {
  Meteor.subscribe('things');

  Template.things.helpers({
    things: function () {
      var oldest_thing = Things.findOne({}, {sort: {start_date: 1}});
      console.log(oldest_thing);
      var max_date = oldest_thing.start_date;
      var now = new Date();
      var max_delta = now - max_date;
      return Things.find({}, {sort: {start_date: 1}}).map(function (el) {el.relative_date = (now - el.start_date) / max_delta * 100; return el; });
    }
  });

  Template.things.events({
    'click .delete': function () {
      console.log(this._id);
      Things.remove(this._id);
    }
  });

  Template.thing_form.events({
    'submit form': function (e) {
      e.preventDefault();

      var thing = {
        blurb: $(e.target).find('[name=blurb]').val(),
        start_date: new Date($(e.target).find('[name=start_date]').val())
      }

      thing._id = Things.insert(thing);
      $(e.target).find('[name=blurb]').val('');
      $(e.target).find('[name=start_date]').val('');
      $(e.target).find('[name=blurb]').focus();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('things', function () {
      return Things.find();
    });
  });
}
