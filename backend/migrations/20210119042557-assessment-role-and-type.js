module.exports = {
    async up(db, client) {

        const session = client.startSession()
        try {
            await session.withTransaction(async () => {
                await db.collection('assessmentindustries').insertOne({ name: 'Accounting' })
                await db.collection('assessmentindustries').insertOne({ name: 'Administration & Office Support' })
                await db.collection('assessmentindustries').insertOne({ name: 'Advertising, Arts & Media' })
                await db.collection('assessmentindustries').insertOne({ name: 'Banking & Financial Services' })
                await db.collection('assessmentindustries').insertOne({ name: 'Call Centre & Customer Service' })
                await db.collection('assessmentindustries').insertOne({ name: 'CEO & General Management' })
                await db.collection('assessmentindustries').insertOne({ name: 'Community Services & Development' })
                await db.collection('assessmentindustries').insertOne({ name: 'Construction' })
                await db.collection('assessmentindustries').insertOne({ name: 'Consulting & Strategy' })
                await db.collection('assessmentindustries').insertOne({ name: 'Design & Architecture' })
                await db.collection('assessmentindustries').insertOne({ name: 'Education & Training' })
                await db.collection('assessmentindustries').insertOne({ name: 'Engineering' })
                await db.collection('assessmentindustries').insertOne({ name: 'Farming, Animals & Conservation' })
                await db.collection('assessmentindustries').insertOne({ name: 'Government & Defence' })
                await db.collection('assessmentindustries').insertOne({ name: 'Healthcare & Medical' })
                await db.collection('assessmentindustries').insertOne({ name: 'Hospitality & Tourism' })
                await db.collection('assessmentindustries').insertOne({ name: 'Human Resources & Recruitment' })
                await db.collection('assessmentindustries').insertOne({ name: 'Information & Communication Technology' })
                await db.collection('assessmentindustries').insertOne({ name: 'Insurance & Superannuation' })
                await db.collection('assessmentindustries').insertOne({ name: 'Legal' })
                await db.collection('assessmentindustries').insertOne({ name: 'Manufacturing, Transport & Logistics' })
                await db.collection('assessmentindustries').insertOne({ name: 'Marketing & Communications' })
                await db.collection('assessmentindustries').insertOne({ name: 'Mining, Resources & Energy' })
                await db.collection('assessmentindustries').insertOne({ name: 'Real Estate & Property' })
                await db.collection('assessmentindustries').insertOne({ name: 'Retail & Consumer Products' })
                await db.collection('assessmentindustries').insertOne({ name: 'Sales' })
                await db.collection('assessmentindustries').insertOne({ name: 'Science & Technology' })
                await db.collection('assessmentindustries').insertOne({ name: 'Self Employment' })
                await db.collection('assessmentindustries').insertOne({ name: 'Sport & Recreation' })
                await db.collection('assessmentindustries').insertOne({ name: 'Trades & Services' })

                await db.collection('assessmenttypes').insertOne({ name: 'Full time' })
                await db.collection('assessmenttypes').insertOne({ name: 'Part time' })
                await db.collection('assessmenttypes').insertOne({ name: 'Contract/Temp' })
                await db.collection('assessmenttypes').insertOne({ name: 'Casual/Vacation' })

            })
        } finally {
            await session.endSession()
        }
    },

    async down(db, client) {
        const session = client.startSession()
        try {
            await session.withTransaction(async () => {
                await db.collection('assessmentindustries').deleteMany({})
                await db.collection('assessmenttypes').deleteMany({})
            })
        } finally {
            await session.endSession()
        }
    },
}