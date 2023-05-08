import userModel from "../mongodb/models/user.js";
import User from "../mongodb/models/user.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).limit(req.query._end);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) return res.status(200).json(userExists);

        const newUser = await User.create({
            name,
            email,
            password,
            role: "User",
            hiringManger: ""
        });

        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserInfoByID = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ _id: id })
        .populate("allProperties").populate("allJobs").populate("allEmp");
        
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUSER = async (req,res) => {
    try {
        const { id } = req.params;
        const { 
            hiringManager
        } = req.body;

        await userModel.findByIdAndUpdate(
            { _id: id },
            {
            role:"Admin",
            hiringManager
            },
        );

        res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};
const deleteUSER = async (req,res) => {
    try {
        const { id } = req.params;

        const Delete = await userModel.findById({ _id: id })
        .populate(
            "creator",
        );

        if (!Delete) throw new Error("User not found");

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {

        Delete.remove({ session });
    

        await Delete.creator.save({ session });
      
        await session.commitTransaction();
    });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { getAllUsers, createUser, getUserInfoByID,updateUSER, deleteUSER};
