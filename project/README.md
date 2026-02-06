# Location-Based Notifications App

This is a React Native application built with Expo that allows users to set reminders triggered by their location.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo Go app on your mobile device (for testing on physical devices) or an Android/iOS simulator/emulator.

### Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd location-based-notifications/project
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

## Running the App

### Local Development

1.  **Start the development server:**
    ```bash
    npm start
    ```
    Or:
    ```bash
    yarn start
    ```

2.  **Open the app:**
    - **On iOS simulator:** Press `i` in the terminal or run `npx expo run:ios`
    - **On Android emulator:** Press `a` in the terminal or run `npx expo run:android`
    - **Web browser:** Press `w` in the terminal or run `npx expo start --web`

### Running on Physical Devices

1. **Using Expo Go (easiest method):**
   - Download the Expo Go app on your [iOS](https://apps.apple.com/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) device
   - Start the development server with `npm start` or `yarn start`
   - Scan the QR code with your camera app (iOS) or the Expo Go app (Android)
   - The app will open in Expo Go

2. **Using development builds (for testing native features):**
   - Create a development build:
     ```bash
     npx expo prebuild
     npx expo build:android --type apk # For Android
     npx expo build:ios # For iOS (requires Apple Developer account)
     ```
   - Install the resulting APK on your Android device or TestFlight for iOS

3. **Using Expo Application Services (EAS):**
   - Configure EAS:
     ```bash
     npx expo install eas-cli
     npx eas login
     npx eas build:configure
     ```
   - Create a development build:
     ```bash
     npx eas build --profile development --platform android
     npx eas build --profile development --platform ios
     ```
   - Install the build by scanning the QR code provided after the build completes

## Testing

Run the test suite:
```bash
npm test
```

Or run tests in watch mode:
```bash
npm test -- --watch
```

## Troubleshooting

### Common Issues

1. **Location services not working properly:**
   - Ensure location permissions are granted to the app
   - On Android, check that background location permissions are enabled
   - Verify that device location services are turned on

2. **Notifications not appearing:**
   - Check that notification permissions are granted
   - On iOS, ensure notifications are enabled in device settings
   - Verify that the app is allowed to run in the background

3. **TypeScript errors:**
   - Run `npm install` to ensure all type definitions are installed
   - Check that `tsconfig.json` is properly configured

## Project Structure

```
project/
├── app/              # Expo Router screens and layouts
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── services/         # Business logic and API interactions
├── store/            # State management (Zustand)
├── types/            # TypeScript type definitions
├── __tests__/        # Test files
├── app.json          # Expo configuration
├── package.json      # Project dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Available Scripts

- `npm start` / `yarn start`: Starts the Expo development server.
- `npm run build:web` / `yarn build:web`: Creates a production web build.
- `npm run lint` / `yarn lint`: Lints the codebase using `expo lint`.
- `npm test`: Runs the Jest test suite.

## Key Technologies

- React Native
- Expo & Expo Router
- TypeScript
- Zustand (for state management)
- React Native Maps
- Expo Location, Notifications, Calendar, Task Manager

## Improvement Recommendations

### Code Structure Improvements
1. **Add more comprehensive unit tests:** Increase test coverage for components, hooks, and services.
2. **Implement a centralized error handling system:** Create a dedicated error handling service to standardize error messages and user notifications.
3. **Extract business logic from components:** Move complex logic from components into custom hooks or services for better separation of concerns.

### Feature Enhancements
1. **Implement geofencing optimization:** Use more efficient algorithms for location tracking to reduce battery consumption.
2. **Add user authentication:** Implement user accounts to sync reminders across devices.
3. **Create reminder categories:** Allow users to categorize reminders by type (shopping, work, personal).
4. **Add rich notifications:** Enhance notifications with images, actions, and deep linking.
5. **Improve offline support:** Implement better caching and offline functionality.

### Performance Optimizations
1. **Implement memo and useMemo:** Prevent unnecessary re-renders by memoizing expensive components and calculations.
2. **Lazy load components:** Use dynamic imports to load components only when needed.
3. **Optimize list rendering:** Use virtualized lists for larger datasets.
4. **Reduce bundle size:** Analyze and optimize the app bundle size with tools like `expo-optimize`.

### UI/UX Enhancements
1. **Dark mode support:** Implement a theme system with dark and light modes.
2. **Accessibility improvements:** Ensure the app is fully accessible by implementing proper ARIA labels and supporting screen readers.
3. **Animations and transitions:** Add smooth animations for a more polished user experience.
4. **Responsive design:** Ensure the app works well on various screen sizes and orientations.
