export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="font-serif text-3xl">House admin</h1>
      <p className="mt-2 text-sm text-muted">Owner only.</p>
      <form action="/api/admin/login" method="post" className="mt-8 space-y-4">
        <label className="block text-sm">
          Email
          <input
            required
            name="email"
            type="email"
            className="mt-1 w-full border border-soft-gold bg-white px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            required
            name="password"
            type="password"
            className="mt-1 w-full border border-soft-gold bg-white px-3 py-2"
          />
        </label>
        <button type="submit" className="bg-house-gold px-6 py-3 text-sm font-medium text-ink">
          Enter
        </button>
      </form>
      {error ? (
        <p className="mt-4 text-sm text-deep-gold">That login did not work. Try again with us.</p>
      ) : null}
    </main>
  );
}
