export enum ResponseCode {
    // HTTP Status 200
    SUCCESS = "SU",

    // HTTP Status 400
    VALIDATION_FAILED = "VF",
    DUPLICATE_EMAIL = "DE",
    DUPLICATE_NICKNAME = "DN",
    DUPLICATE_ID = "DI",
    NOT_EXISTED_USER = "NU",
    DISAGREED_PERSONAL = "DP",
    EXISTED_FRIEND = "EF",
    DUPLICATE_POSTING = "DU",
    NOT_EXISTED_PROMPT = "NP",
    NOT_EXISTED_RESULT = "NR",

    // HTTP Status 401
    SIGN_IN_FAIL = "SF",
    AUTHORIZATION_FAIL = "AF",
    MAIL_FAIL = "MF",
    CERTIFICATION_FAIL = "CF",

    // HTTP Status 403
    NO_PERMISSION = "NP",

    // HTTP Status 500
    DATABASE_ERROR = "DBE",
}

export default ResponseCode;