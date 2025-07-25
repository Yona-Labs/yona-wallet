// This file ensures onboarding code is not tree-shaken in production builds
import { openOnboarding } from "@coral-xyz/common";

// Force webpack to include this function by actually calling it in development
if (process.env.NODE_ENV === "development") {
  // This ensures the function is included in the bundle
  console.log("Onboarding function available:", typeof openOnboarding);
}

// Export for side effects
export { openOnboarding }; 