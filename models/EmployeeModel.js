const mongoose = require("mongoose")
const valid = require("validator")
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    employeeID: {
        type: Number,
        required: true
    },
    employeeFName: {
        type: String,
        required: true,
        pattern: "^[A-Z][a-z]*$",
    },
    employeeLName: {
        type: String,
        required: true,
        pattern: "^[A-Z][a-z]*$",
    },
    employeeUsername: {
        type: String,
        required: true,
    },
    employeeSalary: {
        type: String,
        required: true
    },
    employeeIsActive: {
        type: Boolean,
        default: true,
    },
    employeeIsAdmin: {
        type: Boolean,
        default: false,
    },
    employeeEmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (val) => {
                return valid.isEmail(val)
            },
            message: "Not valid email"
        }
    },
    employeePassword: {
        type: String,
        required: true
    },
    employeePermissions: {
        allowedManagersPermission :{
            canAddManagers:{
                type:Boolean,
                default: false,
            },
            canEditManagers:{
                type:Boolean,
                default: false,
            },
            canViewManagers:{
                type:Boolean,
                default: false,
            },
            canDeleteManagers:{
                type:Boolean,
                default: false,
            },

        },
        allowedEmployeesPermission :{
            canAddEmployees:{
                type:Boolean,
                default: false,
            },
            canEditEmployees:{
                type:Boolean,
                default: false,
            },
            canViewEmployees:{
                type:Boolean,
                default: false,
            },
            canDeleteEmployees:{
                type:Boolean,
                default: false,
            },

        },
        allowedSalesPermission: {
            canAddSales: {
                type: Boolean,
                default: false,
            },
            canEditSales: {
                type: Boolean,
                default: false,
            },
            canViewSales: {
                type: Boolean,
                default: false,
            },
            canDeleteSales: {
                type: Boolean,
                default: false,
            },

        },
        allowedPurchasesPermission: {
            canAddPurchases: {
                type: Boolean,
                default: false,
            },
            canEditPurchases: {
                type: Boolean,
                default: false,
            },
            canViewPurchases: {
                type: Boolean,
                default: false,
            },
            canDeletePurchases: {
                type: Boolean,
                default: false,
            },

        },
        allowedInventoryPermission: {
            canAddInventory: {
                type: Boolean,
                default: false,
            },
            canEditInventory: {
                type: Boolean,
                default: false,
            },
            canViewInventory: {
                type: Boolean,
                default: false,
            },
            canDeleteInventory: {
                type: Boolean,
                default: false,
            },

        },
    }

})

employeeSchema.methods.genEmployeeAuthToken = function () {
    const jwtSecret = process.env.JWT_SECRET || "jwtsecvar";
    const token = jwt.sign({
        employeeID: this.employeeID,
        employeeIsActive: this.employeeIsActive,
        employeeIsAdmin: this.employeeIsAdmin,
        employeePermissions: this.employeePermissions,
    }, jwtSecret, { expiresIn: '24h' })
    return token
}

const Employee = mongoose.model("employees", employeeSchema)
module.exports = Employee