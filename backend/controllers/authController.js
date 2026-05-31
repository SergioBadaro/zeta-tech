const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =============================
// REGISTER
// =============================
exports.register = async (req, res) => {
  try {
    const { nome, email, telefone, senha } = req.body;

    const [usuarioExistente] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        message: "Email já cadastrado",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query(
      `INSERT INTO usuarios (nome, email, telefone, senha)
       VALUES (?, ?, ?, ?)`,
      [nome, email, telefone, senhaHash],
    );

    return res.status(201).json({
      message: "Usuário cadastrado",
    });
  } catch (error) {
    console.error("ERRO REGISTER:", error);
    return res.status(500).json({
      message: "Erro no servidor",
    });
  }
};

// =============================
// LOGIN
// =============================
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios.",
      });
    }

    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    const usuario = rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        message: "Senha incorreta.",
      });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("ERRO LOGIN:", error);
    return res.status(500).json({
      message: "Erro no servidor",
    });
  }
};

// =============================
// FORGOT PASSWORD (RESET)
// =============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email e nova senha são obrigatórios.",
      });
    }

    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Email não encontrado.",
      });
    }

    const senhaHash = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE usuarios SET senha = ? WHERE email = ?", [
      senhaHash,
      email,
    ]);

    return res.json({
      message: "Senha atualizada com sucesso.",
    });
  } catch (error) {
    console.error("ERRO FORGOT PASSWORD:", error);
    return res.status(500).json({
      message: "Erro interno no servidor",
    });
  }
};
