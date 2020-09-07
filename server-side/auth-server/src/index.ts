import "dotenv/config";
import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";

(async () => {
    await createConnection();

    const app = Express();
    
    const schema = await buildSchema({
        resolvers: [ 
            UserResolver 
        ]
    });

    const apollo = new ApolloServer({ 
        schema,
        context: ({ req, res }) => ({ req, res }) 
    });
    apollo.applyMiddleware({ app });
    
    app.listen(4000, () => console.log(`Server started >>> http://localhost:4000/graphql`))
})();