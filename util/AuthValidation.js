const Ajv = require("ajv")
const ajv = new Ajv()

const schema = {
    type: "object",
    properties: {
        employeeEmail: {
            "type": "string",
            "pattern":".+\@.+\..+"
        },
        employeePassword: {
            "type":"string",
            "minLength": 5,
        },
    },
    required: ["employeeEmail", "employeePassword"],
}
module.exports = ajv.compile(schema)