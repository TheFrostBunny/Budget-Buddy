# Budget Buddy Documentation

## Overview
The Budsjett App is a budgeting application designed to help users manage their finances effectively. It provides features such as budget tracking, spending analysis, and language customization to cater to a diverse user base.

## Features

### 1. Budget Management
- **Daily, Weekly, and Monthly Budgets**: Users can set budgets for different time periods.
- **Spending Tracking**: Tracks transactions and calculates remaining budget.
- **Reset Options**: Reset spending or savings balance as needed.

### 2. Language Support
- The app supports multiple languages:
  - Norsk
  - English
  - Nynorsk
  - Deutsch
- Users can switch languages via a dropdown menu in the settings.

### 3. Appearance Customization
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Optimized for both desktop and mobile devices.

### 4. Dietary Preferences
- Users can select dietary preferences such as vegetarian, vegan, gluten-free, etc.

### 5. Developer Mode
- Simulate new days for debugging purposes.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- pnpm (Package Manager)

### Steps
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
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
5. Open the app in your browser at `http://localhost:3000`.

## Folder Structure

```
Budsjett-app/
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # Reusable components
│   ├── pages/       # Application pages
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utility functions
│   ├── locales/     # Translation files
│   ├── data/        # Mock data
│   └── types/       # TypeScript types
├── README.md        # Project overview
├── DOCUMENTATION.md # Detailed documentation
├── package.json     # Project metadata
└── vite.config.ts   # Vite configuration
```

## Key Files

- **src/pages/Profile.tsx**: Handles user profile and budget settings.
- **src/pages/Settings.tsx**: Manages app settings, including language and theme.
- **src/components/ui/**: Contains reusable UI components like buttons, cards, etc.

## Contributing

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

## License
This project is licensed under the MIT License. See the LICENSE file for details.
