const asyncFunction = require("../middlewares/async")
const express = require("express")
const router = express.Router();
const validator = require("../middlewares/EmployeeMWValidator");
const Employee = require("../models/EmployeeModel")
const LoginEmployeeResponse = require("../models/EmployeeModel")
const bcrypt = require("bcrypt");
const { isEmpty } = require("validator");

const addNewEmployee = (async (req, res) => {
    let reqB = await req.body
    try {
        //check already exists
        let EmployeeId = (await Employee.find()).length + 1
        let employee = await Employee.findOne({
            employeeEmail: reqB.employeeEmail
        }).exec()
        if (employee) return res.status(400).send("Employee Email already Registered !!")
        employee = await Employee.findOne({
            employeeUsername: reqB.employeeUsername
        }).exec()
        if (employee) return res.status(400).send("Employee Username already Registered !!")
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
        await employee.save().then(() => {
            const token = employee.genEmployeeAuthToken()
            return res.header("x-auth-token", token).status(200).send("Register Finished")
        }).catch((err) => {
            nxt(err)
        })
    }
    catch (err) {
        console.log(err)
    }
    // send res
})

const loginEmployee = (async (req, res) => {

    let employeeLoginResponse
    // check email
    let employee = await Employee.findOne({
        employeeEmail: req.body.employeeEmail
    }).exec()
    if (!employee) return res.status(400).send("Invalid email or password")
    // check password
    const validPWD = await bcrypt.compare(req.body.employeePassword, employee.employeePassword)
    if (validPWD) {
        const token = employee.genEmployeeAuthToken()
        let employeeData = employee.toJSON()
        employeeLoginResponse = {
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
        employeeLoginResponse = {
            "status": false,
            "message": "Invalid email or password",
        }
        return res.status(200).json(employeeLoginResponse)
    }
})

const getAllEmployees = asyncFunction(async (req, res) => {
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
        "employeesData": emp
    }
    if (!emp) {
        let employeesData = {
            "status": true,
            "employeesData": []
        }

        return res.status(404).send(employeesData)
    } else {
        return res.status(200).send(employeesData)
    }
})

const deleteEmployee = asyncFunction(async (req, res) => {
    try {
        // افتراض أن المعرف يتم إرساله عبر `req.params`
        const employeeID = req.body.employeeID;

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
});




module.exports = {
    getAllEmployees,
    addNewEmployee,
    loginEmployee,
    deleteEmployee
}