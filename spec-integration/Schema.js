//const Joi = require('joi');
//const schema = Joi.object({
//	payment: Joi.object({
//		paymentMethod: Joi.object({
//			id: Joi.string().required()
//		}),
//		fundMethod: Joi.object({
//			type: Joi.string().required()
//		})
//	}),

//}).unknown(true);

//const schemaModel = schema.validate({
//	"payment": {
//		"paymentMethod": {
//			"id": "c6a2c070-d52d-414e-922c-b2af0d803c77"
//		},
//		"fundMethod": {
//			"type": "ACH"
//		},
//		"amount": {
//			"amount": 6000
//		},
//		"transactionDate": "2000-01-01T00:00:00",
//		"externalId": 1167,
//		"checkNumber": 70
//	}
//}
//);

//if (schemaModel.error) { throw new Error(`validation error: ${JSON.stringify(schemaModel.error.details)}`); }

//console.log(schemaModel.value);
