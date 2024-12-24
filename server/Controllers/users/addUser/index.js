const { userRegister } = require("../../auth")

const addUser = async (req, res) => {
  try {
    const role = req.body.role

    const user = {
      username: req.body.username,
      password: req.body.confirmPassword,
      email: req.body.email,
      name: req.body.name,
    }

    await userRegister(user, role, res)
  }catch (err) {
    return res.status(500).json({
      message: 'Unable to add user',
      error: err.message
    })
  }
}

module.exports = addUser