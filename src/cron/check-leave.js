import cron from "node-cron";
import User from "../schema/auth.schmea.js";
import { send_leave_staff_sms } from "../config/nodemailer.js";

export const check_leave_staff = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date().toISOString().slice(0, 10);
    const usersOnLeave = await User.find({
      active: false,
      status: "ta'tilda",
    });
    if (!usersOnLeave) return;
    for (const user of usersOnLeave) {
      const last_leave = user.leave_history[user.leave_history.length - 1];
      const endDate = new Date(last_leave.end_date).toISOString().slice(0, 10);
      if (now === endDate) {
        await User.findByIdAndUpdate(user._id, {
          $set: {
            active: true,
            status: "faol",
            leave_history: {
              endDate: new Date(),
            },
          },
        });
        await send_leave_staff_sms({
          to: "raimjonovdavron4545@gmail.com",
          user,
        });
      }
    }
  });
};
