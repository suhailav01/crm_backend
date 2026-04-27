const repo = require('../repositories/signup')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/asyncHandler')
const { createToken } = require('../utils/jwtTokenHandler')
const { comparisonPassword } = require('../utils/hashPasswordHandler')
//get all users controller
const getAllUsersController = asyncHandler(async (req, res, next) => {
    const users = await repo.getAllUsers();
    res.status(200).json({ success: true, data: users });
});

//signup controller//
const signup = asyncHandler(async (req, res, next) => {
    try {
        const { first_name, last_name, email, phone_number, company_name, industry_type, country_region, password, role } = req.body;
        const users = await repo.getUserByName(first_name);
        if (users && users.length > 0) {
            return next(new ErrorResponse(`user already exists ${first_name}`, 400));
        }
        const userId = await repo.createUser(
            first_name, last_name, email, phone_number, company_name, industry_type, country_region, password, role);
        const token = createToken(userId)
        res.status(200).json({
            success: true,
            token: token,
            message: "user successfully created"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//login controller//
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const users = await repo.getUserByEmail(email);

    if (!users || users.length === 0) {
        return next(new ErrorResponse("invalid credential", 400));
    }

    const user = users[0];
    const isValid = await comparisonPassword(password, user.password);

    if (isValid) {
        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: "login successfully",
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                phone_number: user.phone_number,
                profile_image: user.profile_image,
            }
        });
    } else {
        return next(new ErrorResponse("invalid credential", 400));
    }
});
module.exports = { signup, login, getAllUsersController }