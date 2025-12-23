import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface PaymentSuccessEmailProps {
    buyerName: string;
    transactionId: string;
    listingTitle: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: number;
    amount: number;
    currency: string;
    dealerName: string;
    receiptUrl?: string;
}

export const PaymentSuccessEmail = ({
    buyerName = 'Customer',
    transactionId,
    listingTitle,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
    amount,
    currency = 'USD',
    dealerName,
    receiptUrl,
}: PaymentSuccessEmailProps) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);

    return (
        <Html>
            <Head />
            <Preview>Payment confirmed for {listingTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>✅ Payment Confirmed!</Heading>

                    <Text style={text}>
                        Hi {buyerName},
                    </Text>

                    <Text style={text}>
                        Your payment has been successfully processed. Thank you for your purchase!
                    </Text>

                    <Section style={orderBox}>
                        <Text style={orderTitle}>Order Details</Text>
                        <Hr style={hrLight} />
                        <Text style={orderItem}>
                            <strong>Vehicle:</strong> {vehicleYear} {vehicleBrand} {vehicleModel}
                        </Text>
                        <Text style={orderItem}>
                            <strong>Amount Paid:</strong> {formattedAmount}
                        </Text>
                        <Text style={orderItem}>
                            <strong>Transaction ID:</strong> {transactionId}
                        </Text>
                        <Text style={orderItem}>
                            <strong>Dealer:</strong> {dealerName}
                        </Text>
                    </Section>

                    {receiptUrl && (
                        <Section style={buttonContainer}>
                            <Button style={button} href={receiptUrl}>
                                Download Receipt
                            </Button>
                        </Section>
                    )}

                    <Hr style={hr} />

                    <Text style={text}>
                        <strong>What happens next?</strong>
                    </Text>
                    <Text style={text}>
                        1. The dealer has been notified of your purchase<br />
                        2. They will contact you within 24 hours<br />
                        3. You'll arrange vehicle inspection and delivery<br />
                        4. Once satisfied, complete the handover
                    </Text>

                    <Hr style={hr} />

                    <Text style={text}>
                        If you have any questions, please don't hesitate to contact us.
                    </Text>

                    <Text style={footer}>
                        SK AutoSphere - Korean Vehicle Export Marketplace<br />
                        <Link href="https://skautosphere.com" style={link}>
                            skautosphere.com
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default PaymentSuccessEmail;

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
};

const h1 = {
    color: '#1a1a1a',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0 40px',
    textAlign: 'center' as const,
};

const text = {
    color: '#444',
    fontSize: '16px',
    lineHeight: '26px',
    padding: '0 40px',
};

const orderBox = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '20px 40px',
    padding: '20px',
};

const orderTitle = {
    color: '#1a1a1a',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
};

const orderItem = {
    color: '#444',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '5px 0',
};

const hrLight = {
    borderColor: '#e0e0e0',
    margin: '10px 0',
};

const buttonContainer = {
    padding: '27px 40px',
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#22c55e',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const footer = {
    color: '#666',
    fontSize: '14px',
    lineHeight: '24px',
    padding: '0 40px',
    marginTop: '32px',
    textAlign: 'center' as const,
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const link = {
    color: '#0066ff',
    textDecoration: 'none',
};
