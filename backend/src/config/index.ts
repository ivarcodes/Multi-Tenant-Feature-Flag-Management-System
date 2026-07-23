import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`FATAL: Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const config = {
  port: parseInt(requireEnv('PORT'), 10),
  mongoUri: requireEnv('MONGO_URI'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: '24h' as const,
  allowedOrigins: requireEnv('ALLOWED_ORIGINS').split(',').map(s => s.trim()),
  superAdmin: {
    email: requireEnv('SUPER_ADMIN_EMAIL'),
    password: requireEnv('SUPER_ADMIN_PASSWORD'),
    role: 'super_admin',
  },
};
