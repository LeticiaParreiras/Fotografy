import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../lib/axios"

export class userResponse {
  id: string;
  username: string;
  name: string;
  createdAt: Date;
  biography?: string;
  followed?: boolean;
}
async function fetchUser(username:string):Promise<userResponse>{
    const response = await axiosClient.get<userResponse>(`user/${username}`, {
    withCredentials: true,
  })
    return response.data
}
export function useUserData(username:string){
    return useQuery({
    queryKey: ['userData'],
    queryFn: () => fetchUser(username),
  });

}