export default {
  routes: [
    {
      method: 'POST',
      path: '/available-slots/generate',
      handler: 'available-slot.generate',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};