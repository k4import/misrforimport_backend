const asyncFunction = require("../middlewares/async")
const express = require("express")
const router = express.Router();
const validator = require("../middlewares/EmployeeMWValidator");
const Employee = require("../models/EmployeeModel")
const bcrypt = require("bcrypt");
const { isEmpty } = require("validator");

const addNewEmployee = async (req, res) => {
    try {
        let reqB = req.body;
        
        //check already exists
        let EmployeeId = (await Employee.find()).length + 1
        let employee = await Employee.findOne({
            employeeEmail: reqB.employeeEmail
        }).exec()
        if (employee) return res.status(400).json({
            status: false,
            message: "Employee Email already Registered !!"
        });
        
        employee = await Employee.findOne({
            employeeUsername: reqB.employeeUsername
        }).exec()
        if (employee) return res.status(400).json({
            status: false,
            message: "Employee Username already Registered !!"
        });
        
        // add new employee to be add to DB
        let salt = await bcrypt.genSalt(5)
        let hashedPWD = await bcrypt.hash(reqB.employeePassword, salt)
        employee = new Employee({
            employeeID: EmployeeId,
            employeeFName: reqB.employeeFName,
            employeeLName: reqB.employeeLName,
            employeeUsername: reqB.employeeUsername,
            employeeSalary: reqB.employeeSalary,
            employeeIsActive: reqB.employeeIsActive,
            employeeIsAdmin: reqB.employeeIsAdmin,
            employeeEmail: reqB.employeeEmail,
            employeePassword: hashedPWD,
            employeePermissions: reqB.employeePermissions,
        })
        
        await employee.save();
        const token = employee.genEmployeeAuthToken()
        return res.header("x-auth-token", token).status(200).json({
            status: true,
            message: "Register Finished"
        });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

const loginEmployee = async (req, res) => {
    try {
        // check email
        let employee = await Employee.findOne({
            employeeEmail: req.body.employeeEmail
        }).exec()
        if (!employee) return res.status(400).json({
            status: false,
            message: "Invalid email or password"
        });
        
        // check password
        const validPWD = await bcrypt.compare(req.body.employeePassword, employee.employeePassword)
        if (validPWD) {
            const token = employee.genEmployeeAuthToken()
            let employeeData = employee.toJSON()
            let employeeLoginResponse = {
                "status": true,
                "message": "Login Success",
                "userData": {
                    "employeeID": employeeData.employeeID,
                    "employeeFName": employeeData.employeeFName,
                    "employeeLName": employeeData.employeeLName,
                    "employeeUsername": employeeData.employeeUsername,
                    "employeeSalary": employeeData.employeeSalary,
                    "employeeIsActive": employeeData.employeeIsActive,
                    "employeeIsAdmin": employeeData.employeeIsAdmin,
                    "employeeEmail": employeeData.employeeEmail,
                    "Token": token,
                    "employeePermissions": employeeData.employeePermissions,
                }
            }

            // send res
            return res.header("x-employee-auth-token", token).status(200).json(employeeLoginResponse)

        }
        else {
            let employeeLoginResponse = {
                "status": false,
                "message": "Invalid email or password",
            }
            return res.status(200).json(employeeLoginResponse)
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

const getAllEmployees = async (req, res) => {
    try {
        let emp = await Employee.find().select({
            _id: 0,
            employeeID: 1,
            employeeFName: 1,
            employeeLName: 1,
            employeeUsername: 1,
            employeeEmail: 1,
            employeeIsActive: 1,
        }).sort({ employeeID: 1 })
        
        let employeesData = {
            "status": true,
            "employeesData": emp || []
        }
        
        return res.status(200).json(employeesData)
    } catch (error) {
        console.error('Get employees error:', error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

const deleteEmployee = async (req, res) => {
    try {
        // افتراض أن المعرف يتم إرساله عبر `req.body`
        const employeeID = req.body.employeeID;

        if (!employeeID) {
            return res.status(400).json({
                status: false,
                message: "Employee ID is required",
            });
        }

        // البحث وحذف الموظف
        const emp = await Employee.findOneAndDelete({ employeeID: employeeID });

        if (!emp) {
            // إذا لم يتم العثور على الموظف
            return res.status(404).json({
                status: false,
                message: "Employee not found",
            });
        }

        // عند الحذف بنجاح
        return res.status(200).json({
            status: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        // معالجة أي أخطاء
        console.error("Error deleting employee:", error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while deleting the employee"
        });
    }
};

module.exports = {
    getAllEmployees,
    addNewEmployee,
    loginEmployee,
    deleteEmployee
}