 'use strict';

function userEventsCtrl($scope, $stateParams, $translate, cdEventsService, alertService, auth) {
  auth.get_loggedin_user(function (user) {
    $scope.currentUser = user;
  });

  $scope.applyData = {};

  if($stateParams.userId){
    cdEventsService.getUserDojosEvents($stateParams.userId, function (response) {
      $scope.dojosEvents = response;
      if(_.isEmpty($scope.dojosEvents)) {
        //This user has no Events.
      } else {
        _.each($scope.dojosEvents, function (dojoEvents) {
          if(dojoEvents.events.length > 0){
            var events = [];
            _.each(dojoEvents.events, function(event){
              if(event.type === 'recurring') {
                //Recurring event
                var startDate = _.first(event.dates);
                var endDate = _.last(event.dates);
                event.formattedDate = moment(startDate).format('Do MMMM YY') + ' - ' + moment(endDate).format('Do MMMM YY, HH:mm');
                event.day = moment(startDate, 'YYYY-MM-DD HH:mm:ss').format('dddd');
              } else {
                //One-off event
                var eventDate = _.first(event.dates);
                event.formattedDate = moment(eventDate).format('Do MMMM YY, HH:mm');
              }

              var userType = event.userType;
              event.for = $translate.instant(userType);
              events.push(event);
            });

            dojoEvents.events = events;
          }
        });
      }
    }, function (err) {
      alertService.showError( $translate.instant('Error loading Events') + ' ' + err);
    })
  }

  $scope.tableRowIndexExpandedCurr = '';
  $scope.dojoRowIndexExpandedCurr = '';

  $scope.eventCollapsed = function (dojosEventsIndex, eventIdx) {
    $scope.dojosEvents[dojosEventsIndex].events[eventIdx].isCollapsed = false;
  }


  $scope.showEventInfo = function (dojoEvents, eventIdx) {
    $scope.dojosEventsIndex = _.indexOf($scope.dojosEvents, dojoEvents);
    if (typeof $scope.dojosEvents[$scope.dojosEventsIndex].events[eventIdx].isCollapsed === 'undefined') {
      $scope.eventCollapsed($scope.dojosEventsIndex, eventIdx);
    }

    if ($scope.dojosEvents[$scope.dojosEventsIndex].events[eventIdx].isCollapsed === false) {
      $scope.tableRowIndexExpandedCurr = eventIdx;
      $scope.dojoRowIndexExpandedCurr = dojoEvents;
      $scope.dojosEvents[$scope.dojosEventsIndex].events[eventIdx].isCollapsed = true;
    } else if ($scope.dojosEvents[$scope.dojosEventsIndex].events[eventIdx].isCollapsed === true) {
      $scope.dojosEvents[$scope.dojosEventsIndex].events[eventIdx].isCollapsed = false;
    }
  }

  $scope.hasEvents = function(event){
    return event.events.length > 0;
  }
}

angular.module('cpZenPlatform')
    .controller('user-events-controller', ['$scope', '$stateParams', '$translate', 'cdEventsService', 'alertService', 'auth', userEventsCtrl]);