
export function DemoAccounts() {
  return (
    <div className="bg-quiz-light dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Demo Accounts</h3>
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">Student Account</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email: student@example.com</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Password: password</p>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">Admin Account</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email: admin@example.com</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Password: password</p>
        </div>
      </div>
    </div>
  );
}
