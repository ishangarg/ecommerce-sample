import bcrypt from 'bcrypt';

const validateEmail = (email) => {
    if (email === null || email === undefined){
        throw "Email can't be empty!"
    }
    const emailRegex = /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;

    const isValidEmail = emailRegex.test(email);

    if (isValidEmail) {
        console.log('Valid email');
    } else {
        throw "Invalid Email"
    }

    return email
}

const validatePassword = (password) => {
    if (password === null || password === undefined){
        throw "Password can't be empty!"
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%\^\(\)\+=_\-*?&])[A-Za-z\d@$#\^\(\)!%\+=\-_*?&]{8,}$/;
    const isValidPassword = passwordRegex.test(password);

    if (isValidPassword){
        return password
    }else{
        throw "Invalid Password"
    }
}

const encryptPassword = async (password) => {

    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }

}

const comparePassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error comparing password:', error);
        throw error;
    }
};

export default {validateEmail, validatePassword, encryptPassword, comparePassword}