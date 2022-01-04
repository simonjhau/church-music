import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { audience, domain } from '../config/env.dev';

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),

  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ['RS256'],
});

export default checkJwt;
