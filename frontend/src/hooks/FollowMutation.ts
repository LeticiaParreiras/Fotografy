import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../lib/axios";
interface followBody {
  username: string;
  followed: boolean;
}
async function toggleFollow({ username, followed }: followBody) {
  console.log(username, followed)
  if (followed) {
    return await axiosClient.delete(`/follow/${username}`);
  }
  return await axiosClient.post(`/follow/${username}`);
}
export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, followed }: followBody) =>
      toggleFollow({ username, followed }),
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['userData']})
    }
  });
}