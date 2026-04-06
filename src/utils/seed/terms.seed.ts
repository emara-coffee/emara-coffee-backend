import { db } from '../../configs/db';
import { termsConditions } from '../../db/schema/terms/term.schema';

const mdContent = `
# Emara Coffee Limited - Terms and Conditions

Welcome to Emara Coffee. These Terms and Conditions govern your use of our platform, wholesale ordering systems, and consumer catalog. By accessing our services, you agree to comply with the terms set forth below.

## 1. Introduction
Emara Coffee is dedicated to distributing premium green and roasted coffee beans from East Africa. We act as a conduit between cooperatives and global markets. These terms define the legal relationship between Emara Coffee ("We", "Us", "Our") and the buyer ("You", "Your", "Customer").

## 2. Orders and Acceptance
- **Retail Orders:** All orders placed through the public catalog are subject to inventory availability and acceptance.
- **Wholesale/Dealer Orders:** Dealers must maintain an active, approved account to access wholesale pricing. We reserve the right to cancel or hold orders if there are discrepancies in payment or documentation.
- Order confirmation emails do not constitute a legally binding contract until the goods are dispatched.

## 3. Pricing and Payments
- All prices are displayed in USD unless otherwise specified.
- Payments must be completed at checkout via approved payment gateways (PayPal, Debit/Credit Cards).
- Wholesale accounts may be subject to alternative payment terms if pre-approved by our compliance team.
- Emara Coffee is not responsible for international transaction fees, conversion rates, or duties levied by the destination country.

## 4. Shipping and Logistics
- **FOB Terms:** For international wholesale freight, our responsibility typically ends when the goods pass the ship's rail at the named port of shipment, unless specified otherwise in a separate logistics contract.
- Retail shipping times are estimates and not guaranteed.
- We do not assume liability for delays caused by customs processing, agricultural inspections, or force majeure events.

## 5. Quality Assurance and Returns
- Emara Coffee prides itself on rigorous cupping and grading standards.
- If you receive damaged or incorrect goods, you must report the issue within 72 hours of delivery, including photographic evidence.
- We do not accept returns on roasted coffee due to its perishable nature unless there was a fulfillment error on our part.
- Approved refunds will be credited back to the original payment method within 10-14 business days.

## 6. Intellectual Property
All content on this platform, including text, graphics, logos, and images, is the property of Emara Coffee Limited and is protected by international copyright laws.

## 7. Limitation of Liability
In no event shall Emara Coffee be liable for any indirect, incidental, special, or consequential damages arising out of the use or inability to use our products or services.

## 8. Governing Law
These terms shall be governed by and construed in accordance with the laws of Kenya. Any disputes arising out of these terms will be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya.

## 9. Modifications
We reserve the right to update or modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to this page. Your continued use of the platform constitutes your acceptance of the revised terms.

*For inquiries, please contact legal@emaracoffee.com*
`;

export const seedTerms = async () => {
  try {
    await db.insert(termsConditions).values({
      version: 'v1.0.0',
      title: 'Global Terms of Service & Supply',
      content: mdContent,
      isActive: true,
    });
    console.log('✅ Terms & Conditions seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Terms & Conditions:', error);
  }
};