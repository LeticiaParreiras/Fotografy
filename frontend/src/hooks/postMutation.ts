import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LikeBody } from "../lib/postInterfaces";
import { axiosClient } from "../lib/axios";
import type { CreatePostFormValues } from "../lib/postSchemas";

async function postLike(postId: string, liked: boolean): Promise<void> {
  if (liked) {
    return await axiosClient.delete(`/post/like/${postId}`);
  } 
    return await axiosClient.post(`/post/like/${postId}`);
 
}

export function usePostToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, liked }: LikeBody) => postLike(postId, liked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
async function createPost(data: CreatePostFormValues): Promise<void> {
  const formData = new FormData();
  formData.append('image', data.image[0]);
  formData.append('text', data.text?? "");

  await axiosClient.post('/post', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
export function useCreatePost() {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (data: CreatePostFormValues) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

 async function deletePost(idPost:string) {
  await axiosClient.delete(`/post/${idPost}`)
}
export function useDeletePost(){
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (idPost:string) => deletePost(idPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

