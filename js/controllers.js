var adsrApp = angular.module('adsrApp',[]);

adsrApp.controller('adsrCtrl', function($scope,$interval) {

    $scope.adsr = {};

    $scope.adsr.params = {
        delay: 1000,
        attack: 0.001,
        sustain: 3000,
        decay: 0.1
    };

    $scope.adsr.setState = function(state) {
        $scope.adsr.state = state;
        if (state == 'idle') {

        } else if (state == 'delay') {
            $scope.adsr.delayCounter = 0;
        } else if (state == 'attack') {
            $scope.adsr.attackCounter = 0;
        } else if (state == 'sustain') {
            $scope.adsr.sustainCounter = 0;
        } else if (state == 'decay') {

        }
    }

    $scope.adsr.play = function() {
        console.log('playing');
        if ($scope.adsr.updateTimer) {
            $interval.cancel($scope.adsr.updateTimer);
            $scope.adsr.updateTimer = null;
        }
        $scope.adsr.setState('delay');
        $scope.adsr.updateTimer = $interval($scope.adsr.update,30);
    };

    $scope.adsr.stop = function () {
        console.log('stopping');
        if ($scope.adsr.updateTimer) {
            $interval.cancel($scope.adsr.updateTimer);
            $scope.adsr.updateTimer = null;
        }
        $scope.adsr.reset();
    };

    $scope.adsr.calculateOutput = function () {
        var output = Math.round($scope.adsr.output);
        var redHex = ('0'+output.toString(16)).substr(-2);
        var greenHex = '04';
        var blueHex = ('0'+(255-output).toString(16)).substr(-2);
        $scope.adsr.outputColour = '#'+redHex+greenHex+blueHex;
    }


    $scope.adsr.reset = function () {
        $scope.adsr.stopping = false;
        $scope.adsr.setState('idle');
        $scope.adsr.output = 0;
        $scope.adsr.calculateOutput();
    };
    $scope.adsr.reset();

    $scope.adsr.update = function () {
        if ($scope.adsr.state == 'idle') {

        } else if ($scope.adsr.state == 'delay') {
            $scope.adsr.delayCounter += 30;
            if ($scope.adsr.delayCounter>=$scope.adsr.params.delay) {
                $scope.adsr.setState('attack');
            }
        } else if ($scope.adsr.state == 'attack') {
            $scope.adsr.attackCounter+=30;
            $scope.adsr.output += $scope.adsr.params.attack*0.25*$scope.adsr.attackCounter*30;
            if ($scope.adsr.output>=255) {
                $scope.adsr.output=255;
                $scope.adsr.setState('sustain');
            }
        } else if ($scope.adsr.state == 'sustain') {
            $scope.adsr.sustainCounter += 30;
            if ($scope.adsr.sustainCounter>=$scope.adsr.params.sustain) {
                $scope.adsr.setState('decay');
            }
        } else if ($scope.adsr.state == 'decay') {
            $scope.adsr.output -= $scope.adsr.params.decay*30;
            if ($scope.adsr.output<=0) {
                $scope.adsr.output=0;
                $scope.adsr.stop();
            }
        }
        $scope.adsr.outputStr = Math.round($scope.adsr.output);

        $scope.adsr.calculateOutput();
    }



});