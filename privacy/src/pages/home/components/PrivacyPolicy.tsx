

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy & Terms of Service</h1>
      
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">1. TERMS & CONDITIONS</h2>
        <p className="text-gray-400 mb-6">Effective Date: {currentDate}</p>
        <p className="mb-4">
          <strong>Company Name:</strong> SIRz<br />
          <strong>Registered Address:</strong> 17 Barmouth Road, Marine Parade, LL42 1NA<br />
          <strong>Contact Email:</strong> support@sirz.co.uk<br />
          <strong>Phone Number:</strong> 074 07245685
        </p>

        <div className="space-y-6 mt-8">
          <Section title="1. Introduction">
            Welcome to SIRz ("Company", "we", "our", or "us"). These Terms and Conditions ("Terms") govern your use of our websites and services, including all subdomains under sirz.co.uk, and any associated platforms (collectively, the "Platform").
            By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use our services.
          </Section>

          <Section title="2. Eligibility">
            You must be at least 18 years of age to use our services. By using the Platform, you confirm that you meet this age requirement and that you are legally capable of entering into binding contracts.
          </Section>

          <Section title="3. Services">
            SIRz provides digital marketing services including but not limited to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>E-commerce development and strategy</li>
              <li>Branding and visual identity</li>
              <li>Social media and digital advertising</li>
              <li>Custom content, AI tools, and marketing stacks</li>
            </ul>
            We reserve the right to modify, suspend, or discontinue any aspect of the services at any time.
          </Section>

          <Section title="4. Account Creation and Security">
            Some services require you to create an account. You are responsible for safeguarding your login credentials and all activities under your account. Notify us immediately if you believe your account has been compromised.
          </Section>

          <Section title="5. Fees and Payments">
            Unless otherwise stated, use of our platform is free for browsing. Services provided to clients under a contractual agreement will be governed by separate terms including pricing, deliverables, and timelines.
            All prices are in GBP and include applicable VAT unless stated otherwise.
          </Section>

          <Section title="6. Intellectual Property">
            All content on the Platform (including designs, graphics, logos, and source code) is the property of SIRz or its licensors and is protected under copyright, trademark, and other applicable laws. You may not copy, reproduce, republish, or distribute any content without our written permission.
          </Section>

          <Section title="7. User Conduct">
            You agree not to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Platform for unlawful or harmful purposes</li>
              <li>Attempt to gain unauthorized access to our servers</li>
              <li>Transmit viruses or other malicious code</li>
              <li>Abuse or harass other users</li>
            </ul>
          </Section>

          <Section title="8. Third-Party Services">
            Our platform may integrate or link to third-party services (e.g. Shopify, Cloudinary, Google Analytics). We are not responsible for the content or data practices of these third parties.
          </Section>

          <Section title="9. Termination">
            We may suspend or terminate your account and access to the Platform at our sole discretion if you breach these Terms or misuse our services.
          </Section>

          <Section title="10. Liability and Disclaimer">
            To the extent permitted by law, we disclaim all warranties and are not liable for any indirect, incidental, or consequential damages. Our maximum liability shall not exceed the amount paid by you for services in the past 12 months.
          </Section>

          <Section title="11. Governing Law">
            These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of the United Kingdom.
          </Section>

          <Section title="12. Changes to These Terms">
            We may update these Terms periodically. Continued use of our services after such changes constitutes your acceptance of the new Terms.
          </Section>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">2. PRIVACY & DATA PROTECTION POLICY</h2>
        <p className="text-gray-400 mb-6">Effective Date: {currentDate}</p>
        <p className="mb-4">
          <strong>Data Controller:</strong> SIRz<br />
          <strong>Registered Office:</strong> 17 Barmouth Road, Marine Parade, LL42 1NA<br />
          <strong>Email:</strong> support@sirz.co.uk
        </p>

        <div className="space-y-6 mt-8">
          <Section title="1. Purpose of this Policy">
            This Privacy Policy outlines how SIRz collects, processes, stores, and protects your personal data when you use our websites and services, in accordance with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and other applicable data protection laws.
          </Section>

          <Section title="2. What Data We Collect">
            We collect and process:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Identity Data:</strong> Full name, company name</li>
              <li><strong>Contact Data:</strong> Email address, phone number, billing/delivery address</li>
              <li><strong>Usage Data:</strong> Pages visited, interactions, time spent</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device ID, OS</li>
              <li><strong>Marketing Preferences:</strong> Your opt-in status for newsletters or promotions</li>
              <li><strong>Content:</strong> Any files, images, or text you upload (via Cloudinary or forms)</li>
            </ul>
            We do not knowingly collect personal data from children under 18.
          </Section>

          <Section title="3. How We Use Your Data">
            We use your data to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and improve our services</li>
              <li>Communicate with you regarding inquiries or support</li>
              <li>Personalize your experience</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (only if you consent)</li>
            </ul>
          </Section>

          <Section title="4. Legal Bases for Processing">
            We process personal data under one or more of the following legal bases:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your consent</li>
              <li>Performance of a contract</li>
              <li>Legitimate interests</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing">
            We may share your data with trusted third-party service providers including:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Cloudinary (media hosting)</li>
              <li>MongoDB Atlas (database storage)</li>
              <li>Vercel and Render (hosting and analytics)</li>
              <li>Stripe or Paystack (if payment processing is integrated)</li>
            </ul>
            We ensure all processors are GDPR-compliant and have appropriate data protection measures.
          </Section>

          <Section title="6. International Transfers">
            Some data may be processed or stored outside the UK. In such cases, we ensure adequate safeguards are in place under UK GDPR (e.g., Standard Contractual Clauses).
          </Section>

          <Section title="7. Data Security">
            We implement technical and organizational security measures including:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>HTTPS encryption across all websites</li>
              <li>Secure access controls and authentication</li>
              <li>Environment variable encryption for credentials</li>
              <li>Regular audits and penetration testing (where applicable)</li>
            </ul>
          </Section>

          <Section title="8. Data Retention">
            We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, including for legal, regulatory, or reporting requirements.
            User-uploaded data (e.g. designs, branding assets) may be stored in Cloudinary with expiration rules.
          </Section>

          <Section title="9. Your Rights">
            You have the right to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access your data</li>
              <li>Correct or erase your data</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with the Information Commissioner's Office (ICO)</li>
            </ul>
            To exercise these rights, contact: support@sirz.co.uk
          </Section>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">3. COOKIE POLICY</h2>
        <p className="text-gray-400 mb-6">Effective Date: {currentDate}</p>

        <div className="space-y-6">
          <Section title="1. What Are Cookies?">
            Cookies are small text files placed on your device to collect standard internet log information and visitor behavior information.
          </Section>

          <Section title="2. Why We Use Cookies">
            We use cookies to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Enable core site functionality (e.g., login sessions)</li>
              <li>Analyze traffic and site performance (e.g., Google Analytics)</li>
              <li>Remember preferences (e.g., language, form data)</li>
              <li>Deliver marketing and retargeting ads (where applicable)</li>
            </ul>
          </Section>

          <Section title="3. Types of Cookies">
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-300">Essential</td>
                    <td className="px-4 py-3 text-sm text-gray-400">Necessary for platform operation</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-300">Analytics</td>
                    <td className="px-4 py-3 text-sm text-gray-400">Help us understand site performance</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-300">Functional</td>
                    <td className="px-4 py-3 text-sm text-gray-400">Remember preferences and settings</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-300">Marketing</td>
                    <td className="px-4 py-3 text-sm text-gray-400">Used for advertising and retargeting</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Third-Party Cookies">
            Some third parties (e.g. Cloudinary, Google, Stripe) may set their own cookies via embedded content or scripts.
            We are not responsible for the cookie practices of third-party services.
          </Section>

          <Section title="5. Cookie Consent">
            When you first visit our website, you will see a cookie banner. By continuing to use our site, or clicking "Accept", you consent to the use of non-essential cookies.
            You can withdraw consent or update cookie preferences at any time via your browser settings.
          </Section>

          <Section title="6. Managing Cookies">
            Most browsers allow you to refuse cookies or delete existing ones. Note that blocking cookies may impact site functionality.
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title , children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-2 text-gray-100">{title}</h3>
    <div className="text-gray-300 leading-relaxed">
      {children}
    </div>
  </div>
);

export default PrivacyPolicy;
