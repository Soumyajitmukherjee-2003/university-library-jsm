import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { db } from "@/database/drizzle";
import { todo } from "@/database/schema";
import { eq } from "drizzle-orm";

type LayoutProps = {
  children: ReactNode;
};

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/sign-in");
  }

  const user = await db
    .select()
    .from(todo)
    .where(eq(todo.id, session.user.id))
    .limit(1);

  const today = new Date().toISOString().slice(0, 10);

  if (user.length && user[0].lastActivityDate !== today) {
    await db
      .update(todo)
      .set({ lastActivityDate: today })
      .where(eq(todo.id, session.user.id));
  }

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
