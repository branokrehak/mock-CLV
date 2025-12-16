export function SuccessMessage({ message }: { message: string }) {
  return message ? (
    <p className="text-green-800 dark:text-green-600 mt-2 mb-0 text-center">
      {message}
    </p>
  ) : null;
}
