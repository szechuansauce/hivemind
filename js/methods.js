$( document ).ready(function() {

   //------------------------------------------utility functions
   //update the counters
   function updateBeeCounters() {
      var $queenCount = $('#queenCount .count'),
          $droneCount = $('#droneCount .count'),
          $workerCount = $('#workerCount .count'),
          $honeyCount = $('#honeyCount .count'),
          $territoryCount = $('#territoryCount .count'),
          $healthCount = $('#healthCount .count')
      //methods
      $queenCount.html();
      $droneCount.html();
      $workerCount.html();
      $honeyCount.html($hive.honey);
      $territoryCount.html($hive.territory);
      $healthCount.html($hive.health);
   }

   //update the hive's finances - function for each type then called together
   //multiplier = factor based upon number of workers currently influencing the type
   function updateHoney(mult) {
      $hive.honey += mult;
   }
   function updateTerritory(mult) {
      $hive.territory += mult;
   }
   function updateHealth(mult) {
      $hive.health += mult;
   }
   function updateAllFinances() {
      updateHoney(100);
      updateTerritory(10);
      updateHealth(5);
   }


   //the update master method
   setInterval(function() {
      console.log('Updated.');
      //update the counters
      updateBeeCounters();
      updateAllFinances();
   }, 1000);

});
