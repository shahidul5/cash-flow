import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const TermsOfServiceScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Terms of Service</Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last Updated: June 1, 2023</Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Acceptance of Terms</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            By downloading, installing, or using the Cash Flow application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Description of Service</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Cash Flow is a personal finance management application that allows users to track expenses, create budgets, and manage their financial data. The application is provided "as is" and "as available" without any warranties.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>3. User Accounts and Responsibilities</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            You are responsible for maintaining the confidentiality of your device and the security of your financial data. You agree to accept responsibility for all activities that occur on your device in relation to our application.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>4. User Data</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            All financial data you enter into the application is stored locally on your device. We recommend regularly backing up your data using the export feature provided in the application. We are not responsible for any loss of data.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Intellectual Property</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            The Cash Flow application, including its content, features, and functionality, is owned by us and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Prohibited Uses</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            You agree not to:
          </Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Use the application for any illegal purpose</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Attempt to decompile, reverse engineer, or disassemble the application</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Remove any copyright or other proprietary notices</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Transfer, distribute, or share your license to the application</Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>7. Limitation of Liability</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the application.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>8. Changes to Terms</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            We reserve the right to modify these terms at any time. We will provide notice of any significant changes by updating the "Last Updated" date at the top of these terms. Your continued use of the application after such modifications will constitute your acknowledgment of the modified terms.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>9. Governing Law</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            These Terms shall be governed by and construed in accordance with the laws of [Your Country], without regard to its conflict of law provisions.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>10. Contact Us</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            If you have any questions about these Terms, please contact us at support@cashflowapp.com.
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

export default TermsOfServiceScreen; 