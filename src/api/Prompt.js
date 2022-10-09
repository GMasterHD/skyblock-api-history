import API from "../API.js";
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalk from 'chalk'

import Data from "./Data.js";
import Utils from "./Utils.js";

export default {
	addUser: addUser,
	removeUser: removeUser
}

async function addUser() {
	var done = false

	while (!done) {
		const { name, key } = await inquirer.prompt([
			{
				name: 'name',
				type: 'input',
				message: 'Enter your username:'
			},
			{
				name: 'key',
				type: 'input',
				message: 'Enter your api key:'
			}
		])

		console.log(chalk.gray('Checking if API Key is valid...'))
		if (await Utils.checkAPIKey(key)) {
			done = true

			const { uuid, displayName } = await Utils.getMinecraftData(name)
			const { profiles } = await API.get(`https://api.hypixel.net/skyblock/profiles?uuid=${uuid}&key=${key}`)

			const prs = []
			profiles.forEach(p => {
				prs[p.cute_name] = p.profile_id
			})

			const { profile } = await inquirer.prompt({
				name: 'profile',
				type: 'checkbox',
				choices: Object.keys(prs),
				message: 'Choose your profiles, you want to track:'
			})

			const ids = []
			profile.forEach(p => {
				ids.push(prs[p])
			})

			Data.addUser(name, uuid, displayName, ids, key)
		} else {
			console.log(chalk.red('API Key is not valid!'))
		}
	}
}
async function removeUser() {
	const cfg = Data.getConfig()
	const names = []
	Object.keys(cfg.users).forEach(u => {
		names.push(cfg.users[u].displayName)
	})

	const { user } = await inquirer.prompt({
		name: 'user',
		type: 'list',
		choices: names,
		message: 'Choose a user to remove:'
	})

	Data.removeUser(user.toLowerCase())
}
