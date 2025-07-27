import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/api/auth/signin");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-2">Welcome, {session.user?.name}!</p>
        <p className="text-sm text-gray-500">You have admin access.</p>
      </div>
    </main>
  );
}
