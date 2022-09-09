Hashing password:
=================

>> no cncryption key; we will use hashing algorithm

>> hackers can not convert to plain text as no encryption key is available

>> md5 package: https://www.npmjs.com/package/md5

>> install md5 npm package: npm install md5

usage
=====

var md5 = require("md5");
console.log(md5("message"));
// 78e731027d8fd50ed642340b7c9a63b3

// hash password when create it
const newUser = new User({
  email: req.body.username,
  password: md5(req.body.password),
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await User.findOne({ email: email });
    if (user && user.password === password) {
      res.status(200).json({ status: "valid user" });
    } else {
      res.status(404).json({ status: "Not valid user" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

