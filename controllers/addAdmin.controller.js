import Register from "./register.controller.js";

async function createAdmin(req, res) {
  if (req.body.role && req.body.role !== "admin") {
    return res.status(400).json({ message: `ROLE must be 'admin'!` });
  }

  req.body.role = "admin";
  Register(req, res);
}

export default createAdmin;
