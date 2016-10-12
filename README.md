# parse-cloudcode
Framework to run and setup Parse CloudCode standalone or in AWS Lambda

# Purpose
Provide custom API endpoints (via functions) to client where normal CRUD
operation through Parse RESTful API is inadequate.

Cloud Code was originally designed to be integrated with ParseServer.  However
changes in Cloud Code will result in redeployment of ParseServer.  To reduce
deployment footprint and reduce infrastructure cost, Cloud Code is deployed to
AWS Lambda and fronted by AWS API Gateway.

API Gateway will ensure perfact forwarading of user request (headers, URL
parameters, querystring, body); Cloud Code executor routes these user requests
via function name.

API Gateway is responsible for fulfilling the RESTful contract between
Parse client and its intended Cloud Code function.  The endpoint must be
registered on `/1/functions/{functionName}` where `1` is a version number.
