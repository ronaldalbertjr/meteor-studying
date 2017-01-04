import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Tasks } from '../../api/tasks.js';
import { Meteor } from 'meteor/meteor';
 
// EU sou o ronald
class TodosListCtrl 
{
    constructor($scope) 
    {
      $scope.viewModel(this);

      this.subscribe('tasks');

      this.hideCompleted = false;

      this.helpers(
      {
        tasks() 
        {
          const selector = {};

          if(this.getReactively('hideCompleted'))
          {
            selector.checked = { $ne: true };
          }
          return Tasks.find(selector, {sort: {createdAt: -1}});
        },

        incompleteCount()
        {
          return Tasks.find({checked: {$ne: true}}).count();
        },

        currentUser()
        {
          return Meteor.user();
        }
      })
    }

    addTask(newTask)
    {
      Meteor.call('tasks.setChecked', task._id, !task.checked);
      this.newTask = '';
    }

    setChecked(task)
    {
      Tasks.update(task._id, {
          $set:{
           checked: !task.checked
         },
       });
    }

    removeTask(task)
    {
      Meteor.call('tasks.remove', task._id);
    }

    setPrivate(task)
    {
      Meteor.call('tasks.setPrivate', task._id, !task.private);
    }
}
export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });

