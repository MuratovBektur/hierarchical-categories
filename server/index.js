const app = require("express")();

const PORT = process.env.PORT ?? 5000;

app.get("/", (req, res) => {
  return res.send("server");
});

app.listen(PORT, () => console.log(`server runned on PORT: ${PORT}`));
