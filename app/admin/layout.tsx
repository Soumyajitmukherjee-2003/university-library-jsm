import { auth } from "@/auth";
import Sidebar from "@/components/admin/Sidebar";
import {db} from"@/database/drizzle";
import {todo} from "@/database/schema";
import Header from "@/components/Header";
import '@/styles/admin.css';
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { eq } from "drizzle-orm";
const Layout = async ({ children }: { children: ReactNode }) => {
    const session = await auth();
    if(!session?.user?.id) redirect("/sign-in");
    const isAdmin = await db.select({isAdmin: todo.role}).from(todo).where(eq(todo.id, session.user.id)).limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");
    if(!isAdmin) redirect(( "/"));
    return (
       <main className="flex min-h-screen w-full flex-row">
          <Sidebar session={session} />
          <div className="admin-container">
            <Header session={session} />
            {children}
          </div>
    </main>
    );
};
export default Layout;