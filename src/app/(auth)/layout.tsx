export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold">Travel Handmade</div>
          <p className="text-gray-600 text-sm mt-1">Admin Login</p>
        </div>
        {children}
      </div>
    </div>
  );
}
