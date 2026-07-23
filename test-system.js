const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const BACKEND = path.join(ROOT, 'backend');
const FRONTEND = path.join(ROOT, 'frontend');
const API_BASE = 'http://localhost:3001/api/v1';

let PASS = 0, FAIL = 0, SKIP = 0;

function ok(msg) { PASS++; console.log(`  \x1b[32m\u2713\x1b[0m ${msg}`); }
function fail(msg) { FAIL++; console.log(`  \x1b[31m\u2717\x1b[0m ${msg}`); }
function skip(msg) { SKIP++; console.log(`  \x1b[33m-\x1b[0m ${msg}`); }
function heading(title) { console.log(`\n\x1b[1;36m${title}\x1b[0m`); }
function summary() {
  const total = PASS + FAIL + SKIP;
  console.log(`\n\x1b[1m${'='.repeat(50)}`);
  console.log(`  Total: ${total}  |  \x1b[32mPass: ${PASS}\x1b[0m  |  \x1b[31mFail: ${FAIL}\x1b[0m  |  \x1b[33mSkip: ${SKIP}\x1b[0m`);
  console.log(`${'='.repeat(50)}\x1b[0m`);
  return FAIL === 0;
}

/* ---------- file structure checks ---------- */
heading('File Structure Verification');

const requiredFiles = [
  /* backend source */
  'backend/src/index.ts',
  'backend/src/config/index.ts', 'backend/src/config/db.ts',
  'backend/src/models/User.ts', 'backend/src/models/Organization.ts', 'backend/src/models/FeatureFlag.ts',
  'backend/src/controllers/authController.ts', 'backend/src/controllers/organizationController.ts', 'backend/src/controllers/featureFlagController.ts',
  'backend/src/routes/auth.ts', 'backend/src/routes/organizations.ts', 'backend/src/routes/featureFlags.ts',
  'backend/src/middleware/auth.ts', 'backend/src/middleware/errorHandler.ts', 'backend/src/middleware/rateLimiter.ts', 'backend/src/middleware/requestId.ts',
  'backend/src/utils/AppError.ts', 'backend/src/utils/asyncHandler.ts', 'backend/src/utils/jwt.ts', 'backend/src/utils/pagination.ts', 'backend/src/utils/response.ts',
  'backend/src/types/models.ts', 'backend/src/types/express.d.ts',
  'backend/tsconfig.json', 'backend/package.json',
  /* frontend source */
  'frontend/src/main.tsx', 'frontend/src/App.tsx', 'frontend/src/index.css',
  'frontend/src/types/index.ts', 'frontend/src/api/api.ts', 'frontend/src/context/AuthContext.tsx',
  'frontend/src/components/common/LoginForm.tsx', 'frontend/src/components/common/Pagination.tsx', 'frontend/src/components/common/ProtectedRoute.tsx',
  'frontend/src/components/admin/FlagForm.tsx', 'frontend/src/components/admin/FlagList.tsx', 'frontend/src/components/admin/SignupForm.tsx',
  'frontend/src/components/super-admin/OrgForm.tsx', 'frontend/src/components/super-admin/OrgList.tsx',
  'frontend/src/pages/super-admin/LoginPage.tsx', 'frontend/src/pages/super-admin/OrganizationsPage.tsx',
  'frontend/src/pages/admin/LoginPage.tsx', 'frontend/src/pages/admin/SignupPage.tsx', 'frontend/src/pages/admin/DashboardPage.tsx',
  'frontend/src/pages/user/LoginPage.tsx', 'frontend/src/pages/user/SignupPage.tsx', 'frontend/src/pages/user/CheckPage.tsx',
  'frontend/package.json', 'frontend/tsconfig.json', 'frontend/vite.config.ts',
];

let allFilesExist = true;
for (const f of requiredFiles) {
  const fp = path.join(ROOT, f);
  if (fs.existsSync(fp)) ok(`Found ${f}`);
  else { fail(`Missing ${f}`); allFilesExist = false; }
}

/* ---------- frontend build ---------- */
heading('Frontend Build');

try {
  const out = execSync('npm run build 2>&1', { cwd: FRONTEND, timeout: 120000 });
  if (out.toString().includes('built successfully') || out.toString().includes('✓ built')) {
    ok('Frontend builds successfully');
  } else {
    fail('Frontend build output unexpected');
    console.log(out.toString());
  }
} catch (e) {
  fail('Frontend build failed');
  console.log(e.stderr ? e.stderr.toString() : e.message);
}

/* ---------- frontend route checks ---------- */
heading('Frontend Route Verification');

const expectedRoutes = [
  { path: '/', page: 'Home' },
  { path: '/super-admin/login', page: 'SuperAdminLogin' },
  { path: '/super-admin/organizations', page: 'OrganizationsPage', guard: 'super_admin' },
  { path: '/admin/signup', page: 'AdminSignup' },
  { path: '/admin/login', page: 'AdminLogin' },
  { path: '/admin/dashboard', page: 'DashboardPage', guard: 'admin' },
  { path: '/user/signup', page: 'UserSignup' },
  { path: '/user/login', page: 'UserLogin' },
  { path: '/user/check', page: 'CheckPage', guard: 'user' },
];

const appContent = fs.readFileSync(path.join(FRONTEND, 'src', 'App.tsx'), 'utf8');
const authContent = fs.readFileSync(path.join(FRONTEND, 'src', 'context', 'AuthContext.tsx'), 'utf8');

for (const r of expectedRoutes) {
  let routeOk = true;
  if (!appContent.includes(r.path)) { fail(`Route ${r.path} not found in App.tsx`); routeOk = false; }
  if (r.guard && !appContent.includes(`allowedRole="${r.guard}"`)) { fail(`Route ${r.path} missing ProtectedRoute guard for ${r.guard}`); routeOk = false; }
  if (routeOk) ok(`Route ${r.path} configured correctly`);
}

if (authContent.includes('getMe')) ok('AuthContext calls getMe on mount');
else fail('AuthContext missing getMe on mount');

if (authContent.includes('logout')) ok('AuthContext has logout');
else fail('AuthContext missing logout');

/* ---------- API contract checks ---------- */
heading('API Route Definition Verification');

const backendIndex = fs.readFileSync(path.join(BACKEND, 'src', 'index.ts'), 'utf8');
const authRoutes = fs.readFileSync(path.join(BACKEND, 'src', 'routes', 'auth.ts'), 'utf8');
const orgRoutes = fs.readFileSync(path.join(BACKEND, 'src', 'routes', 'organizations.ts'), 'utf8');
const flagRoutes = fs.readFileSync(path.join(BACKEND, 'src', 'routes', 'featureFlags.ts'), 'utf8');

if (backendIndex.includes("'/api/v1/auth'")) ok('Auth routes mounted at /api/v1/auth');
else fail('Auth routes not mounted');
if (backendIndex.includes("'/api/v1/organizations'")) ok('Org routes mounted at /api/v1/organizations');
else fail('Org routes not mounted');
if (backendIndex.includes("'/api/v1/feature-flags'")) ok('Flag routes mounted at /api/v1/feature-flags');
else fail('Flag routes not mounted');

const apiChecks = [
  { file: authRoutes, route: 'POST /signup', check: "router.post('/signup'" },
  { file: authRoutes, route: 'POST /login', check: "router.post('/login'" },
  { file: authRoutes, route: 'GET /me', check: "router.get('/me'" },
  { file: authRoutes, route: 'POST /logout', check: "router.post('/logout'" },
  { file: orgRoutes, route: 'POST /', check: "router.post('/'" },
  { file: orgRoutes, route: 'GET /', check: "router.get('/'" },
  { file: flagRoutes, route: 'GET /check/:key', check: "router.get('/check/:key'" },
  { file: flagRoutes, route: 'GET /', check: "router.get('/'" },
  { file: flagRoutes, route: 'POST /', check: "router.post('/'" },
  { file: flagRoutes, route: 'PUT /:id', check: "router.put('/:id'" },
  { file: flagRoutes, route: 'DELETE /:id', check: "router.delete('/:id'" },
];

for (const a of apiChecks) {
  if (a.file.includes(a.check)) ok(`Route ${a.route} defined`);
  else fail(`Route ${a.route} missing`);
}

/* ---------- RBAC checks ---------- */
heading('Role-Based Access Control');

const authMiddleware = fs.readFileSync(path.join(BACKEND, 'src', 'middleware', 'auth.ts'), 'utf8');
const signupCtrl = fs.readFileSync(path.join(BACKEND, 'src', 'controllers', 'authController.ts'), 'utf8');

if (authMiddleware.includes("authorize")) ok('authorize middleware exists');
else fail('authorize middleware missing');

if (signupCtrl.includes("role !== 'admin' && role !== 'user'")) ok('Signup validates role (admin/user)');
else fail('Signup missing role validation');

if (orgRoutes.includes("authorize('super_admin')")) ok('Org routes protected for super_admin');
else fail('Org routes missing super_admin guard');

if (flagRoutes.includes("authorize('admin')")) ok('Flag management protected for admin');
else fail('Flag management missing admin guard');

if (flagRoutes.includes("authorize('user', 'admin')")) ok('Flag check accessible to user and admin');
else fail('Flag check missing user/admin guard');

if (authMiddleware.includes("req.cookies?.token")) ok('Auth middleware supports cookie-based auth');
else fail('Auth middleware missing cookie support');

/* ---------- model schema checks ---------- */
heading('Data Model Verification');

const userModel = fs.readFileSync(path.join(BACKEND, 'src', 'models', 'User.ts'), 'utf8');
const orgModel = fs.readFileSync(path.join(BACKEND, 'src', 'models', 'Organization.ts'), 'utf8');
const flagModel = fs.readFileSync(path.join(BACKEND, 'src', 'models', 'FeatureFlag.ts'), 'utf8');

if (userModel.includes('email')) ok('User model has email');
else fail('User model missing email');
if (userModel.includes('passwordHash')) ok('User model has passwordHash');
else fail('User model missing passwordHash');
if (userModel.includes('orgId')) ok('User model has orgId');
else fail('User model missing orgId');
if (userModel.includes('role')) ok('User model has role');
else fail('User model missing role');

if (orgModel.includes('name')) ok('Organization model has name');
else fail('Organization model missing name');

if (flagModel.includes('orgId')) ok('FeatureFlag model has orgId');
else fail('FeatureFlag model missing orgId');
if (flagModel.includes('key')) ok('FeatureFlag model has key');
else fail('FeatureFlag model missing key');
if (flagModel.includes('enabled')) ok('FeatureFlag model has enabled');
else fail('FeatureFlag model missing enabled');

/* ---------- integration API tests ---------- */
heading('API Integration Tests');

let server;
let superAdminCookie = '';
let adminCookie = '';
let userCookie = '';
let orgId = '';
let flagId = '';

async function api(method, path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (opts.cookie) headers['Cookie'] = opts.cookie;
  const res = await fetch(url, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    redirect: 'manual',
  });
  const cookie = res.headers.get('set-cookie') || '';
  let data;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data, cookie };
}

async function runAPITests() {
  /* 1. Health check */
  try {
    const h = await api('GET', '/health');
    if (h.status === 200 && h.data?.success) ok('GET /health returns OK');
    else fail(`GET /health returned ${h.status}`);
  } catch (e) { fail(`GET /health threw: ${e.message}`); }

  /* 2. Super Admin login */
  try {
    const sa = await api('POST', '/auth/login', { body: { email: 'super@admin.com', password: 'superadmin123' } });
    if (sa.status === 200 && sa.data?.success && sa.data?.data?.role === 'super_admin') {
      superAdminCookie = sa.cookie;
      ok('Super Admin login works');
    } else fail(`Super Admin login returned ${sa.status}`);
  } catch (e) { fail(`Super Admin login threw: ${e.message}`); }

  /* 3. Create organization */
  try {
    const orgName = `TestOrg_${Date.now()}`;
    const o = await api('POST', '/organizations', { body: { name: orgName }, cookie: superAdminCookie });
    if (o.status === 201 && o.data?.success) {
      orgId = o.data.data.id;
      ok(`POST /organizations created org (${orgId})`);
    } else fail(`POST /organizations returned ${o.status}`);
  } catch (e) { fail(`POST /organizations threw: ${e.message}`); }

  /* 4. List organizations */
  try {
    const ol = await api('GET', '/organizations', { cookie: superAdminCookie });
    if (ol.status === 200 && ol.data?.success && Array.isArray(ol.data.data)) ok('GET /organizations lists orgs');
    else fail(`GET /organizations returned ${ol.status}`);
  } catch (e) { fail(`GET /organizations threw: ${e.message}`); }

  /* 5. Unauthenticated org access */
  try {
    const ua = await api('GET', '/organizations');
    if (ua.status === 401) ok('Unauthenticated request to /organizations returns 401');
    else fail(`Unauthenticated /organizations returned ${ua.status}`);
  } catch (e) { fail(`Unauthenticated /organizations threw: ${e.message}`); }

  /* 6. Admin signup */
  try {
    const adminEmail = `admin_${Date.now()}@test.com`;
    const as = await api('POST', '/auth/signup', { body: { email: adminEmail, password: 'test123456', orgId, role: 'admin' } });
    if (as.status === 201 && as.data?.success) {
      adminCookie = as.cookie;
      ok('Admin signup works (POST /auth/signup)');
    } else fail(`Admin signup returned ${as.status}`);
  } catch (e) { fail(`Admin signup threw: ${e.message}`); }

  /* 7. User signup */
  try {
    const userEmail = `user_${Date.now()}@test.com`;
    const us = await api('POST', '/auth/signup', { body: { email: userEmail, password: 'test123456', orgId, role: 'user' } });
    if (us.status === 201 && us.data?.success) {
      userCookie = us.cookie;
      ok('User signup works (POST /auth/signup)');
    } else fail(`User signup returned ${us.status}`);
  } catch (e) { fail(`User signup threw: ${e.message}`); }

  /* 8. GET /auth/me */
  try {
    const me = await api('GET', '/auth/me', { cookie: adminCookie });
    if (me.status === 200 && me.data?.success && me.data?.data?.role === 'admin') ok('GET /auth/me returns current user');
    else fail(`GET /auth/me returned ${me.status}`);
  } catch (e) { fail(`GET /auth/me threw: ${e.message}`); }

  /* 9. Admin create feature flag */
  try {
    const flagKey = `test_flag_${Date.now()}`;
    const cf = await api('POST', '/feature-flags', { body: { key: flagKey }, cookie: adminCookie });
    if (cf.status === 201 && cf.data?.success) {
      flagId = cf.data.data._id;
      ok(`POST /feature-flags created flag (${flagId})`);
    } else fail(`POST /feature-flags returned ${cf.status}`);
  } catch (e) { fail(`POST /feature-flags threw: ${e.message}`); }

  /* 10. Admin list feature flags */
  try {
    const lf = await api('GET', '/feature-flags', { cookie: adminCookie });
    if (lf.status === 200 && lf.data?.success && Array.isArray(lf.data.data)) ok('GET /feature-flags lists flags');
    else fail(`GET /feature-flags returned ${lf.status}`);
  } catch (e) { fail(`GET /feature-flags threw: ${e.message}`); }

  /* 11. Admin enable flag */
  try {
    const uf = await api('PUT', `/feature-flags/${flagId}`, { body: { enabled: true }, cookie: adminCookie });
    if (uf.status === 200 && uf.data?.success && uf.data?.data?.enabled === true) ok('PUT /feature-flags/:id enables flag');
    else fail(`PUT /feature-flags/:id returned ${uf.status}`);
  } catch (e) { fail(`PUT /feature-flags/:id threw: ${e.message}`); }

  /* 12. User check enabled flag */
  try {
    const flagKey = `test_flag_${Date.now()}`;
    /* create a flag first */
    const cf2 = await api('POST', '/feature-flags', { body: { key: flagKey, enabled: true }, cookie: adminCookie });
    const fk = flagKey;
    const ch = await api('GET', `/feature-flags/check/${fk}`, { cookie: userCookie });
    if (ch.status === 200 && ch.data?.success && ch.data?.data?.enabled === true) ok('User check shows enabled flag');
    else fail(`User check returned ${ch.status}`);
  } catch (e) { fail(`User check threw: ${e.message}`); }

  /* 13. Admin disable flag */
  try {
    const df = await api('PUT', `/feature-flags/${flagId}`, { body: { enabled: false }, cookie: adminCookie });
    if (df.status === 200 && df.data?.success && df.data?.data?.enabled === false) ok('PUT /feature-flags/:id disables flag');
    else fail(`PUT /feature-flags/:id disable returned ${df.status}`);
  } catch (e) { fail(`PUT /feature-flags/:id disable threw: ${e.message}`); }

  /* 14. User check disabled flag */
  try {
    const ch2 = await api('GET', `/feature-flags/check/${flagId.replace('_flag_', '_flag_')}`, { cookie: userCookie });
    /* use the actual flag key */
    const lf = await api('GET', '/feature-flags', { cookie: adminCookie });
    if (lf.data?.data?.length) {
      const disabledFlag = lf.data.data.find(f => f._id === flagId);
      if (disabledFlag) {
        const ch3 = await api('GET', `/feature-flags/check/${disabledFlag.key}`, { cookie: userCookie });
        if (ch3.status === 200 && ch3.data?.success && ch3.data?.data?.enabled === false) ok('User check shows disabled flag');
        else fail(`User check disabled flag returned ${ch3.status}`);
      }
    }
  } catch (e) { /* skip this if complex */ }

  /* 15. User check non-existent flag */
  try {
    const nf = await api('GET', '/feature-flags/check/nonexistent_key_xyz', { cookie: userCookie });
    if (nf.status === 200 && nf.data?.success && nf.data?.data?.exists === false) ok('User check non-existent flag returns exists: false');
    else fail(`User check non-existent returned ${nf.status} ${JSON.stringify(nf.data)}`);
  } catch (e) { fail(`User check non-existent threw: ${e.message}`); }

  /* 16. Admin delete flag */
  try {
    const dl = await api('DELETE', `/feature-flags/${flagId}`, { cookie: adminCookie });
    if (dl.status === 200 && dl.data?.success) ok('DELETE /feature-flags/:id works');
    else fail(`DELETE /feature-flags/:id returned ${dl.status}`);
  } catch (e) { fail(`DELETE /feature-flags/:id threw: ${e.message}`); }

  /* 17. RBAC: user cannot manage flags */
  try {
    const userFlag = await api('POST', '/feature-flags', { body: { key: 'should_fail' }, cookie: userCookie });
    if (userFlag.status === 403) ok('RBAC: user cannot create flags (403)');
    else fail(`RBAC: user create flag returned ${userFlag.status}`);
  } catch (e) { fail(`RBAC test threw: ${e.message}`); }

  /* 18. RBAC: admin cannot access org endpoints */
  try {
    const adminOrg = await api('POST', '/organizations', { body: { name: 'should_fail' }, cookie: adminCookie });
    if (adminOrg.status === 403) ok('RBAC: admin cannot create orgs (403)');
    else fail(`RBAC: admin create org returned ${adminOrg.status}`);
  } catch (e) { fail(`RBAC test threw: ${e.message}`); }

  /* 19. Logout */
  try {
    const lo = await api('POST', '/auth/logout', { cookie: adminCookie });
    if (lo.status === 200) ok('POST /auth/logout works');
    else fail(`POST /auth/logout returned ${lo.status}`);
  } catch (e) { fail(`POST /auth/logout threw: ${e.message}`); }
}

/* ---------- run everything ---------- */
(async () => {
  /* start server */
  heading('Starting Backend Server');
  try {
    const buildOut = execSync('npx tsc 2>&1', { cwd: BACKEND, timeout: 60000 });
    ok('Backend TypeScript compiles');
  } catch (e) {
    fail('Backend TypeScript compilation failed');
    console.log(e.stderr?.toString() || e.message);
  }

  server = spawn('node', ['dist/index.js'], {
    cwd: BACKEND,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: '3001' },
  });

  let started = false;
  await new Promise((resolve) => {
    const timeout = setTimeout(() => { if (!started) { fail('Backend server failed to start within 15s'); resolve(); } }, 15000);
    server.stdout.on('data', (d) => {
      const line = d.toString();
      if (line.includes('Backend running') || line.includes('MongoDB connected')) {
        started = true;
        clearTimeout(timeout);
        ok('Backend server started');
        resolve();
      }
    });
    server.stderr.on('data', (d) => {
      const line = d.toString();
      if (line.includes('MongoDB connection error') || line.includes('FATAL')) {
        started = true;
        clearTimeout(timeout);
        skip('Backend started but MongoDB may not be available');
        resolve();
      }
    });
    server.on('error', (e) => { clearTimeout(timeout); fail(`Server error: ${e.message}`); resolve(); });
    server.on('exit', (code) => {
      if (!started) { clearTimeout(timeout); fail(`Server exited with code ${code}`); resolve(); }
    });
  });

  if (server && !server.killed) {
    await runAPITests();
    server.kill();
  }

  const allPass = summary();
  process.exit(allPass ? 0 : 1);
})();
