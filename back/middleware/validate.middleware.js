import { body, param, validationResult } from 'express-validator';

/**
 * Runs validation results and returns 422 if any errors exist.
 */
export function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
}

// ── User validators ─────────────────────────────────────────────────────────

export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('mobile')
        .notEmpty().withMessage('Mobile number is required')
        .isMobilePhone().withMessage('Must be a valid mobile number'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    handleValidationErrors
];

export const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    handleValidationErrors
];

// ── Temple validators ────────────────────────────────────────────────────────

export const validateTemple = [
    body('name')
        .trim()
        .notEmpty().withMessage('Temple name is required')
        .isLength({ min: 2, max: 120 }).withMessage('Name must be 2–120 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required'),

    body('city')
        .trim()
        .notEmpty().withMessage('City is required'),

    body('state')
        .trim()
        .notEmpty().withMessage('State is required'),

    body('startTime')
        .notEmpty().withMessage('Start time is required'),

    body('endTime')
        .notEmpty().withMessage('End time is required'),

    body('status')
        .isIn(['open', 'closed']).withMessage('Status must be "open" or "closed"'),

    handleValidationErrors
];

// ── Niti validators ──────────────────────────────────────────────────────────

export const validateNiti = [
    body('currentNiti')
        .trim()
        .notEmpty().withMessage('Current Niti name is required')
        .isLength({ min: 2, max: 120 }).withMessage('Name must be 2–120 characters'),

    body('nextNiti')
        .trim()
        .notEmpty().withMessage('Next Niti name is required'),

    body('status')
        .isIn(['Open', 'Closed', 'Darshan Available', 'Special Ritual'])
        .withMessage('Invalid status value'),

    body('startTime')
        .notEmpty().withMessage('Start time is required')
        .isISO8601().withMessage('Start time must be a valid date-time'),

    body('endTime')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().withMessage('End time must be a valid date-time'),

    body('nextNitiTime')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().withMessage('Next Niti time must be a valid date-time'),

    body('description')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

    handleValidationErrors
];

// ── Param validators ─────────────────────────────────────────────────────────

export const validateObjectId = (paramName) => [
    param(paramName)
        .isMongoId().withMessage(`Invalid ${paramName} format`),
    handleValidationErrors
];
