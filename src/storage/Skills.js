import Skill from "./Skill.js";

export default class Skills {
	constructor(api) {
		this.combat = new Skill('Combat', api.experience_skill_combat)
		this.fishing = new Skill('Fishing', api.experience_skill_fishing)
		this.farming = new Skill('Farming', api.experience_skill_farming)
		this.foraging = new Skill('Foraging', api.experience_skill_foraging)
		this.mining = new Skill('Mining', api.experience_skill_mining)
		this.taming = new Skill('Taming', api.experience_skill_taming)
		this.enchanting = new Skill('Enchanting', api.experience_skill_enchanting)
		this.alchemy = new Skill('Alchemy', api.experience_skill_alchemy)
		this.catacombs = new Skill('Catacombs', api.dungeons.dungeon_types.catacombs.experience)
	}

	print() {
		this.combat.print()
		this.fishing.print()
		this.farming.print()
		this.foraging.print()
		this.mining.print()
		this.taming.print()
		this.enchanting.print()
		this.alchemy.print()
	}

	combat; fishing; farming; foraging; mining; taming; enchanting; alchemy; catacombs;
}
