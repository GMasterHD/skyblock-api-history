import fs from 'fs'
import API from '../API.js'
import Utils from './Utils.js'

export default {
	addUser: async (name, uuid, displayName, profiles, hypixelKey) => {
		name = name.toLowerCase()
		hypixelKey = hypixelKey.toLowerCase()

		if (typeof profiles === 'string') profiles = [profiles]

		const cfg = loadConfig()
		if (cfg.users == undefined) { cfg.users = {} }

		cfg.users[uuid] = {
			name,
			displayName,
			hypixelKey,
			profiles
		}
		saveConfig(cfg)
	},
	removeUser: async (name) => {
		name = name.toLowerCase()

		const cfg = loadConfig()

		const { uuid } = await Utils.getMinecraftData(name)
		delete cfg.users[uuid]

		saveConfig(cfg)
	},

	getConfig: loadConfig
}

function loadConfig() {
	return JSON.parse(fs.readFileSync('./config.json'), { encoding: 'utf-8' })
}
function saveConfig(data) {
	fs.writeFileSync('./config.json', JSON.stringify(data), { encoding: 'utf-8' })
}
