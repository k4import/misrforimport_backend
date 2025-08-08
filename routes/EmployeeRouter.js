const express = require("express")
const router = express.Router();
const validatorAddNewEmployee = require("../middlewares/EmployeeMWValidator");
const validatorAuthEmployee = require("../middlewares/AuthMWValidator")
const Employee = require("../models/EmployeeModel")
const bcrypt = require("bcrypt")
const asyncFunction = require("../middlewares/async")
const employeeController = require("../controllers/employeeController")


router.post(
    "/AddNewEmployee",
    validatorAddNewEmployee,
    employeeController.addNewEmployee
)
router.post(
    "/DeleteEmployee",
    employeeController.deleteEmployee
)

router.post(
    "/LoginEmployee",
    validatorAuthEmployee,
    employeeController.loginEmployee
)

router.post(
    "/LogOutEmployee",
    validatorAuthEmployee,
    employeeController.loginEmployee
)

router.get(
    "/GetAllEmployees",
    employeeController.getAllEmployees
)

module.exports = router
