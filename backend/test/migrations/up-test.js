const Bluebird = require('bluebird')
const { spawn } = require('child_process')
const rimraf = require('rimraf')
const path = require('path')
const url = 'mongodb://bhsoft:bhsoft%40132@117.6.135.148:8544/people-profile'
const MongoClient = require('mongodb')

const run = (cmd, args = []) => {
    const process = spawn(cmd, args)
    let out = ''

    return new Bluebird((resolve, reject) => {
        process.stdout.on('data', data => {
            out += data.toString('utf8')
        })

        process.stderr.on('data', data => {
            out += data.toString('utf8')
        })

        process.on('error', err => {
            reject(err)
        })

        process.on('close', code => {
            resolve(out, code)
        })
    })
}

const migratePath = path.join(__dirname, '..', '..', 'node_modules/migrate/bin', 'migrate')
const migrate = run.bind(null, migratePath)

describe('[Migration: up]', () => {

    let db = null

    describe('[Migration: up]', () => {
        before(done => {
            MongoClient
                .connect(url)
                .then(client => {
                    db = client.db()
                    db.collection('users').insertOne({
                        email: 'phamthihanh1301@gmail.com',
                        password: 'bhsoft',
                        first_name: 'Nguyen',
                        last_name: 'Tuan Anh',
                        job_title: 'BE - Test 2:14',
                        phone_number: '0355832199',
                        agency_name: 'BHSOFT',
                        role: 'admin',
                    })
                    done()
                })
                .catch(done)
        })
        it('should run up on specified migration', () => {
            migrate()
        })
    })
})