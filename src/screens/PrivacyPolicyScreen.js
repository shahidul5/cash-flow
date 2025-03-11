import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicyScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Privacy Policy</Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last Updated: June 1, 2023</Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Introduction</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Welcome to Cash Flow ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Information We Collect</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            We collect information that you voluntarily provide to us when you use our application. This may include:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Financial data such as transactions, budgets, and spending categories</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Device information and usage statistics</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Biometric authentication data (if enabled)</Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>3. How We Use Your Information</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            We use the information we collect to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Provide, maintain, and improve our services</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Process and store your financial data</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Enhance the security of our application</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Respond to your inquiries and provide customer support</Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Data Storage and Security</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Your financial data is stored locally on your device. We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Data Sharing and Disclosure</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with trusted third parties who assist us in operating our application, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Your Rights</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            You have the right to access, update, or delete your information at any time. You can export or clear your data through the application's settings.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>7. Changes to This Privacy Policy</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: theme.text }]}>8. Contact Us</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@cashflowapp.com.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
});

export default PrivacyPolicyScreen; 