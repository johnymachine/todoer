"use strict";

var Todo = angular.module('todo', []);

Todo.factory('todoStorage', function() {
  var STORAGE_ID = 'stored-todos';

  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    },

    put: function(todos) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    }
  };
});

Todo.controller('todoCtrl', function todoCtrl($scope, todoStorage) {
  var todos = $scope.todos = todoStorage.get();
  $scope.newTodo = '';

  $scope.addTodo = function() {
    var newTodo = $scope.newTodo.trim();
    if (newTodo.length === 0) {
      return;
    }

    todos.push({
      title: newTodo,
      completed: false
    });
    $scope.newTodo = '';
  };

  $scope.deleteTodo = function(todo) {
    todos.splice(todos.indexOf(todo), 1);
  };

  $scope.clearCompleted = function() {
    $scope.todos = todos = todos.filter(function(val) {
      return !val.completed;
    });
  };

  $scope.$watch("todos", function(newVal, oldVal) {
    if (newVal !== null && angular.isDefined(newVal) && newVal !== oldVal) {
      todoStorage.put(newVal);
    }
  }, true);

});