import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface ListingApprovedEmailProps {
  dealerName: string;
  listingTitle: string;
  listingId: string;
  listingUrl?: string;
  listingImageUrl?: string;
}

export const ListingApprovedEmail = ({
  dealerName = 'Dealer',
  listingTitle = 'Your Vehicle Listing',
  listingId,
  listingUrl = `https://skautosphere.com/listings/${listingId}`,
  listingImageUrl,
}: ListingApprovedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Great news! Your listing has been approved</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 Listing Approved!</Heading>
          
          <Text style={text}>
            Hi {dealerName},
          </Text>
          
          <Text style={text}>
            Great news! Your listing <strong>{listingTitle}</strong> has been
            reviewed and approved by our team. It's now live on SK AutoSphere!
          </Text>

          {listingImageUrl && (
            <Img
              src={listingImageUrl}
              alt={listingTitle}
              style={image}
            />
          )}
          
          <Section style={buttonContainer}>
            <Button style={button} href={listingUrl}>
              View Your Listing
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            <strong>Next steps:</strong>
          </Text>
          <Text style={text}>
            • Share your listing on social media<br />
            • Respond promptly to buyer inquiries<br />
            • Keep your listing information up to date
          </Text>

          <Hr style={hr} />
          
          <Text style={text}>
            Thank you for choosing SK AutoSphere for your vehicle export needs.
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

export default ListingApprovedEmail;

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

const image = {
  maxWidth: '100%',
  margin: '20px auto',
  display: 'block',
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
