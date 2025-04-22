import LoginPage from "./AuthenticationPages/LoginPage";
import SignUpPage from "./AuthenticationPages/SignUpPage";
import DashBoardPage from "./DashboardPage/DashBoardPage";
import PricingPlanPage from "./PricingPage/PricingPlanPage";
import SuccessPage from "./PaymentPages/SuccessPage";
import CancelPage from "./PaymentPages/CancelPage";

export const SignInPage = <LoginPage />;
export const RegistrationPage = <SignUpPage />;
export const DashboardPage = <DashBoardPage />;
export const PricingPage = <PricingPlanPage />;
export const PaymentSuccessPage = <SuccessPage />;
export const PaymentCancelPage = <CancelPage />;
