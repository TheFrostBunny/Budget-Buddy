# Budget Buddy Documentation

[📖 Se prosjektets Wiki](./WIKI.md)

## Overview

The Budsjett App is a budgeting application designed to help users manage their finances
effectively. It provides features such as budget tracking, spending analysis, and language
customization to cater to a diverse user base.

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

### Using `pnpm`

```bash
pnpm install
pnpm dev
```

### Using `npm`

```bash
npm install
npm run dev
```

## Scripts

- `dev`: Start the development server.
- `build`: Build the app for production.
- `start`: Serve the production build.
- `test`: Run tests.

## Project Structure

```
public/         # Static assets
src/            # Source code
  components/   # Reusable UI components
  pages/        # Application pages
  hooks/        # Custom React hooks
  lib/          # Utility functions
  locales/      # Localization files
```

## Key Files

- **src/pages/Profile.tsx**: Handles user profile and budget settings.
- **src/pages/Settings.tsx**: Manages app settings, including language and theme.
- **src/components/ui/**: Contains reusable UI components like buttons, cards, etc.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
