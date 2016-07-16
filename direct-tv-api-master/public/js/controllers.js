'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth, User) {
  console.log('mainCtrl');
  // var x = 3;
  // console.log('x',x);
  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logout = () => {
    User.logout()
      .then(() => {
        $state.go('home');
      })
  };

  $scope.authenticate = provider => {
    User.authenticate(provider)
      .then(res => {
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };
});

app.controller('loginCtrl', function($scope, $state, User) {
  $scope.login = () => {
    User.login($scope.user)
      .then(res => {
        console.log('res:', res);
        $state.go('profile');
      })
      .catch(err => {
        console.log('err:', err);
      });
  };
});

app.controller('registerCtrl', function($scope, $state, User) {
  $scope.register = () => {
    if($scope.user.password !== $scope.user.password2) {
      $scope.user.password = null;
      $scope.user.password2 = null;
      alert('Passwords must match.  Try again.');
    } else {
      User.signup($scope.user)
        .then(res => {
          console.log('res:', res);
          $state.go('login');
        })
        .catch(err => {
          console.log('err:', err);
        });
    }
  };
});

app.controller('profileCtrl', function($scope, Profile) {
  $scope.user = Profile;

  var x = document.createElement("VIDEO");
  console.log("xX", x);

  
});

app.controller('usersCtrl', function($scope, User, Users) {
  $scope.users = Users;

  $scope.sendMessage = user => {
    User.sendMessage(user);
  };

  $scope.$on('message', function(ev, data) {
    console.log('data:', data);
  });
});
