import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { LiveBlog, LiveBlogResponse } from "./containers/LiveBlog/LiveBlog";
import { DialogFooter, DialogHeader } from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [blogTitle, setBlogTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [blogListFromServer, setBlogListFromServer] = useState(
    [] as LiveBlogResponse[]
  );

  const handleAddNewLiveBlog = () => {
    setIsLoading(true);
    fetch("http://localhost:8200/api/newliveblog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: uuidv4(), blogname: blogTitle, posts: [] }),
    })
      .then((response) => {
        setIsLoading(false);
        setIsDialogOpen(false);
        return response.json();
      })
      .then((newLiveBlogData) => setBlogListFromServer(newLiveBlogData))
      .catch((error) => {
        setIsLoading(false);
        setIsDialogOpen(false);
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center my-0 mx-auto w-3/4 mt-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="self-end mb-2">Create new blog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new live blog!</DialogTitle>
            <DialogDescription>
              Add a blog title and click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="blogName">Blog Title</Label>
            <Input
              name="blogName"
              id="blogName"
              minLength={3}
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              disabled={blogTitle.length < 3 || isLoading}
              onClick={handleAddNewLiveBlog}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LiveBlog liveBlogListFromServer={blogListFromServer} />
    </div>
  );
}

export default App;
