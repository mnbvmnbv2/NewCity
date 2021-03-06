class TileClass {
	constructor(map, tileNumber, y, x) {
		this.map = map;
		this.tileNumber = tileNumber;
		this.y = y;
		this.x = x;
		this.name = 'OK';

		this.height = 0;
		this.setType();
		this.landRegion;
		this.seaRegion;
		this.weather;
		this.temperature;
		this.resource;
	}
	generateLandscape() {
		this.fixHeight();
		this.setType();
		this.setClimate();
		this.setWeather();
		this.setTemperature();
		this.setResource();
	}
	aroundTiles() {
		return [ this.north(), this.west(), this.east(), this.south() ];
	}
	fixHeight() {
		if (this.x == 0 && this.y == 0) {
			this.height = 0;
		}

		//compares left
		if (this.x > 0) {
			if (this.height < this.west().height - newHeightRange) {
				this.height = this.west().height - newHeightRange;
			} else if (this.height > this.west().height + newHeightRange) {
				this.height = this.west().height + newHeightRange;
			}
		}

		//compares right
		if (this.x < mapWidth) {
			if (this.height < this.east().height - newHeightRange) {
				this.height = this.east().height - newHeightRange;
			} else if (this.height > this.east().height + newHeightRange) {
				this.height = this.east().height + newHeightRange;
			}
		}

		//compares to line over
		if (this.y > 0) {
			if (this.height < this.north().height - heightToOver) {
				this.height = this.north().height - heightToOver;
			} else if (this.height > this.north().height + heightToOver) {
				this.height = this.north().height + heightToOver;
			}
		}

		//compares to line under
		if (this.y < mapHeight) {
			if (this.height < this.south().height - heightToOver) {
				this.height = this.south().height - heightToOver;
			} else if (this.height > this.south().height + heightToOver) {
				this.height = this.south().height + heightToOver;
			}
		}

		if (this.height > maxHeight) {
			this.height = maxHeight;
		} else if (this.height < minHeight) {
			this.height = minHeight;
		}

		this.setType();
	}
	setType() {
		if (this.height == 0 || this.height == 1) {
			this.type = 'sand';
		} else if (this.height >= 15) {
			this.type = 'mountain';
		} else if (this.height >= 10) {
			this.type = 'desertDune';
		} else if (this.height >= 0) {
			this.type = 'desert';
		} else if (this.height >= -10) {
			this.type = 'coast';
		} else {
			this.type = 'sea';
		}
	}
	changeHeight() {
		if (Math.random() < 0.5) {
			if (Math.random() < 0.5) {
				this.height++;
			} else {
				this.height--;
			}
		}
		this.fixHeight();
	}
	randomHeight(min, max) {
		this.height = randInt(min, max);
		this.setType();
	}
	north() {
		try {
			return this.map.map[-this.y + this.map.centre.y - 1][this.x + this.map.centre.x];
		} catch (err) {
			return false;
		}
	}
	west() {
		try {
			return this.map.map[-this.y + this.map.centre.y][this.x + this.map.centre.x - 1];
		} catch (err) {
			return false;
		}
	}
	east() {
		try {
			return this.map.map[-this.y + this.map.centre.y][this.x + this.map.centre.x + 1];
		} catch (err) {
			return false;
		}
	}
	south() {
		try {
			return this.map.map[-this.y + this.map.centre.y + 1][this.x + this.map.centre.x];
		} catch (err) {
			return false;
		}
	}
	setClimate() {
		if (this.height >= 0) {
			this.climate =
				Math.floor(this.y - this.height * heigthClimateValue + topClimate) +
				randInt(-climateVariation, climateVariation);
		} else {
			this.climate = Math.floor(this.y + topClimate) + seaClimate + randInt(-climateVariation, climateVariation);
		}
	}
	setWeather() {
		this.weather = this.pickInDatabase(Weather)[0];
	}
	setTemperature() {
		this.temperature = this.climate + randInt(-temperatureChange, temperatureChange);
	}
	changeTemperature() {
		this.temperature += randInt(-1, 1);
		if (this.temperature > this.climate + temperatureChange) {
			this.temperature = this.climate + temperatureChange;
		} else if (this.temperature < this.climate - temperatureChange) {
			this.temperature = this.climate - temperatureChange;
		}
	}
	wind(dir) {
		if (Math.random() < windChance) {
			try {
				this[dir]().weather = this.weather;
				this.setWeather();
			} catch (err) {}
		}
	}
	setRegion(regionType) {
		try {
			if (this[regionType] == undefined) {
				if (regionType == 'seaRegion' && this.height >= 0) {
					this[regionType] = 0;
					return true;
				} else if (regionType == 'landRegion' && this.height < 0) {
					this[regionType] = 0;
					return true;
				}

				/*
				//tests if the tiles around has a region in a random order
				let aroundTiles = [ this.north(), this.west(), this.east(), this.south() ];
				shuffle(aroundTiles);
				aroundTiles.forEach((element) => this.checkRegionTo(element, regionType));

				//if this tile did not get a region, then it creates a new one
				if (this[regionType] == undefined) {
					if (this.map[regionType] == undefined) {
						this.map[regionType] = [];
					}

					//makes a new array for the tiles of the new region
					this.map[regionType].push([]);
					//sets the tile region as the new one
					this[regionType] = this.map[regionType].length;
					//the tile gets added to the region array
					this.map[regionType][this[regionType] - 1].push(this);
				}
				//makes the tiles around do the regionCheck
				aroundTiles.forEach((element) => element.setRegion(regionType));
				*/

				if (this[regionType] == undefined) {
					if (this.map[regionType] == undefined) {
						this.map[regionType] = [];
					}

					//makes a new array for the tiles of the new region
					this.map[regionType].push([]);
					//sets the tile region as the new one
					this[regionType] = this.map[regionType].length;
					//the tile gets added to the region array
					this.map[regionType][this[regionType] - 1].push(this);
				}

				return true;
			}
			return false;
		} catch (err) {}
	}
	joinRegion(regionType, regionNumber) {
		if (this[regionType] == undefined) {
			this[regionType] = regionNumber;
			return true;
		}
		return false;
	}

	setRegionTo(tile, regionType) {
		try {
			tile[regionType] = this[regionType];
		} catch (err) {}
	}
	checkRegionTo(tile, regionType) {
		try {
			//if tile has region
			if (tile[regionType] != 0 && tile[regionType] != undefined) {
				//chance for this to join its region
				if (
					Math.random() <
					regionJoinChance + (regionJoinMinimum - this.map[regionType][tile[regionType] - 1].length / 10)
				) {
					//this gets its region
					this[regionType] = tile[regionType];
					//join the region array
					this.map[regionType][tile[regionType] - 1].push(this);
				}
			}
		} catch (err) {}
	}
	toString() {
		return `Name : ${this.name}
		Heigth: ${this.height}
		x : ${this.x}
		y : ${this.y}
		Region : ${this.region}
		Mean-temp : ${this.climate}
		Temperature : ${this.temperature}
		Weather : ${this.weather}
		Resource : ${this.resource}`;
	}
	setResource() {
		if (this.height >= 0) {
			this.resource = this.pickInDatabase(Resources.land)[0];
		} else {
			this.resource = this.pickInDatabase(Resources.sea)[0];
		}
	}
	pickInDatabase(database) {
		let totalChance = 0;
		for (let name in database) {
			totalChance += database[name].chance;
		}

		let chance = Math.random() * totalChance;
		let toNow = 0;
		for (let name in database) {
			if (chance < database[name].chance + toNow) {
				return [ name, database[name] ];
			} else {
				toNow += database[name].chance;
			}
		}
	}
}
