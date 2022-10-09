import API from '../API.js'

export default class Player {
	async create(name) {
		const mojang = await API.get(`https://api.mojang.com/users/profiles/minecraft/${name}`)
		this.name = name
		this.displayName = mojang.name
		this.uuid = mojang.id
	}

	displayName;
	name;
	uuid;
}
