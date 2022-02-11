module.exports = {
    async up(db, client) {
        const bcrypt = require('bcrypt')
        const password_salt = bcrypt.genSaltSync(10)
        let hashpassword = await bcrypt.hash('BHSoft@132', password_salt)
       
        const session = client.startSession()
        try {
            await session.withTransaction(async() => {
                await db.collection('users').insertOne({
                    email: 'admin@peopleprofiler.com.au',
                    password: hashpassword,
                    first_name: 'admin',
                    last_name: 'ppp',
                    role: 'admin',
                    is_verify: true,
                })
            })
        } finally {
            await session.endSession()
        }
    },

    async down(db, client) {
        const session = client.startSession()
        try {
            await session.withTransaction(async() => {
                await db.collection('users').deleteOne({ email: 'admin@gmail.com' })
            })
        } finally {
            await session.endSession()
        }
    },
}