import {
    Html,
    Head,
    Font,
    Preview,
    Row,
    Section,
    Text
} from '@react-email/components';

interface VerificationEmailProps {
    username: String;
    otp: String
};


export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en">
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily='Roboto'
                    fallbackFontFamily='Verdana'
                    fontWeight={400}
                    fontStyle='normal'
                />
            </Head>
            <Preview>{`Here's your verification code : ${otp}`}</Preview>
            <Section>
                <Row>
                    <Text>
                        Thank you for registering with WhisperIt, please use the following verifiaction
                        code to complete your registration process:
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Text>If you did not request this code, please ignore this email.</Text>
                </Row>
            </Section>
            <Section>
                <Text>© {new Date().getFullYear()} WhisperIt. All rights reserved.</Text>
            </Section>
        </Html>
    );
}