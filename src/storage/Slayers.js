import Slayer from 'Slayer.js'

export default class Slayers {
	constructor(api) {
		zombie = new Slayer('zombie', api.slayer_bosses.zombie.xp)
		spider = new Slayer('spider', api.slayer_bosses.spider.xp)
		wolf = new Slayer('wolf', api.slayer_bosses.wolf.xp)
		enderman = new Slayer('enderman', api.slayer_bosses.enderman.xp)
		blaze = new Slayer('blaze', api.slayer_bosses.blaze.xp)
	}

	zombie; spider; wolf; enderman; blaze;
}
