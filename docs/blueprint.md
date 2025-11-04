# **App Name**: CashFlow Sentinel

## Core Features:

- User Authentication and Authorization: Secure login using Firebase Auth (email/password) with role-based access control (DM, SM, ASM) via custom claims.
- Cash Register Opening Count: Record initial cash count for each register. Alert if count differs from the expected USD 75.
- Expense Tracking: Log expenses by category (supplies, maintenance, etc.) with attachment support. Implemented with validation and role-based authorization.
- End-of-Day Reconciliation: Record final cash count for each register and safe. Automatically calculates over/short with alerts if the difference exceeds USD 5.
- Daily/Weekly Reporting: Generate reports on sales (cash/card), customer count, expenses, and discrepancies. Exportable to CSV/XLSX formats.
- Anomaly Detection and Alerting Tool: Leverage AI to detect unusual expense patterns or cash discrepancies, using historical data and rule-based constraints. The system then uses these rules as a tool to determine when an email alert should be sent to management. Also checks the veracity of an image using generative AI techniques.
- User and Store Management: Admin interface (DM/SM only) for managing user accounts, roles, and store/register configurations.

## Style Guidelines:

- Primary color: Deep teal (#008080) evoking trust, security, and fiscal responsibility.
- Background color: Light teal (#E0F8F7) for a clean, professional backdrop.
- Accent color: Muted olive green (#808000) to highlight important actions and metrics without overwhelming the user.
- Headline font: 'Playfair', serif, to provide elegance to headings and small amounts of text. Body font: 'PT Sans', sans-serif, to complement longer stretches of text.
- Use clean, consistent icons from Material UI to represent different expense categories and actions.
- Responsive design adapting to various screen sizes with a clear, data-dense dashboard layout.
- Subtle transitions and animations for loading states and data updates to provide a smooth user experience.