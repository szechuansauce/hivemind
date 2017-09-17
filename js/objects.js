//Set up the Hive Prototype
function hiveModel() {
   //variables
   this.name = 'Hive';
   this.cost = 10000;
   this.population = 0;
   this.honey = 1000;
   this.territory = 0;
   this.health = 0;
   this.queenCount = 0;
   this.droneCount = 0;
   this.workerCount = 0;
   //methods
   this.getHoney = function() {
      console.log(this.honey);
   };
}

//convert prototype to obj for use
$hive = new hiveModel();

//Set up the Bee Prototype
function beeModel() {
   //variables
   this.name = 'Bee';
   this.cost = 0;
   this.gender = 'Female';
   this.canAddHoney = false;
   this.canAddTerritory = false;
   this.canAddHealth = false;
   //methods
}

// The Queen
$queenBee = new beeModel();
$queenBee.name = 'Queen';
$queenBee.cost = 5000;

// The Drone
$droneBee = new beeModel();
$droneBee.name = 'Drone';
$droneBee.cost = 500;
$droneBee.gender = 'Male';

// The Basic Worker - alternates between each of the possible worker jobs - honey, territory, health.
$workerBee = new beeModel();
$workerBee.name = 'Worker';
$workerBee.cost = 5;
$workerBee.canAddHoney = true;
$workerBee.canAddTerritory = true;
$workerBee.canAddHealth = true;

// The Honey Specialist Worker - Gathers Hive Honey Faster
var $honeyWorkerBee = Object.create($workerBee);
$honeyWorkerBee.name = 'Honey Worker';
$honeyWorkerBee.cost = 50;
$honeyWorkerBee.gender = 'Female';
$honeyWorkerBee.canAddHoney = true;

// The Maintenance Specialist Worker - Gathers Hive Territory Faster
var $maintenanceWorkerBee = Object.create($workerBee);
$maintenanceWorkerBee.name = 'Territory Worker';
$maintenanceWorkerBee.cost = 50;
$maintenanceWorkerBee.gender = 'Female';
$maintenanceWorkerBee.canAddHealth = true;

// The Territory Specialist Worker - Gathers Hive Health Faster
var $territoryWorkerBee = Object.create($workerBee);
$territoryWorkerBee.name = 'Territory Worker';
$territoryWorkerBee.cost = 50;
$territoryWorkerBee.gender = 'Female';
$territoryWorkerBee.canAddTerritory = true;
