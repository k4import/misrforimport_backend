const Ajv = require("ajv")
const ajv = new Ajv()

const employeeSchemaValidator = {
    type: "object",
    properties: {
        employeeFName: {
            type: "string",
            //pattern: "^[A-Z][a-z]*$",
            minLength: 3
        },
        employeeLName: {
            type: "string",
            //pattern: "^[A-Z][a-z]*$",
            minLength: 3
        },
        employeeUsername: {
            type: "string",
            minLength: 5
        },
        employeeSalary: {
            type: "string",
        },
        employeeIsActive: {
            type: "boolean",
        },
        employeeIsAdmin: {
            type: "boolean",
        },
        employeeEmail: {
            type: "string",
            pattern: ".+\@.+\..+"
        },
        employeePassword: {
            type: "string",
            minLength: 5,
        }
    },
    required: ["employeeFName", "employeeLName","employeeUsername","employeeEmail", "employeePassword"],
}


module.exports = ajv.compile(employeeSchemaValidator)