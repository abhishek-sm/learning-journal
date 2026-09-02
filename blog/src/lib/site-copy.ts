import "server-only";

import { prisma } from "@/lib/prisma";

export const DEFAULT_SITE_COPY = {
  homeTitle: "My Learning Journal",
  homeSubtitle:
    "A living archive of what I'm learning — physics, biology, programming, philosophy, and everything in between. Written to be reread.",
  aboutBody:
    "I'm a software engineer who is endlessly curious — about how things work, why they work that way, and what happens at the edges of what I already understand.\n\nThis site is my personal learning journal: a place where I write down what I'm learning, whether that's a physics idea I finally understood, a programming pattern worth remembering, or a book that changed how I think. It isn't polished for an audience — it's polished for my future self, so ideas don't evaporate the moment I move on to the next thing.",
  aboutCta:
    "If you've found your way here, welcome. Browse by category, or start with the latest articles.",
} as const;

export async function getSiteCopy() {
  const user = await prisma.user.findFirst({
    select: {
      homeTitle: true,
      homeSubtitle: true,
      aboutBody: true,
      aboutCta: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return {
    homeTitle: user?.homeTitle || DEFAULT_SITE_COPY.homeTitle,
    homeSubtitle: user?.homeSubtitle || DEFAULT_SITE_COPY.homeSubtitle,
    aboutBody: user?.aboutBody || DEFAULT_SITE_COPY.aboutBody,
    aboutCta: user?.aboutCta || DEFAULT_SITE_COPY.aboutCta,
  };
}
