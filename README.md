# carbonara

A serverless function to take carbon screenshots (https://carbon.now.sh) of any code snippet.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/MaximeHeckel/carbonara)

# Blog post

This project is a dependency of some other projects I'm working on and is meant to serve as the example for the blog post [Creating beautiful screenshots of your code with a serverless function](https://blog.maximeheckel.com/posts/creating-beautiful-screenshots-source-code-with-serverless-function/) on my personal blog [blog.maximeheckel.com](https://blog.maximeheckel.com).

# Usage

- Deploy to [Vercel](https://vercel.com) by clicking on the button above or by cloning this repository and running `vercel --prod` or `yarn deploy` on your local machine (you can use any other serverless provider as well but every script here has been optimized for Vercel)
- Once the function is deployed you can test it with

  - a curl command:

  ```bash
  curl -d "data=Y29uc29sZS5sb2coImhlbGxvIHdvcmxkIik=" -X POST https://yourendpoint.com/api/carbonara
  ```

  - a NodeJS script:

  ```js
  import fs from "fs";
  import { post } from "request";
  import { promisify } from "util";
  import qs from "qs";

  const postAsync = promisify(post);
  const readFileAsync = promisify(fs.readFile);

  const getScreenshot = async () => {
    const code = await readFileAsync("./sample.tsx");
    const language = "tsx";

    const params = {
      backgroundColor: "#E6EDF8",
      dropShadow: true,
      dropShadowBlurRadius: "68px",
      dropShadowOffsetY: "20px",
      fontFamily: "Fira Code",
      fontSize: "14px",
      lineHeight: "133%",
      lineNumbers: false,
      paddingHorizontal: "35px",
      paddingVertical: "49px",
      squaredImage: false,
      theme: "nord",
      widthAdjustment: true,
      language,
    };

    try {
      const { body } = await postAsync({
        url: `https://yourendpoint.com/api/carbonara?${qs.stringify(params)}`,
        formData: {
          data: code.toString("base64"),
        },
      });

      console.log(body);
    } catch (e) {
      console.error(e);
    }
  };

  getScreenshot();
  ```

# Contribute

To contribute to this function, run the following commands:

- `yarn` to install the dependencies
- `yarn start` to start the function locally. The function will be listening on `http://localhost:3000/api/carbonara`
- `yarn lint` to lint the project
- `yarn format` to run prettier
