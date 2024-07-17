import { Html, Head , Preview, Section, Row, Heading, Text, Font } from "@react-email/components";

interface VerificationProps {
    username : string,
    otp : string
}
export default function Email ({username , otp} : VerificationProps) {
  return (
    <Html lang="en" dir="ltr">
        <Head>
            <title>Verification Email</title>
            <Font
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                    format: "woff2",
                }}
                fontWeight={400}
                fontStyle="normal"
                />
      </Head>
      <Preview>Here's your verifcation code : {otp}</Preview>

      <Section>
        <Row>
            <Heading>
                Hi {username}!
            </Heading>
        </Row>
        <Row>
            <Text>
                Thank you for registering to our website. Please use the following code to verify your account:
            </Text>
        </Row>
        <Row>
            <Text>
                {otp}
            </Text>
        </Row>
      </Section>
    </Html>
  );
};
