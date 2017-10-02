//this file to define the persistent object prototypes

//global game model
function hivemind() {
   this.name = 'Hivemind';
   this.isPaused = false;
   this.season = 'Spring';
   this.seasonProgress = 0;
}
//convert game proto to obj
$game = new hivemind();

//global hive model
function hiveModel() {
   //variables
   this.name = 'Hive';
   this.cost = 10000;
   this.population = 0;
   this.populationMax = 100;
   this.honey = 750;
   this.territory = 0;
   this.health = 75;
   this.maxHealth = 100;
   this.queenCount = 1;
   this.droneCount = 0;
   this.workerCount = 0;
   this.honeyWorkerCount = 0;
   this.territoryWorkerCount = 0;
   this.maintenanceWorkerCount = 0;
   this.eggCount = 15;
   this.experience = 0;
   this.experienceRequirement = 15;
   this.experiencePercentage = 0;
   this.level = 1;
   //generation rates
   this.honeyRate = 0;
   this.eggRate = 0;
   this.territoryRate = 0;
   this.healthRate = 0;
}

//convert hive proto to obj
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
   this.eggRate = 0;
   this.honeyRate = 0;
   this.territoryRate = 0;
   this.healthRate = 0;
   this.domTarget = '';
   //experience value on build
   this.experienceValue = 0;
   //available multiples to purchase
   this.availableAmounts = [1];
   //methods
}

// The Queen
$queenBee = new beeModel();
$queenBee.name = 'Queen';
$queenBee.cost = 5000;
$queenBee.DOMReference = 'queen';

// The Drone
$droneBee = new beeModel();
$droneBee.name = 'Drone';
$droneBee.cost = 250;
$droneBee.gender = 'Male';
$droneBee.eggRate = 0.1;
$droneBee.DOMReference = 'drone';
$droneBee.experienceValue = 5;
$droneBee.availableAmounts = [1, 5];

// The Basic Worker - alternates between each of the possible worker jobs - honey, territory, health.
$workerBee = new beeModel();
$workerBee.name = 'Worker';
$workerBee.cost = 50;
$workerBee.healthRate = 0.09;
$workerBee.honeyRate = 0.5;
$workerBee.territoryRate = 0.12;
$workerBee.DOMReference = 'worker';
$workerBee.experienceValue = 1;
$workerBee.availableAmounts = [1, 5, 10];

// The Honey Specialist Worker - Gathers Hive Honey Faster
var   $honeyWorkerBee = Object.create($workerBee);
      $honeyWorkerBee.workerMultiplier = 3;
      $honeyWorkerBee.name = 'Honey Worker';
      $honeyWorkerBee.cost = ($workerBee.cost * $honeyWorkerBee.workerMultiplier);
      $honeyWorkerBee.healthRate = 0;
      $honeyWorkerBee.honeyRate = ($workerBee.honeyRate * $honeyWorkerBee.workerMultiplier);
      $honeyWorkerBee.territoryRate = 0;
      $honeyWorkerBee.DOMReference = 'honeyWorker';
      $honeyWorkerBee.experienceValue = ($workerBee.experienceValue * $honeyWorkerBee.workerMultiplier);
      $honeyWorkerBee.availableAmounts = [1, 5, 10];

// The Territory Specialist Worker - Gathers Hive Health Faster
var   $territoryWorkerBee = Object.create($workerBee);
      $territoryWorkerBee.workerMultiplier = 5;
      $territoryWorkerBee.name = 'Territory Worker';
      $territoryWorkerBee.cost = ($workerBee.cost * $territoryWorkerBee.workerMultiplier);
      $territoryWorkerBee.healthRate = 0;
      $territoryWorkerBee.honeyRate = 0;
      $territoryWorkerBee.territoryRate = ($workerBee.territoryRate * $territoryWorkerBee.workerMultiplier);
      $territoryWorkerBee.DOMReference = 'territoryWorker';
      $territoryWorkerBee.experienceValue = ($workerBee.experienceValue * $territoryWorkerBee.workerMultiplier);
      $territoryWorkerBee.availableAmounts = [1, 5, 10];

// The Maintenance Specialist Worker - Gathers Hive Territory Faster
var   $maintenanceWorkerBee = Object.create($workerBee);
      $maintenanceWorkerBee.workerMultiplier = 10;
      $maintenanceWorkerBee.name = 'Maintenance Worker';
      $maintenanceWorkerBee.cost = ($workerBee.cost * $maintenanceWorkerBee.workerMultiplier);
      $maintenanceWorkerBee.healthRate = ($workerBee.healthRate * $maintenanceWorkerBee.workerMultiplier);
      $maintenanceWorkerBee.honeyRate = 0;
      $maintenanceWorkerBee.territoryRate = 0;
      $maintenanceWorkerBee.DOMReference = 'maintenanceWorker';
      $maintenanceWorkerBee.experienceValue = ($workerBee.experienceValue * $maintenanceWorkerBee.workerMultiplier);
      $maintenanceWorkerBee.availableAmounts = [1, 5, 10];
