//this file to define the persistent object prototypes

//global game model
function hivemind() {
   this.name = 'Hivemind';
   this.isPaused = false;
   this.season = 'Autumn';
   this.seasonProgress = 5;
}
//convert game proto to obj
$game = new hivemind();

//global hive model
function hiveModel() {
   //variables
   this.name = 'Hive';
   this.cost = 10000;
   this.population = 0;
   this.populationMax = 10000;
   this.honey = 750;
   this.territory = 0;
   this.health = 60;
   this.maxHealth = 100;
   this.queenCount = 1;
   this.droneCount = 0;
   this.workerCount = 0;
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
$workerBee.canAddHoney = true;
$workerBee.canAddTerritory = true;
$workerBee.canAddHealth = true;
$workerBee.healthRate = 0.15;
$workerBee.honeyRate = 0.5;
$workerBee.territoryRate = 0.15;
$workerBee.DOMReference = 'worker';
$workerBee.experienceValue = 1;
$workerBee.availableAmounts = [1, 5, 10];

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
