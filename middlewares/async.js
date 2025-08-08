module.exports = function asyncFunction(routeHandler) {
    return async function (req, res, nxt) {
        try {
            //logic
            await routeHandler(req, res)
            nxt()
        }
        catch (err) {
            nxt(err)
        }
    }
}