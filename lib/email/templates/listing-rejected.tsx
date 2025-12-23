import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import type { CSSProperties } from 'react';

interface ListingRejectedEmailProps {
  dealerName: string;
  listingTitle: string;
  listingId: string;
  rejectionReason: string;
  dashboardUrl?: string;
}

export const ListingRejectedEmail = ({
  dealerName = 'Dealer',
  listingTitle = 'Your Vehicle Listing',
  listingId,
  rejectionReason,
  dashboardUrl = 'https://skautosphere.com/dealer/listings',
}: ListingRejectedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Update required for your listing</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📋 Listing Review Update</Heading>
          
          <Text style={text}>
            Hi {dealerName},
          </Text>
          
          <Text style={text}>
            We've reviewed your vehicle listing and it requires some updates before it can be approved.
          </Text>
          
          <Section style={listingBox}>
            <Text style={listingTitleStyle}>
              <strong>Listing:</strong> {listingTitle}
            </Text>
            <Text style={listingIdStyle}>
              <strong>ID:</strong> {listingId}
            </Text>
          </Section>
          
          <Section style={reasonBox}>
            <Text style={reasonTitle}>
              <strong>Reason for Review:</strong>
            </Text>
            <Text style={reasonText}>
              {rejectionReason}
            </Text>
          </Section>
          
          <Text style={text}>
            Please make the necessary updates to your listing and resubmit it for review. Our team is here to help if you have any questions.
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Edit Listing
            </Button>
          </Section>
          
          <Text style={text}>
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </Text>
          
          <Text style={footer}>
            Best regards,<br />
            <strong>The SK AutoSphere Team</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ListingRejectedEmail;

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

const listingBox = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '20px',
};

const listingTitleStyle: CSSProperties = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const listingIdStyle: CSSProperties = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
};

const reasonBox = {
  backgroundColor: '#fff4e6',
  borderLeft: '4px solid #ff9900',
  borderRadius: '4px',
  margin: '24px 40px',
  padding: '20px',
};

const reasonTitle: CSSProperties = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const reasonText: CSSProperties = {
  color: '#333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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
};
