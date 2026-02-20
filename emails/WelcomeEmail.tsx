import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
    Button,
    Section,
} from "@react-email/components"
import * as React from "react"

interface WelcomeEmailProps {
    userName: string
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to Antigravity - Start Learning Today</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Welcome aboard, {userName}!</Heading>

                <Text style={text}>
                    We're thrilled to have you join Antigravity. Our platform is designed to help you launch your skills to the next level with world-class courses and a supportive community.
                </Text>

                <Section style={btnContainer}>
                    <Button style={button} href="https://antigravity.vercel.app/search">
                        Explore Courses
                    </Button>
                </Section>

                <Text style={text}>
                    If you have any questions or need help getting started, just reply to this email. We're always here to help.
                </Text>

                <Text style={footer}>
                    — The Antigravity Team
                </Text>
            </Container>
        </Body>
    </Html>
)

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "580px",
}

const h1 = {
    color: "#1a1a1a",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "40px",
    margin: "0 0 20px",
}

const text = {
    color: "#4a4a4a",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 20px",
}

const btnContainer = {
    textAlign: "center" as const,
    margin: "24px 0",
}

const button = {
    backgroundColor: "#000000",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
}

const footer = {
    color: "#898989",
    fontSize: "14px",
    lineHeight: "22px",
    marginTop: "32px",
}

export default WelcomeEmail
