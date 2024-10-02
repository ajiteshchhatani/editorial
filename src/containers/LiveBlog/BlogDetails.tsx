import { useLocation } from "react-router-dom";
import { LiveBlogResponse } from "./LiveBlog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { error } from "console";

export interface PostsResponseStructure {
  id: string;
  postTitle: string;
  postDescription?: string;
}

const BlogDetails = () => {
  const { state }: { state: LiveBlogResponse } = useLocation();

  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isPostDeleteDialogOpen, setIsPostDeleteDialogOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [postsDataFromApiResponse, setPostsDataFromApiResponse] = useState(
    [] as PostsResponseStructure[]
  );

  const ws = new WebSocket("ws://localhost:8000");

  /* useEffect(() => {
    ws.onopen = function () {
      ws.send("hello from client");
    };

    ws.onmessage = (event) => {
      const { data } = event;
      console.log("data", data);
    };
  }, []); */

  useEffect(() => {
    console.log(state);
  }, [state]);

  const handleCreateNewPost = () => {
    setIsLoading(true);
    fetch("http://localhost:8200/api/newPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blogId: state.id,
        id: uuidv4(),
        postTitle,
        postDescription,
      }),
    })
      .then((response) => {
        setIsLoading(false);
        setIsPostDialogOpen(false);
        return response.json();
      })
      .then((newlyCreatedPost) => setPostsDataFromApiResponse(newlyCreatedPost))
      .catch((error) => {
        setIsLoading(false);
        setIsPostDialogOpen(false);
        console.error(error);
      });
  };

  const handlePostDelete = (blogId: string, postId: string) => {
    // Close the dialog
    setIsPostDeleteDialogOpen(false);

    // Make delete api call
    console.log(postId);

    fetch("http://localhost:8200/api/deletePost", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogId, postId }),
    })
      .then((response) => response.json())
      .then((dataAfterPostDelete) => {
        console.log("dataAfterPostDelete", dataAfterPostDelete);
        setPostsDataFromApiResponse(dataAfterPostDelete);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col items-center justify-center my-0 mx-auto w-3/4 mt-2">
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogTrigger asChild>
          <Button className="self-end mb-2">Create new post</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new post for the live blog!</DialogTitle>
            <DialogDescription>
              Add a blog title and click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="postTitle">Post Title</Label>
            <Input
              name="blogName"
              id="blogName"
              minLength={3}
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              disabled={postTitle.length < 3 || isLoading}
              onClick={handleCreateNewPost}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="self-start">Posts:</div>
      <div className="w-full border-2 rounded-md border-gray-400">
        {postsDataFromApiResponse.length ? (
          postsDataFromApiResponse.map((post) => (
            <div key={post.id} className="flex items-center">
              <div>{post.postTitle}</div>
              <Button className="ml-auto mb-2">Edit</Button>
              {/**Delete post dialog */}
              <Dialog
                open={isPostDeleteDialogOpen}
                onOpenChange={setIsPostDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="ml-auto mb-2">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete post</DialogTitle>
                  </DialogHeader>
                  <DialogDescription></DialogDescription>
                  <div>Are you sure you want to delete post?</div>
                  <DialogFooter>
                    <Button onClick={() => setIsPostDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handlePostDelete(post.blogId, post.id)}
                    >
                      Yes, delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))
        ) : state.posts.length ? (
          <div className="p-2">
            {state.posts.map((post) => (
              <div key={post.id} className="flex items-center">
                <div>{post.postTitle}</div>
                <Button className="ml-auto mb-2">Edit</Button>
                {/**Delete post dialog */}
                <Dialog
                  open={isPostDeleteDialogOpen}
                  onOpenChange={setIsPostDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="ml-auto mb-2">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete post</DialogTitle>
                    </DialogHeader>
                    <DialogDescription></DialogDescription>
                    <div>Are you sure you want to delete post?</div>
                    <DialogFooter>
                      <Button onClick={() => setIsPostDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handlePostDelete(post.blogId, post.id)}
                      >
                        Yes, delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* <Button className="ml-auto mb-2" onClick={() => handlePostDelete(post.id)}>Delete</Button> */}
              </div>
            ))}
          </div>
        ) : (
          <div>No posts at this time</div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
