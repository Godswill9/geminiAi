const express = require("express")
const route = express.Router()
const { handleUserCarRequest}= require("../controllers/carRequest")

route.post("/gemApiCall", handleUserCarRequest)

module.exports=route