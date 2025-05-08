
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { Separator } from "@/components/ui/separator";

export default function DatabaseManagementPage() {
  return (
    <AdminLayout>
      <div className="container max-w-screen-xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Database Management</h1>
        <p className="text-muted-foreground mb-6">
          Manage your application database
        </p>
        <Separator className="mb-8" />
        
        <div className="grid gap-6">
          <DatabaseManagement />
        </div>
      </div>
    </AdminLayout>
  );
}
