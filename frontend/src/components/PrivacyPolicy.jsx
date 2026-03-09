import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Trash2, Download } from 'lucide-react';
import { Button } from './ui/button';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Last updated: March 2026</p>
        </div>

        {/* GDPR Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🇪🇺 GDPR Compliant</h3>
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            This privacy policy complies with the EU General Data Protection Regulation (GDPR). 
            You have the right to access, correct, export, and delete your personal data at any time.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-600" />
              1. What Data We Collect
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>Account Information:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name and email address</li>
                <li>Phone number (optional)</li>
                <li>Account type (provider or patient)</li>
              </ul>
              
              <p className="mt-4"><strong>For Healthcare Providers:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Business name and address</li>
                <li>Tax identification numbers (for invoicing)</li>
                <li>Bank details (for receiving payments)</li>
                <li>Professional credentials</li>
              </ul>

              <p className="mt-4"><strong>Usage Data:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Appointment bookings and history</li>
                <li>Messages between providers and patients (encrypted)</li>
                <li>Payment transactions</li>
                <li>Login activity and session data</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              2. What We Do NOT Collect
            </h2>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                DocPortal is designed for scheduling and communication only. We do NOT collect or store:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Medical diagnoses or clinical notes</li>
                <li>Health records or medical history</li>
                <li>Prescription information</li>
                <li>Mental health assessments or evaluations</li>
                <li>Any sensitive health data beyond appointment scheduling</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-blue-600" />
              3. How We Protect Your Data
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Encryption:</strong> All messages are encrypted using AES-256 encryption</li>
              <li><strong>Secure transmission:</strong> All data is transmitted over HTTPS/TLS</li>
              <li><strong>Access control:</strong> Patients can only communicate with their assigned provider</li>
              <li><strong>Session security:</strong> Automatic logout after 30 minutes of inactivity</li>
              <li><strong>Secure payments:</strong> Payment processing handled by Stripe (PCI-DSS compliant)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. How We Use Your Data</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>To provide and maintain our scheduling service</li>
              <li>To process appointments and payments</li>
              <li>To send appointment reminders and notifications</li>
              <li>To generate invoices (for providers)</li>
              <li>To respond to support requests</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Sharing</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">We share data only in these circumstances:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Provider-Patient relationship:</strong> Your data is shared with your healthcare provider (or patients, if you are a provider)</li>
              <li><strong>Payment processing:</strong> Payment details are shared with Stripe</li>
              <li><strong>Legal requirements:</strong> When required by law or court order</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              <strong>We do NOT sell your data to third parties.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Retention</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Account data:</strong> Retained while your account is active</li>
              <li><strong>Messages:</strong> Retained for 2 years after last activity</li>
              <li><strong>Invoices:</strong> Retained for 10 years (legal requirement in Slovenia/EU)</li>
              <li><strong>Deleted accounts:</strong> Data permanently removed within 30 days of deletion request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2 text-blue-600" />
              7. Your Rights (GDPR)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Under GDPR, you have the right to:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Access</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Request a copy of all your personal data</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rectification</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Correct inaccurate personal data</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Erasure</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Request deletion of your data ("right to be forgotten")</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Portability</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Export your data in a machine-readable format</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              To exercise these rights, go to <strong>Profile → Data & Privacy</strong> or contact us at privacy@docportal.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use essential cookies only for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1 mt-2">
              <li>Authentication (keeping you logged in)</li>
              <li>Language and theme preferences</li>
              <li>Session security</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              DocPortal is not intended for users under 18 years of age. We do not knowingly collect 
              personal data from children. If you believe a child has provided us with personal data, 
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact & Data Protection Officer</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Data Controller:</strong> DocPortal<br />
                <strong>Email:</strong> privacy@docportal.com<br />
                <strong>Address:</strong> Ljubljana, Slovenia<br /><br />
                For GDPR-related inquiries, contact our Data Protection Officer at: dpo@docportal.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this privacy policy from time to time. We will notify you of significant 
              changes via email. The "last updated" date at the top of this policy indicates when it 
              was last revised.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
