export const getToken = (request: {
  headers: Record<string, string | string[]>;
}): string => {
  const authorization = request.headers['authorization'];

  if (!authorization || Array.isArray(authorization)) {
    throw new Error('Invalid Authorization Header');
  }
  // eslint-disable-next-line
    const [_, token] = authorization.split(' ');
  return token;
};
