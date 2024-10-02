import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
//import data from "./data/blogData.json";
import fs from "fs";
import WebSocket from "ws";

interface PostDataStructureFromFile {
  blogId: string;
  id: string;
  postTitle: string;
  postDescription?: string;
}

interface BlogDataStructureFromFile {
  id: string;
  blogName: string;
  posts: PostDataStructureFromFile[];
}

const app = express();
const PORT = 8200;
//const liveBlogData: string[] = data;

app.use(cors());

//app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

app.get("/api/blogs", (req, res) => {
  fs.readFile("./data/blogData.json", "utf-8", (error, readFileData) => {
    if (error) {
      return res.status(500).send("Error in reading file");
    }
    return res.json(JSON.parse(readFileData));
  });
});

app.post("/api/newliveblog", (req, res) => {
  console.log(req.body);
  /* liveBlogData.push(req.body);
  res.json(liveBlogData); */
  // Read JSON file contents
  fs.readFile("./data/blogData.json", "utf-8", (error, readFileData) => {
    if (error) {
      return res.status(500).send("Error in reading file");
    }

    // Parse contents read from file
    const blogDataFromFile = JSON.parse(readFileData);
    // Push to JSON array, the contents received in POST request body
    blogDataFromFile.push(req.body);
    // Write contents to JSON file to serve as db
    fs.writeFile(
      "./data/blogData.json",
      JSON.stringify(blogDataFromFile),
      () => {
        // Return the response to frontend after writing to update contents
        return res.json(blogDataFromFile);
      }
    );
  });
});

// Api route to create new post within a blog
app.post("/api/newPost", (req, res) => {
  //console.log(req.body);
  fs.readFile("./data/blogData.json", "utf-8", (error, readFileData) => {
    if (error) {
      return res.status(500).send("Error in reading file");
    }

    // Parse contents read from file
    const blogDataFromFile: Array<{
      id: string;
      blogName: "";
      posts: Array<{ id: string; postTitle: string; postDescription?: string }>;
    }> = JSON.parse(readFileData);
    //
    console.log("##", blogDataFromFile);
    const updatedBlogDataWithPosts = blogDataFromFile.map((blog) => {
      if (blog.id === req.body.blogId) {
        return { ...blog, posts: [...blog.posts, req.body] };
      } else {
        return blog;
      }
    });
    //console.log("!!", updatedBlogDataWithPosts);

    fs.writeFile(
      "./data/blogData.json",
      JSON.stringify(updatedBlogDataWithPosts),
      () => {
        const postsForSelectedBlog = updatedBlogDataWithPosts.filter(
          (blog) => blog.id === req.body.blogId
        );
        return res.json(postsForSelectedBlog[0]?.posts);
      }
    );
    // Push to JSON array, the contents received in POST request body
  });
});

// Api route to delete a post within a blog
app.delete("/api/deletePost", (req, res) => {
  fs.readFile("./data/blogData.json", "utf-8", (error, readFileData) => {
    // If error return error response
    if (error) {
      return res.status(500).send("Operation failed. Please try again.");
    }
    // Parse contents of file to JSON
    const blogDataFromFile: BlogDataStructureFromFile[] =
      JSON.parse(readFileData);
    const blogDataAfterPostDelete = blogDataFromFile.map((blog) => {
      if (blog.id === req.body.blogId) {
        const postsAfterDelete = blog.posts.filter(
          (post) => post.id !== req.body.postId
        );
        blog.posts = postsAfterDelete;
        return blog;
      } else {
        return blog;
      }
    });
    console.log("##", blogDataAfterPostDelete);
    fs.writeFile(
      "./data/blogData.json",
      JSON.stringify(blogDataAfterPostDelete),
      () => {
        const postsAfterDelete = blogDataAfterPostDelete.filter(
          (blog) => blog.id === req.body.blogId
        );
        return res.json(postsAfterDelete[0]?.posts);
      }
    );
  });
});

const ws = new WebSocket.Server({
  port: 8000,
});

ws.on("error", console.error);

ws.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("received %s", data);
  });

  ws.send("hello from ws");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
