import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Si no viene el encabezado o no empieza con "Bearer " -> 401
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Token no proporcionado"
        });
    }

    // Extraemos solo el token quitando la palabra "Bearer "
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos los datos del usuario en la petición
        next(); // Continuamos hacia el controlador
    } catch (error) {
        // Token adulterado o expirado -> 403
        return res.status(403).json({
            error: "Token inválido o expirado"
        });
    }
};
