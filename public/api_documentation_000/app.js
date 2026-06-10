/* ============================================================================
   Lagos MVAA — API Documentation (interactive)
   Framework-free. The whole page (nav, endpoint cards, and "Try it" consoles)
   is rendered from the ENDPOINT_GROUPS data below — edit that to update the docs.
   ============================================================================ */

'use strict';

const DEFAULT_BASE_URL = 'https://licensetest.permit.org.ng/api/v1';

/* ----------------------------------------------------------------------------
   Endpoint catalogue. Each endpoint:
     id          unique slug (also the anchor id)
     name        human title
     method      GET | POST | PATCH | DELETE
     path        with :params placeholders, e.g. /shared/verify/nin/:nin
     auth        'none' | 'session'
     desc        short description
     pathParams  [{ name, desc, example }]
     queryParams [{ name, desc, example, required }]
     body        example request body object (omit for no body)
     response    example response object (illustrative)
     notes       [ html strings ]
---------------------------------------------------------------------------- */

const ENDPOINT_GROUPS = [
  {
    id: 'auth',
    title: 'Authentication',
    desc: 'Sign in, register, and end sessions. Sign-in returns an encrypted session envelope (see Authentication overview).',
    endpoints: [
      {
        id: 'signin',
        name: 'Sign in (Individual)',
        method: 'POST',
        path: '/portal/auth/signin',
        auth: 'none',
        desc: 'Authenticate an individual user. Returns an opaque, server-encrypted session envelope in the "data" field.',
        body: { email: 'user@example.com', password: 'yourpassword' },
        response: {
          status: 200,
          message: 'login successful',
          success: 'true',
          data: '{"iv":"M4jNDe1XX+irqK7G","txt":"pTYbF4/J6k7W8...","tag":"WCsuPXVPRp/qqHxVpiIlFA==","used":0,"purpose":"login"}'
        },
        notes: [
          'The <code>data</code> value is the <strong>session token</strong>. Send it back on every authenticated request via the <code>X-Portal-Session-Id</code> header — do not decrypt it.',
          'After a successful response here, click <strong>“Use as session token”</strong> to load it into the global token field above.'
        ]
      },
      {
        id: 'signin-entity',
        name: 'Sign in (Company)',
        method: 'POST',
        path: '/portal/auth/signin-entity',
        auth: 'none',
        desc: 'Authenticate a company/entity account. Returns the same encrypted session envelope as the individual sign-in.',
        body: { email: 'company@example.com', password: 'yourpassword' },
        response: {
          status: 200,
          message: 'login successful',
          success: 'true',
          data: '{"iv":"...","txt":"...","tag":"...","used":0,"purpose":"login"}'
        }
      },
      {
        id: 'signup',
        name: 'Register (Individual)',
        method: 'POST',
        path: '/portal/auth/signup',
        auth: 'none',
        desc: 'Create an individual account. Triggers an email-verification flow.',
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+2348100000000',
          placeOfBirth: 'Lagos',
          maritalStatus: 'Single',
          address: { street: '12 Marina Road', lga: 'Lagos Island', state: 'Lagos' },
          password: 'yourpassword'
        },
        response: { status: 201, message: 'Registration successful. Please verify your email.', success: 'true' }
      },
      {
        id: 'signup-entity',
        name: 'Register (Company)',
        method: 'POST',
        path: '/portal/auth/signup-entity',
        auth: 'none',
        desc: 'Create a company account with representative, address, and owner details. Triggers an email-verification flow.',
        body: {
          companyName: 'Acme Motors Ltd',
          companyRCNumber: 'RC123456',
          companyTIN: '12345678-0001',
          companyRepName: 'Jane Doe',
          companyRepPhone: '+2348100000000',
          companyRepEmail: 'rep@acme.com',
          address: {
            flatNumber: '4B',
            blockNumber: 'N/A',
            street: '12 Marina Road',
            landmark: 'Near CMS Bus Stop',
            lga: 'Lagos Island',
            state: 'Lagos',
            contactPhone: '+2348100000000',
            email: 'company@acme.com',
            utilityBill: 'Pending Utility Bill',
            utilityBillDescription: 'Pending Utility Bill'
          },
          companyOwner: {
            title: 'Mr',
            firstName: 'John',
            surname: 'Doe',
            otherName: '',
            sex: 'Male',
            maritalStatus: 'Single',
            dob: '1990-01-01',
            placeOfBirth: 'Lagos',
            nationalIdentificationNumber: '12345678901',
            driverLicenseNumber: 'ABC123456',
            passportNumber: 'A01234567'
          },
          password: 'yourpassword',
          email: 'company@acme.com'
        },
        response: { status: 201, message: 'Company registration successful. Please verify your email.', success: 'true' }
      },
      {
        id: 'logout',
        name: 'Log out',
        method: 'POST',
        path: '/portal/auth/logout',
        auth: 'session',
        desc: 'Invalidate the current session on the server. The session to end is identified by the X-Portal-Session-Id header.',
        body: {},
        response: { status: 200, message: 'logout successful', success: 'true' }
      }
    ]
  },
  {
    id: 'account',
    title: 'Account & Profile',
    desc: 'Read and update the signed-in user’s profile, plus password recovery and email activation.',
    endpoints: [
      {
        id: 'profile',
        name: 'Get profile',
        method: 'GET',
        path: '/shared/profile',
        auth: 'session',
        desc: 'Fetch the signed-in user’s profile. Returns individual or company fields depending on the account type.',
        response: {
          status: 200,
          message: 'company profile fetch successful',
          success: 'true',
          data: {
            id: '21fd1042-d0b6-41ac-849e-cf72401bea49',
            email: 'company@acme.com', isActivated: true, isVerified: false,
            payerId: null, role: 'USER', userType: 'company',
            address: {
              flatNumber: '12', blockNumber: '12', street: 'Olabiran Street, Shomolu',
              landmark: 'Itablae', lga: 'Apapa', state: 'Lagos',
              contactPhone: '+2348175125000', email: 'company@acme.com',
              utilityBill: 'Pending Utility Bill', utilityBillDescription: 'Pending Utility Bill'
            },
            companyOwner: {
              title: 'Mr', firstName: 'Mykel', surname: 'Dev', otherName: 'Ebube',
              sex: 'Male', maritalStatus: 'Single', dob: '2008-06-04T23:00:00.000Z',
              placeOfBirth: 'Lagos', nationalIdentificationNumber: '10202020202',
              driverLicenseNumber: '202939', passportNumber: 'BC-12929'
            },
            companyName: 'Acme Motors Ltd', companyRCNumber: '1234567', companyTIN: '12345678',
            companyRepName: 'Jane Doe', companyRepPhone: '+2348127273732', companyRepEmail: 'company@acme.com'
          }
        },
        notes: [
          'The example above is a <strong>company</strong> profile. <strong>Individual</strong> accounts return <code>firstName</code>, <code>lastName</code>, <code>phone</code>, and a simpler <code>address</code> instead of the company/owner objects.',
          '<code>isVerified</code> / <code>isActivated</code> are also surfaced as <code>is_verified</code> / <code>is_activated</code> by the client.'
        ]
      },
      {
        id: 'update-account',
        name: 'Update account (Individual)',
        method: 'PATCH',
        path: '/portal/accounts/update-account/:email',
        auth: 'session',
        desc: 'Update an individual account. Accepts name, phone, and a basic address.',
        pathParams: [ { name: 'email', desc: 'Account email (identifier)', example: 'john@example.com' } ],
        body: {
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+2348100000000',
          address: { street: '12 Marina Road', lga: 'Lagos Island', state: 'Lagos' }
        },
        response: { status: 200, message: 'account updated', success: 'true', data: {} }
      },
      {
        id: 'update-company-account',
        name: 'Update account (Company)',
        method: 'PATCH',
        path: '/portal/accounts/update-company-account/:email',
        auth: 'session',
        desc: 'Update a company account. Strict whitelist: accepts companyRepName and a full address object only.',
        pathParams: [ { name: 'email', desc: 'Account email (identifier)', example: 'company@acme.com' } ],
        body: {
          companyRepName: 'Jane Doe',
          companyOwner: { firstName: 'John', surname: 'Doe' },
          address: {
            street: '12 Marina Road', lga: 'Lagos Island', state: 'Lagos',
            flatNumber: '4B', landmark: 'Near CMS Bus Stop',
            contactPhone: '+2348100000000', email: 'company@acme.com'
          }
        },
        response: {
          message: 'corporate account updated successfully', status: 200, success: 'true',
          data: { companyRepName: 'Jane Doe', address: { /* full address */ }, id: '21fd1042-…', updatedAt: '2026-06-10T07:50:27.651Z' }
        },
        notes: [
          'Accepted fields: <code>companyRepName</code>, <code>companyOwner</code> (e.g. <code>firstName</code>, <code>surname</code>), and <code>address</code>.',
          'The address requires <code>flatNumber</code> (min 2), <code>landmark</code> (min 2), a valid <code>contactPhone</code>, and a valid <code>email</code>.',
          'Sending individual-only fields (<code>firstName</code>, <code>lastName</code>, <code>phone</code>) or <code>companyRepPhone</code> returns <code>400</code> — they are not on this DTO.',
          'Send the full <code>companyOwner</code> object (merge over the profile’s value) — a partial object may overwrite the omitted owner fields.',
          'The <code>companyOwner</code> update DTO is a strict whitelist: it accepts <code>title</code>, <code>firstName</code>, <code>surname</code>, <code>sex</code>, <code>maritalStatus</code>, <code>dob</code>, <code>placeOfBirth</code>, <code>nationalIdentificationNumber</code>, <code>driverLicenseNumber</code>, <code>passportNumber</code>. It rejects extras like <code>otherName</code> and <code>entityId</code> (the NIN-verification blob the profile gains after verification) — send only the allowlisted fields.'
        ]
      },
      {
        id: 'forgot-password',
        name: 'Forgot password',
        method: 'GET',
        path: '/portal/accounts/forgot-password/:email',
        auth: 'none',
        desc: 'Send a password-reset link/token to the account email.',
        pathParams: [ { name: 'email', desc: 'Account email', example: 'john@example.com' } ],
        response: { status: 200, message: 'Password reset email sent', success: 'true' }
      },
      {
        id: 'reset-password',
        name: 'Reset password',
        method: 'PATCH',
        path: '/portal/accounts/reset-password/:token',
        auth: 'none',
        desc: 'Set a new password using the token from the reset email.',
        pathParams: [ { name: 'token', desc: 'Reset token from email', example: 'reset-token-from-email' } ],
        body: { password: 'newpassword' },
        response: { status: 200, message: 'Password reset successful', success: 'true' }
      },
      {
        id: 'send-activation',
        name: 'Resend activation email',
        method: 'GET',
        path: '/portal/accounts/send-activation',
        auth: 'session',
        desc: 'Resend the account-activation / email-verification message.',
        queryParams: [ { name: 'email', desc: 'Account email', example: 'john@example.com', required: true } ],
        response: { status: 200, message: 'Activation email sent', success: 'true' }
      }
    ]
  },
  {
    id: 'verification',
    title: 'Identity Verification',
    desc: 'Validate national identity (NIN), business registration (CAC), and tax (TIN) details.',
    endpoints: [
      {
        id: 'verify-nin',
        name: 'Verify NIN (Individual)',
        method: 'POST',
        path: '/shared/verify/nin/:nin',
        auth: 'session',
        desc: 'Verify an individual’s National Identification Number against the provided name.',
        pathParams: [ { name: 'nin', desc: '11-digit NIN', example: '12345678901' } ],
        body: { firstname: 'John', lastname: 'Doe' },
        response: {
          data: {
            firstname: 'John', lastname: 'Doe', middlename: 'A', gender: 'm', birthdate: '1990-01-01',
            phone: '08100000000', residence: { address1: '12 Marina Road', town: 'Lagos Island', lga: 'Lagos Island', state: 'Lagos' }
          }
        }
      },
      {
        id: 'verify-business-nin',
        name: 'Verify NIN (Business owner)',
        method: 'POST',
        path: '/shared/verify/businessNin/:nin',
        auth: 'session',
        desc: 'Verify a business owner’s NIN against the provided name.',
        pathParams: [ { name: 'nin', desc: '11-digit NIN', example: '12345678901' } ],
        body: { firstname: 'Jane', lastname: 'Doe' },
        response: {
          data: {
            firstname: 'Jane', lastname: 'Doe', gender: 'f', birthdate: '1988-05-12', phone: '08100000000',
            residence: { address1: '5 Allen Avenue', town: 'Ikeja', lga: 'Ikeja', state: 'Lagos' }
          }
        }
      },
      {
        id: 'verify-cac',
        name: 'Verify CAC',
        method: 'POST',
        path: '/shared/verify/cac',
        auth: 'session',
        desc: 'Verify a company’s CAC (Corporate Affairs Commission) registration number.',
        body: { regNumber: 'RC123456' },
        response: { data: { companyName: 'Acme Motors Ltd', rcNumber: 'RC123456', status: 'ACTIVE' } }
      },
      {
        id: 'verify-business-tin',
        name: 'Verify Business TIN',
        method: 'POST',
        path: '/shared/verify/businessTin',
        auth: 'session',
        desc: 'Verify a company’s Tax Identification Number.',
        body: { tinNumber: '12345678-0001' },
        response: { data: { tin: '12345678-0001', taxpayerName: 'Acme Motors Ltd', status: 'ACTIVE' } }
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing — Payer ID',
    desc: 'Look up and create LIRS Payer IDs used for vehicle-service payments.',
    endpoints: [
      {
        id: 'verify-payer',
        name: 'Verify Payer ID',
        method: 'GET',
        path: '/shared/billing/identification',
        auth: 'session',
        desc: 'Look up an existing Payer ID (PID) and return the associated taxpayer details.',
        queryParams: [ { name: 'pid', desc: 'Payer ID to look up', example: 'PID000123', required: true } ],
        response: { data: { pid: 'PID000123', name: 'John Doe', email: 'john@example.com', phone: '08100000000' } }
      },
      {
        id: 'create-payer',
        name: 'Create Payer ID',
        method: 'POST',
        path: '/shared/billing/identification',
        auth: 'session',
        desc: 'Create a new Payer ID. Use type "Individual" for individuals or "Corporate" for company owners.',
        body: {
          type: 'Individual',
          title: 'Mr',
          sex: 'Male',
          maritalStatus: 'Single',
          firstName: 'John',
          lastName: 'Doe',
          middleName: 'A',
          dateOfBirth: '1990-01-01',
          phoneNumber: '08100000000',
          email: 'john@example.com',
          address: '12 Marina Road, Lagos Island, Lagos',
          ninNumber: '12345678901'
        },
        response: { data: { Pid: 'PID000456', name: 'John Doe' } },
        notes: [ 'The created ID may be returned as <code>Pid</code>, <code>pid</code>, <code>PID</code>, or <code>payerId</code>.' ]
      }
    ]
  },
  {
    id: 'transactions',
    title: 'Transactions',
    desc: 'Read the signed-in user’s payment/transaction history.',
    endpoints: [
      {
        id: 'transactions-list',
        name: 'List transactions',
        method: 'GET',
        path: '/shared/transaction',
        auth: 'session',
        desc: 'Return the signed-in user’s transactions.',
        response: { data: [ { id: 'txn_001', reference: 'REF123', amount: 5000, status: 'success', createdAt: '2026-06-01T10:00:00Z' } ] }
      },
      {
        id: 'transaction-detail',
        name: 'Get transaction',
        method: 'GET',
        path: '/shared/transaction/:id',
        auth: 'session',
        desc: 'Return a single transaction by id.',
        pathParams: [ { name: 'id', desc: 'Transaction id', example: 'txn_001' } ],
        response: { data: { id: 'txn_001', reference: 'REF123', amount: 5000, status: 'success', service: 'Number Plate', createdAt: '2026-06-01T10:00:00Z' } }
      }
    ]
  },
  {
    id: 'session-handshake',
    title: 'Session Handshake (v2)',
    desc: 'Hand a session off to an external service module via a short-lived one-time token, instead of exposing the session to third parties. Note: these live under /api/v2, not the /api/v1 base.',
    endpoints: [
      {
        id: 'issue-token',
        name: 'Issue handshake token',
        method: 'GET',
        path: '/api/v2/session/auth/issuetoken',
        absolutePath: true,
        auth: 'session',
        desc: 'Mint a short-lived (180s) one-time token to redirect a user to an external service with an authenticated handoff. The portal’s service cards use this so the third party never receives the session itself.',
        queryParams: [
          { name: 'email', desc: 'Account email', example: 'user@example.com', required: true },
          { name: 'url', desc: 'External service URL to hand off to', example: 'https://mvatvtlagos.com/mvaa-app/verify-session', required: true },
          { name: 'userType', desc: 'individual or company', example: 'individual', required: true },
          { name: 'redirect', desc: 'true → server 302-redirects to url?token=<oht>; false → returns the JSON below (use false from this console / a fetch)', example: 'false', required: true }
        ],
        response: {
          success: 'true',
          expiresIn: 180,
          status: 200,
          url: 'https://mvatvtlagos.com/mvaa-app/verify-session?token=iUi9W8MlWQIBSxxaVKibFF-lYnxuHj0JOH4yu7zlqVo',
          oht: 'iUi9W8MlWQIBSxxaVKibFF-lYnxuHj0JOH4yu7zlqVo'
        },
        notes: [
          'Authenticates exactly like the v1 endpoints — via the session header (<code>X-Portal-Session-Id</code>) carrying the encrypted login envelope. A server-side guard resolves the session, so a <code>sid</code> query param is no longer required.',
          'Tokens expire after <strong>180 seconds</strong> and are single-use.',
          'With <code>redirect=true</code> + <code>url</code>, the server 302-redirects to <code>url?token=&lt;oht&gt;</code>. With <code>redirect=false</code> it returns the JSON so the client navigates itself.',
          'The portal calls this with <code>redirect=false</code> then navigates to the returned <code>url</code> — so the external module only ever receives the disposable <code>oht</code>, never the session envelope.'
        ]
      }
    ]
  }
];

/* ----------------------------------------------------------------------------
   Persistent config (base URL + session token), stored in localStorage.
---------------------------------------------------------------------------- */

const store = {
  get base() { return localStorage.getItem('mvaa_doc_base') || DEFAULT_BASE_URL; },
  set base(v) { localStorage.setItem('mvaa_doc_base', v); },
  get token() { return localStorage.getItem('mvaa_doc_token') || ''; },
  set token(v) { localStorage.setItem('mvaa_doc_token', v); }
};

/* ----------------------------------------------------------------------------
   Small helpers
---------------------------------------------------------------------------- */

const el = (tag, attrs = {}, html) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([ k, v ]) => {
    if (k === 'class') n.className = v;
    else if (k === 'dataset') Object.assign(n.dataset, v);
    else n.setAttribute(k, v);
  });
  if (html !== undefined) n.innerHTML = html;
  return n;
};

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Minimal JSON syntax highlighter for the dark code blocks.
const highlightJson = (obj) => {
  const json = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
  return escapeHtml(json)
    .replace(/&quot;(\w[\w\d_]*)&quot;:/g, '<span class="k">&quot;$1&quot;</span>:')
    .replace(/: &quot;(.*?)&quot;/g, ': <span class="s">&quot;$1&quot;</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="n">$1</span>')
    .replace(/: (true|false|null)/g, ': <span class="b">$1</span>');
};

const methodClass = (m) => m.toLowerCase();

const codeBlock = (obj, label) => {
  const wrap = el('div', { class: 'code-wrap' });
  if (label) wrap.appendChild(el('h4', {}, label));
  const inner = el('div', { class: 'code-wrap' });
  const pre = el('pre', { class: 'code' });
  pre.innerHTML = highlightJson(obj);
  const btn = el('button', { class: 'copy-btn' }, 'Copy');
  btn.addEventListener('click', () => {
    const text = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy'), 1400);
    });
  });
  inner.appendChild(pre);
  inner.appendChild(btn);
  if (label) { wrap.appendChild(inner); return wrap; }
  return inner;
};

/* ----------------------------------------------------------------------------
   Render: sidebar navigation
---------------------------------------------------------------------------- */

function renderNav() {
  const nav = document.getElementById('nav');
  ENDPOINT_GROUPS.forEach((group) => {
    const g = el('div', { class: 'nav-group' });
    g.appendChild(el('div', { class: 'nav-group-title' }, group.title));
    group.endpoints.forEach((ep) => {
      const link = el('a', { class: 'nav-link', href: '#' + ep.id, dataset: { target: ep.id, search: (ep.name + ' ' + ep.path).toLowerCase() } });
      link.appendChild(el('span', { class: 'm method ' + methodClass(ep.method) }, ep.method));
      link.appendChild(el('span', {}, ep.name));
      g.appendChild(link);
    });
    nav.appendChild(g);
  });
}

/* ----------------------------------------------------------------------------
   Render: a parameter table
---------------------------------------------------------------------------- */

function paramTable(title, params, withRequired) {
  const h = el('h4', {}, title);
  const table = el('table', { class: 'def' });
  const head = withRequired
    ? '<tr><th>Name</th><th>Required</th><th>Description</th><th>Example</th></tr>'
    : '<tr><th>Name</th><th>Description</th><th>Example</th></tr>';
  table.innerHTML = head + params.map((p) => withRequired
    ? `<tr><td><code>${p.name}</code></td><td>${p.required ? '<span class="req">required</span>' : '<span class="opt">optional</span>'}</td><td>${p.desc}</td><td><code>${escapeHtml(p.example)}</code></td></tr>`
    : `<tr><td><code>${p.name}</code></td><td>${p.desc}</td><td><code>${escapeHtml(p.example)}</code></td></tr>`
  ).join('');
  return [ h, table ];
}

/* ----------------------------------------------------------------------------
   Render: one endpoint card (with Try-it console)
---------------------------------------------------------------------------- */

function renderEndpoint(ep) {
  const card = el('section', { class: 'endpoint', id: ep.id });

  // Head
  const head = el('div', { class: 'endpoint-head' });
  const title = el('div', { class: 'endpoint-title' });
  title.appendChild(el('span', { class: 'method ' + methodClass(ep.method) }, ep.method));
  title.appendChild(el('h3', {}, ep.name));
  title.appendChild(el('span', { class: 'auth-badge ' + ep.auth }, ep.auth === 'session' ? '🔒 Session' : 'Public'));
  head.appendChild(title);
  const pathRow = el('div', { class: 'path-row' });
  pathRow.appendChild(el('span', { class: 'path' }, escapeHtml(ep.path)));
  head.appendChild(pathRow);
  head.appendChild(el('p', { class: 'desc' }, ep.desc));
  card.appendChild(head);

  // Body
  const body = el('div', { class: 'endpoint-body' });

  if (ep.pathParams && ep.pathParams.length) paramTable('Path parameters', ep.pathParams, false).forEach((n) => body.appendChild(n));
  if (ep.queryParams && ep.queryParams.length) paramTable('Query parameters', ep.queryParams, true).forEach((n) => body.appendChild(n));

  if (ep.body !== undefined) body.appendChild(codeBlock(ep.body, 'Request body'));
  if (ep.response !== undefined) body.appendChild(codeBlock(ep.response, 'Example response'));

  if (ep.notes && ep.notes.length) {
    const notes = el('div', { class: 'callout' });
    notes.innerHTML = ep.notes.map((n) => `<div>• ${n}</div>`).join('');
    body.appendChild(notes);
  }

  // Try it
  body.appendChild(renderTryIt(ep));

  card.appendChild(body);
  return card;
}

/* ----------------------------------------------------------------------------
   Render: Try-it console for an endpoint
---------------------------------------------------------------------------- */

function renderTryIt(ep) {
  const wrap = el('div', { class: 'tryit' });
  wrap.appendChild(el('div', { class: 'tryit-title' }, '<span class="bolt">⚡</span> Try it'));

  const inputs = {};

  // Path + query param inputs
  const allParams = [
    ...(ep.pathParams || []).map((p) => ({ ...p, kind: 'path' })),
    ...(ep.queryParams || []).map((p) => ({ ...p, kind: 'query' }))
  ];
  if (allParams.length) {
    const grid = el('div', { class: 'input-grid' });
    allParams.forEach((p) => {
      const label = el('label', {}, `${p.name}<span class="hint">${p.kind} param</span>`);
      const input = el('input', { type: 'text', value: p.example || '', placeholder: p.example || '' });
      inputs[p.kind + ':' + p.name] = input;
      grid.appendChild(label);
      grid.appendChild(input);
    });
    wrap.appendChild(grid);
  }

  // Body editor
  let bodyEditor = null;
  if (ep.body !== undefined) {
    const be = el('div', { class: 'body-editor' });
    be.appendChild(el('label', {}, 'Request body (JSON)'));
    bodyEditor = el('textarea', { spellcheck: 'false' });
    bodyEditor.value = JSON.stringify(ep.body, null, 2);
    be.appendChild(bodyEditor);
    wrap.appendChild(be);
  }

  // Actions
  const actions = el('div', { class: 'tryit-actions' });
  const sendBtn = el('button', { class: 'btn btn-send' }, 'Send Request');
  const resetBtn = el('button', { class: 'btn btn-ghost' }, 'Reset');
  actions.appendChild(sendBtn);
  if (bodyEditor) actions.appendChild(resetBtn);
  wrap.appendChild(actions);

  // Response area
  const resp = el('div', { class: 'response' });
  wrap.appendChild(resp);

  resetBtn.addEventListener('click', () => { if (bodyEditor) bodyEditor.value = JSON.stringify(ep.body, null, 2); });

  sendBtn.addEventListener('click', () => sendRequest(ep, inputs, bodyEditor, resp, sendBtn));

  return wrap;
}

/* ----------------------------------------------------------------------------
   Perform the live request
---------------------------------------------------------------------------- */

async function sendRequest(ep, inputs, bodyEditor, resp, sendBtn) {
  // Build path with params
  let path = ep.path;
  (ep.pathParams || []).forEach((p) => {
    const v = (inputs['path:' + p.name].value || '').trim();
    path = path.replace(':' + p.name, encodeURIComponent(v));
  });

  // Query string
  const qs = (ep.queryParams || [])
    .map((p) => [ p.name, (inputs['query:' + p.name].value || '').trim() ])
    .filter(([ , v ]) => v !== '')
    .map(([ k, v ]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const base = (store.base || DEFAULT_BASE_URL).replace(/\/+$/, '');
  // absolutePath endpoints (e.g. the v2 handshake) hang off the origin, not the /api/v1 base.
  const root = ep.absolutePath ? new URL(base).origin : base;
  const url = root + path + (qs ? '?' + qs : '');

  // Headers
  const headers = { 'Content-Type': 'application/json' };
  if (ep.auth === 'session') {
    const token = store.token;
    if (!token) {
      renderResponse(resp, { error: true, message: 'This endpoint requires a session token. Sign in first, then click “Use as session token”, or paste one into the Session Token field at the top.' });
      return;
    }
    headers['X-Portal-Session-Id'] = token;
    headers['Authorization'] = 'Bearer ' + token;
  }

  // Body
  let bodyStr;
  if (bodyEditor) {
    try {
      bodyStr = JSON.stringify(JSON.parse(bodyEditor.value));
    } catch (e) {
      renderResponse(resp, { error: true, message: 'Request body is not valid JSON: ' + e.message });
      return;
    }
  }

  sendBtn.disabled = true;
  const original = sendBtn.textContent;
  sendBtn.innerHTML = '<span class="spinner"></span> Sending…';
  const started = performance.now();

  try {
    const res = await fetch(url, {
      method: ep.method,
      headers,
      body: ep.method === 'GET' || ep.method === 'DELETE' ? undefined : bodyStr,
      mode: 'cors'
    });
    const ms = Math.round(performance.now() - started);
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = text; }
    renderResponse(resp, { status: res.status, statusText: res.statusText, ms, body: parsed, ep });
  } catch (err) {
    const ms = Math.round(performance.now() - started);
    renderResponse(resp, {
      error: true, ms,
      message: 'Request failed: ' + err.message + '. This is usually a CORS or connectivity issue — the API server must allow this page’s origin. See the “Testing & CORS” note at the top.'
    });
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = original;
  }
}

/* ----------------------------------------------------------------------------
   Render the response panel
---------------------------------------------------------------------------- */

function renderResponse(resp, result) {
  resp.innerHTML = '';
  resp.classList.add('show');

  const meta = el('div', { class: 'response-meta' });

  if (result.error) {
    meta.appendChild(el('span', { class: 'status-pill s0' }, 'ERROR'));
    if (result.ms !== undefined) meta.appendChild(el('span', { class: 'time' }, result.ms + ' ms'));
    resp.appendChild(meta);
    resp.appendChild(codeBlock(result.message));
    return;
  }

  const cls = 's' + String(result.status).charAt(0);
  meta.appendChild(el('span', { class: 'status-pill ' + cls }, result.status + ' ' + (result.statusText || '')));
  meta.appendChild(el('span', { class: 'time' }, result.ms + ' ms'));

  // Offer to capture a session token from a sign-in response.
  const isSignin = result.ep && (result.ep.id === 'signin' || result.ep.id === 'signin-entity');
  const token = result.body && typeof result.body === 'object' ? result.body.data : null;
  if (isSignin && result.status >= 200 && result.status < 300 && typeof token === 'string' && token) {
    const useBtn = el('button', { class: 'use-token' }, '✓ Use as session token');
    useBtn.addEventListener('click', () => {
      setToken(token);
      useBtn.textContent = 'Saved!';
      setTimeout(() => (useBtn.textContent = '✓ Use as session token'), 1500);
    });
    meta.appendChild(useBtn);
  }

  resp.appendChild(meta);
  resp.appendChild(codeBlock(result.body));
}

/* ----------------------------------------------------------------------------
   Config bar (base URL + token) wiring
---------------------------------------------------------------------------- */

function setToken(v) {
  store.token = v;
  const input = document.getElementById('token-input');
  if (input) input.value = v;
  updateTokenChip();
}

function updateTokenChip() {
  const chip = document.getElementById('token-chip');
  if (!chip) return;
  if (store.token) { chip.textContent = '● Session active'; chip.classList.remove('empty'); }
  else { chip.textContent = '○ No session token'; chip.classList.add('empty'); }
}

function initConfigBar() {
  const baseInput = document.getElementById('base-input');
  const tokenInput = document.getElementById('token-input');
  baseInput.value = store.base;
  tokenInput.value = store.token;
  baseInput.addEventListener('input', () => { store.base = baseInput.value.trim(); });
  tokenInput.addEventListener('input', () => { store.token = tokenInput.value.trim(); updateTokenChip(); });
  updateTokenChip();
}

/* ----------------------------------------------------------------------------
   Sidebar: scrollspy + search + mobile toggle
---------------------------------------------------------------------------- */

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const byId = {};
  links.forEach((l) => (byId[l.dataset.target] = l));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove('active'));
        if (byId[e.target.id]) byId[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('.endpoint').forEach((s) => observer.observe(s));
}

function initSearch() {
  const input = document.getElementById('nav-search-input');
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('.nav-link').forEach((l) => {
      l.classList.toggle('hidden', q && !l.dataset.search.includes(q));
    });
    document.querySelectorAll('.nav-group').forEach((g) => {
      const anyVisible = g.querySelector('.nav-link:not(.hidden)');
      g.style.display = anyVisible ? '' : 'none';
    });
  });
}

function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach((l) =>
    l.addEventListener('click', () => sidebar.classList.remove('open')));
}

/* ----------------------------------------------------------------------------
   Boot
---------------------------------------------------------------------------- */

function init() {
  renderNav();
  const container = document.getElementById('endpoints');
  ENDPOINT_GROUPS.forEach((group) => {
    const sec = el('section', { class: 'section', id: 'group-' + group.id });
    sec.appendChild(el('h2', {}, `${group.title}<a class="anchor" href="#group-${group.id}">#</a>`));
    sec.appendChild(el('p', {}, group.desc));
    container.appendChild(sec);
    group.endpoints.forEach((ep) => container.appendChild(renderEndpoint(ep)));
  });
  initConfigBar();
  initScrollSpy();
  initSearch();
  initMobileMenu();
}

document.addEventListener('DOMContentLoaded', init);
