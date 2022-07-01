// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const knexConfig = {

  development: {
    client: 'postgresql',
    connection: {
      type: 'postgres',
      database: 'hacker_news_stories',
      user:     'hacker_news_stories',
      password: 'hacker_news_stories'     
    }
  }

};

export default knexConfig

/*

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      type: 'postgres',
      
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT

    },
    migration: "icecreams"
  }

};

*/
 