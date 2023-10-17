module.exports = ({ env }) => ({
    settings: {
      cors: {
        enabled: true,
        origin: ["*"], // Ganti dengan domain Anda
      },
    },
  });