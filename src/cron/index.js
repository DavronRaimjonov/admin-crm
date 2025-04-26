import { check_leave_staff } from "./check-leave.js";

export const run_cron = () => {
  check_leave_staff();
};
