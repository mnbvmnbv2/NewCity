//-----------regions-----------
const regionJoinChance = 0.92;
const regionJoinMinimum = 0.44;

//---------MAPSIZE---------------

let boxSize = 20;
let mapWidth = 85;
let mapHeight = 37;

if (screen.width >= 1850) {
	boxSize = 20;
	mapWidth = 96;
	mapHeight = 43;
} else {
	boxSize = 20;
	mapWidth = 85;
	mapHeight = 37;
}

//--------------MAPMAKER------------------------

const maxHeight = 20;
const minHeight = -20;
const heightRange = maxHeight - minHeight;
const newHeightRange = 12; // 10 => (-5) - 5
const heightToOver = 7;

//----------------wind----------------------

const windChance = 0.92;
let currentDir = 'west';

//-------------CLIMATECONFIG------------

const climateVariation = 2;
const topClimate = -10;
const heigthClimateValue = 1 / 3;
const minClimate = topClimate - Math.floor(maxHeight * heigthClimateValue) - climateVariation;
const maxClimate = mapHeight + topClimate + climateVariation;
const seaClimate = -2;

//------------TEMPERATURE----------------

const temperatureChange = 3;
const minTemperature = minClimate - temperatureChange;
const maxTemperature = maxClimate + temperatureChange;

//-------------WEATHER-------------------

const Weather = {
	fair   : { chance: 10 },
	sunny  : { chance: 5 },
	cloudy : { chance: 5 },
	windy  : { chance: 3 },
	storm  : { chance: 1 },
	hurric : { chance: 0.5 }
};

//-------------RESOURCES----------------------

const Resources = {
	sea  : {
		fish   : { chance: 10 },
		whale  : { chance: 2 },
		sharks : { chance: 0.5 }
	},

	land : {
		gold   : { chance: 0.1 },
		iron   : { chance: 0.5 },
		copper : { chance: 0.3 },
		cattle : { chance: 2 },
		wheat  : { chance: 3 }
	}
};

//const mapTypeChances = [ 1, 2 ];
// const mapTotalChance = mapTypeChances.reduce();
