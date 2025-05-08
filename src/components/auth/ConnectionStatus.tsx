
import { toast } from "@/hooks/use-toast";

type ConnectionStatusProps = {
  supabaseConnected: boolean;
  databaseReady: boolean;
};

export function ConnectionStatus({ 
  supabaseConnected, 
  databaseReady 
}: ConnectionStatusProps) {
  return (
    <>
      {supabaseConnected && (
        <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 rounded-md text-sm text-green-800 dark:text-green-200">
          ✓ Supabase connection confirmed
        </div>
      )}
      {databaseReady && (
        <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 rounded-md text-sm text-green-800 dark:text-green-200">
          ✓ Database tables ready
        </div>
      )}
    </>
  );
}
