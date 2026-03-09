import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';
import { Button } from './ui/button';

const TermsOfService = () => {
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
            <Scale className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Last updated: March 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing or using DocPortal ("the Platform"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services. DocPortal is a scheduling 
              and communication platform connecting healthcare providers with their patients.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              DocPortal provides:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Appointment scheduling between healthcare providers and patients</li>
              <li>Secure messaging for appointment-related communication</li>
              <li>Billing and payment processing</li>
              <li>Video consultation scheduling</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              <strong>Important:</strong> DocPortal is NOT a medical service. We do not provide medical advice, 
              diagnosis, or treatment. All medical decisions are between you and your healthcare provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>Providers:</strong> Healthcare professionals may register directly and must provide accurate professional information.</p>
              <p><strong>Patients:</strong> Patient accounts are created only through invite codes provided by registered healthcare providers.</p>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Use the platform for any unlawful purpose</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to access other users' accounts or data</li>
              <li>Upload malicious content or attempt to compromise platform security</li>
              <li>Use the messaging system for non-healthcare related solicitation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Payments and Refunds</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>Payments for appointments are processed through Stripe. By making a payment, you agree to Stripe's terms of service.</p>
              <p><strong>Refund Policy:</strong> Patients may request refunds for appointments cancelled at least 3 days in advance. 
              Refund requests require a valid reason and are subject to provider approval.</p>
              <p>DocPortal is not responsible for disputes between providers and patients regarding service quality.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Privacy and Data</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> for 
              information on how we collect, use, and protect your data. By using DocPortal, you consent to 
              our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              DocPortal is provided "as is" without warranties of any kind. We are not liable for any indirect, 
              incidental, or consequential damages arising from your use of the platform. Our total liability 
              shall not exceed the amount you paid to us in the 12 months preceding any claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update these terms from time to time. We will notify users of significant changes via 
              email or platform notification. Continued use of DocPortal after changes constitutes acceptance 
              of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These terms are governed by the laws of the Republic of Slovenia and applicable European Union 
              regulations. Any disputes shall be resolved in the courts of Ljubljana, Slovenia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For questions about these Terms of Service, please contact us at: <br />
              <strong>Email:</strong> legal@docportal.com
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
