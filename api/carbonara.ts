import { NowRequest, NowResponse, NowRequestQuery } from "@now/node";
import formidable from "formidable";
import fs from "fs";
import { getUrl, getScreenshot } from "./_lib";
import { Options } from "./_lib/url";

const handler = async (
  data: string,
  query?: NowRequestQuery,
): Promise<Buffer | undefined> => {
  const url = getUrl(data, query as Partial<Options>);
  if (!url) {
    return;
  }
  const imageBuffer = await getScreenshot({ url });
  return imageBuffer;
};

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err.message);
      return res.status(500).send(err.message);
    }

    if (fields.data) {
      const buff = Buffer.from(fields.data.toString(), "base64");
      const data = buff.toString();

      const imageBuffer = await handler(data, req.query);

      if (!imageBuffer) {
        return null;
      }

      res.json(imageBuffer.toString("base64"));
    } else if (files.data) {
      fs.readFile(files.data.path, async (err, data) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error(err.message);
          return res.status(500).send(err.message);
        }

        const imageBuffer = await handler(data.toString(), req.query);

        if (!imageBuffer) {
          return res.status(200).send("No screenshot generated");
        }

        return res.json(imageBuffer.toString("base64"));
      });
    }
  });
};
