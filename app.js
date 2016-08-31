angular.module('procst', [])

.directive("videoUpload", function($timeout, $http, $sce) {
    return {
        restrict: 'E',
        scope: {
            id: '@id'
        },
        link: function(scope, element, attrs) {
            scope.apiPass = '15d92a48344a3f28b00a6e2ad2e42199ccb802e73049fe9d1b9ce65e71006a0d';
            scope.hashId = null;
            scope.progress = 0;
            scope.embed = null;

            scope.getStatus = function() {
              $http({
                method: 'GET',
                url: 'https://api.wistia.com/v1/medias/' + scope.hashId + '.json?api_password=' + scope.apiPass
              }).then(function (response) {
                scope.status = response.data.status || '';
                if (scope.status == 'ready') {
                  scope.embed = $sce.trustAsHtml(response.data.embedCode);
                } else if(scope.status != 'failed') {
                  $timeout(function(){
                    scope.getStatus();
                  }, 3000);
                }
              });
            };

            $timeout(function() {
                $('#' + scope.id).fileupload({
                    dataType: 'json',
                    url: 'https://upload.wistia.com',
                    formData: {
                      api_password: scope.apiPass
                    },
                    done: function (e, data) {
                        scope.hashId = data.result.hashed_id;
                        scope.getStatus();
                        console.log(data.result);
                    },
                    progressall: function (e, data) {
                        scope.$apply(function(){
                          scope.progress = parseInt(data.loaded / data.total * 100, 10);
                        });
                    }
                });
            });

        },
        templateUrl: 'video-upload.html'
  };

});
