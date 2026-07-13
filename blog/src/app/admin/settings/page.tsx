import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getSession();
  const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-1 text-sm font-medium">Account</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-1 text-sm font-medium">Site URL</p>
          <p className="text-sm text-muted-foreground">
            {process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Set <code>NEXT_PUBLIC_SITE_URL</code> in your environment to control the domain
            used for SEO metadata, RSS, and the sitemap.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-1 text-sm font-medium">Changing your password</p>
          <p className="text-sm text-muted-foreground">
            This is a single-admin site with no self-service password reset UI by design —
            update <code>ADMIN_PASSWORD</code> in your <code>.env</code> and re-run{" "}
            <code>npm run db:seed</code> to rotate it.
          </p>
        </div>
      </div>
    </div>
  );
}
