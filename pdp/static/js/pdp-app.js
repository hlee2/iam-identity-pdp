// possible js tools for the project

// these are set by page load
var pdp_name_url = 'api/name';
var pdp_pub_url = 'api/publish';


var app = angular.module('pdpApp', []);

app.config(['$httpProvider', function($httpProvider) {
	    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
	    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	}]);

app.filter('invalid_chars', function() {
	return function(input, valid) {
	    var ichars = [];
	    for(var i = 0; i < input.length; i++){
		if(!valid.test(input.charAt(i))){
		    if(ichars.indexOf(input.charAt(i)) == -1){
			ichars.push(input.charAt(i));
		    }
		}
	    }
	    return ichars.join(', ');
	};
    });

/* controller for the preferred name */

app.controller('NameCtrl', ['$scope', '$http', '$log', function($scope, $http, $log) {

    // sample valid name characters
    $scope.valid_chars = /^[\w !#$%&\'*+\-,.?^_`{}~]*$/;
    $scope.displayNameMax = 80;

    // display names as they look in the directory
    $scope.wp = {
        fname: null,
        mname: null,
        lname: null
    };
    // display names as they are edited
    $scope.pn = {
	display_fname: null,
	display_mname: null,
	display_lname: null
    };
    $scope.displayName = '';

    $scope.putStatus = null;
    $scope.getPrefName = function() {
	$log.info('about to get '+ pdp_name_url);
	$http.get(pdp_name_url).success(function(data){
		$scope.pn = data;
                $scope.wp.fname = $scope.pn.display_fname;
                $scope.wp.mname = $scope.pn.display_mname;
                $scope.wp.lname = $scope.pn.display_lname;
	    });
    };
    $scope.putPrefName = function() {
        console.log('pub = ' + $scope.wp_publish);
	$log.info('about to put '+ pdp_name_url);
	$http.put(pdp_name_url, $scope.pn)
	.success(function(data){
            $scope.putStatus = 'success';
            $scope.getPrefName();
            $log.info($scope.putStatus);
            $scope.pnform.$setPristine(); // only set pristine on success
	    })
	.error(function(data){
		$scope.putStatus = 'error';
		$log.info($scope.putStatus);
	    });
    };
    $scope.getDisplayNameFromObject = function(value){
        dname = "";
        if(value.display_fname) dname += value.display_fname;
        if(value.display_mname) dname += (dname.length ? ' ' : '') + value.display_mname;
        if(value.display_lname) dname += (dname.length ? ' ' : '') + value.display_lname;
        return dname;
    };
    $scope.getPrefName();
    $scope.displayName = $scope.getDisplayNameFromObject($scope.pn);
    $scope.$watch('pn', function(newval, oldval){
        $scope.displayName = $scope.getDisplayNameFromObject(newval);
    }, true);
}]);


/* controller for the publish preference */

app.controller('PubCtrl', ['$http', '$log', function($http, $log) {
    var _this = this;
    this.publish = {
        publish: 'no'
    };
    this.putStatus = null;
    this.getPubPref = function() {
	    $log.info('about to get '+ pdp_pub_url);
	    $http.get(pdp_pub_url).success(function(data){
		    _this.publish = data;
	    });
    };
    this.putPubPref = function() {
        console.log('pub = ' + JSON.stringify(_this.publish));
	    $log.info('about to put to '+ pdp_pub_url);
	    $http.put(pdp_pub_url, _this.publish)
	        .success(function(data){
		        _this.putStatus = 'success';
		        $log.info(_this.putStatus);
                _this.form.$setPristine();
            })
	        .error(function(data){
                err_msg = data.error_message;
                console.log(err_msg);
                _this.putStatus = 'error';
                $log.info(err_msg);
	        });
    };
    this.getPubPref();

}]);

