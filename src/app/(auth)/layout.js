import AuthRoute from "@/components/authroute";

export default function RootLayout({ children }) {
  return (
    <AuthRoute redirectTo="/dashboard">
      {children}
    </AuthRoute>
  );
}

