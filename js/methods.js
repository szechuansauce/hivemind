//this file to define and enact the methods that power the game

//hive reference
/* $hive {
   this.name = 'Hive';
   this.cost = 10000;
   this.population = 0;
   this.populationMax = 10000;
   this.honey = 1000;
   this.territory = 0;
   this.health = 0;
   this.queenCount = 0;
   this.droneCount = 0;
   this.workerCount = 0;
} */

$( document ).ready(function() {

   //take current message off-screen
   function moveMessage() {
      $('#messageTarget').addClass('hide');
   }
   //clear current message
   function clearMessage() {
      $('#messageTarget').html('');
      $('#messageTarget').removeClass('hide');
   }
   //update the game's current message
   function updateMessage(message) {
      clearMessage();
      $('#messageTarget').html(message);
      setTimeout(moveMessage, 3000);
   }
   //pause and unpause the game when clicking play/pause
   $('#pauseMe').on( "click", function() {
      pauseUnpause();
   });
   function pauseUnpause() {
      //var
      var $button = $('#pauseMe');
      $pausehtml = '<i class="fa fa-pause" aria-hidden="true"></i>';
      $playhtml = '<i class="fa fa-play" aria-hidden="true"></i>';
      //methods
      //if time paused, unpause and run timer
      if ($game.isPaused) {
         $game.isPaused = false;
         $button.html($pausehtml);
         updateMessage('Unpaused');
         masterTimer();
      //if time running, pause and don't run timer
      } else {
         $game.isPaused = true;
         updateMessage('Paused');
         $button.html($playhtml);
      }
   }
   //calculate total population of bees
   function calculateTotalPopulation() {
      $total = ($hive.queenCount + $hive.droneCount + $hive.workerCount);
      $hive.population = $total;
   }
   //update the counters (bee counts next to bee types)
   function updateBeeCounters() {
      var $queenCount = $('#queenCount .count'),
          $droneCount = $('#droneCount .count'),
          $workerCount = $('#workerCount .count'),
          $populationCount = $('#populationCount .count'),
          $seasonCount = $('#seasonCount .count'),
          $honeyCount = $('#honeyCount .count'),
          $territoryCount = $('#territoryCount .count'),
          $healthCount = $('#healthCount .count')
      //methods
      calculateTotalPopulation();
      $queenCount.html($hive.queenCount);
      $droneCount.html($hive.droneCount);
      $workerCount.html($hive.workerCount);
      $populationCount.html($hive.population);
      $honeyCount.html($hive.honey);
      $territoryCount.html($hive.territory);
      $healthCount.html($hive.health);
      $seasonCount.html($game.season);
   }
   //update the hive's finances - function for each type then called together
   //multiplier = factor based upon number of workers currently influencing the type
   function updateHoney(amount) {
      $hive.honey += amount;
   }
   function updateTerritory(amount) {
      $hive.territory += amount;
   }
   function updateHealth(amount) {
      //if health less than 100, and adding amount still less, add amount
      if (($hive.health + amount) <= 100) {
         $hive.health += amount;
      }
      //if amount will send health over 100, force to 100
      else if (($hive.health + amount) > 100) {
         $hive.health = 100;
      //shouldn't reach here, but otherwise force 100
      } else {
         $hive.health = 100;
      }
   }
   //this function used to update all finances based on bee activity per second
   function updateAllFinances() {
      $honeyRate = (($hive.workerCount) * 0.25);
      $territoryRate = (($hive.workerCount) * 0.25);
      $healthRate = (($hive.workerCount) * 0.25);
      updateHoney($honeyRate);
      updateTerritory($territoryRate);
      updateHealth($healthRate);
   }
   //create a new bee on button click. take html id as a parameter. the element should have data-beetype, data-beeamount, data-beecost attributes to use.
   function createBee(button) {
      $this = button;
      $type = $this.data('beetype');
      $amount = $this.data('beeamount');
      $cost = $this.data('beecost');
      $message = $amount + ' ' + $type + ' created.';
      if ($cost && $amount && $type) {
         if ($cost < $hive.honey) {
            //subtract cost from honey
            $hive.honey = ($hive.honey - $cost);
            //send message
            updateMessage($message);
            //check bee type and add appropriately
            if ($type = 'worker') {
               $hive.workerCount += $amount;
            } else if ($type = 'drone') {
               $hive.droneCount += $amount;
            } else if ($type = 'queen') {
               $hive.queenCount += $amount;
            }
            updateBeeCounters();
         } else {
            alert('You don\'t have enough honey!');
         }
      } else {
         alert('Data attribute missing!')
         return false;
      }
   }
   //monitor the seasons - watch and update game.season, controlled by game.seasonProgress
   function refreshSeasons() {
      //push the season progress forward
      $game.seasonProgress += 1;
      //check if season has finished (against arbitrary amount, change this to lengthen or shorten)
      if ($game.seasonProgress > 5) {
         $game.seasonProgress = 0;
         switch($game.season) {
            case 'Summer':
               $game.season = 'Autumn';
               break;
            case 'Autumn':
               $game.season = 'Winter';
               break;
            case 'Winter':
               $game.season = 'Spring';
               break;
            case 'Spring':
               $game.season = 'Summer';
               break;
         }
      }
   }


   /////////////////////////////////////////////////////////////////////////


   //------master method use starts here
   //update all counters and finances on start
   updateBeeCounters();
   updateAllFinances();
   //pause the game initially
   pauseUnpause();
   //the update master method
   setInterval(function() {
   }, 1000);
   function masterTimer(){
     //update the counters
     if ($game.isPaused) {
        console.log('Game time not flowing.');
        return false;
     } else {
        console.log('Game time flowing. Counters updated.');
        updateBeeCounters();
        updateAllFinances();
        setTimeout(masterTimer, 1000);
        refreshSeasons();
        calculateTotalPopulation();
     }
   }
   setTimeout(masterTimer, 1000);


   //create a bee on button click
   $('.actions .button').on( "click", function() {
      $this = $(this);
      createBee($this);
   });


});
