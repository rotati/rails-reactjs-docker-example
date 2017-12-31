export default {
	s3: {
	  BUCKET: "notes-app-uploads-rotati"
	},
	apiGateway: {
	  URL: "https://jb15p89br1.execute-api.ap-southeast-1.amazonaws.com/prod",
	  REGION: "ap-southeast-1"
	},
  cognito: {
  	MAX_ATTACHMENT_SIZE: 5000000,
    USER_POOL_ID: "ap-southeast-1_0X5ZACsg1",
    APP_CLIENT_ID: "16etj3in7h94o5bd5dnqrng5o4",
    REGION: "ap-southeast-1",
		IDENTITY_POOL_ID: "ap-southeast-1:93bbb985-fd75-488f-966b-8052552af3f6"
  }
};