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
  $scope.todos = todoStorage.get();
  $scope.show = 'All';
  $scope.allTodoCount = 0;
  $scope.activeTodoCount = 0;
  $scope.completedTodoCount = 0;
  $scope.newTodo = '';
  $scope.searchFilter = '';

  $scope.addTodo = function() {
    $scope.newTodo.trim();
    if ($scope.newTodo.length === 0) {
      return;
    }
    $scope.todos.push({
      title: $scope.newTodo,
      completed: false,
      created: Date.now()
    });
    $scope.newTodo = '';
  };

  $scope.deleteTodo = function(todo) {
    $scope.todos.splice($scope.todos.indexOf(todo), 1);
  };

  $scope.clearCompleted = function() {
    $scope.todos = $scope.todos.filter(function(val) {
      return !val.completed;
    });
  };

  $scope.markAll = function() {
    $scope.todos.forEach(function(todo) {
      todo.completed = true;
    });
  };

  $scope.statusFilter = function(todo) {
    if ($scope.show === "All") {
      return true;
    } else if (!todo.completed && $scope.show === "Active") {
      return true;
    } else if (todo.completed && $scope.show === "Done") {
      return true;
    } else {
      return false;
    }
  };

  $scope.$watch("todos", function(newVal, oldVal) {
    if (newVal !== null && angular.isDefined(newVal) && newVal !== oldVal) {
      $scope.allTodoCount = $scope.todos.length;
      $scope.activeTodoCount = $scope.todos.filter(function(val) {
        return !val.completed;
      }).length;
      $scope.completedTodoCount = $scope.todos.filter(function(val) {
        return val.completed;
      }).length;
      todoStorage.put(newVal);
    }
  }, true);

});