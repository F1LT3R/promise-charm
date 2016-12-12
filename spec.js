const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const Promise = require('bluebird');
const charm = require('./index.js');

const getFile = file => new Promise((resolve, reject) => {
	fs.readFile(file, 'utf8', (err, data) => {
		if (err !== null) {
			return reject(err);
		}
		return resolve(data);
	});
});

describe('Charm can reject should reject', () => {
	it('should be able to sequentially resolve promises with errors', done => {
		let promises = [];

		for (let i = 0; i < 512; i += 1) {
			promises.push(getFile('./test1.txt'));
			promises.push(getFile('./test2.txt'));
			promises.push(getFile('./oops.txt'));
		}

		charm(promises)
		.then(results => {
			expect(false).to.equal(true);
			done();
		})
		.catch(err => {
			expect(err.length).to.equal(1536);

			for (let j = 0; j < err.length; j += 3) {
				expect(err[j + 0]).to.equal('1');
				expect(err[j + 1]).to.equal('2');
				const type  = typeof err[j + 2];
				expect(type).to.equal('object');
			}

			done();
		});
	});

	it('should be able to sequentially resolve promises without errors', done => {
		let promises = [];

		for (let i = 0; i < 1024; i += 1) {
			promises.push(getFile('./test1.txt'));
			promises.push(getFile('./test2.txt'));
		}

		charm(promises)
		.then(results => {
			expect(results.length).to.equal(2048);

			for (let j = 0; j < results.length; j += 2) {
				expect(results[j + 0]).to.equal('1');
				expect(results[j + 1]).to.equal('2');
			}

			done();
		})
		.catch(err => {
			expect(false).to.equal(true);
			done();
		});
	});
});
