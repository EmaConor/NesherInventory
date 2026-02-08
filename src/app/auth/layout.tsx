

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-87.5 px10">{children}</div>
    </main>
  );
}
