import API from "../API.js"
import Data from "./Data.js"

export default {
	checkAPIKey: checkAPIKey,
	getMinecraftData: getMinecraftData,
	getSkyblockProfiles: getSkyblockProfiles
}

async function checkAPIKey(key) {
	const { success } = await API.get(`https://api.hypixel.net/key?key=${key}`)
	return success
}
async function getMinecraftData(uname) {
	const { id, name } = await API.get(`https://api.mojang.com/users/profiles/minecraft/${uname}`)
	return { uuid: id, displayName: name }
}
async function getSkyblockProfiles(uuid) {
	return new Promise(async (resolve, reject) => {
		const cfg = Data.getConfig()
		const out = {}

		const { hypixelKey, profiles } = cfg.users[uuid]

		console.log({ uuid, hypixelKey })
		const data = await API.get(`https://api.hypixel.net/skyblock/profiles?key=${hypixelKey}&uuid=${uuid}`)

		data.profiles.forEach(async (d, i, a) => {
			if (profiles.includes(d.profile_id)) {
				const d2 = await API.get(`https://api.hypixel.net/skyblock/profile?key=${hypixelKey}&uuid=${uuid}&profile=${d.profile_id}`)

				out[d.profile_id] = d2.profile.members[uuid]
			}

			if (i == a.length - 1) {
				resolve(out)
			}
		})
	})
}
