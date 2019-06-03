(function () {
    'use strict';

    angular.module('app.activenodes')
        .controller('activenodeCtrl', ['$scope', 'utilities', 'governanceService', activenodeCtrl]);

    function activenodeCtrl($scope, utilities, governanceService) {
        
        governanceService.getActivenodes(function (returnData) {
            $scope.active_activenodes = returnData[0];
            //$scope.standby_witnesses = returnData[1];
        });

        utilities.columnsort($scope, "total_votes", "sortColumn", "sortClass", "reverse", "reverseclass", "column");
        utilities.columnsort($scope, "total_votes", "sortColumn2", "sortClass2", "reverse2", "reverseclass2", "column2");
    }
    
})();
