# DocPortal - Private Psychiatric Practice Management Platform

## 🎯 Project Vision

**DocPortal** is a modern, secure platform designed to connect **private sector psychiatrists** with their **patients** in the European market (initially focused on Slovenia and EU countries). 

Think of it as a **SimplePractice alternative** tailored specifically for:
- Private psychiatric practices
- Mental health professionals
- Therapists and counselors

### What We Want to Achieve

1. **Simplify Practice Management** - Give psychiatrists a single dashboard to manage their entire practice
2. **Empower Patients** - Provide patients with easy appointment booking, secure messaging, and payment management
3. **Ensure Privacy & Security** - Handle sensitive psychiatric communications with encryption and GDPR/HIPAA compliance mindset
4. **EU Compliance** - Built-in support for European invoicing, VAT, and tax requirements across 8 countries

---

## 🏗️ What We Built

### For Psychiatrists (Provider Portal)

| Feature | Status | Description |
|---------|--------|-------------|
| **Dashboard** | ✅ Complete | Overview of daily appointments, income, and pending tasks |
| **Client Management** | ✅ Complete | Invite-only system - patients can only join via provider's invite code |
| **Appointment Calendar** | ✅ Complete | View, manage, and track all bookings |
| **Secure Messaging** | ✅ Complete | AES-256 encrypted chat with patients |
| **Billing & Invoicing** | ✅ Complete | EU-compliant PDF invoices with VAT, generate bills, track payments |
| **Business Settings** | ✅ Complete | Tax info, bank details, logo upload for invoices |
| **Refund Management** | ✅ Complete | Approve/reject patient refund requests |
| **Schedule Settings** | ✅ Complete | Set availability, appointment types, pricing |
| **Email Reminders** | ✅ Complete | Automatic 24h appointment reminders (MOCKED) |

### For Patients (Client Portal)

| Feature | Status | Description |
|---------|--------|-------------|
| **Dashboard** | ✅ Complete | View upcoming appointments, pending bills, messages |
| **Appointment Booking** | ✅ Complete | Book sessions with assigned psychiatrist |
| **Secure Messaging** | ✅ Complete | Chat with provider (encrypted) |
| **Billing & Payments** | ✅ Complete | View invoices, make payments via Stripe |
| **Refund Requests** | ✅ Complete | Request refunds (3+ days before appointment) |
| **Profile Settings** | ✅ Complete | Update personal info, language preference |

### Platform Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Multi-Language** | ✅ Complete | 8 languages: EN, SL, DE, FR, ES, IT, PT, NL |
| **Multi-Currency** | ✅ Complete | EUR (€) and GBP (£) based on country |
| **Dark/Light Mode** | ✅ Complete | User preference toggle |
| **Session Security** | ✅ Complete | 30-min auto-logout, "Keep me logged in" option |
| **Mobile Responsive** | ✅ Complete | Works on all devices |

---

## 🔒 Privacy & Security Approach

Since we're handling **psychiatric/mental health data**, security is paramount:

### What We Store
- ✅ **User accounts** (email, name, role)
- ✅ **Appointments** (date, time, type, status)
- ✅ **Messages between patient-provider** (AES-256 encrypted)
- ✅ **Invoices and payment records**
- ✅ **Provider business settings**

### What We DON'T Store
- ❌ **Clinical notes or diagnoses** (not implemented by design)
- ❌ **Medical records or EHR data**
- ❌ **Sensitive health information beyond scheduling**

### Security Measures
- **Encrypted Messaging**: AES-256 encryption for all chat messages
- **Secure Authentication**: JWT tokens + optional Google OAuth
- **Session Management**: Auto-logout after 30 minutes of inactivity
- **Invite-Only Patients**: Patients cannot self-register - must have provider's invite code
- **Audit Logging**: All sensitive actions are logged

---

## 🚨 What's Missing / Needs Attention

### Critical for Launch

| Missing Feature | Priority | Why It Matters |
|-----------------|----------|----------------|
| **Real Payment Integration** | 🔴 HIGH | Stripe is currently in TEST mode - no real payments |
| **Real Email Service** | 🔴 HIGH | Email reminders log to console only - need Resend/SendGrid API key |
| **Video Consultation** | 🟡 MEDIUM | Only generates placeholder links - needs Google Meet API integration |
| **Terms of Service / Privacy Policy** | 🔴 HIGH | Legal requirement for any healthcare-adjacent platform |
| **Consent Forms** | 🟡 MEDIUM | Patients should agree to data processing terms |

### Nice to Have

| Feature | Priority | Description |
|---------|----------|-------------|
| **SMS Reminders** | 🟢 LOW | Alternative to email reminders via Twilio |
| **Calendar Sync** | 🟢 LOW | Export/import to Google Calendar, iCal |
| **Recurring Appointments** | 🟡 MEDIUM | Weekly/monthly recurring sessions |
| **Waitlist Management** | 🟢 LOW | Handle cancellations and waitlisted patients |
| **Analytics Dashboard** | 🟢 LOW | Practice statistics, revenue trends |
| **Multi-Provider Practice** | 🟡 MEDIUM | Support for clinics with multiple psychiatrists |

---

## 🌍 EU Compliance Status

### Invoicing (✅ Complete)

| Country | Tax ID Label | VAT Rate | E-Invoicing |
|---------|--------------|----------|-------------|
| Slovenia | Davčna številka | 22% | No |
| Germany | Steuernummer | 19% | No |
| France | SIRET | 20% | Required |
| Spain | NIF/CIF | 21% | Required |
| Italy | Codice Fiscale | 22% | Required |
| Portugal | NIF | 23% | Required |
| Netherlands | KVK-nummer | 21% | No |
| UK | UTR | 20% | No |

### GDPR Considerations

- ✅ Data minimization (only collect necessary info)
- ✅ Encrypted sensitive data (messages)
- ⚠️ Need: Data export functionality (patient's right to data)
- ⚠️ Need: Data deletion request handling
- ⚠️ Need: Cookie consent banner
- ⚠️ Need: Privacy policy page

---

## 💰 Business Model Potential

DocPortal could operate as:

1. **SaaS Subscription** - Monthly fee per provider (€29-99/month)
2. **Transaction Fee** - Small percentage of each payment processed
3. **Freemium** - Basic features free, premium features paid

---

## 🛠️ Technical Stack

```
Frontend:  React + Tailwind CSS + shadcn/ui
Backend:   FastAPI (Python) + MongoDB
Auth:      JWT + Google OAuth
Payments:  Stripe (TEST mode)
Emails:    Resend (needs API key)
Hosting:   Kubernetes container
```

---

## 📋 Summary

**DocPortal is 80% complete** for a basic private psychiatric practice management system.

### ✅ Working Now
- Provider and patient portals
- Appointment scheduling
- Secure encrypted messaging
- EU-compliant invoicing
- Multi-language support
- Session security

### ⚠️ Needs Before Launch
1. Real Stripe payment keys
2. Real email service (Resend API key)
3. Terms of Service / Privacy Policy pages
4. Video consultation integration
5. GDPR compliance pages (data export, deletion)

### 🎯 Core Value Proposition
> "A simple, secure way for private psychiatrists to manage their practice and connect with patients - built for Europe."

---

*Last Updated: March 2026*
