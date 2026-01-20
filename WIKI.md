
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

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/your-repo/license) file for details.

---