import chalk from 'chalk'

export default class Slayer {
	constructor(name, xp, kills) {
		if (xp == undefined) xp = 0

		if (kills)

			xp = Math.floor(xp)

		this.xp = xp
		this.name = name

		if (this.xp < Slayer.xpTable[name][9]) {
			for (var l = 1; l < 61; ++l) {
				if (Slayer.xpTable[name][l] > this.xp) {
					this.#level = l - 1
					break
				}
			}

			this.#xpToNext = Slayer.xpTable[name][this.#level + 1] - this.xp
			this.#currentLevelXP = this.xp - Slayer.xpTable[name][this.#level]
		} else {
			this.#xpToNext = 0
			this.#currentLevelXP = 0
			this.#level = 60
		}
	}

	print() {
		console.log(chalk.cyan(this.name), chalk.cyanBright(this.#level), chalk.gray('on'), chalk.green(this.xp), `${chalk.gray('(')}${chalk.green(this.#currentLevelXP)}${chalk.gray(' / ')}${chalk.blueBright(this.#xpToNext + this.#currentLevelXP)}${chalk.gray(')')}`)
	}

	getXP() { return this.xp }
	getName() { return this.name }
	getXPToNext() { return this.#xpToNext }
	getCurrentLevelXP() { return this.#currentLevelXP }
	getLevel() { return this.#level }

	xp;
	name;
	#level;
	#xpToNext;
	#currentLevelXP;

	static xpTable = {
		zombie: { 1: 5, 2: 15, 3: 200, 4: 1000, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000 },
		spider: { 1: 5, 2: 25, 3: 200, 4: 1000, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000 },
		wolf: { 1: 10, 2: 30, 3: 250, 4: 1500, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000 },
		enderman: { 1: 10, 2: 30, 3: 250, 4: 1500, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000 },
		blaze: { 1: 10, 2: 30, 3: 250, 4: 1500, 5: 5000, 6: 20000, 7: 100000, 8: 400000, 9: 1000000 }
	}
}
