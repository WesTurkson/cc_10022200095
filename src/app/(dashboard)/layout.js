import Protected from "@/components/protected";

export default function RootLayout({ children }) {
  return (
    <Protected redirectTo="/login">
      {children}
    </Protected>
  );
}

