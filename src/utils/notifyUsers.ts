import { prismaClient } from "../server.js";

export async function notifyUsersBeforeExpiry() {
  const now = new Date();
  now.setDate(now.getDate() + 3);

  const usersToNotify = await prismaClient.subscription.findMany({
    where: { expiresAt: { lte: now, gt: new Date() } },
    include: { user: true },
  });

  usersToNotify.forEach(({ user }) => {
    console.log(`Reminder: ${user.email}, your subscription will expire soon!`);
    // Send email/notification logic here
  });
}
