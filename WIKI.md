# Budsjett App Wiki

Welcome to the **Budsjett App** Wiki! This documentation hub is designed to provide comprehensive information about the app, including its features, setup instructions, and development guidelines.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Usage Guide](#usage-guide)
5. [Contributing](#contributing)
6. [FAQ](#faq)
7. [License](#license)

---

## Overview

The Budsjett App is a modern budgeting tool that helps users manage their finances effectively. Whether you're tracking daily expenses or planning monthly budgets, this app provides the tools you need to stay on top of your financial goals.

### Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: LocalStorage (for data persistence)
- **Build Tool**: Vite

---

## Features

### Budget Management
- Set daily, weekly, or monthly budgets.
- Track spending and calculate remaining budget.
- Reset spending or savings balance as needed.

### Expense Categorization
- Organize expenses into categories for better analysis.
- Enable or disable categorization in settings.

### Language Support
- Automatically detects the phone's language.
- Supports manual language selection (Norsk, English, Nynorsk, Deutsch).

### Appearance Customization
- Toggle between light and dark themes.
- Responsive design optimized for mobile and desktop.

### Dietary Preferences
- Select dietary preferences such as vegetarian, vegan, gluten-free, etc.

### Developer Mode
- Simulate new days for debugging purposes.

---

## Getting Started

### Installation
1. Clone the repository:
	```bash
	git clone <repository-url>
	```
2. Navigate to the project directory:
	```bash
	cd Budsjett-app
	```
3. Install dependencies:
	```bash
	pnpm install
	or
	npm install
	```
4. Start the development server:
	```bash
	pnpm dev
	or 
	npm run dev
	```

### Requirements
- Node.js (v16 or higher)
- pnpm (Package Manager)

---


## Usage Guide

### Setting Up Your Budget
- Navigate to the **Profile** page to set your default budget period (daily, weekly, or monthly).
- Enter your budget amount and, if applicable, the number of days for daily budgets.

### Tracking Expenses
- Use the **Dashboard** page to add expenses.
- Categorize expenses if categorization is enabled in settings.

### Customizing Preferences
- Go to the **Settings** page to:
	- Change the app's language.
	- Toggle dark mode.
	- Enable or disable expense categorization.

### Changing Language
- Navigate to the **Settings** page.
- Use the dropdown menu under the **Language** section to select your preferred language.
- The app will automatically update to reflect your selection.

### Adding a Budget
- Go to the **Profile** page.
- Select your default budget period (daily, weekly, or monthly).
- Enter your budget amount in the input field provided.
- For daily budgets, specify the number of days.
- The app will save your budget and start tracking expenses.

### Managing Expenses
- Open the **Dashboard** page.
- Enter the expense amount, date, and time.
- If categorization is enabled, select a category from the dropdown menu.
- Click the **Add Expense** button to save the expense.

### Importing and Exporting Data (.json)

You can move your budgets and expenses between different versions of the Budsjett App by importing and exporting data as .json files.

#### Exporting Data
1. Go to the **Settings** or **Dashboard** page (depending on app version).
2. Click the **Export to JSON** button.
3. A `.json` file containing your data will be downloaded to your device.

#### Importing Data
1. Go to the **Settings** page.
2. Click the **Import from JSON** button.
3. Select your previously exported `.json` file.
4. The app will load your budgets and expenses from the file.

**Note:** Import/export features may only be available in developer mode or certain app versions. Always back up your data before importing.

---

## Contributing

We welcome contributions to the Budsjett App! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute
1. Fork the repository.
2. Create a new branch:
	```bash
	git checkout -b feature/your-feature-name
	```
3. Commit your changes:
	```bash
	git commit -m "Add your message here"
	```
4. Push to the branch:
	```bash
	git push origin feature/your-feature-name
	```
5. Open a pull request.

---

## FAQ

### What browsers are supported?
The app is optimized for modern browsers like Chrome, Firefox, and Edge.

### Can I use the app offline?
Yes, the app uses LocalStorage for data persistence, allowing offline usage.

### How do I reset my budget?
Navigate to the **Profile** page and use the reset options provided.

---

## Architecture

The Budsjett App is structured as a modern React application using functional components and hooks. State management is handled locally or via context providers. Styling is managed with Tailwind CSS for rapid UI development.

**Main folders:**
- `src/components/` – Reusable UI and logic components
- `src/pages/` – Main application pages (Dashboard, Profile, Settings, etc.)
- `src/hooks/` – Custom React hooks
- `src/lib/` – Utility functions and helpers
- `src/locales/` – Language files for i18n

---

## Examples

### Example: Adding a New Expense
1. Go to the **Dashboard** page.
2. Enter the amount, date, and category (if enabled).
3. Click **Add Expense**. The expense will appear in your list and update your budget.

### Example: Exporting Data (Developer Mode)
1. Enable developer mode in **Settings**.
2. Go to the **Dashboard** and click **Export to Excel** to download your data.

---

## Accessibility

The app aims to be accessible for all users:
- Keyboard navigation is supported throughout the UI.
- Sufficient color contrast for text and UI elements.
- Responsive design for both desktop and mobile devices.

---

## Security

All data is stored locally in the browser using LocalStorage. No personal data is sent to external servers. For best security, use the app on trusted devices.

---

## Common Issues & Troubleshooting

**App does not start:**
- Ensure Node.js and pnpm/npm are installed and up to date.
- Run `pnpm install` or `npm install` to install dependencies.

**Language does not change:**
- Refresh the page after changing language in settings.

**Data is missing after refresh:**
- Data is stored in LocalStorage. If you clear browser data, your budgets and expenses will be lost.

---

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/TheFrostBunny/Budget-Buddy/blob/Added-Wiki/LICENSE) file for details.

---