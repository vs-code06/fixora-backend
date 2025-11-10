const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const validateSignup = (req, res, next) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password){
        return res.status(400).json({ message: "All fields required" });
    }

    if (!isEmail(email)){
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (String(password).length < 6){
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body || {};
    if (!email || !password){
        return res.status(400).json({ message: "All fields required" });
    }
    if (!isEmail(email)){
        return res.status(400).json({ message: "Invalid email format" });
    } 
    next();
};