import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostStructure } from "./LiveBlog";

interface LiveBlogCardProps {
  blogTitle: string;
  blogPosts: PostStructure[] | [];
}

export const LiveBlogCard = ({ blogTitle, blogPosts }: LiveBlogCardProps) => {
  return (
    <Card className="mb-2">
      <CardHeader className="flex">{blogTitle}</CardHeader>
      {blogPosts.length ? (
        blogPosts.map((post) => (
          <CardContent key={post.id}>{post.postTitle}</CardContent>
        ))
      ) : (
        <CardContent>There are no posts at this time</CardContent>
      )}
    </Card>
  );
};
