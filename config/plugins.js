module.exports = ({ env }) => ({
  "vercel-deploy": {
    enabled: true,
    config: {
      deployHook:
        "https://api.vercel.com/v1/integrations/deploy/prj_vsk6viPTKxqp8QeH7UJ9aRnTJMH1/F7HcAbZVvE",
      apiToken: "sEv1oORnA3kS1OHLdTfB1ubY",
      appFilter: "photoland-backend",
      teamFilter: "",
      roles: [],
    },
  },
});
