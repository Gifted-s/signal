import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ObjectId } from "mongodb";
import { collections, connectToDatabase } from "./services/database.service";
import { Sender, User } from "./models/schema";
import { sendPushNotification } from './services/notify.service';
dotenv.config();

const app: Express = express();
app.use(express.json())
const port = process.env.PORT || 8000;
connectToDatabase().then(() => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });


  app.post('/users', async (req: Request, res: Response) => {
    try {
      let user = req.body as User
      user.createdAt = new Date()
      const userExist = (await collections?.users?.findOne({ phone: user.phone }));
      if (!userExist) {
        const result = await collections?.users?.insertOne(user);
        return result
          ? res.status(200).send({ message: `Successfully created a new user with id ${result.insertedId}` })
          : res.status(500).send({ message: "Failed to create a new user." });
      }
      return res.status(200).send({ message: `User already exist`, alreadyExist: true })
    } catch (error: any) {
      console.error(error);
      res.status(400).send({ message: error.message });
    }
  });


  app.post('/sendNotification', async (req: Request, res: Response) => {
    try {
      let sender = req.body as Sender
      sender.createdAt = new Date()
      await collections?.senders?.insertOne(sender);
      const users = (await collections?.users?.find({}).toArray()) || [];
      let tokens: string[] = []
      for (let user of users) {
        tokens.push(user.deviceToken)
      }
      let response: { sent: boolean } = await sendPushNotification(tokens)
      if (response.sent) {
        res.status(200).send({ status: "success" });
      }
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });


  app.listen(port, () => {
    console.log(`[server]: Server is up and running at http://localhost:${port}`);
  });


})

  .catch(err => {
    console.log(err)
  })
