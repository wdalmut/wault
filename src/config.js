define([], function() {
  return {
    db: {
      path: process.env.WAULT_PATH || "/tmp/wault.level",
    },
  };
});
