
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
                        "description": "\n        This endpoint serves as the entry point for a new user on the portal.\n\n        - The request includes a request body and no query parameters nor authentication cookie sessions.\n        - A successful connection will trigger an e-mail service to the respective registration email for account activation — open and click format.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓00000.\n      ",
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
                        ],
                        "security": [
                            {
                                "portal_session_id": []
                            }
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
                                "description": "resource for user account updates",
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
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/accounts/update-password/{email}": {
                    "patch": {
                        "operationId": "AppController_updateAccountPassword",
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
                                "description": "resource for user password updates",
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
                            "Portal"
                        ]
                    }
                },
                "/api/v1/portal/accounts/reset-password/{token}": {
                    "patch": {
                        "operationId": "AppController_resetUserPassword",
                        "parameters": [
                            {
                                "name": "token",
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
                                "description": "resource for password reset",
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
                            "Company"
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
                            "Company"
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
                        "description": "\n        This endpoint serves as the original resource for authentication in v2.\n\n        - The request includes no request body and some query parameters(email, sessionId, redirect, url).\n        - The query parameters (url and redirect) will force a redirect automatically.\n        - In the absence of either the url or the redirect the response will remain on the client that initiated the request\n        - A successful connection will generate some token to be used up upon redirection (if redirection is true).\n        - Generated tokens will expire after 3mins or 180s.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```\n            http://localhost:3000/api/v2/session/auth/issuetoken?email=example@gmail.com&url=http://localhost:5200&sid=dbd77750-7fdf-4e83-8522-43cc47aaf09f&redirect=true\n        ```\n      ",
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
                        "summary": "v2 resource for fetching user profile",
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
                "/api/v1/shared/retrieveuseridentification/{agency}": {
                    "post": {
                        "operationId": "SharedAppController_getIdentification",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "resource for agency identification (e.g NIMC, FRSC)",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": true,
                                                "status": 200
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Shared"
                        ]
                    }
                },
                "/api/v1/shared/registervehicle": {
                    "post": {
                        "operationId": "SharedAppController_registerVehicle",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "resource for vehicle registration",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": true,
                                                "status": 200
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Shared"
                        ]
                    }
                },
                "/api/v1/shared/profile": {
                    "get": {
                        "operationId": "SharedAppController_getUserCredentials",
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
                                "description": "fetch user profile",
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
                            "default": {
                                "description": "cookie-based user authorization",
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
                            "Shared"
                        ],
                        "security": [
                            {
                                "portal_session_id": []
                            }
                        ]
                    }
                },
                "/api/v2/shared/payment/generate": {
                    "post": {
                        "operationId": "PaymentAppController_generateOrder",
                        "summary": "resource to generate a billing order",
                        "description": "\n        This endpoint serves as a v2 resource for creating orders post billing.\n\n        - The request includes a request body with all the necessary parameters.\n        - A successful connection will generate an order.\n        - Clients can use a browser or some request client in Node.js.\n        - Each request payload has an identical shape as shown below ↓.\n\n        Example:\n        ```js\n          handshake_token=abcd1234 \n          Authorization: Bearer {handshake_token} —— `credential signature`\n\n          Testing Example:\n          -X POST https://{baseurl}/api/v2/shared/payment/generate\n          -H 'Content-Type: application/json' \n          -H 'Authorization: Bearer {handshake_token}'\n            {\n                \"email\": \"customer@example.com\",\n                \"amount\": 5000,\n                \"reference\": \"unique_transaction_reference_1\"\n            }    \n        ```\n      ",
                        "parameters": [],
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
                                                    "order_id": "ord-mvaa1751274129065nguhysif",
                                                    "amount": 5000,
                                                    "client_id": "NUMBER_PLATE_SERVICES",
                                                    "order_status": "PENDING",
                                                    "client_name": "NUMBER_PLATE_SERVICES",
                                                    "order_url": "https://checkout.paystack.com/h3q09ag0a4b0qd2",
                                                    "accessCode": "h3q09ag0a4b0qd2",
                                                    "user": "04aa0fcc-01cb-48d3-a8b2-39dd1a839f19",
                                                    "id": "64a24443-df1d-4958-a880-47a08941ca7d",
                                                    "createdAt": "2025-06-30T09:02:10.317Z",
                                                    "updatedAt": "2025-06-30T09:02:10.317Z"
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
                            "Shared—Billing"
                        ]
                    }
                },
                "/api/v2/shared/billing/identification": {
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
                            "Shared—Billing"
                        ]
                    },
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
                            "Shared—Billing"
                        ]
                    }
                },
                "/api/v2/shared/billing/confirmation-total": {
                    "get": {
                        "operationId": "PaymentAppController_paymentConfirmationTotal",
                        "summary": "v2 resource for collecting total billing for a payer with reference",
                        "description": "\n            This endpoint is a v2 resource for billing confirmation of payer with a guid reference.\n\n            - The request includes no request body and a single query parameter.\n            - A successful request will generate a billing receipt for the total pay.\n            - Clients can use a browser or some request client in Node.js.\n            - Each request payload has an identical shape as shown below ↓.\n\n            Example:\n            ```js\n            handshake_token=abcd1234 \n            Authorization: Bearer {handshake_token} —— `credential signature`\n            guid=64624450-9793087-295\n\n            Testing Example:\n            -X GET https://{baseurl}/api/v2/shared/billing/confirmation-total?guid=64624450-9793087-295\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {handshake_token}'\n\n            ```\n      ",
                        "parameters": [
                            {
                                "name": "guid",
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
                                                "message": "Valid Receipt",
                                                "success": "true",
                                                "data": {
                                                    "totalpay": "1,150.00",
                                                    "status": "SUCCESS"
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
                            "Shared—Billing"
                        ]
                    }
                },
                "/api/v2/shared/billing/confirmation": {
                    "get": {
                        "operationId": "PaymentAppController_paymentConfirmationByReference",
                        "summary": "v2 resource for collecting a single billing for a payer with reference",
                        "description": "\n            This endpoint is a v2 resource for billing confirmation of payer with a guid reference.\n\n            - The request includes no request body and a single query parameter.\n            - A successful request will generate a billing receipt.\n            - Clients can use a browser or some request client in Node.js.\n            - Each request payload has an identical shape as shown below ↓.\n\n            Example:\n            ```js\n            handshake_token=abcd1234 \n            Authorization: Bearer {handshake_token} —— `credential signature`\n            guid=64624450-9793087-295\n\n            Testing Example:\n            -X GET https://{baseurl}/api/v2/shared/billing/confirmation?guid=64624450-9793087-295\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {handshake_token}'\n\n            ```\n      ",
                        "parameters": [
                            {
                                "name": "guid",
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
                                                "message": "Valid Receipt",
                                                "success": "true",
                                                "data": {
                                                    "receipt": "250.00 paid on Aug 11 2025 12:00AM By Abc Dev Group <<C-1109166>> for 32101/PAYE (Pay As You Earn)",
                                                    "amountpaid": "250.00",
                                                    "status": "SUCCESS",
                                                    "transId": "42034940",
                                                    "transCode": "MQIWXFMQ",
                                                    "statusmessage": "Valid Receipt"
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
                            "Shared—Billing"
                        ]
                    }
                },
                "/api/v2/shared/billing/generateguid": {
                    "post": {
                        "operationId": "PaymentAppController_generatebillingGuid",
                        "summary": "v2 resource for creating an order and billing reference",
                        "description": "\n            This endpoint is a v2 resource for generating a \"reference\" web guid.\n\n            - The request includes no request body and a single query parameter.\n            - A successful request will generate a billing receipt.\n            - Clients can use a browser or some request client in Node.js.\n            - Each request payload has an identical shape as shown below ↓.\n\n            Example:\n            ```js\n            handshake_token=eyabcd1234.12345 \n            Authorization: Bearer {handshake_token} —— `credential signature`\n\n            Testing Example:\n            -X POST https://{baseurl}/api/v2/shared/billing/generateguid\n            -H 'Content-Type: application/json' \n            -H 'Authorization: Bearer {handshake_token}'\n            {\n                \"Pid\": \"N-191005\",\n                \"Amount\": \"21000\",\n                \"AgencyCode\": \"4250000\",\n                \"RevCode\": \"4010002\",\n                \"AppliedDate\":\"Test October 2025\",\n                \"AssessmentRef\":\"IF-DepositSlip-1100\"\n            }\n\n            ```\n        ",
                        "parameters": [],
                        "requestBody": {
                            "required": true,
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/GlobalBillReferenceDto"
                                    }
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "successfully generates a guid",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "status": 200,
                                                "message": "WebGuid Created",
                                                "success": "true",
                                                "data": {
                                                    "orderId": "ord-mvaa1759738115059ng5jeskt",
                                                    "userId": "62a4d035-e62a-4e3d-89c0-9e05d346f76e",
                                                    "paymentReference": "1910050-5717087-229",
                                                    "amount": "21000",
                                                    "pid": "N-191005",
                                                    "agencyCode": "4250000",
                                                    "appliedDate": "Test December 2025",
                                                    "billingClientType": "N",
                                                    "revenueCode": "4010002",
                                                    "revenueClientId": "f7f6584da5fdeff261066d75ffac19e735ea",
                                                    "revenueClientName": "THIRD_PARTY_INSURANCE",
                                                    "receiptCallBackUrl": "https://lagos-mvaa-website.vercel.app/services",
                                                    "user": {
                                                        "id": "62a4d035-e62a-4e3d-89c0-9e05d346f76e"
                                                    },
                                                    "currency": null,
                                                    "receiptStatus": "PENDING",
                                                    "country": null,
                                                    "state": null,
                                                    "assessmentReference": null,
                                                    "billingClientName": null,
                                                    "billingClientId": null,
                                                    "revenueProductId": null,
                                                    "revenueProductDescription": null,
                                                    "NIN": null,
                                                    "mobilePhoneNumber": null,
                                                    "walletName": null,
                                                    "bankName": null,
                                                    "bankAccountNumber": null,
                                                    "bankCode": null,
                                                    "id": "c0509326-5633-4b21-881a-c71619c2fbdd",
                                                    "createdAt": "2025-10-06T08:08:35.067Z",
                                                    "updatedAt": "2025-10-06T08:08:35.067Z"
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
                            "Shared—Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/initialize": {
                    "post": {
                        "operationId": "PaymentAppController_generateTransactionalOrder",
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
                            "Shared—Billing"
                        ]
                    }
                },
                "/api/v2/shared/payment/transaction/retrieve": {
                    "post": {
                        "operationId": "PaymentAppController_verifyFulfilledOrder",
                        "parameters": [],
                        "responses": {
                            "200": {
                                "description": "this resource aims to fetch and fulfil transactional orders",
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "example": {
                                                "success": true,
                                                "status": 200
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "tags": [
                            "Shared—Billing"
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
                        "operationId": "StaffAppController_getStaffProfile",
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
                            "utilityBillDescription"
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
                            "otherName": {
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
                            "otherName",
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
                    "GlobalBillReferenceDto": {
                        "type": "object",
                        "properties": {
                            "Pid": {
                                "type": "string"
                            },
                            "Amount": {
                                "type": "string"
                            },
                            "AgencyCode": {
                                "type": "string"
                            },
                            "RevCode": {
                                "type": "string"
                            },
                            "AssessmentRef": {
                                "type": "string"
                            },
                            "AppliedDate": {
                                "type": "string"
                            },
                            "NIN": {
                                "type": "string"
                            },
                            "currency": {
                                "type": "string"
                            },
                            "productId": {
                                "type": "string"
                            },
                            "mobilePhoneNumber": {
                                "type": "string"
                            },
                            "productDescription": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "Pid",
                            "Amount",
                            "AgencyCode",
                            "RevCode",
                            "AssessmentRef",
                            "AppliedDate",
                            "NIN",
                            "currency",
                            "productId",
                            "mobilePhoneNumber",
                            "productDescription"
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
                    "EntityIdentification": {
                        "type": "object",
                        "properties": {
                            "verificationId": {
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
                            "verificationId",
                            "issuerId",
                            "issueType",
                            "issueDate",
                            "issueExpiryDate"
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
                            "utilityBillDescription"
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
                            "otherName": {
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
                            "otherName",
                            "sex",
                            "maritalStatus",
                            "dob",
                            "placeOfBirth",
                            "nationalIdentificationNumber",
                            "driverLicenseNumber",
                            "passportNumber"
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
                    "WeightedOrderEntity": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "orderId": {
                                "type": "string"
                            },
                            "userId": {
                                "type": "string"
                            },
                            "user": {
                                "$ref": "#/components/schemas/UserEntity"
                            },
                            "paymentReference": {
                                "type": "string"
                            },
                            "amount": {
                                "type": "string"
                            },
                            "currency": {
                                "type": "string"
                            },
                            "receiptStatus": {
                                "type": "string"
                            },
                            "country": {
                                "type": "string"
                            },
                            "pid": {
                                "type": "string"
                            },
                            "state": {
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
                            "billingClientType": {
                                "type": "string"
                            },
                            "billingClientName": {
                                "type": "string"
                            },
                            "billingClientId": {
                                "type": "string"
                            },
                            "revenueCode": {
                                "type": "string"
                            },
                            "revenueClientId": {
                                "type": "string"
                            },
                            "revenueClientName": {
                                "type": "string"
                            },
                            "revenueProductId": {
                                "type": "string"
                            },
                            "revenueProductDescription": {
                                "type": "string"
                            },
                            "NIN": {
                                "type": "string"
                            },
                            "mobilePhoneNumber": {
                                "type": "string"
                            },
                            "receiptCallBackUrl": {
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
                            "orderId",
                            "userId",
                            "paymentReference",
                            "amount",
                            "currency",
                            "receiptStatus",
                            "country",
                            "pid",
                            "state",
                            "agencyCode",
                            "appliedDate",
                            "assessmentReference",
                            "billingClientType",
                            "billingClientName",
                            "billingClientId",
                            "revenueCode",
                            "revenueClientId",
                            "revenueClientName",
                            "revenueProductId",
                            "revenueProductDescription",
                            "NIN",
                            "mobilePhoneNumber",
                            "receiptCallBackUrl",
                            "walletName",
                            "bankName",
                            "bankAccountNumber",
                            "bankCode",
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
