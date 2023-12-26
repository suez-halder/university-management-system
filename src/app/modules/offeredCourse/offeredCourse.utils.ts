// * src/app/modules/offeredCourse/offeredCourse.utils.ts

import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.endTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    // 10:30 - 12:30
    // 9:30 - 11:30
    if (newStartTime <= existingEndTime && newEndTime >= existingStartTime) {
      //   console.log('yes');
      return true;
    }
  }
  return false;
};
