import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A simple hook for fetching and refetching API data.
 *
 * - Initial fetch: `isRefetch: false` (uses cache if applicable)
 * - Manual refetch: `isRefetch: true` (bypasses cache)
 * - Loading state is only shown for the initial fetch
 *
 * @example
 * ```tsx
 * const { loading, refetch } = useFetch(async ({ isRefetch }) => {
 *   const response = await apiGetPatientsPatientIdPpgs({
 *     path: { patient_id: patientId },
 *     meta: { useSessionCache: !isRefetch },
 *   });
 *   model.data = response.data.ppg_data;
 *   model.init();
 * }, [patientId]);
 * ```
 */
export function useFetch(
  fn: (options: { isRefetch: boolean }) => Promise<void>,
  deps: readonly unknown[],
): { loading: boolean; refetch: () => Promise<void> } {
  const [loading, setLoading] = useState(true);
  const fnRef = useRef(fn);
  const isInitialFetch = useRef(true);

  fnRef.current = fn;

  const doFetch = useCallback(async (isRefetch: boolean) => {
    await fnRef.current({ isRefetch });
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (isInitialFetch.current) {
        setLoading(true);
      }
      await doFetch(false);
      if (isInitialFetch.current) {
        setLoading(false);
        isInitialFetch.current = false;
      }
    };
    void fetch();
  }, [doFetch, ...deps]);

  const refetch = useCallback(async () => {
    await doFetch(true);
  }, [doFetch]);

  return { loading, refetch };
}
