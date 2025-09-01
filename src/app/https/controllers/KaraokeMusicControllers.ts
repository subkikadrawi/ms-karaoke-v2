/* eslint-disable n/no-unsupported-features/node-builtins */
import path from 'path';
import {ELogStage, logger} from '../../configs/LoggerConfig';
import {
  EHttpResponseStatus,
  EHttpResponseStatusDesc,
} from '../../enums/HttpResponseEnum';
import {IBaseResourceModel} from '../../models/resource_models/IBaseResourceModel';
import {KaraokeMusicTblRepository} from '../../repositories/KaraokeMusicRepository';
import {IMainRequest} from '../requests/MainRequest';
import {BaseResource} from '../resources/BaseResource';
import {Response} from 'express';
import fs from 'fs';
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import {config} from '../../configs/AppConfig';

const CategoryEnum = Object.freeze({
  0: 'all',
  1: 'indonesia',
  2: 'dangdut',
  3: 'barat',
  4: 'mandarin',
  5: 'jepang',
  6: 'korea',
});

const getCategoryId = (categoryName: string) => {
  return (
    Object.keys(CategoryEnum) as unknown as Array<keyof typeof CategoryEnum>
  ).find(key => CategoryEnum[key] === categoryName);
};

const s3 = new S3Client({
  region: 'us-east-1', // or your preferred region
  endpoint: 'https://nos.wjv-1.neo.id', // custom S3-compatible endpoint
  forcePathStyle: true, // often required for S3-compatible storage
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID, // set in your env
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY, // set in your env
  },
});

const getList = async (req: IMainRequest, res: Response) => {
  logger.info(ELogStage.start);
  const title = (req.query.title || '') as string;
  const category =
    req.query.category !== undefined ? String(req.query.category) : 'all';
  const categoryId = getCategoryId(category);

  if (!categoryId) {
    return BaseResource.exec(res, {
      message: `${EHttpResponseStatusDesc.Unauthorized}: category ${category} not found!`,
      isSuccess: false,
      requestId: req.requestId,
      status: EHttpResponseStatus.Unauthorized,
    });
  }

  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 20;

  const karaokeMusic = await KaraokeMusicTblRepository.findAll({
    q: {categoryId: categoryId, title},
    offset: (page - 1) * size,
    limit: size,
  });

  const totalResult = await KaraokeMusicTblRepository.findAll({
    q: {categoryId: categoryId, title},
    count: [{alias: 'total_data', selected: '*'}],
  });

  const totalData = totalResult[0]?.total_data || 0;
  const totalPages = totalData === 0 ? 1 : Math.ceil(totalData / size);

  const responseModified = karaokeMusic.map(item => ({
    ...item,
    categoryName:
      CategoryEnum[item.categoryId as keyof typeof CategoryEnum].toUpperCase(),
  }));

  const dataPagination = {
    pagination: {
      totalData,
      totalPages,
      currentPage: page,
      pageSize: size,
    },
    data: responseModified,
  };

  const response: IBaseResourceModel = {
    data: dataPagination,
    isSuccess: true,
    message: '200 OK',
    status: 200,
  };

  logger.info(ELogStage.end);
  return BaseResource.exec(res, response);
};

const getMusicVideo = async (req: IMainRequest, res: Response) => {
  const titleMusic = req.params.title_music;
  const category = req.params.category;
  const key = `musics/${category}/${titleMusic}`; // S3 object key
  const range = req.headers.range;

  // const localPath = path.resolve(`/secure_media/${category}/${titleMusic}`);
  const localPath = path.resolve(
    __dirname,
    '../../../../secure_media',
    category,
    titleMusic,
  );

  // Check if local file exists
  if (fs.existsSync(localPath)) {
    try {
      const stat = fs.statSync(localPath);
      const fileSize = stat.size;

      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
        });

        // file.pipe(res);
        const fileStream = fs.createReadStream(localPath, {start, end});

        fileStream.on('error', err => {
          console.error('File stream error:', err);
          if (!res.headersSent) {
            res.status(500).send('Error reading file');
          }
        });

        fileStream.pipe(res).on('error', err => {
          console.error('Pipe error:', err);
        });
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        });
        // fs.createReadStream(localPath).pipe(res);
        const fileStream = fs.createReadStream(localPath);

        fileStream.on('error', err => {
          console.error('File stream error:', err);
          if (!res.headersSent) {
            res.status(500).send('Error reading file');
          }
        });

        fileStream.pipe(res).on('error', err => {
          console.error('Pipe error:', err);
        });
      }

      return; // Stop here if file is served
    } catch (err) {
      console.error('Error reading local file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
  }

  try {
    // Import GetObjectCommandInput at the top if not already imported:
    // import { GetObjectCommand, GetObjectCommandInput } from "@aws-sdk/client-s3";
    const commandParams: GetObjectCommandInput = {
      Bucket: 'karaoke-reactjs', // replace with your bucket
      Key: key,
    };
    if (range) {
      commandParams.Range = range; // e.g. "bytes=0-"
    }

    const command = new GetObjectCommand(commandParams);
    const s3Response = await s3.send(command);
    // console.log(s3Response);

    // Set headers for partial or full content
    if (range && s3Response.ContentRange) {
      res.status(206);
      res.set({
        'Content-Range': s3Response.ContentRange,
        'Accept-Ranges': 'bytes',
        'Content-Length': s3Response.ContentLength,
        'Content-Type': s3Response.ContentType || 'video/mp4',
      });
    } else {
      res.set({
        'Content-Length': s3Response.ContentLength,
        'Content-Type': s3Response.ContentType || 'video/mp4',
      });
    }

    // Stream S3 data to client
    // s3Response.Body.pipe(res);
    const {Readable} = require('stream');
    const streamBody = s3Response.Body;

    if (streamBody) {
      // Convert to Node.js readable stream if necessary
      const nodeStream = Readable.from(streamBody as any);

      nodeStream.on('error', (err: any) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
          res.status(500).send('Stream failed');
        }
      });

      nodeStream.pipe(res).on('error', (err: any) => {
        console.error('Pipe error:', err);
      });
    } else {
      res.status(500).send('No stream returned from S3');
    }
  } catch (err) {
    res.status(404).send('File not found');
  }
};

const getMusicInstrument = async (req: IMainRequest, res: Response) => {
  const titleMusic = req.params.title_music;
  const typeFile = req.params.type_file;
  const category = req.params.category;
  const key = `musics/${category}/separated/${titleMusic}/${typeFile}`; // S3 object key
  const range = req.headers.range;

  // const localPath = path.resolve(
  //   `./secure_media/${category}/separated/${titleMusic}/${typeFile}`,
  // );
  const localPath = path.resolve(
    __dirname,
    '../../../../secure_media',
    category,
    'separated',
    titleMusic,
    typeFile,
  );

  // Check if local file exists
  if (fs.existsSync(localPath)) {
    try {
      const stat = fs.statSync(localPath);
      const fileSize = stat.size;

      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
        });

        // file.pipe(res);
        const fileStream = fs.createReadStream(localPath, {start, end});

        fileStream.on('error', err => {
          console.error('File stream error:', err);
          if (!res.headersSent) {
            res.status(500).send('Error reading file');
          }
        });

        fileStream.pipe(res).on('error', err => {
          console.error('Pipe error:', err);
        });
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        });
        // fs.createReadStream(localPath).pipe(res);
        const fileStream = fs.createReadStream(localPath);

        fileStream.on('error', err => {
          console.error('File stream error:', err);
          if (!res.headersSent) {
            res.status(500).send('Error reading file');
          }
        });

        fileStream.pipe(res).on('error', err => {
          console.error('Pipe error:', err);
        });
      }

      return; // Stop here if file is served
    } catch (err) {
      console.error('Error reading local file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
  }

  try {
    // Import GetObjectCommandInput at the top if not already imported:
    // import { GetObjectCommand, GetObjectCommandInput } from "@aws-sdk/client-s3";
    const commandParams: GetObjectCommandInput = {
      Bucket: 'karaoke-reactjs', // replace with your bucket
      Key: key,
    };
    if (range) {
      commandParams.Range = range; // e.g. "bytes=0-"
    }

    const command = new GetObjectCommand(commandParams);
    const s3Response = await s3.send(command);
    // console.log(s3Response);

    // Set headers for partial or full content
    if (range && s3Response.ContentRange) {
      res.status(206);
      res.set({
        'Content-Range': s3Response.ContentRange,
        'Accept-Ranges': 'bytes',
        'Content-Length': s3Response.ContentLength,
        'Content-Type': s3Response.ContentType || 'audio/mpeg',
      });
    } else {
      res.set({
        'Content-Length': s3Response.ContentLength,
        'Content-Type': s3Response.ContentType || 'audio/mpeg',
      });
    }

    // Stream S3 data to client
    // s3Response.Body.pipe(res);
    const {Readable} = require('stream');
    const streamBody = s3Response.Body;

    if (streamBody) {
      // Convert to Node.js readable stream if necessary
      const nodeStream = Readable.from(streamBody as any);

      nodeStream.on('error', (err: any) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
          res.status(500).send('Stream failed');
        }
      });

      nodeStream.pipe(res).on('error', (err: any) => {
        console.error('Pipe error:', err);
      });
    } else {
      res.status(500).send('No stream returned from S3');
    }
  } catch (err) {
    res.status(404).send('File not found');
  }
};

export {getList, getMusicVideo, getMusicInstrument};
