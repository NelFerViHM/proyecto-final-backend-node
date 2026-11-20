import jwt from "jsonwebtoken";

// Credenciales demostrativas según el contrato del proyecto
const DEMO_USER = {
    email: "user@email.com",
    password: "strongPass123!"
};

export const login = (req, res) => {
    const { email, password } = req.body;

    // Validación básica de presencia de campos
    if (!email || !password) {
        return res.status(400).json({
            error: "Debe proporcionar email y contraseña"
        });
    }

    // Verificación de credenciales
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
        return res.status(401).json({
            error: "Las credenciales no son correctas"
        });
    }

    // Generación del token JWT (expira en 1 hora)
    const token = jwt.sign(
        { email: DEMO_USER.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
};
