const getCsrfCookieOptions = () => {
    const sameSite = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
    const domain = process.env.COOKIE_DOMAIN || undefined;

    return {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite,
        domain,
        path: '/',
    };
};

export const setCsrfTokenCookie = (res, token) => {
    res.cookie('XSRF-TOKEN', token, getCsrfCookieOptions());
};
