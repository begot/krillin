var app = angular.module('StarterApp', ['ngMaterial', 'ngSails', 'md.data.table']);

app.controller('AppCtrl', ['$scope', '$sails', '$http', '$filter', '$interval', '$mdSidenav', '$mdDialog', function ($scope, $sails, $http, $filter, $interval, $mdSidenav, $mdDialog) {

$scope.databases = [
  {
	"name": "my test database",
	"tables": [1, 2],
	"provider": 0
  }
];

$scope.providers = [
  {
	"name": "MySQL",
	"description": "The world's most popular open source database.",
	"color": "mysql",
        "logo": "mysql.png"
  },
  {
	"name": "PostgreSQL",
	"description": "The world's most advanced open source database.",
	"color": "postgresql"
  },
  {
	"name": "MongoDB",
	"description": "Agility, scalability, performance. Pick three.",
	"color": "mongodb"
  },
  {
	"name": "Microsoft SQL Server",
	"description": "Breakthrough performance and faster insights across cloud and on-premises.",
	"color": "microsoft"
  },
  {
	"name": "Twitter",
	"description": "Twitter is an online social networking service.",
	"color": "twitter"
  },
  {
	"name": "Cassandra",
	"description": "high availability with no single point of failure.",
	"color": "cassandra"
  }
];

$scope.pages = [
  {
	"name": "Providers",
	"description": "",
	"template_id": 1,
	"children": []
  },
  {
	"name": "Databases",
	"description": "",
	"template_id": 2,
	"children": []
  },
  {
	"name": "Status",
	"description": "",
	"template_id": 3,
	"children": []
  },
  {
	"name": "Users",
	"description": "",
	"template_id": 4,
	"children": []
  },
  {
	"name": "Export",
	"description": "",
	"template_id": 5,
	"children": []
  },
  {
	"name": "Import",
	"description": "",
	"template_id": 6,
	"children": []
  },
  {
	"name": "Settings",
	"description": "",
	"template_id": 7,
	"children": []
  },
  {
	"name": "Replication",
	"description": "",
	"template_id": 8,
	"children": []
  },
  {
	"name": "Variables",
	"description": "",
	"template_id": 9,
	"children": []
  },
  {
	"name": "More",
	"description": "",
	"template_id": 10,
	"children": [{
		"name": "Charsets",
		"description": "",
		"template_id": 11
	}, {
		"name": "Engines",
		"description": "",
		"template_id": 12
	}]
  },
];

    $scope.navigateTo = function(to, event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Navigating')
          .content('Imagine being taken to ' + to)
          .ariaLabel('Navigation demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };

    $scope.doSecondaryAction = function(event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Secondary Action')
          .content('Secondary actions can be used for one click actions')
          .ariaLabel('Secondary click demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };

    $scope.settings = [
      { name: 'Wi-Fi', extraScreen: 'Wi-fi menu', icon: 'device:network-wifi', enabled: true },
      { name: 'Bluetooth', extraScreen: 'Bluetooth menu', icon: 'device:bluetooth', enabled: false },
    ];

    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.deletePost = function (postId) {

        if (typeof postId === 'number') {

            var req = {
                method: 'POST',
                url: '/posts/destroy?id=' + postId
            };

            $http(req);

        }

    };

    $scope.determinateValue = 0;

    $scope.$on('$destroy', function () {

        $interval.cancel(postsLoading);

    });

    $scope.demo = {
        topDirections: ['left', 'up'],
        bottomDirections: ['down', 'right'],
        availableModes: ['md-fling', 'md-scale'],
        selectedMode: 'md-fling',
        availableDirections: ['up', 'down', 'left', 'right'],
        selectedDirection: 'down'
    };

    $scope.posts = [];

    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '/templates/createNewPost.html',
            parent: angular.element(document.body),
            targetEvent: ev
        })
            .then(function (answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.alert = 'You cancelled the dialog.';
        });
    };

    (function () {

        $sails.get("/posts")
            .success(function (data, status, headers, jwr) {

            $scope.posts = data;
            $scope.determinateValue = 100;

        })
            .error(function (data, status, headers, jwr) {

            throw new Error(data);

        });

        $sails.on("posts", function (message) {

            if (message.verb == "destroyed") {

                var index = $filter('getIndex')($scope.posts, parseInt(message.id, 10));
                $scope.posts.splice(index, 1);

            } else if (message.verb == "created") {
                $scope.posts.push(message.data);
            }

        });

    }());

}]);

function DialogController($scope, $mdDialog, $http) {

    $scope.colors = ["green", "gray", "yellow", "blue", "purple", "red"];

    $scope.createPost = function (newPost) {

        var req = {
            method: 'POST',
            url: '/posts/create',
            data: newPost
        };

        $http(req)
            .success(function (data) {
            $mdDialog.cancel();
        })
            .error(function (data) {
            console.log(data);
        });

    };

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}

app.filter('getIndex', function () {
    return function (input, id) {
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (+input[i].id == +id) {
                return i;
            }
        }
        return null;
    };
});
