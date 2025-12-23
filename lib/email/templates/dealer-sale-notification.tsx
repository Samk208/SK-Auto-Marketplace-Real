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

interface DealerSaleNotificationEmailProps {
    dealerName: string;
    transactionId: string;
    listingTitle: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: number;
    amount: number;
    currency: string;
    buyerName: string;
    buyerEmail: string;
    buyerCountry?: string;
}

export const DealerSaleNotificationEmail = ({
    dealerName = 'Dealer',
    transactionId,
    listingTitle,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
    amount,
    currency = 'USD',
    buyerName,
    buyerEmail,
    buyerCountry,
}: DealerSaleNotificationEmailProps) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);

    return (
        <Html>
            <Head />
            <Preview>You have a new sale! {listingTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>🎉 Congratulations! New Sale!</Heading>

                    <Text style={text}>
                        Hi {dealerName},
                    </Text>

                    <Text style={text}>
                        Great news! A buyer has just completed payment for your vehicle listing.
                    </Text>

                    <Section style={saleBox}>
                        <Text style={saleTitle}>Sale Details</Text>
                        <Hr style={hrLight} />
                        <Text style={saleItem}>
                            <strong>Vehicle:</strong> {vehicleYear} {vehicleBrand} {vehicleModel}
                        </Text>
                        <Text style={saleItem}>
                            <strong>Sale Amount:</strong> {formattedAmount}
                        </Text>
                        <Text style={saleItem}>
                            <strong>Transaction ID:</strong> {transactionId}
                        </Text>
                    </Section>

                    <Section style={buyerBox}>
                        <Text style={buyerTitle}>Buyer Information</Text>
                        <Hr style={hrLight} />
                        <Text style={saleItem}>
                            <strong>Name:</strong> {buyerName}
                        </Text>
                        <Text style={saleItem}>
                            <strong>Email:</strong> <Link href={`mailto:${buyerEmail}`} style={link}>{buyerEmail}</Link>
                        </Text>
                        {buyerCountry && (
                            <Text style={saleItem}>
                                <strong>Country:</strong> {buyerCountry}
                            </Text>
                        )}
                    </Section>

                    <Section style={buttonContainer}>
                        <Button style={button} href={`mailto:${buyerEmail}`}>
                            Contact Buyer
                        </Button>
                    </Section>

                    <Hr style={hr} />

                    <Text style={text}>
                        <strong>Required Actions:</strong>
                    </Text>
                    <Text style={text}>
                        1. Contact the buyer within 24 hours<br />
                        2. Arrange vehicle inspection details<br />
                        3. Coordinate delivery or pickup logistics<br />
                        4. Complete all required export documentation
                    </Text>

                    <Hr style={hr} />

                    <Text style={text}>
                        The vehicle listing has been automatically marked as "Sold".
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

export default DealerSaleNotificationEmail;

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

const saleBox = {
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    margin: '20px 40px',
    padding: '20px',
    border: '1px solid #86efac',
};

const saleTitle = {
    color: '#166534',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
};

const buyerBox = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '20px 40px',
    padding: '20px',
};

const buyerTitle = {
    color: '#1a1a1a',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
};

const saleItem = {
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
    backgroundColor: '#0066ff',
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
