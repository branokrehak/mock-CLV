export function ErrorMessage({ message }: { message: string }) {
  return message ? (
    <p className="text-red-600 dark:text-red-400 mt-2 mb-0 text-center">
      {message}
    </p>
  ) : null;
}
