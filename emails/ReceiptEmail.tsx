import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Hr,
} from "@react-email/components"
import * as React from "react"

interface ReceiptEmailProps {
    userName: string
    courseTitle: string
    amount: string
    date: string
    orderId: string
}

export const ReceiptEmail = ({
    userName,
    courseTitle,
    amount,
    date,
    orderId
}: ReceiptEmailProps) => (
    <Html>
        <Head />
        <Preview>Your receipt from Antigravity</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Receipt</Heading>

                <Text style={text}>
                    Hi {userName},
                </Text>
                <Text style={text}>
                    Thank you for your purchase! We hope you enjoy learning with Antigravity.
                    Here are your order details:
                </Text>

                <Section style={receiptSection}>
                    <Row>
                        <Column>
                            <Text style={receiptLabel}>ORDER ID</Text>
                            <Text style={receiptValue}>{orderId}</Text>
                        </Column>
                        <Column>
                            <Text style={receiptLabel}>DATE</Text>
                            <Text style={receiptValue}>{date}</Text>
                        </Column>
                    </Row>
                </Section>

                <Hr style={hr} />

                <Section>
                    <Row>
                        <Column style={{ width: '80%' }}>
                            <Text style={itemName}>{courseTitle}</Text>
                        </Column>
                        <Column style={{ width: '20%', textAlign: 'right' }}>
                            <Text style={itemPrice}>{amount}</Text>
                        </Column>
                    </Row>
                </Section>

                <Hr style={hr} />

                <Section>
                    <Row>
                        <Column style={{ width: '80%' }}>
                            <Text style={totalLabel}>Total</Text>
                        </Column>
                        <Column style={{ width: '20%', textAlign: 'right' }}>
                            <Text style={totalValue}>{amount}</Text>
                        </Column>
                    </Row>
                </Section>

                <Text style={footer}>
                    If you have any questions concerning this receipt, please contact us at support@antigravity.edu
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
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "580px",
}

const h1 = {
    color: "#1a1a1a",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 20px",
}

const text = {
    color: "#4a4a4a",
    fontSize: "14px",
    lineHeight: "24px",
    margin: "0 0 20px",
}

const receiptSection = {
    backgroundColor: "#f9f9f9",
    padding: "24px",
    borderRadius: "8px",
    margin: "24px 0",
}

const receiptLabel = {
    color: "#a0a0a0",
    fontSize: "10px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: "0 0 4px",
}

const receiptValue = {
    color: "#1a1a1a",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0",
}

const hr = {
    borderColor: "#e6e6e6",
    margin: "20px 0",
}

const itemName = {
    fontSize: "14px",
    color: "#1a1a1a",
    margin: "0",
}

const itemPrice = {
    fontSize: "14px",
    color: "#1a1a1a",
    margin: "0",
    textAlign: "right" as const,
}

const totalLabel = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: "0",
}

const totalValue = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: "0",
    textAlign: "right" as const,
}

const footer = {
    color: "#898989",
    fontSize: "12px",
    lineHeight: "22px",
    marginTop: "32px",
}

export default ReceiptEmail
