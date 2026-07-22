import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::available-slot.available-slot',
  ({ strapi }) => ({
    async generate(ctx) {
      const {
        courseDocumentId,
        startDate,
        endDate,
        startTime,
        endTime,
        slotLengthMinutes = 60,
        maximumCapacity = 1,
        daysOfWeek = [1, 2, 3, 4, 5],
      } = ctx.request.body;

      if (!courseDocumentId || !startDate || !endDate || !startTime || !endTime) {
        ctx.status = 400;
        ctx.body = { error: 'Missing required fields.' };
        return;
      }

      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const dayStartMinutes = startH * 60 + startM;
      const dayEndMinutes = endH * 60 + endM;

      const created = [];
      const current = new Date(startDate + 'T00:00:00');
      const last = new Date(endDate + 'T00:00:00');

      while (current <= last) {
        if (daysOfWeek.includes(current.getDay())) {
          const dateStr = current.toISOString().split('T')[0];

          for (
            let minutes = dayStartMinutes;
            minutes + slotLengthMinutes <= dayEndMinutes;
            minutes += slotLengthMinutes
          ) {
            const slotStartH = String(Math.floor(minutes / 60)).padStart(2, '0');
            const slotStartM = String(minutes % 60).padStart(2, '0');
            const slotEndMinutes = minutes + slotLengthMinutes;
            const slotEndH = String(Math.floor(slotEndMinutes / 60)).padStart(2, '0');
            const slotEndM = String(slotEndMinutes % 60).padStart(2, '0');

            const entry = await strapi.documents('api::available-slot.available-slot').create({
              data: {
                course: courseDocumentId,
                date: dateStr,
                startTime: `${slotStartH}:${slotStartM}:00`,
                endTime: `${slotEndH}:${slotEndM}:00`,
                maximumCapacity,
                remainingSeats: maximumCapacity,
                slotStatus: 'Available',
              },
            });
            created.push(entry);
          }
        }
        current.setDate(current.getDate() + 1);
      }

      ctx.body = { created: created.length };
    },
  })
);
