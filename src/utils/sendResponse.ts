import { Request, Response } from 'express';
import { json2xml } from 'xml-js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const json2html = require('json2html');
import { jsonToPlainText } from 'json-to-plain-text';

type ResponseType<DataType> = {
  message: string;
  data?: DataType;
};

const createResponseObject = <DataType>(
  message: string,
  data: DataType,
  contentType: string
): JSON | string => {
  const responseObject: ResponseType<DataType> = {
    message,
    data,
  };

  if (!data) {
    delete responseObject.data;
  }

  const json = JSON.stringify(responseObject);

  switch (contentType) {
    case 'application/xml':
      return json2xml(json, {
        compact: true,
        ignoreComment: true,
        spaces: 2,
      });

    case 'text/html':
      return json2html.render(responseObject);

    case 'text/plain':
      return jsonToPlainText(responseObject, {
        color: false,
        spacing: true,
        seperator: ':',
        squareBracketsForArray: true,
        doubleQuotesForKeys: false,
        doubleQuotesForValues: false,
      });

    case 'application/json':
      return json;

    default:
      return json;
  }
};

const sendResponse = <DataType>(
  req: Request,
  res: Response,
  statusCode: number,
  message: string,
  data?: DataType
) => {
  let contentType: string = req.headers.accept || 'application/json';
  contentType = contentType === '*/*' ? 'application/json' : contentType;

  res.set('content-type', contentType);

  const response = createResponseObject(message, data, contentType);

  res.status(statusCode).send(response);
};

export default sendResponse;
