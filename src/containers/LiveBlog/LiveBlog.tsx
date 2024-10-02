import { useState, useEffect } from "react";
import { LiveBlogCard } from "./LiveBlogCard";
import { Link } from "react-router-dom";

interface LiveBlogProps {
  liveBlogListFromServer: LiveBlogResponse[];
}

export interface PostStructure {
  blogId: string;
  id: string;
  postTitle: string;
  postDescription?: string;
}

export interface LiveBlogResponse {
  id: string;
  blogname: string;
  posts: PostStructure[] | [];
}

export const LiveBlog = ({ liveBlogListFromServer }: LiveBlogProps) => {
  // state variable in case the liveBlogListFromServer prop is [] in case user refreshes after adding a new blog
  const [liveBlogList, setLiveBlogList] = useState(liveBlogListFromServer);
  const [isLiveBlogListLoading, setIsLiveBlogListLoading] = useState(false);

  useEffect(() => {
    // Make a GET call only if the prop received is [] which will only happen when user reloads after POST call. pattern can be replaced with other patterns
    if (liveBlogListFromServer.length === 0) {
      setIsLiveBlogListLoading(true);
      fetch("http://localhost:8200/api/blogs")
        .then((response) => {
          setIsLiveBlogListLoading(false);
          return response.json();
        })
        .then((blogList: LiveBlogResponse[] | []) => {
          return setLiveBlogList(blogList);
        })
        .catch((error) => console.error(error));
    } else {
      setLiveBlogList(liveBlogListFromServer);
    }
  }, [liveBlogListFromServer]);

  return isLiveBlogListLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="w-full">
      {liveBlogList.length === 0 ? (
        <>No live blogs at this moment</>
      ) : (
        liveBlogList.map((blog) => (
          <Link to={`blog/${blog.id}`} key={blog.id} state={blog}>
            <LiveBlogCard
              key={blog.id}
              blogTitle={blog.blogname}
              blogPosts={blog.posts}
            />
          </Link>
        ))
      )}
    </div>
  );
};
