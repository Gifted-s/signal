import { Expo , ExpoPushMessage} from 'expo-server-sdk';
import { Message } from '../models/message';

export async function sendPushNotification(tokens: string[]) {
    const expo: Expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
    const messages: Message[] | ExpoPushMessage[] = [];
    for (let pushToken of tokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        function formatAMPM(date :number) {
           let  newDate:Date = new Date(date)
            var hours = newDate.getHours();
            var minutes = newDate.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? 0 + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
            to: pushToken,
            title: `Up Nepa!!! - ${formatAMPM(Date.now())}`,
            sound: 'default',
            body: `Light Up. If your generator in on, you can put it off now.`,
            data: { time: Date.now() },
        })

    }




     
// The Expo push notification service accepts batches of notifications so
// that you don't need to send 1000 requests to send 1000 notifications. We
// recommend you batch your notifications to reduce the number of requests
// and to compress them (notifications with similar content will get
// compressed).
let chunks = expo.chunkPushNotifications(messages as ExpoPushMessage[]);
let tickets = [];

let sent =  await (async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error :any) {
      console.error(error)
    }
  } 
  return {sent: true}
})();
return sent 
}
