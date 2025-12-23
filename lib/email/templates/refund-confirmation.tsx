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

interface RefundConfirmationEmailProps {
  buyerName: string;
  transactionId: string;
  listingTitle: string;
  refundAmount: number;
  originalAmount: number;
  currency: string;
  refundReason?: string;
  dashboardUrl?: string;
}

export const RefundConfirmationEmail = ({
  buyerName = 'Valued Customer',
  transactionId,
  listingTitle = 'Vehicle Purchase',
  refundAmount,
  originalAmount,
  currency = 'USD',
  refundReason,
  dashboardUrl = 'https://skautosphere.com/account/transactions',
}: RefundConfirmationEmailProps) => {
  const isPartialRefund = refundAmount < originalAmount;
  const formattedRefundAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(refundAmount);

  const formattedOriginalAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(originalAmount);

  return (
    <Html>
      <Head />
      <Preview>Refund processed for your vehicle purchase</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>💰 Refund Processed</Heading>
          
          <Text style={text}>
            Hi {buyerName},
          </Text>
          
          <Text style={text}>
            {isPartialRefund 
              ? `A partial refund of ${formattedRefundAmount} has been processed for your purchase.`
              : `A full refund of ${formattedRefundAmount} has been processed for your purchase.`
            }
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>Refund Details</Text>
            <Text style={infoText}>
              <strong>Vehicle:</strong> {listingTitle}<br />
              <strong>Transaction ID:</strong> {transactionId}<br />
              <strong>Original Amount:</strong> {formattedOriginalAmount}<br />
              <strong>Refund Amount:</strong> {formattedRefundAmount}<br />
              {refundReason && (
                <>
                  <strong>Reason:</strong> {refundReason}
                </>
              )}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            <strong>What happens next?</strong>
          </Text>
          <Text style={text}>
            • The refund has been initiated to your original payment method<br />
            • Please allow 5-10 business days for the funds to appear in your account<br />
            • The processing time depends on your bank or card issuer<br />
            • You will receive a separate notification once the refund is complete
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              View Transaction History
            </Button>
          </Section>

          <Hr style={hr} />
          
          <Text style={text}>
            If you have any questions about this refund, please don't hesitate to contact our support team.
          </Text>
          
          <Text style={footer}>
            SK AutoSphere - Korean Vehicle Export Marketplace<br />
            <Link href="https://skautosphere.com/support" style={link}>
              Contact Support
            </Link>
            {' | '}
            <Link href="https://skautosphere.com" style={link}>
              skautosphere.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default RefundConfirmationEmail;

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

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  padding: '20px',
  margin: '20px 40px',
};

const infoTitle = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const infoText = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0',
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
