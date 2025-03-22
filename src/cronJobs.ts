import cron from "node-cron";

import { downGradeUser } from "./utils/downGradeUser.js";
import { notifyUsersBeforeExpiry } from "./utils/notifyUsers.js";

// Run every day at midnight (02:00)
cron.schedule("0 2 * * *", async () => {
  const now = new Date().toLocaleString();
  console.log(`[${now}] Running cron job: Checking expired subscriptions...`);
  await downGradeUser();
  console.log(`[${now}] Subscription updates completed!`);
});

// // Notify users before expiry (02:30)
// cron.schedule("30 2 * * *", () => {
//   const now = new Date().toLocaleString();
//   console.log(`[${now}] Checking for expiring subscriptions...`);
//   notifyUsersBeforeExpiry();
// });
