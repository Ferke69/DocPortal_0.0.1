import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Shield, Settings } from 'lucide-react';
import { Button } from './ui/button';

const CookiePolicy = () => {
  const navigate = useNavigate();

  const openCookieSettings = () => {
    // Clear consent to re-show the banner
    localStorage.removeItem('docportal_cookie_consent');
    window.location.reload();
  };

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
            <Cookie className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cookie Policy</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Last updated: March 2026</p>
        </div>

        {/* Manage Cookies Button */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">Manage Your Cookie Preferences</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                You can change your cookie settings at any time.
              </p>
            </div>
            <Button onClick={openCookieSettings} className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Cookie Settings
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit a website. 
              They help the website remember your preferences and understand how you interact with 
              the site. Cookies are widely used to make websites work more efficiently and provide 
              a better user experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How We Use Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              DocPortal uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>To keep you signed in to your account</li>
              <li>To remember your language and display preferences</li>
              <li>To ensure the security of your session</li>
              <li>To understand how you use our platform (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              {/* Essential */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Essential Cookies</h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                    Always Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  These cookies are necessary for the website to function and cannot be switched off.
                </p>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-300">Cookie</th>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-300">Purpose</th>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-300">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    <tr className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-2 font-mono text-xs">auth_token</td>
                      <td className="p-2">Authentication session</td>
                      <td className="p-2">Session / 30 days</td>
                    </tr>
                    <tr className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-2 font-mono text-xs">docportal_cookie_consent</td>
                      <td className="p-2">Stores your cookie preferences</td>
                      <td className="p-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Functional */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Functional Cookies</h3>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  These cookies enable personalized features and remember your preferences.
                </p>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-300">Cookie</th>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-300">Purpose</th>
                      <th className="text-left p-2 text-gray-600 dark:text-gray-300">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    <tr className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-2 font-mono text-xs">i18nextLng</td>
                      <td className="p-2">Language preference</td>
                      <td className="p-2">1 year</td>
                    </tr>
                    <tr className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-2 font-mono text-xs">userCountry</td>
                      <td className="p-2">Country/currency preference</td>
                      <td className="p-2">1 year</td>
                    </tr>
                    <tr className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-2 font-mono text-xs">theme</td>
                      <td className="p-2">Dark/light mode preference</td>
                      <td className="p-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Analytics */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</h3>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                    Optional
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  These cookies help us understand how visitors interact with our website.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-sm text-gray-600 dark:text-gray-400">
                  <p>We currently do not use third-party analytics cookies. If we add analytics in the future, 
                  we will update this policy and request your consent.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              DocPortal uses the following third-party services that may set cookies:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li><strong>Stripe:</strong> For secure payment processing. Stripe may set cookies to prevent fraud.</li>
              <li><strong>Jitsi Meet:</strong> For video consultations. Jitsi may set cookies when you join a video call.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Managing Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You can control cookies in several ways:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Use our cookie settings button at the top of this page</li>
              <li>Configure your browser to block or delete cookies</li>
              <li>Use your browser's private/incognito mode</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              <strong>Note:</strong> Blocking essential cookies may prevent you from using DocPortal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Under GDPR and ePrivacy regulations, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>Know what cookies we use and why</li>
              <li>Accept or reject non-essential cookies</li>
              <li>Change your preferences at any time</li>
              <li>Request deletion of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have questions about our use of cookies, please contact us at:<br />
              <strong>Email:</strong> privacy@docportal.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated revision date. If we make significant changes, we will notify you and 
              request your consent again.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
