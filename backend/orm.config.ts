import * as dotenv from 'dotenv';

const currentEnv: string = process.env.NODE_ENV || 'development';
if (currentEnv == 'development') {
    const result = dotenv.config();
    if (result.error) {
        throw result.error;
    }
}
export const connectionString = {
    // uri: `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    uri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
};

// export const withCache = {
//     type: 'mongodb',
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT),
//     username: process.env.DB_USER,
//     password: encodeURIComponent(process.env.DB_PASS),
//     database: process.env.DB_NAME,
//     synchronize: false,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     logging: true,
//     // cache: {
//     //     type: 'redis',
//     //     options: {
//     //         host: process.env.REDIS_HOST,
//     //         port: process.env.REDIS_PORT,
//     //     },
//     // },
//     entities: [
//         __dirname + '/**/*.schema{.ts,.js}'
//     ]
// }
