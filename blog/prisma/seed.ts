import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Admin user ----
  const email = process.env.ADMIN_EMAIL ?? "you@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      homeTitle: "My Learning Journal",
      homeSubtitle:
        "A living archive of what I'm learning — physics, biology, programming, philosophy, and everything in between. Written to be reread.",
      aboutBody:
        "I'm a software engineer who is endlessly curious — about how things work, why they work that way, and what happens at the edges of what I already understand.\n\nThis site is my personal learning journal: a place where I write down what I'm learning, whether that's a physics idea I finally understood, a programming pattern worth remembering, or a book that changed how I think. It isn't polished for an audience — it's polished for my future self, so ideas don't evaporate the moment I move on to the next thing.",
      aboutCta:
        "If you've found your way here, welcome. Browse by category, or start with the latest articles.",
    },
    create: {
      email,
      passwordHash,
      name: "Admin",
      homeTitle: "My Learning Journal",
      homeSubtitle:
        "A living archive of what I'm learning — physics, biology, programming, philosophy, and everything in between. Written to be reread.",
      aboutBody:
        "I'm a software engineer who is endlessly curious — about how things work, why they work that way, and what happens at the edges of what I already understand.\n\nThis site is my personal learning journal: a place where I write down what I'm learning, whether that's a physics idea I finally understood, a programming pattern worth remembering, or a book that changed how I think. It isn't polished for an audience — it's polished for my future self, so ideas don't evaporate the moment I move on to the next thing.",
      aboutCta:
        "If you've found your way here, welcome. Browse by category, or start with the latest articles.",
    },
  });

  // ---- Categories (parent -> children) ----
  const science = await prisma.category.upsert({
    where: { slug: "science" },
    update: {},
    create: { name: "Science", slug: "science", order: 1 },
  });
  const physics = await prisma.category.upsert({
    where: { slug: "physics" },
    update: {},
    create: { name: "Physics", slug: "physics", parentId: science.id, order: 1 },
  });
  const biology = await prisma.category.upsert({
    where: { slug: "biology" },
    update: {},
    create: { name: "Biology", slug: "biology", parentId: science.id, order: 2 },
  });

  const food = await prisma.category.upsert({
    where: { slug: "food" },
    update: {},
    create: { name: "Food", slug: "food", order: 2 },
  });
  const nutrition = await prisma.category.upsert({
    where: { slug: "nutrition" },
    update: {},
    create: { name: "Nutrition", slug: "nutrition", parentId: food.id, order: 1 },
  });

  const books = await prisma.category.upsert({
    where: { slug: "books" },
    update: {},
    create: { name: "Books", slug: "books", order: 3 },
  });

  // ---- Sample article ----
  await prisma.article.upsert({
    where: { slug: "why-entropy-always-increases" },
    update: {},
    create: {
      title: "Why Entropy Always Increases",
      slug: "why-entropy-always-increases",
      excerpt: "A short, intuitive look at the second law of thermodynamics.",
      content: `# Why Entropy Always Increases\n\nEntropy is often described as "disorder," but a more useful way to think about it is **the number of ways a system's microscopic details can be arranged while looking the same from the outside**.\n\n## The core idea\n\nThere are vastly more disordered arrangements than ordered ones, so as a system evolves randomly, it overwhelmingly tends toward the more probable, higher-entropy states.\n\n> It's not that nature "wants" disorder — it's that disorder is simply far more likely.\n\n## A simple example\n\n\`\`\`python\nimport random\n\ndef shuffle_demo(n=10):\n    cards = list(range(n))\n    random.shuffle(cards)\n    return cards\n\`\`\`\n\nEvery shuffle is equally likely, but almost all shuffles *look* disordered, simply because ordered arrangements are rare.\n\n## Table: Ordered vs. Disordered States\n\n| Property | Ordered | Disordered |\n|---|---|---|\n| Count | Few | Many |\n| Probability | Low | High |\n| Entropy | Low | High |\n\nThat asymmetry — not some cosmic preference — is the entire content of the second law.\n`,
      categoryId: physics.id,
      published: true,
      publishedAt: new Date(),
      readingTime: 3,
      featured: true,
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${email} / password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
