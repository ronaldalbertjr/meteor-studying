import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if(Meteor.isServer)
{
	Meteor.publish('tasks', function tasksPublication(){ return Tasks.find({ $or:[{private:{ $ne: true } },{ owner: this.userId },],}); });
}

Meteor.methods({
	'tasks.insert' (text){
		check(text, String);

		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}

		Tasks.insert({
			text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user()
		});
	},

	'tasks.remove' (taskId){
		check(taskId, String);

		const task = Tasks.findOne(taskId);

		if (task.private && task.owner !== Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}

		Tasks.remove(taskId);
	},

	'tasks.setChecked' (taskId, setChecked){
		check(taskId, String);
		check(setChecked, Boolean);

		Tasks.update(taskId, {
			$set:{
				checked: setChecked
			}
		});
	},
	'tasks.SetPrivate' (taskId, setToPrivate){
		check(taskId, String);
		check(setToPrivate, Boolean);

		const task = Tasks.findOne(taskId);

		if(task.owner !== Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}

		Tasks.update(taskId,{
			$set:{
				private: setToPrivate
			}
		});
	},
});