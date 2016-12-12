const Promise = require('bluebird');

module.exports = promises => new Promise((resolve, reject) => {
	let errors = 0;
	const results = [];

	const fire = () => {
		if (promises.length === 0) {
			if (errors > 0) {
				return reject(results);
			}

			return resolve(results);
		}

		const next = promises.shift();

		return Promise.resolve(next)
		.then(result => {
			results.push(result);
			return fire();
		})
		.catch(err => {
			errors += 1;
			results.push(err);
			return fire();
		});
	};

	return fire();
});
