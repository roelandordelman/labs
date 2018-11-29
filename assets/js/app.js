var benglabs = angular.module('benglabs', ['beng.kit.filters']);

benglabs.run(function($rootScope) {

    var urlParts = window.location.pathname.split('/');
    var page = urlParts[1] == '' ? 'home' : urlParts[1];
    var loadApplications = ['home', 'application'].indexOf(page) != -1;
    var loadDatasets = ['home', 'datasets'].indexOf(page) != -1;
    var loadApis = ['home', 'apis'].indexOf(page) != -1;
    var loadProjects = ['home', 'project'].indexOf(page) != -1;

    if(loadApplications) {
        $.ajax({
            dataType: "json",
            url: '../../static/resources/applications.json',
            success: function(json) {
                if(page == 'application') {
                    $rootScope.application = urlParts[2];
                }
                $rootScope.$broadcast('applications', json.applications);
            },
            error: function(err) {
                console.debug(err);
            }
        });
    }

    if(loadDatasets) {
        $.ajax({
            dataType: "json",
            url: '../../static/resources/datasets.json',
            success: function(json) {
                $rootScope.$broadcast('datasets', json.datasets);
            },
            error: function(err) {
                console.debug(err);
            }
        });
    }

    if(loadApis) {
        $.ajax({
            dataType: "json",
            url: '../../static/resources/apis.json',
            success: function(json) {
                $rootScope.$broadcast('apis', json.apis);
            },
            error: function(err) {
                console.debug(err);
            }
        });
    }

    if(loadProjects) {
        $.ajax({
            dataType: "json",
            url: '../../static/resources/projects.json',
            success: function(json) {
                if(page == 'project') {
                    $rootScope.project = urlParts[2];
                }
                $rootScope.$broadcast('projects', json.projects);
            },
            error: function(err) {
                console.debug(err);
            }
        });
    }

});