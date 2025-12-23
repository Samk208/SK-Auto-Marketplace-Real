import {
    Body,
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

interface DealerRefundNotificationEmailProps {
  dealerName: string;
  transactionId: string;
  listingTitle: string;
  listingId: string;
  refundAmount: number;
  originalAmount: number;
  currency: string;
  refundReason?: string;
  buyerEmail: string;
}

export const DealerRefundNotificationEmail = ({
  dealerName = 'Dealer',
  transactionId,
  listingTitle = 'Your Vehicle Listing',
  listingId,
  refundAmount,
  originalAmount,
  currency = 'USD',
  refundReason,
  buyerEmail,
}: DealerRefundNotificationEmailProps) => {
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
      <Preview>Refund notification for transaction {transactionId}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📋 Transaction Refunded</Heading>
          
          <Text style={text}>
            Hi {dealerName},
          </Text>
          
          <Text style={text}>
            This is to notify you that {isPartialRefund ? 'a partial refund' : 'a full refund'} has been 
            processed for one of your vehicle sales.
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>Refund Details</Text>
            <Text style={infoText}>
              <strong>Vehicle:</strong> {listingTitle}<br />
              <strong>Listing ID:</strong> {listingId}<br />
              <strong>Transaction ID:</strong> {transactionId}<br />
              <strong>Buyer Email:</strong> {buyerEmail}<br />
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
            <strong>What this means:</strong>
          </Text>
          <Text style={text}>
            • The transaction has been reversed<br />
            • Your listing has been automatically restored to 'Active' status<br />
            • The vehicle is now available for other buyers<br />
            • No further action is required from you
          </Text>

          <Hr style={hr} />

          {isPartialRefund ? (
            <Section style={noticeBox}>
              <Text style={noticeText}>
                <strong>Partial Refund Notice:</strong> Only {formattedRefundAmount} of 
                the {formattedOriginalAmount} was refunded. You may need to coordinate 
                with the buyer regarding the remaining amount.
              </Text>
            </Section>
          ) : (
            <Section style={noticeBox}>
              <Text style={noticeText}>
                <strong>Full Refund:</strong> The entire transaction amount has been returned 
                to the buyer. Your listing is now available for new buyers.
              </Text>
            </Section>
          )}

          <Hr style={hr} />
          
          <Text style={text}>
            If you have any questions about this refund or need assistance, please contact our support team.
          </Text>
          
          <Text style={footer}>
            SK AutoSphere - Korean Vehicle Export Marketplace<br />
            <Link href="https://skautosphere.com/dealer/dashboard" style={link}>
              Dealer Dashboard
            </Link>
            {' | '}
            <Link href="https://skautosphere.com/support" style={link}>
              Contact Support
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default DealerRefundNotificationEmail;

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

const noticeBox = {
  backgroundColor: '#fff3cd',
  borderRadius: '6px',
  borderLeft: '4px solid #ffc107',
  padding: '16px 20px',
  margin: '20px 40px',
};

const noticeText = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
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
