export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-gray-100" />
        <p className="text-lg text-gray-900 dark:text-gray-100">ロード中</p>
      </div>
    </div>
  );
}
