$( document ).ready(function() {

   //send each bee's data to the DOM
   //takes input of a bee object, maps to the appropriate data-ids on a dom element
   function mapBeeDataToDOM(bee) {
      var $DOMTarget = $('#' + (bee.DOMReference) + 'Button');
      var $availableAmounts = $(bee.availableAmounts);
      $singleCost = bee.cost;
      //add a button for each available purchase amount
      $availableAmounts.each(function(index, value) {
         $totalCost =  (value * $singleCost);
         $exp = (value * bee.experienceValue);
         var $buttonMarkup = '<div class="button" data-beetype="' + bee.DOMReference + '" data-beeamount="' + value +'" data-beecost="' + $totalCost + '" data-exp="' + $exp + '"><i class="fa fa-plus" aria-hidden="true"></i>' + ' ' + value + '<span class="bee-cost">(' + $totalCost + ')</span></div>';
         $DOMTarget.append($buttonMarkup);
      });
   }
   mapBeeDataToDOM($queenBee);
   mapBeeDataToDOM($droneBee);
   mapBeeDataToDOM($workerBee);
   //clear buttons from a bee
   function clearBeeDataFromDOM(bee) {
      var $DOMTarget = $('#' + (bee.DOMReference) + 'Button');
      $DOMTarget.html('');
   }

   //update the game's current message (chains to existing, reverse of chrome console)
   var $lastMessage,
       $repeatCount = 0;
   function updateMessage(message) {
      var $previous = $('.message span').first(),
          $messageWrapper = $('.message');
      if ($messageWrapper.hasClass('empty')) {
         $messageWrapper.removeClass('empty');
         $lastMessage = (message + '');
         $repeatCount = 0;
         $('.message').prepend('<span>' + message + '</span>');
      }
      else if (message == $lastMessage) {
         $previous.children().remove();
         $repeatCount += 1;
         $previous.append('<div class="repeated">' + ' ' + '[' + $repeatCount + ']' + '</div>');
         $lastMessage = message;
      } else {
         $repeatCount = 0;
         $lastMessage = (message + '');
         $('.message').prepend('<span>' + message + '</span>');
      } return false;
   }
   //pause and unpause the game when clicking play/pause
   $('#pauseMe').on( "click", function() {
      pauseUnpause();
   });
   function pauseUnpause() {
      //var
      var $button = $('#pauseMe');
      disablePauseButton();
      setTimeout(enablePauseButton, 1001);
      //methods
      //if time paused, unpause and run timer
      if ($game.isPaused) {
         $game.isPaused = false;
         updateMessage('Unpaused');
         masterTimer();
         slowMasterTimer();
         $('body').removeClass('paused');
         setSeasonToBody();
         setTimeout(pauseButton_pauseHTML, 1000);
      //if time running, pause and don't run timer
      } else {
         $game.isPaused = true;
         updateMessage('Paused');
         $('body').addClass('paused');
         setTimeout(pauseButton_playHTML, 1000);
      }
   }
   //function to disable the pause button while changes are made
   function disablePauseButton() {
      var $button = $('#pauseMe');
      $button.addClass('disabled');
   }
   function enablePauseButton() {
      var $button = $('#pauseMe');
      $button.removeClass('disabled');
   }
   function pauseButton_pauseHTML() {
      var $button = $('#pauseMe'),
      $pausehtml = '<i class="fa fa-pause" aria-hidden="true"></i>';
      $button.html($pausehtml);
   }
   function pauseButton_playHTML() {
      var $button = $('#pauseMe'),
      $playhtml = '<i class="fa fa-play" aria-hidden="true"></i>';
      $button.html($playhtml);
   }
   //calculate total population of bees
   function calculateTotalPopulation() {
      $total = ($hive.queenCount + $hive.droneCount + $hive.workerCount + $hive.honeyWorkerCount + $hive.territoryWorkerCount + $hive.maintenanceWorkerCount);
      $hive.population = $total;
   }
   //utility function to round down to nearest whole number
   function roundDown(number) {
      return Math.floor(number);
   }
   function roundToFirstDecimalPlace(number) {
      var $number = (number * 10);
      Math.floor($number);
      $number = ($number / 10);
      return $number;
   }
   //update the counters (bee/resource counts next to bee/resource types)
   function updateBeeCounters() {
      var $queenCount = $('#queenCount .count'),
          $droneCount = $('#droneCount .count'),
          $workerCount = $('#workerCount .count'),
          $honeyWorkerCount = $('#honeyWorkerCount .count'),
          $territoryWorkerCount = $('#territoryWorkerCount .count'),
          $maintenanceWorkerCount = $('#maintenanceWorkerCount .count'),
          $eggCount = $('#eggCount .count'),
          $populationCount = $('#populationCount .count'),
          $seasonCount = $('#seasonCount .count'),
          $honeyCount = $('#honeyCount .count'),
          $territoryCount = $('#territoryCount .count'),
          $healthCount = $('#healthCount .count'),
          $experienceCount = $('#experienceCount .count'),
          $levelCount = $('#levelCount .count')
      //methods
      calculateTotalPopulation();
      $queenCount.html(roundDown($hive.queenCount));
      $droneCount.html(roundDown($hive.droneCount));
      $workerCount.html(roundDown($hive.workerCount));
      $honeyWorkerCount.html(roundDown($hive.honeyWorkerCount));
      $territoryWorkerCount.html(roundDown($hive.territoryWorkerCount));
      $maintenanceWorkerCount.html(roundDown($hive.maintenanceWorkerCount));
      $eggCount.html(roundDown($hive.eggCount) + ' (+' + roundToFirstDecimalPlace($hive.eggRate) + ')');
      $populationCount.html(roundDown($hive.population) + '/' + $hive.populationMax);
      $honeyCount.html(roundDown($hive.honey) + ' (+' + roundToFirstDecimalPlace($hive.honeyRate) + ')');
      $territoryCount.html(roundDown($hive.territory) + ' (+' + roundToFirstDecimalPlace($hive.territoryRate) + ')');
      $healthCount.html(roundDown($hive.health) + '% (+' + roundToFirstDecimalPlace($hive.healthRate) + '%)');
      $seasonCount.html($game.season);
      $levelCount.html(roundDown($hive.level));
   }
   //check hive exp progress, level the hive up if required and reset progress to 0
   function checkHiveExp() {
      var $exp = $hive.experience,
      $expReq = $hive.experienceRequirement;
      if ($exp >= $expReq) {
         $hive.level += 1;
         $hive.experience = 0;
         $hive.experienceRequirement = ($expReq * 1.95);
         updateMessage('Your hive has hit level ' + $hive.level + '!');
         if (($hive.level == 10) && ($hive.hasUnlockedSpecialists == false)) {
            $hive.honeyWorkerCount = roundDown($hive.workerCount / $honeyWorkerBee.workerMultiplier);
            $hive.territoryWorkerCount = roundDown($hive.workerCount / $territoryWorkerBee.workerMultiplier);
            $hive.maintenanceWorkerCount = roundDown($hive.workerCount / $maintenanceWorkerBee.workerMultiplier);
            $('#workerCount').remove();
            mapBeeDataToDOM($honeyWorkerBee);
            mapBeeDataToDOM($maintenanceWorkerBee);
            mapBeeDataToDOM($territoryWorkerBee);
            $hive.workerCount = 0;
            $hive.hasUnlockedSpecialists = true;
            updateMessage('You\'ve unlocked specialist Workers! Your existing Workers have been converted. Good luck!')
         }
      }
   }
   checkHiveExp();
   //util function to add experience for any rate addition - takes amount and cuts it down
   function addExperience(source, multiplier) {
      if (multiplier) {
         var $expValue = ((source / 10) * multiplier);
         $hive.experience += $expValue;
      } else {
         var $expValue = (source / 10);
         $hive.experience += $expValue;
      }
   }
   //update the hive's finances - function for each type then called together
   //multiplier = factor based upon number of workers currently influencing the type
   function updateHoney(amount) {
      $hive.honey += amount;
      addExperience(amount);
   }
   function updateTerritory(amount) {
      $hive.territory += amount;
      addExperience(amount);
   }
   function updateHealth(amount) {
      //if health less than 100, and adding amount still less, add amount
      if (($hive.health + amount) <= 100) {
         $hive.health += amount;
         addExperience(amount);
      }
      //if amount will send health over 100, force to 100
      else if (($hive.health + amount) > 100) {
         $hive.health = 100;
      }
      //if going below 0, the hive has died.
      else if (($hive.health + amount) <= 0) {
         alert('your hive has died.')
      }
   }
   function updateEggs(amount) {
      $hive.eggCount += amount;
      addExperience(amount, 5);
   }
   function updatePopulationMax() {
      $popMax = ($hive.level * 3) + ($hive.territory * 0.1);
      if ($popMax < 100) {
         $popMax = 100;
      }
      $hive.populationMax = Math.floor($popMax);
   }
   //this function used to update all finances based on bee activity per second
   function updateAllFinances() {
      var $levelDifficultyMultiplier = (Math.abs(($hive.level / 3) - 100) / 100);
      $hive.healthRate = ((($hive.workerCount * $workerBee.healthRate) + ($hive.maintenanceWorkerCount * $maintenanceWorkerBee.healthRate)) / 10);
      //stuff affected by winter
      if ($game.season == 'Winter') {
         $hive.healthRate -= ((($hive.level * 0.25) * $levelDifficultyMultiplier) / 5);
      }
      else {
         $hive.healthRate = ($hive.healthRate * $levelDifficultyMultiplier);
      };
      $hive.honeyRate = ($hive.workerCount * $workerBee.honeyRate) + ($hive.honeyWorkerCount * $honeyWorkerBee.honeyRate);
      $hive.territoryRate = ($hive.workerCount * $workerBee.territoryRate) + ($hive.territoryWorkerCount * $territoryWorkerBee.territoryRate);
      $hive.eggRate = ($hive.droneCount * $droneBee.eggRate);
      updateHoney($hive.honeyRate);
      updateTerritory($hive.territoryRate);
      updateHealth($hive.healthRate);
      updateEggs($hive.eggRate);
      updatePopulationMax();
   }
   //create a new bee on button click. take html id as a parameter. the element should have data-beetype, data-beeamount, data-beecost attributes to use.
   function createBee(button) {
      $this = button;
      $type = $this.data('beetype');
      $amount = $this.data('beeamount');
      $cost = $this.data('beecost');
      $counter = $this.closest('.count-wrapper').find('.name');
      $message = $amount + ' ' + $type + ' created.';
      if ($cost && $amount && $type) {
         if ($hive.eggCount >= $amount) {
            if (($hive.population + $amount) < $hive.populationMax) {
               if ($cost < $hive.honey) {
                  //subtract cost from honey
                  $hive.honey = ($hive.honey - $cost);
                  $hive.experience += $this.data('exp');
                  //apply eye candy
                  applyCandy($this, 'good');
                  applyCandy($counter, 'good');
                  console.log($counter);
                  //check bee type and add appropriately
                  if ($type == 'worker') {
                     $hive.workerCount += $amount;
                  } else if ($type == 'honeyWorker') {
                     $hive.honeyWorkerCount += $amount;
                  } else if ($type == 'territoryWorker') {
                     $hive.territoryWorkerCount += $amount;
                  } else if ($type == 'maintenanceWorker') {
                     $hive.maintenanceWorkerCount += $amount;
                  } else if ($type == 'drone') {
                     $hive.droneCount += $amount;
                  } else if ($type == 'queen') {
                     $hive.queenCount += $amount;
                  } else {return false;}
                  //send message informing of successful creation
                  updateMessage($message);
                  //spend an egg
                  $hive.eggCount -= $amount;
                  updateBeeCounters();
               } else {
                  updateMessage('Not enough honey!');
               }
            } else {
               updateMessage('Your hive is too full!');
            }
         } else {
            updateMessage('Not enough eggs!');
         }
      } else {
         updateMessage('Button data attribute(s) missing! Someone done goofed.')
         return false;
      }
   }

   //compare a progress to a max, calc the percentage progress, add max-width to bar
   var $experienceBarInner = $('#experienceCount .progress-bar-inner');
   var $healthBarInner = $('#healthCount .progress-bar-inner');
   var $populationBarInner = $('#populationCount .progress-bar-inner');
   function generatePercentage(progress, maximum, target) {
      var $percentage = ((progress / maximum) * 100);
      var $percentageString = ($percentage + '%');
      //target.css('max-width', '50%');
      target.css('max-width', $percentageString);
   }
   function generateAllPercentages() {
      generatePercentage($hive.experience, $hive.experienceRequirement, $experienceBarInner);
      generatePercentage($hive.health, $hive.maxHealth, $healthBarInner);
      generatePercentage($hive.population, $hive.populationMax, $populationBarInner);
   }
   generateAllPercentages();

   //monitor the seasons - watch and update game.season, controlled by game.seasonProgress
   function setSeasonToBody() {
      $season = $game.season.toLowerCase();
      $('body').addClass($season);
   }
   function refreshSeasons() {
      //push the season progress forward
      $game.seasonProgress += 1;
      //check if season has finished (against arbitrary amount, change this to lengthen or shorten)
      if ($game.seasonProgress > 45) {
         $game.seasonProgress = 1;
         $body = $('body');
         switch($game.season) {
            case 'Summer':
               $game.season = 'Autumn';
               $body.removeClass();
               $body.addClass('autumn');
               break;
            case 'Autumn':
               updateMessage('It\'s Winter. Prepare yourself...');
               $game.season = 'Winter';
               $body.removeClass();
               $body.addClass('winter');
               break;
            case 'Winter':
               $game.season = 'Spring';
               $body.removeClass();
               $body.addClass('spring');
               break;
            case 'Spring':
               $game.season = 'Summer';
               $body.removeClass();
               $body.addClass('summer');
               break;
         }
      }
   }
   refreshSeasons();

   //if hive health gets below 50%, kill off drones first and then the workers
   function applyHealthRepurcussions() {
      if ($hive.health < 100) {
         $health = $hive.health;
         $deaths = Math.floor(((Math.abs($health - 100)) * ($hive.level * 0.5)) / 50);
         if ($hive.droneCount > Math.floor($deaths * 0.75)) {
            $hive.droneCount -= Math.floor($deaths * 0.75);
            $hive.workerCount -= Math.floor($deaths * 0.25);
         } else if ($hive.workerCount > Math.floor($deaths)) {
            $hive.droneCount = 0;
            $hive.workerCount -= Math.floor($deaths);
         } else {
            $hive.droneCount = 0;
            $hive.workerCount = 0;
         }
      } else {
         return false;
      }
   }

   //function to check a current income rate against an array of allowed bee multiples
   //if the current rate /s is higher than the highest array value, increase all values
   //if the current /s value is lower than the lowest mult, reduce all, unless the mult is one.
   function checkBeeMutiplierAmounts(rate, multArray, singleCost) {
      var   $rate = rate,
            $mults = $(multArray),
            $newMults = [],
            $singleCost = singleCost,
            $max = $mults.get(-1),
            $min = $mults.get(0);
      if ($rate > ($min * ($singleCost * 3))) {
            $mults.each(function (index, value) {
               value = (value * 2);
               $newMults.push(value);
            });
            return $newMults;
         //otherwise you must have lost a lot of bees, reduce the mults
      } else if ($min == 1) {
         return $mults;
      } else if (($rate * 1.2) < $min) {
         $mults.each(function (index, value) {
            value = (value / 2);
            $newMults.push(value);
         });
         return $newMults;
      } else {
         return $mults;
      }
   }
   //compare old mults to new mults
   //if different, refresh the dom for that bee
   function compareAvailableAmounts(oldAmounts, newAmounts, bee) {
      $old1 = $(oldAmounts).get(1);
      $new1 = $(newAmounts).get(1);
      if ($old1 == $new1) {
         return false;
      } else {
         bee.cachedAvailableAmounts = newAmounts;
         clearBeeDataFromDOM(bee);
         mapBeeDataToDOM(bee);
      }
   }
   //combine and run the above two functions against each bee type
   function checkAllBeeMutiplierAmounts() {
      if ($hive.hasUnlockedSpecialists == false) {
         //check basic worker bees
         $workerBee.availableAmounts = (checkBeeMutiplierAmounts($hive.honeyRate, $workerBee.availableAmounts, $workerBee.cost));
         compareAvailableAmounts($workerBee.cachedAvailableAmounts, $workerBee.availableAmounts, $workerBee);
      }
      //check drones
      $droneBee.availableAmounts = (checkBeeMutiplierAmounts($hive.honeyRate, $droneBee.availableAmounts, $droneBee.cost));
      compareAvailableAmounts($droneBee.cachedAvailableAmounts, $droneBee.availableAmounts, $droneBee);
      if ($hive.hasUnlockedSpecialists == true) {
         //check honey workers
         $honeyWorkerBee.availableAmounts = (checkBeeMutiplierAmounts($hive.honeyRate, $honeyWorkerBee.availableAmounts, $honeyWorkerBee.cost));
         compareAvailableAmounts($honeyWorkerBee.cachedAvailableAmounts, $honeyWorkerBee.availableAmounts, $honeyWorkerBee);
         //check maintenance workers
         $maintenanceWorkerBee.availableAmounts = (checkBeeMutiplierAmounts($hive.honeyRate, $maintenanceWorkerBee.availableAmounts, $maintenanceWorkerBee.cost));
         compareAvailableAmounts($maintenanceWorkerBee.cachedAvailableAmounts, $maintenanceWorkerBee.availableAmounts, $maintenanceWorkerBee);
         //check territory bee
         $territoryWorkerBee.availableAmounts = (checkBeeMutiplierAmounts($hive.honeyRate, $territoryWorkerBee.availableAmounts, $territoryWorkerBee.cost));
         compareAvailableAmounts($territoryWorkerBee.cachedAvailableAmounts, $territoryWorkerBee.availableAmounts, $territoryWorkerBee);
      }
   }

   //visual candy status changes
   //three parmeters - target element (id), type (good, warning, bad), and timeout
   function applyCandy(target, type, timeout=500) {
      $target = $(target);
      $target.addClass('candy');
      if (type == 'warning') {
         $target.addClass('warning');
      } else if (type == 'bad') {
         $target.addClass('bad');
      } else {
         $target.addClass('good');
      }
      setTimeout(removeCandy, timeout, $target);
   }
   function removeCandy(target) {
      $target = $(target);
      $target.removeClass('candy good bad warning');
   }

   /////////////////////////////////////////////////////////////////////////
   //------master method use starts here
   //update all counters and finances on start
   updateBeeCounters();
   updateAllFinances();
   refreshSeasons();
   //pause the game initially
   pauseUnpause();
   //the update master method
   setInterval(function() {
   }, 250);
   function masterTimer(){
     //update the counters
     if ($game.isPaused) {
        return false;
     } else {
        updateBeeCounters();
        updateAllFinances();
        setTimeout(masterTimer, 250);
        refreshSeasons();
        calculateTotalPopulation();
        checkHiveExp();
        generateAllPercentages();
        applyHealthRepurcussions();
     }
   }

   function slowMasterTimer(){
     if ($game.isPaused) {
        return false;
     } else {
        setTimeout(slowMasterTimer, 1000);
        checkAllBeeMutiplierAmounts();
     }
   }
   slowMasterTimer();

   //create a bee on button click
   $('.actions').on( "click", '.button', function() {
      $this = $(this);
      createBee($this);
   });


});
