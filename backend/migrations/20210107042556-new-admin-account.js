module.exports = {
    async up(db, client) {
        const bcrypt = require('bcrypt')
        const password_salt = bcrypt.genSaltSync(10)
        let hashpassword = await bcrypt.hash('BHSoft@132', password_salt)

        const session = client.startSession()
        try {
            await session.withTransaction(async () => {
                await db.collection('users').insertOne({
                    email: 'quanhoang.bhtech+admin@gmail.com',
                    password: hashpassword,
                    first_name: 'quanhl',
                    last_name: 'bhsoft',
                    role: 'admin',
                    is_verify: true,
                })
                await db.collection('users').insertOne({
                    email: 'thunt.bhsoft+admin@gmail.com',
                    password: hashpassword,
                    first_name: 'thunt',
                    last_name: 'bhsoft',
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
            await session.withTransaction(async () => {
                await db.collection('users').deleteOne({ email: 'quanhl@bachasoftware.com' })
                await db.collection('users').deleteOne({ email: 'thunt.bhsoft+admin@gmail.com' })
            })
        } finally {
            await session.endSession()
        }
    },
}