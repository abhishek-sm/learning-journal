import { redirect } from "next/navigation";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateSiteCopyAction(formData: FormData) {
  "use server";

  const session = await requireAdmin();
  const homeTitle = String(formData.get("homeTitle") ?? "").trim() || "My Learning Journal";
  const homeSubtitle = String(formData.get("homeSubtitle") ?? "").trim();
  const aboutBody = String(formData.get("aboutBody") ?? "").trim();
  const aboutCta = String(formData.get("aboutCta") ?? "").trim();

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      homeTitle,
      homeSubtitle,
      aboutBody,
      aboutCta,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}

export default async function SettingsPage() {
  const session = await getSession();
  const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-1 text-sm font-medium">Account</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <form action={updateSiteCopyAction} className="space-y-6 rounded-lg border border-border bg-card p-5">
          <div className="space-y-2">
            <label htmlFor="homeTitle" className="block text-sm font-medium">
              Home page title
            </label>
            <input
              id="homeTitle"
              name="homeTitle"
              defaultValue={user?.homeTitle ?? "My Learning Journal"}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="homeSubtitle" className="block text-sm font-medium">
              Landing page subtitle
            </label>
            <textarea
              id="homeSubtitle"
              name="homeSubtitle"
              defaultValue={user?.homeSubtitle ?? ""}
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="aboutBody" className="block text-sm font-medium">
              About page text
            </label>
            <textarea
              id="aboutBody"
              name="aboutBody"
              defaultValue={user?.aboutBody ?? ""}
              rows={8}
              className="w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="aboutCta" className="block text-sm font-medium">
              About page CTA
            </label>
            <textarea
              id="aboutCta"
              name="aboutCta"
              defaultValue={user?.aboutCta ?? "If you've found your way here, welcome. Browse by category, or start with the latest articles."}
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            Save site copy
          </button>
        </form>

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
