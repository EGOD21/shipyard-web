// ponytail: follows existing pattern from app/api/vote/route.ts
export const userKeys = {
  byEmail: (email: string) => `user:email:${email}`,
  byUsername: (username: string) => `user:username:${username}`,
  byId: (id: string) => `user:id:${id}`,
};

export const commentKeys = {
  forSlug: (slug: string) => `comments:${slug}`,
  byId: (id: string) => `comment:${id}`,
};
