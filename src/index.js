import got from 'got';
import * as dotenv from 'dotenv'
dotenv.config()

import https from 'https'

import figlet from 'figlet'
import gradient from 'gradient-string'
import chalk from 'chalk'
import fs from 'fs'
import inquirer from 'inquirer'

import express from 'express'
import API from './API.js';
import Player from './storage/Player.js';

import Prompt from './api/Prompt.js';
import Data from './api/Data.js';

import * as Prompts from './Prompts.js'
import Utils from './api/Utils.js';
import Skill from './storage/Skill.js';
import Skills from './storage/Skills.js';
import { resolve } from 'path';
import { timeStamp } from 'console';

update()

const FILE_TYPE_PLAYER = 0
const FILE_TYPE_PROFILE = 1
const FILE_TYPE_GLOBAL = 2
async function generateFilePath(type, uuid, profileID) {
	const timestamp = Date.now()

	let file = ''
	if (type == FILE_TYPE_PLAYER) {
		file = `./data/players/${profileID}/${uuid}/${timestamp}.json`
	} else if (type == FILE_TYPE_PROFILE) {
		file = `./data/profiles/${profileID}/${timestamp}.json`
	} else if (type == FILE_TYPE_GLOBAL) {
		file = `./data/global/${timestamp}.json`
	}
	return file
}

async function setup() {
	const { main } = await inquirer.prompt({
		name: 'main',
		type: 'list',
		message: 'Choose an option:',
		choices: Object.keys(Prompts.MAIN_MENU_PROMPTS)
	})

	switch (Prompts.MAIN_MENU_PROMPTS[main]) {
		case Prompts.MAIN_MENU_ADD_USER: {
			await Prompt.addUser()
			break
		}
		case Prompts.MAIN_MENU_REMOVE_USER: {
			await Prompt.removeUser()
		}
	}
}

const titleCase = (s) =>
	s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())

async function update() {
	console.log(gradient.pastel.multiline(figlet.textSync('EC   API', {
		font: 'doom'
	})))

	console.log(chalk.gray('Loading config...'))
	await updatePlayers()
	await updateProfiles()
	await updateGlobals()
}

async function updatePlayers() {
	return new Promise(async (resolve, reject) => {
		const cfg = Data.getConfig()

		console.log(chalk.gray('Updating per player stats...'))
		Object.keys(cfg.users).forEach(async uuid => {
			const { hypixelKey, name, displayName, profiles } = cfg.users[uuid]

			console.log(chalk.gray('Fetching data for'), `${chalk.cyan(displayName)}${chalk.gray('...')}`)
			const prs = await Utils.getSkyblockProfiles(uuid)

			Object.keys(prs).forEach(async pID => {
				const p = prs[pID]

				const skills = new Skills(p)
				skills.print()

				const purse = Math.floor(p.coin_purse)

				const totalKills = p.stats.kills
				const totalDeaths = p.stats.deaths

				const kills = {}
				Object.keys(p.stats).forEach(k => {
					if (k.includes('kills_')) {
						kills[k.substring(6)] = p.stats[k]
					}
				})

				const mithrilPowder = p.mining_core.powder_mithril_total
				const gemstonePowder = p.mining_core.powder_gemstone_total

				const wither = p.essence_wither
				const undead = p.essence_undead
				const dragon = p.essence_dragon
				const gold = p.essence_gold
				const spider = p.essence_spider
				const ice = p.essence_ice
				const diamond = p.essence_diamond

				const data = {
					skills,
					purse,
					kills,
					totalKills,
					totalDeaths,
					mining: {
						gemstonePowder,
						mithrilPowder
					},
					essences: {
						wither,
						undead,
						dragon,
						spider,
						diamond,
						gold,
						ice
					}
				}

				const file = await generateFilePath(FILE_TYPE_PLAYER, uuid, pID)
				const path = file.substring(0, file.lastIndexOf('/'))

				console.log(path)
				if (!fs.existsSync(path)) {
					fs.mkdirSync(path, { recursive: true })
				}
				fs.writeFileSync(file, JSON.stringify(data), { encoding: 'utf-8' })
			})
		})

		resolve()
	})
}
async function updateProfiles() {
	return new Promise(async (resolve, reject) => {
		const cfg = Data.getConfig()

		console.log(chalk.gray('Updating per profile stats...'))

		const profileIDs = []
		const playersForProfiles = {}
		Object.keys(cfg.users).forEach(k => {
			cfg.users[k].profiles.forEach(id => {
				if (!profileIDs.includes(id)) profileIDs.push(id)
				playersForProfiles[id] = k
			})
		})

		profileIDs.forEach(async pID => {
			const uuid = playersForProfiles[pID]
			const { hypixelKey } = cfg.users[uuid]

			console.log(chalk.gray('Fetching data for profile'), chalk.cyan(pID), chalk.gray('using'), `${chalk.cyan(uuid)}${chalk.gray('...')}`)
			const pr = await API.get(`https://api.hypixel.net/skyblock/profile?key=${hypixelKey}&profile=${pID}`)
			const p = pr.profile.members[uuid]

			const data = {
				collections: p.collection
			}

			const file = await generateFilePath(FILE_TYPE_PROFILE, uuid, pID)
			const path = file.substring(0, file.lastIndexOf('/'))
			console.log(data)

			if (!fs.existsSync(path)) {
				fs.mkdirSync(path, { recursive: true })
			}
			fs.writeFileSync(file, JSON.stringify(data), { encoding: 'utf-8' })
		})

		resolve()
	})
}
async function updateGlobals() {
	return new Promise(async (resolve, reject) => {
		const cfg = Data.getConfig()

		console.log(chalk.gray('Updating global stats...'))

		resolve()
	})
}
