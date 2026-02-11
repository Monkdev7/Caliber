const isProduction = () => process.env.NODE_ENV === 'production';

const getCookieOptions = (overrides = {}) => {
    const sameSite = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
    const domain = process.env.COOKIE_DOMAIN || undefined;

    return {
        httpOnly: true,
        secure: isProduction(),
        sameSite,
        domain,
        ...overrides,
    };
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
    const accessMaxAgeMinutes = parseInt(
        process.env.ACCESS_COOKIE_MAX_AGE_MIN || '15',
        10,
    );
    const refreshMaxAgeDays = parseInt(
        process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7',
        10,
    );

    res.cookie(
        'access_token',
        accessToken,
        getCookieOptions({ maxAge: accessMaxAgeMinutes * 60 * 1000, path: '/' }),
    );

    res.cookie(
        'refresh_token',
        refreshToken,
        getCookieOptions({
            maxAge: refreshMaxAgeDays * 24 * 60 * 60 * 1000,
            path: '/api/auth/refresh',
        }),
    );
};

export const clearAuthCookies = res => {
    res.clearCookie('access_token', getCookieOptions({ path: '/' }));
    res.clearCookie('refresh_token',
        getCookieOptions({ path: '/api/auth/refresh' }),
    );
};
