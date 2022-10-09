import https from 'https'
import chalk from 'chalk'

export default class API {
	static get(url) {
		console.log(chalk.gray(`API: ${url}`))

		return new Promise((resolve, reject) => {
			https.get(url, r => {
				let data = ''

				r.on('data', chunk => {
					data += chunk
				})

				r.on('end', () => {
					resolve(JSON.parse(data))
				})
			}).on('error', e => {
				reject(e)
			})
		})
	}
}
