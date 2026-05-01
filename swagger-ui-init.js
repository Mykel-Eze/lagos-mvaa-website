
window.onload = function () {
    // Build a system
    let url = window.location.search.match(/url=([^&]+)/);
    if (url && url.length > 1) {
        url = decodeURIComponent(url[ 1 ]);
    } else {
        url = window.location.origin;
    }
    let options = {
        "swaggerDoc": {
            "openapi": "3.0.0",
            "paths": {
                "/api/v1/portal/auth/signup": {
                    "post": {
                        "operationId": "AppController_register",
                        "summary": "resource to register a single individual user.",
                        "description": "\n        This endpoint serves as the entry point for a new user on the portal.\n\n        - The request includes a request body and no query parameters nor authentication cookie sessions.\n        - A successful connection will trigger an e-mail service to the respective registration email for account activation — open and click format.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓00000.\n\n        {\n          \"firstName\": \"John\",\n          \"lastName\": \"Doe\",\n          \"email\": \"test@gmail.com\",\n          \"password\": \"_VeryStrongPassword20\",\n          \"phone\": \"+234703086XXXX\",\n          \"address\": {\n            \"street\": \"12 Boulevard Avenue\",\n            \"lga\": \"Adenakan Shomolu, Lagos Mainland\",\n          \"state\": \"Lagos State\"\n        }\n}\n      ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/NewUserDTO"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "individual user entity created",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 201,
                                                "success": "true",
                                                "message": "user created",
                                                "data": {}
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "failed attempt to create with non-unique property - email",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "An account with that email already exists!",
                                                "timestamp": "2025-09-19T09:01:14.087Z",
                                                "path": "/api/v1/portal/auth/signup",
                                                "status": 409,
                                                "details": "An account with that email already exists!"
                                            }
                                        }
                                    }
                                }
                            },
                            "409": {
                                "description": "a company account with that email already exists!",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "An account with that email already exists!",
                                                "timestamp": "2025-09-19T09:01:14.087Z",
                                                "path": "/api/v1/portal/auth/signup",
                                                "status": 409,
                                                "details": "An account with that email already exists!"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/auth/signin": {
                    "post": {
                        "operationId": "AppController_login",
                        "summary": "resource to login an individual user entity.",
                        "description": "\n        This endpoint serves as the authentication portal for any user on the portal.\n\n        - The request includes a simple request body and no query parameters nor authentication cookie sessions.\n        - A successful connection will generate connection \"tokens\" for subsequent requests — access;session;refresh .\n        - Each request payload has an identical shape as shown below ↓.\n        - Clients can use a browser or some request client in Node.js.\n      ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ExistingUserDTO"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "entity logged in correctly",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "login successful",
                                                "success": "true",
                                                "data": {
                                                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.eyJzdWIiOjIsImVtYWlsIjoiZXhhbBsZUlbWFpbC5jb0iLCJpYXQiOjE3MzczODE2NzAsImV4cCI6MTczNzM4MjU3MH0.IR7YXeeHN47hUk6iub3rVOj_aI2CguNZs4UBvnI2aBY",
                                                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.eyJzdWIiOjIsImVtYWlsIjoiZXhhbBsZBlbWFpbC5jb20iLCJpYXQiOjE3MzczODE2NAsImV4cCI6MTczNzk4NjQ3MH0.G1I23d8QESs_OyXenp1sbYRgwMxS8pgDPFRA86mIVO0",
                                                    "session_token": "930e4c43-d2a9-44a9-af23-4e70e32134a4"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "a bad request for fetching resource ",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Bad Request Exception",
                                                "timestamp": "2025-09-22T11:14:24.678Z",
                                                "path": "/api/v1/portal/auth/signin",
                                                "status": 400,
                                                "details": [
                                                    "email must be an email"
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credentials malformed or incorrect",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied!",
                                                "timestamp": "2025-09-22T11:14:24.678Z",
                                                "path": "/api/v1/portal/auth/signin",
                                                "status": 401,
                                                "details": "credential access denied!"
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "attempting to access login resource before account activation — visit email and try again later",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "timestamp": "2024-01-20T14:22:55.040Z",
                                                "path": "/api/v1/portal/auth/signin",
                                                "error": "email is unverified.",
                                                "status": 403,
                                                "success": "false",
                                                "details": "email is unverified."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/auth/logout": {
                    "post": {
                        "operationId": "AppController_logout",
                        "summary": "resource to logout an entity with an open session.",
                        "description": "\n        This endpoint serves as a v1 authentication logout for portal and module use.\n\n        - The request has no body and no query parameters ——— only authentication cookie to share sessions.\n        - A successful cookie authentication will allow access to top-level resources like a simple profile fetch — GET or logout — POST but not higher order resources like 'payment and billing'.\n        - This request has no payload but the expected response is shown below shown below ↓.\n        - Clients can use a browser or some request client in Node.js.\n        \n        ```\n            Example: \n            session_token=abcd1234\n            portal_id=efgh5678\n\n            portal_session_id=abcd1234&efgh5678 — `credential signature`\n\n            Testing Example:\n            portal_session_id=e26a6046-b000-4c79-acb8-b42cbd820593%2675e6df2eba1c1875ef359fc95c0f5a1ce5b8; Expires=null; Path=/; Secure; HttpOnly; Domain=localhost\n        ```\n        ",
                        "parameters": [
                            {
                                "name": "portal_session_id",
                                "in": "header",
                                "required": true,
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "successful logout response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "success": "true",
                                                "message": "logout successful",
                                                "data": {}
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "guarded logout resource ",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 400,
                                                "details": "credential access denied"
                                            }
                                        }
                                    }
                                }
                            },
                            "500": {
                                "description": "logout failure",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "e.message",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 500,
                                                "details": "e.message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/auth/refresh": {
                    "post": {
                        "operationId": "AppController_refreshTokens",
                        "summary": "portal resource to restore access validity for a token",
                        "description": "\n      This endpoint serves as a v1-authenticated with 'refresh token' to restore expired tokens —— portal use alone.\n\n      - The request has no body and no query parameters ——— only authentication via header.\n      - A successful header authentication will allow access to a token referesh — POST resource.\n      - This request has no payload but the expected response is as shown below ↓.\n      - Clients can use a browser or some request client in Node.js.\n      \n        ```\n          Example: \n          refresh_token=abcd1234 \n          Authorization: Bearer {refresh_token} —— `credential signature`\n\n          Testing Example:\n          -X POST https://{baseurl}/api/v1/portal/auth/refresh\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {refresh_token}\n          \n      ```\n      ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "resource to update access by providing refresh token as header authorization",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "tokens refreshed",
                                                "success": "true",
                                                "data": {
                                                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.eyJzdWIiOjIsImVtYWlsIjoiZXhhbBsZUlbWFpbC5jb0iLCJpYXQiOjE3MzczODE2NzAsImV4cCI6MTczNzM4MjU3MH0.IR7YXeeHN47hUk6iub3rVOj_aI2CguNZs4UBvnI2aBY",
                                                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.eyJzdWIiOjIsImVtYWlsIjoiZXhhbBsZBlbWFpbC5jb20iLCJpYXQiOjE3MzczODE2NAsImV4cCI6MTczNzk4NjQ3MH0.G1I23d8QESs_OyXenp1sbYRgwMxS8pgDPFRA86mIVO0",
                                                    "session_token": "930e4c43-d2a9-44a9-af23-4e70e32134a4"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "201": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "refresh unauthorized response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "refresh forbidden response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 403,
                                                "details": "credential access denied"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/accounts/upload": {
                    "post": {
                        "operationId": "AppController_uploadProfileImage",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/accounts/send-activation": {
                    "get": {
                        "operationId": "AppController_sendAccountActivationResource",
                        "summary": "resource to send account's activation mail.",
                        "description": "\n        This endpoint is v1-authenticated with access tokens for manual account activation —— portal use alone.\n\n        - The request has no body but includes a query parameter and authentication via header.\n        - A successful header authentication will allow access to a a mail service.\n        - This request has no payload but the expected response is as shown below ↓.\n        - Clients can use a browser or some request client in Node.js.\n        \n         ```\n            Example: \n            access_token=abcd1234 \n            Authorization: Bearer {access_token} —— `credential signature`\n\n            Testing Example:\n            -X GET https://{baseurl}/api/v1/portal/accounts/send-activation?email=example@email.com\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {access_token}\n            \n        ```\n        ",
                        "parameters": [
                            {
                                "name": "email",
                                "required": true,
                                "in": "query",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Ok response for sending email verification for account verification",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success - mail sent",
                                                "success": "true",
                                                "data": {}
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "sample unauthorized response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "sample bad response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "user data incorrect",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 400,
                                                "details": "user data incorrect"
                                            }
                                        }
                                    }
                                }
                            },
                            "503": {
                                "description": "sample service unavailable response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "unable to send activation message.",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 501,
                                                "details": "unable to send activation message."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/accounts/forgot-password/{email}": {
                    "get": {
                        "operationId": "AppController_sendAccountPasswordResetResource",
                        "summary": "resource to send account's reset mail.",
                        "description": "\n        This endpoint is v1-authenticated with access tokens for manual password reset —— portal use alone.\n\n        - The request has no body but includes a query parameter and authentication via header.\n        - A successful header authentication will allow access to a a mail service.\n        - This request has no payload but the expected response is as shown below ↓.\n        - Clients can use a browser or some request client in Node.js.\n        \n         ```\n            Example: \n            access_token=abcd1234 \n            Authorization: Bearer {access_token} —— `credential signature`\n\n            Testing Example:\n            -X GET https://{baseurl}/api/v1/portal/accounts/send-activation/example@email.com\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {access_token}\n            \n        ```\n        ",
                        "parameters": [
                            {
                                "name": "email",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Ok response for sending email verification for password reset",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success - mail sent",
                                                "success": "true",
                                                "data": {}
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "sample unauthorized response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "sample bad response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "user data incorrect",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 400,
                                                "details": "user data incorrect"
                                            }
                                        }
                                    }
                                }
                            },
                            "503": {
                                "description": "sample service unavailable response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "unable to send reset message.",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 501,
                                                "details": "unable to send reset message."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/accounts/update-account/{email}": {
                    "patch": {
                        "operationId": "AppController_updateUserAccount",
                        "summary": "portal resource to update user account information",
                        "description": "\n      This endpoint serves as a v1-authenticated with 'access token' —— portal use alone.\n\n      - The request has a body and a parameter with authentication via header.\n      - A successful header authentication will allow access account update — PATCH resource.\n      - This request payload and expected response is as shown below ↓.\n      - Clients can use a browser or some request client in Node.js.\n      \n        ```\n          Example: \n          access_token=abcd1234 \n          Authorization: Bearer {access_token} —— `credential signature`\n\n          Testing Example:\n          -X PATCH https://{baseurl}/api/v1/portal/accounts/update-account/{email}\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {access_token}\n          \n      ```\n      ",
                        "parameters": [
                            {
                                "name": "email",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ProfileUpdateDto"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "success request response resource",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "message": "account updated successfully",
                                                "status": 200,
                                                "success": "true",
                                                "data": {
                                                    "username": "flawedTomatoes",
                                                    "firstName": "Phil",
                                                    "lastName": "Foden",
                                                    "email": "jonkbog+testdeveloper@gmail.com",
                                                    "id": "398dbc78-1478-468e-b3ad-8ec0f013bb1d"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "bad request response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Bad Request Exception",
                                                "timestamp": "2026-02-13T03:28:19.436Z",
                                                "path": "/api/v1/portal/accounts/update-password/jonkbog+testdeveloper@gmail.com",
                                                "status": 400,
                                                "details": [
                                                    "Password too weak. Must include uppercase, lowercase, number, and symbol.",
                                                    "password should not be empty",
                                                    "password must be a string"
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "unauthorized request response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "forbidden request response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 403,
                                                "details": "credential access denied"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/accounts/utility/{email}": {
                    "patch": {
                        "operationId": "AppController_updateCompanyUserAccount",
                        "parameters": [
                            {
                                "name": "email",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/CompanyUtilityBillUpdateDto"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/accounts/update-password/{email}": {
                    "patch": {
                        "operationId": "AppController_updateAccountPassword",
                        "summary": "portal resource to update user password",
                        "description": "\n      This endpoint serves as a v1-authenticated with 'access token' —— portal use alone.\n\n      - The request has a body and a parameter with authentication via header.\n      - A successful header authentication will allow access account update — PATCH resource.\n      - This resource can only be used on Activated accounts.\n      - This request payload and expected response is as shown below ↓.\n      - Clients can use a browser or some request client in Node.js.\n      \n        ```\n          Example: \n          access_token=abcd1234 \n          Authorization: Bearer {access_token} —— `credential signature`\n\n          Testing Example:\n          -X PATCH https://{baseurl}/api/v1/portal/accounts/update-password/{email}\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {access_token}\n          \n      ```\n      ",
                        "parameters": [
                            {
                                "name": "email",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/PasswordResetDto"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "success request response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "message": "password changed successfully",
                                                "status": 200,
                                                "success": "true"
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "bad request response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Bad Request Exception",
                                                "timestamp": "2026-02-13T03:28:19.436Z",
                                                "path": "/api/v1/portal/accounts/update-password/jonkbog+testdeveloper@gmail.com",
                                                "status": 400,
                                                "details": [
                                                    "Password too weak. Must include uppercase, lowercase, number, and symbol.",
                                                    "password should not be empty",
                                                    "password must be a string"
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "unauthorized request response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            },
                            "500": {
                                "description": "internal server error request response - confirm user is activated",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "unable to perform operation on user!",
                                                "timestamp": "2026-02-13T01:23:40.260Z",
                                                "path": "/api/v1/portal/accounts/update-account/jnkbog+testdeveloper@gmail.com",
                                                "status": 400,
                                                "details": "unable to perform operation on user!"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/auth/signup-entity": {
                    "post": {
                        "operationId": "CorporateAppController_registerCompany",
                        "summary": "resource to register a corporate entity.",
                        "description": "\n        This endpoint serves as the entry point for a new company on the portal.\n\n        - The request includes a request body and no query parameters nor authentication cookie sessions.\n        - A successful connection will trigger an e-mail service to the respective registration email for account activation — open and click format.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n      ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/NewCompanyDto"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "company created successfully",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 201,
                                                "success": "true",
                                                "message": "corporate account created successfully!",
                                                "data": {}
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "failed attempt to create admin with non-unique property - {property}",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "duplicate entry for a unique field: ${e.detail}",
                                                "timestamp": "2025-09-19T09:01:14.087Z",
                                                "path": "/api/v1/portal/auth/signup-entity",
                                                "status": 409,
                                                "details": "duplicate entry for a unique field: ${e.detail}"
                                            }
                                        }
                                    }
                                }
                            },
                            "409": {
                                "description": "a company account with that email already exists!",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "An account with that email already exists!",
                                                "timestamp": "2025-09-19T09:01:14.087Z",
                                                "path": "/api/v1/portal/auth/signup",
                                                "status": 409,
                                                "details": "An account with that email already exists!"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/auth/signin-entity": {
                    "post": {
                        "operationId": "CorporateAppController_login",
                        "summary": "resource to login a corporate entity.",
                        "description": "\n            This endpoint serves as the authentication portal for a company on the portal.\n    \n            - The request includes a simple request body and no query parameters nor authentication cookie sessions.\n            - A successful connection will generate connection \"tokens\" for subsequent requests — access;session;refresh.\n            - Each request payload has an identical shape as shown below ↓.\n            - Clients can use a browser or some request client in Node.js.\n          ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ExistingUserDTO"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "OK",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "login successful",
                                                "success": "true",
                                                "data": {
                                                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.eyJzdWIiOjIsImVtYWlsIjoiZXhhbBsZUlbWFpbC5jb0iLCJpYXQiOjE3MzczODE2NzAsImV4cCI6MTczNzM4MjU3MH0.IR7YXeeHN47hUk6iub3rVOj_aI2CguNZs4UBvnI2aBY",
                                                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.eyJzdWIiOjIsImVtYWlsIjoiZXhhbBsZBlbWFpbC5jb20iLCJpYXQiOjE3MzczODE2NAsImV4cCI6MTczNzk4NjQ3MH0.G1I23d8QESs_OyXenp1sbYRgwMxS8pgDPFRA86mIVO0",
                                                    "session_token": "930e4c43-d2a9-44a9-af23-4e70e32134a4"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "a bad request for fetching resource.",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Bad Request Exception",
                                                "timestamp": "2025-09-22T11:14:24.678Z",
                                                "path": "/api/v1/portal/auth/signin",
                                                "status": 400,
                                                "details": [
                                                    "email must be an email"
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credentials malformed or incorrect.",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied!",
                                                "timestamp": "2025-09-22T11:14:24.678Z",
                                                "path": "/api/v1/portal/auth/signin",
                                                "status": 401,
                                                "details": "credential access denied!"
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "attempting to access 'login' resource before account activation — visit email and try again later.",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "timestamp": "2024-01-20T14:22:55.040Z",
                                                "path": "/api/v1/portal/auth/signin",
                                                "error": "email is unverified.",
                                                "status": 403,
                                                "success": "false",
                                                "details": "email is unverified."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v2/session/session/events": {
                    "get": {
                        "operationId": "SessionGatewayController_streamSessionEvents",
                        "summary": "Stream session events (SSE)",
                        "description": "\n        This endpoint establishes a **Server-Sent Events (SSE)** stream.\n\n        - The request must include a valid session cookie or token.\n        - The connection stays open, and events are pushed in `text/event-stream` format.\n        - Each event has the shape: `{ data: <payload> }`.\n        - Clients should use `EventSource` in the browser or an SSE client in Node.js.\n\n        Example (client/browser):\n        ```js\n        const sse = new EventSource('https://baseurl/api/v2/session/events', {\n            withCredentials: true, // Important: include session cookie\n        });\n\n        sse.onmessage = (event) => {\n            const data = JSON.parse(event.data);\n            if (data.type === 'logout') {\n                console.log('Received logout event via SSE');\n                window.location.href = '/login';\n            }\n        };\n\n        sse.onerror = (err) => {\n        console.error('SSE error', err);\n        };\n        ```\n      ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "SSE stream of session events",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {}
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "Unauthorized",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {}
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Session"
                        ]
                    }
                },
                "/api/v2/session/auth/issuetoken": {
                    "get": {
                        "operationId": "SessionGatewayController_issueTemporaryToken",
                        "summary": "v2 resource that issues temporary token for server side validation (handshake)",
                        "description": "\n        This endpoint serves as the original resource for authentication in v2.\n\n        - The request includes no request body and some query parameters(email, sessionId, redirect, url).\n        - The query parameters (url and redirect) will force a redirect automatically.\n        - In the absence of either the url or the redirect the response will remain on the client that initiated the request\n        - A successful connection will generate some token to be used up upon redirection (if redirection is true).\n        - Generated tokens will expire after 3mins or 180s.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```\n            {base_url}/api/v2/session/auth/issuetoken?email=jonkbog%2Bcompany3%40gmail.com&sid=5b6e36b1-e210-4628-a106-fa69f519d53b&url=https%3A%2F%2Fmvatvtlagos.com%2Fmvaa-app%2Fverify-session&userType=company\n        ```\n      ",
                        "parameters": [
                            {
                                "name": "email",
                                "required": true,
                                "in": "query",
                                "schema": {
                                    "type": "string"
                                }
                            },
                            {
                                "name": "sid",
                                "required": true,
                                "in": "query",
                                "schema": {
                                    "type": "string"
                                }
                            },
                            {
                                "name": "redirect",
                                "required": true,
                                "in": "query",
                                "schema": {
                                    "type": "string"
                                }
                            },
                            {
                                "name": "url",
                                "required": true,
                                "in": "query",
                                "schema": {
                                    "type": "string"
                                }
                            },
                            {
                                "name": "userType",
                                "required": true,
                                "in": "query",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Success",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "true",
                                                "expiresIn": 180,
                                                "status": 200,
                                                "url": "http://localhost:5200?token=iUi9W8MlWQIBSxxaVKibFF-lYnxuHj0JOH4yu7zlqVo",
                                                "oht": "iUi9W8MlWQIBSxxaVKibFF-lYnxuHj0JOH4yu7zlqVo"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Session"
                        ]
                    }
                },
                "/api/v2/session/auth/connect/{temp}": {
                    "get": {
                        "operationId": "SessionGatewayController_assignAccessToken",
                        "summary": "perform session handshake",
                        "description": "Returns final tokens for the current session.",
                        "parameters": [
                            {
                                "name": "temp",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Session"
                        ]
                    }
                },
                "/api/v2/session/profile/me": {
                    "get": {
                        "operationId": "SessionGatewayController_getUserCredentials",
                        "summary": "v2 resource for fetching user profile.",
                        "description": "",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Session"
                        ]
                    }
                },
                "/api/v2/session/auth/logout": {
                    "post": {
                        "operationId": "SessionGatewayController_logout",
                        "summary": "resource to logout an entity with an open session.",
                        "description": "\n            This endpoint serves as the original resource for authentication in v2.\n\n            - The request includes no request body or parameters.\n            - The query parameters (url and redirect) will force a redirect automatically.\n            - In the absence of either the url or the redirect the response will remain on the client that initiated the request\n            - A successful connection will generate some token to be used up upon redirection (if redirection is true).\n            - Generated tokens will expire after 3mins or 180s.\n            - Clients can use a browser or some request client in Node.js.\n            - Each request payload has an identical shape as shown below ↓.\n\n            Example:\n            ```\n                {base_url}/api/v2/session/auth/logout\n            ```\n        ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "successful logout response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "success": "true",
                                                "message": "logout successful",
                                                "data": {}
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "guarded logout resource ",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 400,
                                                "details": "credential access denied"
                                            }
                                        }
                                    }
                                }
                            },
                            "500": {
                                "description": "logout failure",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "e.message",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 500,
                                                "details": "e.message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Session"
                        ]
                    }
                },
                "/api/v1/shared/profile": {
                    "get": {
                        "operationId": "SharedAppController_getUserCredentials",
                        "summary": "resource to fetch an entity profile.",
                        "description": "\n          This endpoint serves a v1 authentication endpoint for portal and module use.\n  \n          - The request has no body and no query parameters ——— only authentication cookie to share sessions.\n          - A successful cookie authentication will allow access to top-level resources like a simple profile fetch — GET or logout — POST but not higher order resources like 'payment and billing'.\n          - This request has no payload but the expected response is shown below shown below ↓.\n          - Clients can use a browser or some request client in Node.js.\n          \n          ```\n              Example: \n              session_token=abcd1234\n              portal_id=efgh5678\n  \n              portal_session_id=abcd1234&efgh5678 — `credential signature`\n  \n              Testing Example:\n              portal_session_id=e26a6046-b000-4c79-acb8-b42cbd820593%2675e6df2eba1c1875ef359fc95c0f5a1ce5b8; Expires=null; Path=/; Secure; HttpOnly; Domain=localhost\n          ```\n          ",
                        "parameters": [
                            {
                                "name": "cookie",
                                "in": "header",
                                "description": "cookies must contain portal_session_id=your_session_token",
                                "required": true,
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "successful fetch user response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "firstName": "Peter",
                                                "lastName": "Petrelli",
                                                "email": "hero@email.com",
                                                "phone": "+2347030861111",
                                                "address": {
                                                    "street": "14 Boulevard Avenue",
                                                    "lga": "Agege",
                                                    "state": "Lagos State"
                                                },
                                                "role": "user",
                                                "role_markers": null
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "cookie-based user authorization response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied: session expired",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "path": "/api/v1/portal/auth/identification",
                                                "status": 401,
                                                "details": "credential access denied: session expired"
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "unauthorized",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied: session expired",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "path": "/api/v1/portal/auth/identification",
                                                "status": 401,
                                                "details": "credential access denied: session expired"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ],
                        "security": [
                            {
                                "portal_session_id": []
                            }
                        ]
                    }
                },
                "/api/v1/shared/verify/nin/{idNumber}": {
                    "post": {
                        "operationId": "SharedAppController_verifymeWithNIN",
                        "summary": "resource to fetch/verify an entity national identification number — NIN.",
                        "description": "\n        This endpoint serves a v1 authentication endpoint for portal and module use.\n\n        - The request has no body and no query parameters ——— only authentication cookie to share sessions.\n        - A successful cookie authentication will allow access to top-level resources like NIN and CAC.\n        - This request has a payload and the expected response is shown below shown below ↓.\n        - Clients can use a browser or some request client in Node.js.\n        \n        ```\n            Example: \n            session_token=abcd1234\n            portal_id=efgh5678\n\n            portal_session_id=abcd1234&efgh5678 — `credential signature`\n\n            Testing Example:\n            portal_session_id=e26a6046-b000-4c79-acb8-b42cbd820593%2675e6df2eba1c1875ef359fc95c0f5a1ce5b8; Expires=null; Path=/; Secure; HttpOnly; Domain=localhost\n        ```\n        ",
                        "parameters": [
                            {
                                "name": "idNumber",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/IVerifyWithNIN"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "successful match for nin response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "success": "true",
                                                "message": "EXACT_MATCH for 'Bunch Dillon' with id(NIN)}",
                                                "data": {
                                                    "nin": "63184876213",
                                                    "firstname": "Bunch",
                                                    "lastname": "Dillon",
                                                    "middlename": "",
                                                    "phone": "08000000000",
                                                    "gender": "m",
                                                    "photo": "_long_photo_base64_string_",
                                                    "birthdate": "06-01-1974",
                                                    "residence": {
                                                        "address1": "1193 TOLA CRESENT",
                                                        "town": "WUSE",
                                                        "lga": "Abuja Municipal",
                                                        "state": "FCT Abuja"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "bad request server response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Request failed with status code 400",
                                                "timestamp": "2026-02-13T12:33:03.942Z",
                                                "path": "/api/v1/shared/verify/nin",
                                                "status": 500,
                                                "details": "Request failed with status code 400"
                                            }
                                        }
                                    }
                                }
                            },
                            "422": {
                                "description": "bad request unprocessed entity response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "NO_MATCH for 'firstname: string lastname: string' with id(NIN)}",
                                                "timestamp": "2026-02-13T20:45:20.129Z",
                                                "path": "/api/v1/shared/verify/nin/63184876213",
                                                "status": 422,
                                                "details": "NO_MATCH for 'firstname: string lastname: string' with id(NIN)}"
                                            }
                                        }
                                    }
                                }
                            },
                            "500": {
                                "description": "unauthorized authentication protocol response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Request failed with status code 401",
                                                "timestamp": "2026-02-13T12:27:27.334Z",
                                                "path": "/api/v1/shared/verify/nin",
                                                "status": 500,
                                                "details": "Request failed with status code 401"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/shared/verify/businessNin/{idNumber}": {
                    "post": {
                        "operationId": "SharedAppController_verifyBusinessWithNIN",
                        "summary": "resource to fetch/verify an entity national identification number — NIN.",
                        "description": "\n        This endpoint serves a v1 authentication endpoint for portal and module use.\n\n        - The request has no body and no query parameters ——— only authentication cookie to share sessions.\n        - A successful cookie authentication will allow access to top-level resources like NIN and CAC.\n        - This request has a payload and the expected response is shown below shown below ↓.\n        - Clients can use a browser or some request client in Node.js.\n        \n        ```\n            Example: \n            session_token=abcd1234\n            portal_id=efgh5678\n\n            portal_session_id=abcd1234&efgh5678 — `credential signature`\n\n            Testing Example:\n            portal_session_id=e26a6046-b000-4c79-acb8-b42cbd820593%2675e6df2eba1c1875ef359fc95c0f5a1ce5b8; Expires=null; Path=/; Secure; HttpOnly; Domain=localhost\n        ```\n        ",
                        "parameters": [
                            {
                                "name": "idNumber",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/IVerifyWithNIN"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "successful match for nin response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "success": "true",
                                                "message": "EXACT_MATCH for 'Bunch Dillon' with id(NIN)}",
                                                "data": {
                                                    "nin": "63184876213",
                                                    "firstname": "Bunch",
                                                    "lastname": "Dillon",
                                                    "middlename": "",
                                                    "phone": "08000000000",
                                                    "gender": "m",
                                                    "photo": "_long_photo_base64_string_",
                                                    "birthdate": "06-01-1974",
                                                    "residence": {
                                                        "address1": "1193 TOLA CRESENT",
                                                        "town": "WUSE",
                                                        "lga": "Abuja Municipal",
                                                        "state": "FCT Abuja"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "bad request server response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Request failed with status code 400",
                                                "timestamp": "2026-02-13T12:33:03.942Z",
                                                "path": "/api/v1/shared/verify/nin",
                                                "status": 500,
                                                "details": "Request failed with status code 400"
                                            }
                                        }
                                    }
                                }
                            },
                            "422": {
                                "description": "bad request unprocessed entity response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "NO_MATCH for 'firstname: string lastname: string' with id(NIN)}",
                                                "timestamp": "2026-02-13T20:45:20.129Z",
                                                "path": "/api/v1/shared/verify/nin/63184876213",
                                                "status": 422,
                                                "details": "NO_MATCH for 'firstname: string lastname: string' with id(NIN)}"
                                            }
                                        }
                                    }
                                }
                            },
                            "500": {
                                "description": "unauthorized authentication protocol response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Request failed with status code 401",
                                                "timestamp": "2026-02-13T12:27:27.334Z",
                                                "path": "/api/v1/shared/verify/nin",
                                                "status": 500,
                                                "details": "Request failed with status code 401"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/shared/verify/cac": {
                    "post": {
                        "operationId": "SharedAppController_verifymeWithCAC",
                        "summary": "resource to fetch/verify an entity company registration number — CAC.",
                        "description": "\n        This endpoint serves a v1 authentication endpoint for portal and module use( means it uses cookies).\n        - The request has no body and no query parameters ——— only authentication cookie to share sessions.\n        - A successful cookie authentication will allow access to top-level resources like NIN and CAC.\n        - This request has a payload and the expected response is shown below shown below ↓.\n        - Clients can use a browser or some request client in Node.js.\n        \n        ```\n            Example: \n            session_token=abcd1234\n            portal_id=efgh5678\n\n            portal_session_id=abcd1234&efgh5678 — `credential signature`\n          \n            regNumber string required\n            Company's registration number. The registration number should be typed in this format. RC1234, BN1234, IT1234. etc.\n        ```\n        ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/IVerifyWithCAC"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "successful match for cac response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "success": "true",
                                                "message": "cac fetch successful",
                                                "data": {
                                                    "state": "",
                                                    "headOfficeAddress": "Test Company Head Office Address",
                                                    "status": "ACTIVE",
                                                    "city": "",
                                                    "companyEmail": "",
                                                    "rcNumber": "100001",
                                                    "classification": "Limited Company",
                                                    "branchAddress": "",
                                                    "registrationDate": "2013-02-19T00:00:00.000+00:00",
                                                    "companyName": "TEST COMPANY   ",
                                                    "lga": "",
                                                    "companyType": "",
                                                    "affiliates": 10,
                                                    "shareCapital": 0,
                                                    "shareCapitalInWords": "",
                                                    "natureOfBusiness": ""
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "bad request server response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Request failed with status code 400",
                                                "timestamp": "2026-02-13T12:33:03.942Z",
                                                "path": "/api/v1/shared/verify/nin",
                                                "status": 500,
                                                "details": "Request failed with status code 400"
                                            }
                                        }
                                    }
                                }
                            },
                            "500": {
                                "description": "unauthorized authentication protocol response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Request failed with status code 401",
                                                "timestamp": "2026-02-13T12:27:27.334Z",
                                                "path": "/api/v1/shared/verify/nin",
                                                "status": 500,
                                                "details": "Request failed with status code 401"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/shared/verify/businessTin": {
                    "post": {
                        "operationId": "SharedAppController_verifymeWithTIN",
                        "summary": "resource to fetch/verify an entity company registration number — CAC.",
                        "description": "\n        This endpoint serves a v1 authentication endpoint for portal and module use( means it uses cookies).\n        - The request has no body and no query parameters ——— only authentication cookie to share sessions.\n        - A successful cookie authentication will allow access to top-level resources like NIN and CAC.\n        - This request has a payload and the expected response is shown below shown below ↓.\n        - Clients can use a browser or some request client in Node.js.\n        \n        ```\n            Example: \n            session_token=abcd1234\n            portal_id=efgh5678\n\n            portal_session_id=abcd1234&efgh5678 — `credential signature`\n          \n            regNumber string required\n            Company's registration TIN number. The registration number should be typed in this format. RC1234, BN1234, IT1234. etc.\n        ```\n        ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "successful match for tin response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "success": "true",
                                                "message": "verified",
                                                "data": {
                                                    "tin": "08120451-1001",
                                                    "taxpayerName": "Bunch Dillon Limited",
                                                    "cacRegNo": "01108909",
                                                    "entityType": "TIN",
                                                    "jittin": "33230189",
                                                    "taxOffice": "Abule Egba",
                                                    "phone": "08000000000",
                                                    "email": "Colin.Schneider@gmail.com"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "400": {
                                "description": "bad request server response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Request failed with status code 400",
                                                "timestamp": "2026-02-13T12:33:03.942Z",
                                                "path": "/api/v1/shared/verify/nin",
                                                "status": 500,
                                                "details": "Request failed with status code 400"
                                            }
                                        }
                                    }
                                }
                            },
                            "500": {
                                "description": "unauthorized authentication protocol response",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Request failed with status code 401",
                                                "timestamp": "2026-02-13T12:27:27.334Z",
                                                "path": "/api/v1/shared/verify/nin",
                                                "status": 500,
                                                "details": "Request failed with status code 401"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/shared/transaction": {
                    "get": {
                        "operationId": "SharedAppController_fetchUserOrders",
                        "summary": "resource to fetch all orders for a user",
                        "description": "\n          This endpoint serves as the v1 resource for fetching orders.\n  \n          - The request includes a request body with all the necessary parameters.\n          - A successful connection will generate an order.\n          - Clients can use a browser or some request client in Node.js.\n          - Each request payload has an identical shape as shown below ↓.\n  \n          Example:\n          ```js\n            handshake_token=abcd1234 \n            Authorization: Bearer {handshake_token} —— `credential signature`\n  \n            Testing Example:\n            -X GET https://{baseurl}/api/v1/shared/transaction\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {handshake_token}'\n          ```\n        ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "successfully fetch orders",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success",
                                                "success": "true",
                                                "data": [
                                                    {
                                                        "id": "31ec147e-4c90-4eb1-b3d5-a913aea11fff",
                                                        "order_id": "BUS_1774912978756J3PTNG",
                                                        "amount": "3100.00",
                                                        "currency": "NGN",
                                                        "payment_reference": null,
                                                        "gateway_reference": null,
                                                        "receipt_status": "PENDING",
                                                        "receipt_callback_url": "https://lagosmvaa.ng/services",
                                                        "userId": null,
                                                        "companyId": "3596de37-baf6-4535-af02-53dfbb73c5d2",
                                                        "gateway": "pay4it",
                                                        "billing_metadata": {
                                                            "pid": "N-191005",
                                                            "billingClientId": "3596de37-baf6-4535-af02-53dfbb73c5d2",
                                                            "appliedDate": "Test March 2026",
                                                            "country": "Nigeria",
                                                            "state": "Lagos State",
                                                            "assessmentReference": "MVX-RevenueSlip-",
                                                            "agencyCode": "4570000",
                                                            "billingClientName": null,
                                                            "billingClientType": "C"
                                                        },
                                                        "revenue_module_metadata": {
                                                            "revenueCode": "4010002",
                                                            "revenueClientName": "AUTO_DEALER_SPARE_PARTS",
                                                            "revenueClientId": "9dd1dda32a635879fb7fdd617629189111b0"
                                                        },
                                                        "trans_metadata": null,
                                                        "gateway_metadata": null,
                                                        "is_gateway_processed": false,
                                                        "is_processed_count": false,
                                                        "createdAt": "2026-03-30T23:22:58.762Z",
                                                        "updatedAt": "2026-03-30T23:22:58.762Z"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/shared/transaction/{id}": {
                    "get": {
                        "operationId": "SharedAppController_fetchSingleOrder",
                        "summary": "resource to fetch an orders for a user",
                        "description": "\n        This endpoint serves as a v1 resource for fetching an order.\n\n        - The request includes a request body with all the necessary parameters.\n        - A successful connection will generate an order.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```js\n          handshake_token=abcd1234 \n          Authorization: Bearer {handshake_token} —— `credential signature`\n\n          Testing Example:\n          -X GET https://{baseurl}/api/v1/shared/transaction/{orderId}\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {handshake_token}'\n        ```\n      ",
                        "parameters": [
                            {
                                "name": "id",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "successfully fetch orders",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success",
                                                "success": "true",
                                                "data": {
                                                    "id": "7921a40d-9217-41c2-bb1d-a2caed83a93e",
                                                    "order_id": "BUS_17746119189282PETNG",
                                                    "amount": "3100.00",
                                                    "currency": "NGN",
                                                    "payment_reference": "1910050-9621528-145",
                                                    "gateway_reference": null,
                                                    "receipt_status": "CONFIRMED",
                                                    "receipt_callback_url": "https://lagosmvaa.ng/services",
                                                    "userId": null,
                                                    "companyId": "d9f1df25-97f6-445e-aea2-46c473269119",
                                                    "gateway": "pay4it",
                                                    "billing_metadata": {
                                                        "pid": "N-191005",
                                                        "billingClientId": "d9f1df25-97f6-445e-aea2-46c473269119",
                                                        "appliedDate": "Test March 2026",
                                                        "country": "Nigeria",
                                                        "state": "Lagos State",
                                                        "assessmentReference": "MVX-RevenueSlip-",
                                                        "agencyCode": "4570000",
                                                        "billingClientName": null,
                                                        "billingClientType": "C"
                                                    },
                                                    "revenue_module_metadata": {
                                                        "revenueCode": "4010002",
                                                        "revenueClientName": "AUTO_DEALER_SPARE_PARTS",
                                                        "revenueClientId": "9dd1dda32a635879fb7fdd617629189111b0"
                                                    },
                                                    "trans_metadata": null,
                                                    "gateway_metadata": null,
                                                    "is_gateway_processed": false,
                                                    "is_processed_count": false,
                                                    "createdAt": "2026-03-27T11:45:18.932Z",
                                                    "updatedAt": "2026-03-27T11:46:55.189Z"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v1/shared/payment/initialize": {
                    "post": {
                        "operationId": "SharedAppController_generateTransactionalOrder",
                        "summary": "resource to process an order after billing",
                        "description": "\n          This endpoint serves as the v1 portal resource for initializing an order for a checkout / authorization url.\n  \n          - The request includes a request body with all the necessary parameters.\n          - A successful connection will generate an order.\n          - Clients can use a browser or some request client in Node.js.\n          - Each request payload has an identical shape as shown below ↓.\n  \n          Example:\n          ```js\n            handshake_token=abcd1234 \n            Authorization: Bearer {handshake_token} —— `credential signature`\n  \n            Testing Example:\n            -X POST https://{baseurl}/api/v1/shared/payment/initialize\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {handshake_token}'\n            {\n              order_id: \"BUS_XXXXXXXX\"\n            }\n          ```\n        ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "successfully update order to processed",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success",
                                                "success": "true",
                                                "data": {
                                                    "status": 200,
                                                    "message": "string",
                                                    "data": {
                                                        "authorizationUrl": "string",
                                                        "reference": "string",
                                                        "credoReference": "string",
                                                        "crn": "string"
                                                    },
                                                    "execTime": 60,
                                                    "error": []
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Portal"
                        ]
                    }
                },
                "/api/v2/shared/payment/generate": {
                    "post": {
                        "operationId": "PaymentAppController_generateOrder",
                        "summary": "resource to generate an order for billing",
                        "description": "\n        This endpoint serves as a v2 resource for creating orders.\n\n        - The request includes a request body with all the necessary parameters.\n        - A successful connection will generate an order.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```js\n          handshake_token=abcd1234 \n          Authorization: Bearer {handshake_token} —— `credential signature`\n\n          Testing Example:\n          -X POST https://{baseurl}/api/v2/shared/payment/generate\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {handshake_token}'\n            {\n                \"amount\": \"31000.00\",\n                \"assessmentReference\": \"MVX-RevenueSlip-001\",\n                \"appliedDate\": \"Test March 2026\",\n                \"gateway\": \"pay4it\",\n                \"currency\": \"NGN\",\n                \"revCode\": \"4010002\"\n            }   \n        ```\n      ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/GlobalBillingReceiptDto"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "generate a single client order",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "order generated",
                                                "success": "true",
                                                "data": {
                                                    "order_id": "BUS_177491893319852VFNG",
                                                    "amount": "3100.00",
                                                    "url": "https://lagosmvaa.ng/services",
                                                    "status": "PENDING",
                                                    "client": {
                                                        "id": "3596de37-baf6-4535-af02-53dfbb73c5d2"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "201": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied.",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {}
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/billing/receipt/{orderId}": {
                    "post": {
                        "operationId": "PaymentAppController_generateBillingOrder",
                        "summary": "resource to update an order via billing api",
                        "description": "\n        This endpoint serves as a v2 resource for creating a revenue billing for each order.\n\n        - The request includes a request body with all the necessary parameters.\n        - A successful connection will generate an order.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```js\n          handshake_token=abcd1234 \n          Authorization: Bearer {handshake_token} —— `credential signature`\n\n          Testing Example:\n          -X GET https://{baseurl}/api/v2/shared/billing/receipt/:orderId\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {handshake_token}'\n        ```\n      ",
                        "parameters": [
                            {
                                "name": "orderId",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "generate a single billing with orderId",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "payment reference generated — order updated successfully",
                                                "success": "true",
                                                "data": {
                                                    "order_id": "BUS_177491893319852VFNG",
                                                    "amount": "3100.00",
                                                    "url": "https://lagosmvaa.ng/services",
                                                    "status": "CONFIRMED"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/initialize": {
                    "post": {
                        "operationId": "PaymentAppController_generateTransactionalOrder",
                        "summary": "resource to process an order after billing",
                        "description": "\n        This endpoint serves as a v2 resource for initializing an order for a checkout / authorization url.\n\n        - The request includes a request body with all the necessary parameters.\n        - A successful connection will generate an order.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```js\n          handshake_token=abcd1234 \n          Authorization: Bearer {handshake_token} —— `credential signature`\n\n          Testing Example:\n          -X POST https://{baseurl}/api/v2/shared/payment/initialize\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {handshake_token}'\n          {\n            order_id: \"BUS_XXXXXXXX\"\n          }\n        ```\n      ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "successfully update order to processed",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success",
                                                "success": "true",
                                                "data": {
                                                    "status": 200,
                                                    "message": "string",
                                                    "data": {
                                                        "authorizationUrl": "string",
                                                        "reference": "string",
                                                        "credoReference": "string",
                                                        "crn": "string"
                                                    },
                                                    "execTime": 60,
                                                    "error": []
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/transaction/verify": {
                    "post": {
                        "operationId": "PaymentAppController_verifyFulfilledOrder",
                        "summary": "resource to verify an order status",
                        "description": "\n        This endpoint serves as a v2 resource validating processed orders post-webhook dispatch.\n\n        - The request includes a request body with all the necessary parameters.\n        - A successful connection verify the reference orderId and confirm the state of the order.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```js\n          handshake_token=abcd1234 \n          Authorization: Bearer {handshake_token} —— `credential signature`\n\n          Testing Example:\n          -X POST https://{baseurl}/api/v2/shared/payment/transaction/verify'\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {handshake_token}'\n          {\n            ref: \"BUS_XXXXXXXXX\"\n          }\n        ```\n      ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "successfully fetch orders",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "Transaction fetched successfully",
                                                "data": {
                                                    "transRef": "vs_xxxxxxxxxxxx",
                                                    "businessRef": "ORD-20260207-001",
                                                    "debitedAmount": 153250,
                                                    "transAmount": 150000,
                                                    "transFeeAmount": 3250,
                                                    "settlementAmount": 150000,
                                                    "customerId": "customer@example.com",
                                                    "transactionDate": "2026-02-07T14:30:00.000Z",
                                                    "currencyCode": "NGN",
                                                    "status": 0
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/transaction": {
                    "get": {
                        "operationId": "PaymentAppController_fetchUserOrders",
                        "summary": "resource to fetch all user orders",
                        "description": "\n        This endpoint serves as a v2 resource for fetching orders.\n\n        - The request includes a request body with all the necessary parameters.\n        - A successful connection will generate an order.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```js\n          handshake_token=abcd1234 \n          Authorization: Bearer {handshake_token} —— `credential signature`\n\n          Testing Example:\n          -X GET https://{baseurl}/api/v2/shared/transaction\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {handshake_token}'\n        ```\n      ",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "successfully fetch orders",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success",
                                                "success": "true",
                                                "data": [
                                                    {
                                                        "id": "31ec147e-4c90-4eb1-b3d5-a913aea11fff",
                                                        "order_id": "BUS_1774912978756J3PTNG",
                                                        "amount": "3100.00",
                                                        "currency": "NGN",
                                                        "payment_reference": null,
                                                        "gateway_reference": null,
                                                        "receipt_status": "PENDING",
                                                        "receipt_callback_url": "https://lagosmvaa.ng/services",
                                                        "userId": null,
                                                        "companyId": "3596de37-baf6-4535-af02-53dfbb73c5d2",
                                                        "gateway": "pay4it",
                                                        "billing_metadata": {
                                                            "pid": "N-191005",
                                                            "billingClientId": "3596de37-baf6-4535-af02-53dfbb73c5d2",
                                                            "appliedDate": "Test March 2026",
                                                            "country": "Nigeria",
                                                            "state": "Lagos State",
                                                            "assessmentReference": "MVX-RevenueSlip-",
                                                            "agencyCode": "4570000",
                                                            "billingClientName": null,
                                                            "billingClientType": "C"
                                                        },
                                                        "revenue_module_metadata": {
                                                            "revenueCode": "4010002",
                                                            "revenueClientName": "AUTO_DEALER_SPARE_PARTS",
                                                            "revenueClientId": "9dd1dda32a635879fb7fdd617629189111b0"
                                                        },
                                                        "trans_metadata": null,
                                                        "gateway_metadata": null,
                                                        "is_gateway_processed": false,
                                                        "is_processed_count": false,
                                                        "createdAt": "2026-03-30T23:22:58.762Z",
                                                        "updatedAt": "2026-03-30T23:22:58.762Z"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/transaction/{id}": {
                    "get": {
                        "operationId": "PaymentAppController_fetchSingleOrder",
                        "summary": "resource to fetch an order for a user",
                        "description": "\n             This endpoint serves as a v1 resource for fetching an order.\n    \n            - The request includes a request body with all the necessary parameters.\n            - A successful connection will generate an order.\n            - Clients can use a browser or some request client in Node.js.\n            - Each request payload has an identical shape as shown below ↓.\n    \n            Example:\n            ```js\n              handshake_token=abcd1234 \n              Authorization: Bearer {handshake_token} —— `credential signature`\n    \n              Testing Example:\n              -X GET https://{baseurl}/api/v2/shared/transaction/{orderId}\n              -H 'Content-Type: application/json' \n              -H 'Authorization: Bearer {handshake_token}'\n            ```\n          ",
                        "parameters": [
                            {
                                "name": "id",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "successfully fetch orders",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success",
                                                "success": "true",
                                                "data": {
                                                    "id": "7921a40d-9217-41c2-bb1d-a2caed83a93e",
                                                    "order_id": "BUS_17746119189282PETNG",
                                                    "amount": "3100.00",
                                                    "currency": "NGN",
                                                    "payment_reference": "1910050-9621528-145",
                                                    "gateway_reference": null,
                                                    "receipt_status": "CONFIRMED",
                                                    "receipt_callback_url": "https://lagosmvaa.ng/services",
                                                    "userId": null,
                                                    "companyId": "d9f1df25-97f6-445e-aea2-46c473269119",
                                                    "gateway": "pay4it",
                                                    "billing_metadata": {
                                                        "pid": "N-191005",
                                                        "billingClientId": "d9f1df25-97f6-445e-aea2-46c473269119",
                                                        "appliedDate": "Test March 2026",
                                                        "country": "Nigeria",
                                                        "state": "Lagos State",
                                                        "assessmentReference": "MVX-RevenueSlip-",
                                                        "agencyCode": "4570000",
                                                        "billingClientName": null,
                                                        "billingClientType": "C"
                                                    },
                                                    "revenue_module_metadata": {
                                                        "revenueCode": "4010002",
                                                        "revenueClientName": "AUTO_DEALER_SPARE_PARTS",
                                                        "revenueClientId": "9dd1dda32a635879fb7fdd617629189111b0"
                                                    },
                                                    "trans_metadata": null,
                                                    "gateway_metadata": null,
                                                    "is_gateway_processed": false,
                                                    "is_processed_count": false,
                                                    "createdAt": "2026-03-27T11:45:18.932Z",
                                                    "updatedAt": "2026-03-27T11:46:55.189Z"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/billing/identification": {
                    "post": {
                        "operationId": "PaymentAppController_createPayerId",
                        "summary": "v2 resource for creating a tax payer id",
                        "description": "\n            This endpoint is a v2 resource for creating a tax id for an entity with no payer id.\n\n            - The request includes a request body and a single query parameter.\n            - A successful request will generate a billing receipt.\n            - Clients can use a browser or some request client in Node.js.\n            - Each request payload has an identical shape as shown below ↓.\n\n            Example:\n            ```js\n            handshake_token=eyabcd1234.efghi12345jklmn \n            Authorization: Bearer {handshake_token} —— `credential signature`\n\n            Testing Example:\n            -X POST https://{baseurl}/api/v2/shared/billing/identification\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {handshake_token}'\n            {\n                \"type\":\"N\", // individual (N) — corporate (C)\n                \"title\":\"Mr\",\n                \"sex\":\"M\",\n                \"maritalStatus\":\"M\",\n                \"lastName\":\"ALIU\", \n                \"firstName\":\"CHIKE\", \n                \"middleName\":\"BOLA\",\n                \"dateOfBirth\":\"15-April-1990\",\n                \"PhoneNumber\":\"0000000001\",\n                \"email\":\"qazim_123@yahoo.com\",\n                \"address\":\"4 Adigun Street Test Avenue\",\n                \"ninNumber\":\"00000000000\"\n            }\n\n            ```\n        ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/BillingRegistrationDto"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "successfully creates a tax id",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "Pid Generated",
                                                "success": "true",
                                                "data": {
                                                    "Pid": "Payer Created: -ADEKUNLE YARO AZIKWE (N-7698735)",
                                                    "Status": "SUCCESS",
                                                    "StatusMessage": "Pid Generated"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "201": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied: session expired",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "path": "/api/v2/shared/billing/identification",
                                                "status": 401,
                                                "details": "credential access denied: session expired"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    },
                    "get": {
                        "operationId": "PaymentAppController_verifyTaxId",
                        "summary": "v2 resource for identification of billing data",
                        "description": "\n            This endpoint is a v2 resource for verification of billing numbers.\n\n            - The request includes no request body and a single query parameter.\n            - A successful connection will generate a billing receipt to confirm the pid.\n            - Clients can use a browser or some request client in Node.js.\n            - Each request payload has an identical shape as shown below ↓.\n\n            Example:\n            ```js\n            handshake_token=abcd1234 \n            Authorization: Bearer {handshake_token} —— `credential signature`\n            pid=N-191005\n\n            Testing Example:\n            -X POST https://{baseurl}/api/v2/shared/billing/identification?pid=N-191005\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {handshake_token}'\n\n            ```\n      ",
                        "parameters": [
                            {
                                "name": "pid",
                                "required": true,
                                "in": "query",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "Success",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "Valid Pid",
                                                "success": "true",
                                                "data": {
                                                    "ResponseCode": "SUCCESS",
                                                    "ResponseDesc": "Valid Pid",
                                                    "State": "XXSG",
                                                    "Pid": "N-191005",
                                                    "Nin": null,
                                                    "Fullname": "MR SUNDAY ADEROGBA ADEKOJO",
                                                    "Status": "SUCCESS",
                                                    "StatusMessage": "Valid Pid"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "Unauthorized",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {}
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/keys": {
                    "post": {
                        "operationId": "PaymentAppController_generatePay4itEncryptKeys",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/initializePay4it": {
                    "post": {
                        "operationId": "PaymentAppController_generatePay4itTransactionalOrder",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/verifyPay4it": {
                    "post": {
                        "operationId": "PaymentAppController_verifyPay4itTransactionalOrder",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/verifyPay4itPayment/{ref}": {
                    "post": {
                        "operationId": "PaymentAppController_verifyPay4itpayment",
                        "parameters": [
                            {
                                "name": "ref",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/initializeTranzact": {
                    "post": {
                        "operationId": "PaymentAppController_generateEtranzact",
                        "parameters": [],
                        "responses": {
                            "201": {
                                "description": "",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Billing"
                        ]
                    }
                },
                "/api/v1/staff/auth/signup-staff": {
                    "post": {
                        "operationId": "StaffAppController_registerAdmin",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/NewAdminDTO"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "201": {
                                "description": "admin created",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 201,
                                                "success": "true",
                                                "message": "admin created",
                                                "data": {}
                                            }
                                        }
                                    }
                                }
                            },
                            "502": {
                                "description": "failed attempt to create admin with non-unique property - email",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "An account with that email already exists!",
                                                "timestamp": "2025-09-19T09:01:14.087Z",
                                                "path": "/api/v1/portal/auth/signup",
                                                "status": 409,
                                                "details": "An account with that email already exists!"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Staff"
                        ]
                    }
                },
                "/api/v1/staff/auth/signin-staff": {
                    "post": {
                        "operationId": "StaffAppController_loginStaff",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ExistingUserDTO"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "OK",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "login successful",
                                                "success": "true",
                                                "data": {
                                                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.eyJzdWIiOjIsImVtYWlsIjoiZXhhbBsZUlbWFpbC5jb0iLCJpYXQiOjE3MzczODE2NzAsImV4cCI6MTczNzM4MjU3MH0.IR7YXeeHN47hUk6iub3rVOj_aI2CguNZs4UBvnI2aBY",
                                                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC.eyJzdWIiOjIsImVtYWlsIjoiZXhhbBsZBlbWFpbC5jb20iLCJpYXQiOjE3MzczODE2NAsImV4cCI6MTczNzk4NjQ3MH0.G1I23d8QESs_OyXenp1sbYRgwMxS8pgDPFRA86mIVO0",
                                                    "session_token": "930e4c43-d2a9-44a9-af23-4e70e32134a4"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "credentials malformed or incorrect",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "timestamp": "2024-01-20T14:22:55.040Z",
                                                "path": "/api/v1/portal/auth/signin",
                                                "error": "email is unverified.",
                                                "status": 403,
                                                "success": "false",
                                                "details": "email is unverified."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Staff"
                        ]
                    }
                },
                "/api/v1/staff/users": {
                    "get": {
                        "operationId": "StaffAppController_getUserData",
                        "parameters": [
                            {
                                "name": "sort",
                                "required": false,
                                "in": "query",
                                "schema": {
                                    "type": "string"
                                }
                            },
                            {
                                "name": "order",
                                "required": true,
                                "in": "query",
                                "schema": {
                                    "default": "ASC",
                                    "enum": [
                                        "ASC",
                                        "DESC",
                                        "asc",
                                        "desc"
                                    ],
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "resource for fetching all user profile data",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "data": [
                                                    {
                                                        "id": 1,
                                                        "firstName": "John",
                                                        "lastName": "Doe",
                                                        "email": "example@email.com",
                                                        "phone": "+2347030861112",
                                                        "profile_avatar": null,
                                                        "username": null,
                                                        "hash": "$2a$12$BL6sZo2SLBSfyE9cle3VB.xV.hp65RXj/S.5sPySeYo83j1hDxFiu",
                                                        "hashRef": "$2a$12$T4ZowDWv.fsewQW5.zEwHucHfvZurES.ynO75mjTx8yKxx19rWTh6",
                                                        "portal_id": null,
                                                        "verification_id": null,
                                                        "isVerified": false,
                                                        "isActivated": false,
                                                        "address": {
                                                            "street": "two",
                                                            "city": "Yenagoa",
                                                            "state": "Yenagoa",
                                                            "postalCode": "55120",
                                                            "country": "Nigeria"
                                                        },
                                                        "role": "admin",
                                                        "createdAt": "2025-01-22T12:02:24.125Z",
                                                        "updatedAt": "2025-01-27T13:55:21.219Z"
                                                    },
                                                    {
                                                        "id": 3,
                                                        "firstName": "Peter",
                                                        "lastName": "Petrelli",
                                                        "email": "hero@email.com",
                                                        "phone": "+2347030861111",
                                                        "profile_avatar": null,
                                                        "username": null,
                                                        "hash": "$2a$12$4uxtLsheLYDtA0v4ebmXBO9ogfpD1ZQmE4CyTW6iI97EVfuihAy1O",
                                                        "hashRef": "$2a$12$TFVmTv6dMyW/rERU2BAZ7O3uY2ItpEkrQF./iRmZF6wqlLD2G66my",
                                                        "portal_id": null,
                                                        "verification_id": null,
                                                        "isVerified": false,
                                                        "isActivated": false,
                                                        "address": {
                                                            "street": "14 Boulevard Avenue",
                                                            "city": "Inglewood",
                                                            "state": "Chicago",
                                                            "postalCode": "55120",
                                                            "country": "United States of America"
                                                        },
                                                        "role": "user",
                                                        "createdAt": "2025-01-27T13:48:27.077Z",
                                                        "updatedAt": "2025-01-27T13:48:27.517Z"
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            "403": {
                                "description": "authorization route for admin only "
                            }
                        },
                        "tags": [
                            "Staff"
                        ]
                    }
                },
                "/api/v1/staff/accounts/profile/{id}": {
                    "get": {
                        "operationId": "StaffAppController_getUserProfile",
                        "parameters": [
                            {
                                "name": "id",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "resource for fetching users profile",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "id": 2,
                                                "firstName": "John2",
                                                "lastName": "Doe2",
                                                "email": "exampleadmin@email.com",
                                                "phone": "+2347030861112",
                                                "profile_avatar": null,
                                                "username": null,
                                                "portal_id": null,
                                                "verification_id": null,
                                                "isVerified": false,
                                                "isActivated": false,
                                                "address": {
                                                    "street": "2, Odunsi Ifeoluwa Cr.",
                                                    "city": "Lagos Mainland",
                                                    "state": "Lagos",
                                                    "postalCode": "55120",
                                                    "country": "Nigeria"
                                                },
                                                "role": "admin",
                                                "createdAt": "2024-01-20T13:11:58.936Z",
                                                "updatedAt": "2025-01-20T14:01:11.540Z"
                                            }
                                        }
                                    }
                                }
                            },
                            "default": {
                                "description": "authorized route: admin",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied: session expired",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "path": "/api/v1/portal/auth/identification",
                                                "status": 401,
                                                "details": "credential access denied: session expired"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Staff"
                        ]
                    }
                },
                "/api/v1/staff/profile/{id}": {
                    "get": {
                        "operationId": "StaffAppController_getOrders",
                        "parameters": [
                            {
                                "name": "id",
                                "required": true,
                                "in": "path",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        ],
                        "responses": {
                            "200": {
                                "description": "resource for fetching admin profile",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "id": 2,
                                                "firstName": "John2",
                                                "lastName": "Doe2",
                                                "email": "exampleadmin@email.com",
                                                "phone": "+2347030861112",
                                                "profile_avatar": null,
                                                "username": null,
                                                "portal_id": null,
                                                "verification_id": null,
                                                "isVerified": false,
                                                "isActivated": false,
                                                "address": {
                                                    "street": "2, Odunsi Ifeoluwa Cr.",
                                                    "city": "Lagos Mainland",
                                                    "state": "Lagos",
                                                    "postalCode": "55120",
                                                    "country": "Nigeria"
                                                },
                                                "role": "admin",
                                                "createdAt": "2024-01-20T13:11:58.936Z",
                                                "updatedAt": "2025-01-20T14:01:11.540Z"
                                            }
                                        }
                                    }
                                }
                            },
                            "default": {
                                "description": "authorized route: admin",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "credential access denied: session expired",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "path": "/api/v1/portal/auth/identification",
                                                "status": 401,
                                                "details": "credential access denied: session expired"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Staff"
                        ]
                    }
                },
                "/api/v2/webhook/register": {
                    "post": {
                        "operationId": "WebhookAppController_handleRecipientRegistration",
                        "summary": "resource to verify an order status",
                        "description": "\n            This endpoint serves as an admin resource for registering module urls for message dispatch.\n    \n            - The request includes a request body with all the necessary parameters.\n            - A successful connection will create a secret for any module registered.\n            - Clients can use a browser or some request client in Node.js.\n            - Each request payload has an identical shape as shown below ↓.\n            \n            Example:\n            ```js\n              Testing Example:\n              -X POST https://{baseurl}/api/v2/webhook/register'\n              -H 'Content-Type: application/json' \n              {\n                \"url\": \"your_webhook_url\",\n                \"isPaymentFailed\": false,\n                \"isPaymentSuccess\": true\n              }\n            ```\n\n            - Consumer can verify central payload after payment response is sent and validate with request secret as shown below ↓.\n            - An admin registers the url above, the payload is sent to the url, consumer/module validates the payload is from central source with secret.\n\n            Example:\n            ```js\n              Testing Webhook Payload:\n              const hash = crypto\n                        .createHmac(\"sha256\", secret) // use secret to generate hash to enhance trust with payload\n                        .update(JSON.stringify(req.body))\n                        .digest(\"hex\");\n\n            if (hash !== req.headers[\"x-mvaa-signature-id\"]) {\n                    throw new Error(\"Invalid signature\");\n            }\n            ```\n          ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/CreateWebhookRequestDto"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "successfully fetch orders",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "success",
                                                "success": "true",
                                                "data": {
                                                    "secret": "MV_TESTcf5fe70c27cc2d2f38befef9dc8277f40811c151faf0bed26c1734609bbc1376"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "401": {
                                "description": "credential access denied",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": "false",
                                                "error": "Unauthorized",
                                                "timestamp": "2025-09-21T06:26:08.935Z",
                                                "status": 401,
                                                "details": "Unauthorized"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Webhook"
                        ]
                    }
                }
            },
            "info": {
                "title": "mvva-lagos resource specification document",
                "description": "open-api specification",
                "version": "2.0.0",
                "contact": {}
            },
            "tags": [],
            "servers": [],
            "components": {
                "securitySchemes": {
                    "bearer": {
                        "scheme": "bearer",
                        "bearerFormat": "JWT",
                        "type": "http"
                    },
                    "cookie": {
                        "type": "apiKey",
                        "in": "cookie",
                        "name": "connect.sid"
                    }
                },
                "schemas": {
                    "AddressUI": {
                        "type": "object",
                        "properties": {
                            "street": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "lga": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "state": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            }
                        },
                        "required": [
                            "street",
                            "lga",
                            "state"
                        ]
                    },
                    "NewUserDTO": {
                        "type": "object",
                        "properties": {
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "phone": {
                                "type": "string"
                            },
                            "placeOfBirth": {
                                "type": "string"
                            },
                            "maritalStatus": {
                                "type": "string"
                            },
                            "address": {
                                "$ref": "#/components/schemas/AddressUI"
                            },
                            "password": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "firstName",
                            "lastName",
                            "email",
                            "phone",
                            "placeOfBirth",
                            "maritalStatus",
                            "address",
                            "password"
                        ]
                    },
                    "ExistingUserDTO": {
                        "type": "object",
                        "properties": {
                            "email": {
                                "type": "string"
                            },
                            "password": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "email",
                            "password"
                        ]
                    },
                    "ProfileUpdateDto": {
                        "type": "object",
                        "properties": {
                            "email": {
                                "type": "string"
                            },
                            "phone": {
                                "type": "string"
                            },
                            "username": {
                                "type": "string"
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "address": {
                                "$ref": "#/components/schemas/AddressUI"
                            }
                        }
                    },
                    "CompanyUtilityBillUpdateDto": {
                        "type": "object",
                        "properties": {
                            "url": {
                                "type": "string"
                            },
                            "userType": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "url",
                            "userType"
                        ]
                    },
                    "PasswordResetDto": {
                        "type": "object",
                        "properties": {
                            "password": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "password"
                        ]
                    },
                    "CompanyAddressUI": {
                        "type": "object",
                        "properties": {
                            "flatNumber": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "blockNumber": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "street": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "landmark": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "lga": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "state": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "contactPhone": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "utilityBillDescription": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            },
                            "utilityBill": {
                                "type": "string",
                                "minLength": 2,
                                "maxLength": 50
                            }
                        },
                        "required": [
                            "flatNumber",
                            "blockNumber",
                            "street",
                            "landmark",
                            "lga",
                            "state",
                            "contactPhone",
                            "email",
                            "utilityBillDescription",
                            "utilityBill"
                        ]
                    },
                    "CompanyOwnerUI": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string"
                            },
                            "surname": {
                                "type": "string"
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "sex": {
                                "type": "string"
                            },
                            "maritalStatus": {
                                "type": "string"
                            },
                            "dob": {
                                "type": "string"
                            },
                            "placeOfBirth": {
                                "type": "string"
                            },
                            "nationalIdentificationNumber": {
                                "type": "string"
                            },
                            "driverLicenseNumber": {
                                "type": "string"
                            },
                            "passportNumber": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "title",
                            "surname",
                            "firstName",
                            "sex",
                            "maritalStatus",
                            "dob",
                            "placeOfBirth",
                            "nationalIdentificationNumber",
                            "driverLicenseNumber",
                            "passportNumber"
                        ]
                    },
                    "NewCompanyDto": {
                        "type": "object",
                        "properties": {
                            "companyName": {
                                "type": "string"
                            },
                            "companyRCNumber": {
                                "type": "string"
                            },
                            "companyTIN": {
                                "type": "string"
                            },
                            "companyRepName": {
                                "type": "string"
                            },
                            "companyRepPhone": {
                                "type": "string"
                            },
                            "companyRepEmail": {
                                "type": "string"
                            },
                            "address": {
                                "$ref": "#/components/schemas/CompanyAddressUI"
                            },
                            "companyOwner": {
                                "$ref": "#/components/schemas/CompanyOwnerUI"
                            },
                            "password": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "companyName",
                            "companyRCNumber",
                            "companyTIN",
                            "companyRepName",
                            "companyRepPhone",
                            "companyRepEmail",
                            "address",
                            "companyOwner",
                            "password",
                            "email"
                        ]
                    },
                    "IVerifyWithNIN": {
                        "type": "object",
                        "properties": {
                            "firstname": {
                                "type": "string"
                            },
                            "lastname": {
                                "type": "string"
                            },
                            "dob": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "phone": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "gender": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "firstname",
                            "lastname"
                        ]
                    },
                    "IVerifyWithCAC": {
                        "type": "object",
                        "properties": {
                            "regNumber": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "regNumber"
                        ]
                    },
                    "GlobalBillingReceiptDto": {
                        "type": "object",
                        "properties": {
                            "pid": {
                                "type": "string"
                            },
                            "amount": {
                                "type": "string"
                            },
                            "agencyCode": {
                                "type": "string"
                            },
                            "revCode": {
                                "type": "string"
                            },
                            "assessmentReference": {
                                "type": "string"
                            },
                            "appliedDate": {
                                "type": "string"
                            },
                            "currency": {
                                "type": "string"
                            },
                            "country": {
                                "type": "string"
                            },
                            "state": {
                                "type": "string"
                            },
                            "gateway": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "pid",
                            "amount",
                            "agencyCode",
                            "revCode",
                            "assessmentReference",
                            "appliedDate",
                            "currency",
                            "country",
                            "state",
                            "gateway"
                        ]
                    },
                    "BillingRegistrationDto": {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string"
                            },
                            "title": {
                                "type": "string"
                            },
                            "sex": {
                                "type": "string"
                            },
                            "maritalStatus": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "middleName": {
                                "type": "string"
                            },
                            "dateOfBirth": {
                                "type": "string"
                            },
                            "phoneNumber": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "address": {
                                "type": "string"
                            },
                            "ninNumber": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "type",
                            "title",
                            "sex",
                            "maritalStatus",
                            "lastName",
                            "firstName",
                            "middleName",
                            "dateOfBirth",
                            "phoneNumber",
                            "email",
                            "address",
                            "ninNumber"
                        ]
                    },
                    "NewAdminDTO": {
                        "type": "object",
                        "properties": {
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "password": {
                                "type": "string"
                            },
                            "username": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "firstName",
                            "lastName",
                            "email",
                            "password",
                            "username"
                        ]
                    },
                    "CreateWebhookRequestDto": {
                        "type": "object",
                        "properties": {
                            "url": {
                                "type": "string"
                            },
                            "isPaymentFailed": {
                                "type": "boolean"
                            },
                            "isPaymentSuccess": {
                                "type": "boolean"
                            }
                        },
                        "required": [
                            "url",
                            "isPaymentFailed",
                            "isPaymentSuccess"
                        ]
                    },
                    "PayerIdentification": {
                        "type": "object",
                        "properties": {
                            "portalId": {
                                "type": "string"
                            },
                            "issuerId": {
                                "type": "string"
                            },
                            "issueType": {
                                "type": "string"
                            },
                            "issueDate": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "issueExpiryDate": {
                                "format": "date-time",
                                "type": "string"
                            }
                        },
                        "required": [
                            "portalId",
                            "issuerId",
                            "issueType",
                            "issueDate",
                            "issueExpiryDate"
                        ]
                    },
                    "Residence": {
                        "type": "object",
                        "properties": {
                            "address1": {
                                "type": "string"
                            },
                            "town": {
                                "type": "string"
                            },
                            "lga": {
                                "type": "string"
                            },
                            "state": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "address1",
                            "town",
                            "lga",
                            "state"
                        ]
                    },
                    "EntityIdentification": {
                        "type": "object",
                        "properties": {
                            "nin": {
                                "type": "string"
                            },
                            "firstname": {
                                "type": "string"
                            },
                            "lastname": {
                                "type": "string"
                            },
                            "middlename": {
                                "type": "string"
                            },
                            "phone": {
                                "type": "string"
                            },
                            "gender": {
                                "type": "string"
                            },
                            "photo": {
                                "type": "string"
                            },
                            "birthdate": {
                                "type": "string"
                            },
                            "residence": {
                                "$ref": "#/components/schemas/Residence"
                            }
                        },
                        "required": [
                            "nin",
                            "firstname",
                            "lastname",
                            "middlename",
                            "phone",
                            "gender",
                            "photo",
                            "birthdate",
                            "residence"
                        ]
                    },
                    "Address": {
                        "type": "object",
                        "properties": {
                            "street": {
                                "type": "string"
                            },
                            "lga": {
                                "type": "string"
                            },
                            "city": {
                                "type": "string"
                            },
                            "state": {
                                "type": "string"
                            },
                            "postalCode": {
                                "type": "string"
                            },
                            "country": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "street",
                            "lga",
                            "city",
                            "state",
                            "postalCode",
                            "country"
                        ]
                    },
                    "AdminEntity": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "username": {
                                "type": "string"
                            },
                            "hash": {
                                "type": "string"
                            },
                            "hashRef": {
                                "type": "string"
                            },
                            "departmentId": {
                                "type": "string"
                            },
                            "department": {
                                "type": "string"
                            },
                            "image": {
                                "type": "string"
                            },
                            "role": {
                                "type": "string"
                            },
                            "userType": {
                                "type": "object"
                            },
                            "profileAvatar": {
                                "$ref": "#/components/schemas/UserAvatar"
                            },
                            "roleMarkers": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "sessions": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/SessionEntity"
                                }
                            },
                            "createdAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "updatedAt": {
                                "format": "date-time",
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "username",
                            "hash",
                            "hashRef",
                            "departmentId",
                            "department",
                            "image",
                            "role",
                            "userType",
                            "profileAvatar",
                            "roleMarkers",
                            "sessions",
                            "createdAt",
                            "updatedAt"
                        ]
                    },
                    "CompanyTINEntityIdentification": {
                        "type": "object",
                        "properties": {
                            "tin": {
                                "type": "string"
                            },
                            "taxpayerName": {
                                "type": "string"
                            },
                            "cacRegNo": {
                                "type": "string"
                            },
                            "entityType": {
                                "type": "string"
                            },
                            "jittin": {
                                "type": "string"
                            },
                            "taxOffice": {
                                "type": "string"
                            },
                            "phone": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "tin",
                            "taxpayerName",
                            "cacRegNo",
                            "entityType",
                            "jittin",
                            "taxOffice",
                            "phone",
                            "email"
                        ]
                    },
                    "OrderEntity": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "order_id": {
                                "type": "string"
                            },
                            "amount": {
                                "type": "string"
                            },
                            "client_id": {
                                "type": "string"
                            },
                            "order_status": {
                                "type": "string"
                            },
                            "client_name": {
                                "type": "string"
                            },
                            "user": {
                                "$ref": "#/components/schemas/UserEntity"
                            },
                            "order_url": {
                                "type": "string"
                            },
                            "accessCode": {
                                "type": "string"
                            },
                            "createdAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "updatedAt": {
                                "format": "date-time",
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "order_id",
                            "amount",
                            "client_id",
                            "order_status",
                            "client_name",
                            "user",
                            "order_url",
                            "accessCode",
                            "createdAt",
                            "updatedAt"
                        ]
                    },
                    "CompanyAddress": {
                        "type": "object",
                        "properties": {
                            "street": {
                                "type": "string"
                            },
                            "lga": {
                                "type": "string"
                            },
                            "city": {
                                "type": "string"
                            },
                            "state": {
                                "type": "string"
                            },
                            "postalCode": {
                                "type": "string"
                            },
                            "country": {
                                "type": "string"
                            },
                            "flatNumber": {
                                "type": "string"
                            },
                            "blockNumber": {
                                "type": "string"
                            },
                            "landmark": {
                                "type": "string"
                            },
                            "contactPhone": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "utilityBillDescription": {
                                "type": "string"
                            },
                            "utilityBill": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "street",
                            "lga",
                            "city",
                            "state",
                            "postalCode",
                            "country",
                            "flatNumber",
                            "blockNumber",
                            "landmark",
                            "contactPhone",
                            "email",
                            "utilityBillDescription",
                            "utilityBill"
                        ]
                    },
                    "UserEntityIdentification": {
                        "type": "object",
                        "properties": {
                            "nin": {
                                "type": "string"
                            },
                            "firstname": {
                                "type": "string"
                            },
                            "lastname": {
                                "type": "string"
                            },
                            "middlename": {
                                "type": "string"
                            },
                            "phone": {
                                "type": "string"
                            },
                            "gender": {
                                "type": "string"
                            },
                            "photo": {
                                "type": "string"
                            },
                            "birthdate": {
                                "type": "string"
                            },
                            "residence": {
                                "$ref": "#/components/schemas/Residence"
                            }
                        },
                        "required": [
                            "nin",
                            "firstname",
                            "lastname",
                            "middlename",
                            "phone",
                            "gender",
                            "photo",
                            "birthdate",
                            "residence"
                        ]
                    },
                    "CompanyOwner": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string"
                            },
                            "surname": {
                                "type": "string"
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "sex": {
                                "type": "string"
                            },
                            "maritalStatus": {
                                "type": "string"
                            },
                            "dob": {
                                "type": "string"
                            },
                            "placeOfBirth": {
                                "type": "string"
                            },
                            "nationalIdentificationNumber": {
                                "type": "string"
                            },
                            "driverLicenseNumber": {
                                "type": "string"
                            },
                            "passportNumber": {
                                "type": "string"
                            },
                            "entityId": {
                                "$ref": "#/components/schemas/UserEntityIdentification"
                            }
                        },
                        "required": [
                            "title",
                            "surname",
                            "firstName",
                            "sex",
                            "maritalStatus",
                            "dob",
                            "placeOfBirth",
                            "nationalIdentificationNumber",
                            "driverLicenseNumber",
                            "passportNumber",
                            "entityId"
                        ]
                    },
                    "CorporateEntity": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "username": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "hash": {
                                "type": "string"
                            },
                            "hashRef": {
                                "type": "string"
                            },
                            "createdAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "updatedAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "isActivated": {
                                "type": "boolean"
                            },
                            "payerId": {
                                "$ref": "#/components/schemas/PayerIdentification"
                            },
                            "entityId": {
                                "$ref": "#/components/schemas/EntityIdentification"
                            },
                            "tinEntityId": {
                                "$ref": "#/components/schemas/CompanyTINEntityIdentification"
                            },
                            "isVerified": {
                                "type": "boolean"
                            },
                            "role": {
                                "type": "string"
                            },
                            "userType": {
                                "type": "object"
                            },
                            "image": {
                                "type": "string"
                            },
                            "profileAvatar": {
                                "$ref": "#/components/schemas/UserAvatar"
                            },
                            "sessions": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/SessionEntity"
                                }
                            },
                            "orders": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/OrderEntity"
                                }
                            },
                            "address": {
                                "$ref": "#/components/schemas/CompanyAddress"
                            },
                            "companyOwner": {
                                "$ref": "#/components/schemas/CompanyOwner"
                            },
                            "companyName": {
                                "type": "string"
                            },
                            "companyRCNumber": {
                                "type": "string"
                            },
                            "companyTIN": {
                                "type": "string"
                            },
                            "companyRepName": {
                                "type": "string"
                            },
                            "companyRepPhone": {
                                "type": "string"
                            },
                            "companyRepEmail": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "username",
                            "email",
                            "hash",
                            "hashRef",
                            "createdAt",
                            "updatedAt",
                            "isActivated",
                            "payerId",
                            "entityId",
                            "tinEntityId",
                            "isVerified",
                            "role",
                            "userType",
                            "image",
                            "profileAvatar",
                            "sessions",
                            "orders",
                            "address",
                            "companyOwner",
                            "companyName",
                            "companyRCNumber",
                            "companyTIN",
                            "companyRepName",
                            "companyRepPhone",
                            "companyRepEmail"
                        ]
                    },
                    "SessionEntity": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "userId": {
                                "type": "string"
                            },
                            "adminId": {
                                "type": "string"
                            },
                            "companyId": {
                                "type": "string"
                            },
                            "user": {
                                "$ref": "#/components/schemas/UserEntity"
                            },
                            "admin": {
                                "$ref": "#/components/schemas/AdminEntity"
                            },
                            "company": {
                                "$ref": "#/components/schemas/CorporateEntity"
                            },
                            "userType": {
                                "type": "object"
                            },
                            "sessionToken": {
                                "type": "string"
                            },
                            "refreshToken": {
                                "type": "string"
                            },
                            "ipAddress": {
                                "type": "string"
                            },
                            "userAgent": {
                                "type": "string"
                            },
                            "deviceType": {
                                "type": "string"
                            },
                            "isLoggedInCurrent": {
                                "type": "boolean"
                            },
                            "expiresAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "createdAt": {
                                "format": "date-time",
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "userType",
                            "sessionToken",
                            "ipAddress",
                            "userAgent",
                            "deviceType",
                            "isLoggedInCurrent",
                            "expiresAt",
                            "createdAt"
                        ]
                    },
                    "GatewayEvents": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "payment_id": {
                                "type": "string"
                            },
                            "order": {
                                "$ref": "#/components/schemas/WeightedOrderEntity"
                            },
                            "payment_gateway": {
                                "type": "string",
                                "enum": [
                                    "paystack",
                                    "flutterwave",
                                    "pay4it",
                                    "credo"
                                ]
                            },
                            "gateway_reference": {
                                "type": "string"
                            },
                            "gateway_event": {
                                "type": "string"
                            },
                            "processedAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "payload": {
                                "type": "object"
                            },
                            "is_module_webhook": {
                                "type": "boolean"
                            },
                            "is_module_validate": {
                                "type": "boolean"
                            },
                            "createdAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "updatedAt": {
                                "format": "date-time",
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "payment_id",
                            "payment_gateway",
                            "gateway_reference",
                            "gateway_event",
                            "processedAt",
                            "payload",
                            "is_module_webhook",
                            "is_module_validate",
                            "createdAt",
                            "updatedAt"
                        ]
                    },
                    "BillingClientMetaData": {
                        "type": "object",
                        "properties": {
                            "pid": {
                                "type": "string"
                            },
                            "billingClientType": {
                                "type": "string"
                            },
                            "billingClientName": {
                                "type": "string"
                            },
                            "billingClientId": {
                                "type": "string"
                            },
                            "agencyCode": {
                                "type": "string"
                            },
                            "appliedDate": {
                                "type": "string"
                            },
                            "assessmentReference": {
                                "type": "string"
                            },
                            "guid_ref": {
                                "type": "string"
                            },
                            "country": {
                                "type": "string"
                            },
                            "state": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "pid",
                            "billingClientType",
                            "billingClientName",
                            "billingClientId",
                            "agencyCode",
                            "appliedDate",
                            "assessmentReference",
                            "guid_ref",
                            "country",
                            "state"
                        ]
                    },
                    "RevenueMetadata": {
                        "type": "object",
                        "properties": {
                            "revenueCode": {
                                "type": "string"
                            },
                            "revenueClientId": {
                                "type": "string"
                            },
                            "revenueClientName": {
                                "type": "string",
                                "enum": [
                                    "NUMBER_PLATE_SERVICES",
                                    "DRIVING_LICENSE",
                                    "VEHICLE_REGISTRATION",
                                    "AUTO_DEALER_SPARE_PARTS",
                                    "HACKNEY_PERMIT",
                                    "ROAD_WORTHINESS",
                                    "THIRD_PARTY_INSURANCE",
                                    " INTERNATIONAL_DRIVING_LICENSE",
                                    "TINTED_PERMIT"
                                ]
                            },
                            "revenueProductId": {
                                "type": "string"
                            },
                            "revenueProductDescription": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "revenueCode",
                            "revenueClientId",
                            "revenueClientName",
                            "revenueProductId",
                            "revenueProductDescription"
                        ]
                    },
                    "TransactionMetadata": {
                        "type": "object",
                        "properties": {
                            "mobilePhoneNumber": {
                                "type": "string"
                            },
                            "walletName": {
                                "type": "string"
                            },
                            "bankName": {
                                "type": "string"
                            },
                            "bankAccountNumber": {
                                "type": "string"
                            },
                            "bankCode": {
                                "type": "string"
                            },
                            "NIN": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "mobilePhoneNumber",
                            "walletName",
                            "bankName",
                            "bankAccountNumber",
                            "bankCode",
                            "NIN"
                        ]
                    },
                    "ProcessedOrderMetadata": {
                        "type": "object",
                        "properties": {}
                    },
                    "WeightedOrderEntity": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "order_id": {
                                "type": "string"
                            },
                            "amount": {
                                "type": "string"
                            },
                            "currency": {
                                "type": "string"
                            },
                            "payment_reference": {
                                "type": "string"
                            },
                            "gateway_reference": {
                                "type": "string"
                            },
                            "receipt_status": {
                                "type": "string",
                                "enum": [
                                    "PENDING",
                                    "CONFIRMED",
                                    "FULFILLED",
                                    "PROCESSED",
                                    "FAILED",
                                    "CANCELLED"
                                ]
                            },
                            "receipt_callback_url": {
                                "type": "string"
                            },
                            "userId": {
                                "type": "string"
                            },
                            "companyId": {
                                "type": "string"
                            },
                            "user": {
                                "$ref": "#/components/schemas/UserEntity"
                            },
                            "company": {
                                "$ref": "#/components/schemas/CorporateEntity"
                            },
                            "event": {
                                "$ref": "#/components/schemas/GatewayEvents"
                            },
                            "gateway": {
                                "type": "string",
                                "enum": [
                                    "paystack",
                                    "flutterwave",
                                    "pay4it",
                                    "credo"
                                ]
                            },
                            "billing_metadata": {
                                "$ref": "#/components/schemas/BillingClientMetaData"
                            },
                            "revenue_module_metadata": {
                                "$ref": "#/components/schemas/RevenueMetadata"
                            },
                            "trans_metadata": {
                                "$ref": "#/components/schemas/TransactionMetadata"
                            },
                            "gateway_metadata": {
                                "$ref": "#/components/schemas/ProcessedOrderMetadata"
                            },
                            "is_gateway_processed": {
                                "type": "boolean"
                            },
                            "is_processed_count": {
                                "type": "number"
                            },
                            "createdAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "updatedAt": {
                                "format": "date-time",
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "order_id",
                            "amount",
                            "currency",
                            "payment_reference",
                            "gateway_reference",
                            "receipt_status",
                            "receipt_callback_url",
                            "userId",
                            "event",
                            "gateway",
                            "billing_metadata",
                            "revenue_module_metadata",
                            "trans_metadata",
                            "gateway_metadata",
                            "is_gateway_processed",
                            "is_processed_count",
                            "createdAt",
                            "updatedAt"
                        ]
                    },
                    "UserEntity": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string"
                            },
                            "phone": {
                                "type": "string"
                            },
                            "username": {
                                "type": "string"
                            },
                            "hash": {
                                "type": "string"
                            },
                            "hashRef": {
                                "type": "string"
                            },
                            "portalId": {
                                "type": "string"
                            },
                            "payerId": {
                                "$ref": "#/components/schemas/PayerIdentification"
                            },
                            "verificationId": {
                                "type": "string"
                            },
                            "entityId": {
                                "$ref": "#/components/schemas/EntityIdentification"
                            },
                            "isVerified": {
                                "type": "boolean"
                            },
                            "isActivated": {
                                "type": "boolean"
                            },
                            "address": {
                                "$ref": "#/components/schemas/Address"
                            },
                            "maritalStatus": {
                                "type": "string"
                            },
                            "placeOfBirth": {
                                "type": "string"
                            },
                            "driverLicenseNumber": {
                                "type": "string"
                            },
                            "passportNumber": {
                                "type": "string"
                            },
                            "image": {
                                "type": "string"
                            },
                            "role": {
                                "type": "string"
                            },
                            "userType": {
                                "type": "object"
                            },
                            "profileAvatar": {
                                "$ref": "#/components/schemas/UserAvatar"
                            },
                            "roleMarkers": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "sessions": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/SessionEntity"
                                }
                            },
                            "orders": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/WeightedOrderEntity"
                                }
                            },
                            "createdAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "updatedAt": {
                                "format": "date-time",
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                            "phone",
                            "username",
                            "hash",
                            "hashRef",
                            "portalId",
                            "payerId",
                            "verificationId",
                            "entityId",
                            "isVerified",
                            "isActivated",
                            "address",
                            "maritalStatus",
                            "placeOfBirth",
                            "driverLicenseNumber",
                            "passportNumber",
                            "image",
                            "role",
                            "userType",
                            "profileAvatar",
                            "roleMarkers",
                            "sessions",
                            "orders",
                            "createdAt",
                            "updatedAt"
                        ]
                    },
                    "UserAvatar": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number"
                            },
                            "asset_id": {
                                "type": "string"
                            },
                            "public_id": {
                                "type": "string"
                            },
                            "version": {
                                "type": "string"
                            },
                            "version_id": {
                                "type": "string"
                            },
                            "signature": {
                                "type": "string"
                            },
                            "format": {
                                "type": "string"
                            },
                            "resource_type": {
                                "type": "string"
                            },
                            "created_at": {
                                "type": "string"
                            },
                            "bytes": {
                                "type": "number"
                            },
                            "type": {
                                "type": "string"
                            },
                            "placeholder": {
                                "type": "string"
                            },
                            "url": {
                                "type": "string"
                            },
                            "secure_url": {
                                "type": "string"
                            },
                            "folder": {
                                "type": "string"
                            },
                            "original_filename": {
                                "type": "string"
                            },
                            "userId": {
                                "type": "string"
                            },
                            "adminId": {
                                "type": "string"
                            },
                            "companyId": {
                                "type": "string"
                            },
                            "user": {
                                "$ref": "#/components/schemas/UserEntity"
                            },
                            "admin": {
                                "$ref": "#/components/schemas/AdminEntity"
                            },
                            "company": {
                                "$ref": "#/components/schemas/CorporateEntity"
                            },
                            "createdAt": {
                                "format": "date-time",
                                "type": "string"
                            },
                            "updatedAt": {
                                "format": "date-time",
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "asset_id",
                            "public_id",
                            "version",
                            "version_id",
                            "signature",
                            "format",
                            "resource_type",
                            "created_at",
                            "bytes",
                            "type",
                            "placeholder",
                            "url",
                            "secure_url",
                            "folder",
                            "original_filename",
                            "createdAt",
                            "updatedAt"
                        ]
                    }
                }
            }
        },
        "customOptions": {
            "persistAuthorization": true,
            "tryItOutEnabled": false,
            "supportedSubmitMethods": []
        }
    };
    url = options.swaggerUrl || url
    let urls = options.swaggerUrls
    let customOptions = options.customOptions
    let spec1 = options.swaggerDoc
    let swaggerOptions = {
        spec: spec1,
        url: url,
        urls: urls,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
    }
    for (let attrname in customOptions) {
        swaggerOptions[ attrname ] = customOptions[ attrname ];
    }
    let ui = SwaggerUIBundle(swaggerOptions)

    if (customOptions.initOAuth) {
        ui.initOAuth(customOptions.initOAuth)
    }

    if (customOptions.authAction) {
        ui.authActions.authorize(customOptions.authAction)
    }

    window.ui = ui
}
