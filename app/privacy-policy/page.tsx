import { Header } from "@/components/ui/header-on-page";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and cookie information for Jupiter Foto.",
};

export default function PrivacyPolicyPage() {
  return (
    <AnimationWrapper>
      <Header
        title="Privacy Policy"
        subtitle="Information about how we handle your data and cookies"
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 select-none">
              Cookie Usage
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-semibold text-foreground select-none">
                Necessary Cookies
              </h3>
              <p className="select-none">
                These cookies are essential for the website to function
                properly. They enable basic functionality such as page
                navigation, form submissions, and access to secure areas of the
                website. The website cannot function properly without these
                cookies.
              </p>

              <h3 className="text-lg font-semibold text-foreground select-none">
                Analytics Cookies
              </h3>
              <p className="select-none">
                We use Google Analytics to understand how visitors interact with
                our website. These cookies collect information such as the
                number of visitors, which pages are most popular, and how users
                navigate through the site. All information collected is
                aggregated and anonymous.
              </p>

              <h3 className="text-lg font-semibold text-foreground select-none">
                Marketing Cookies
              </h3>
              <p className="select-none">
                These cookies track visitors across websites to display relevant
                advertisements and measure the effectiveness of advertising
                campaigns.
              </p>

              <h3 className="text-lg font-semibold text-foreground select-none">
                Preference Cookies
              </h3>
              <p className="select-none">
                These cookies remember your preferences and settings, such as
                your preferred language or theme, to provide a more personalized
                experience.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 select-none">
              Data Collection
            </h2>
            <p className="text-muted-foreground select-none">
              We collect minimal data necessary to provide and improve our
              services. This includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li className="select-none">
                Basic website usage analytics (page views, session duration)
              </li>
              <li className="select-none">
                Technical information (browser type, device information)
              </li>
              <li className="select-none">Your cookie preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 select-none">Your Rights</h2>
            <p className="text-muted-foreground select-none">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li className="select-none">
                Accept or decline non-essential cookies
              </li>
              <li className="select-none">
                Change your cookie preferences at any time
              </li>
              <li className="select-none">
                Request information about data we collect
              </li>
              <li className="select-none">Request deletion of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 select-none">Contact</h2>
            <p className="text-muted-foreground select-none">
              If you have any questions about this privacy policy or our use of
              cookies, please contact us at{" "}
              <a
                href="mailto:ashwinmanghat@gmail.com"
                className="text-primary underline hover:text-primary/80"
              >
                ashwinmanghat@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground select-none">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </AnimationWrapper>
  );
}
