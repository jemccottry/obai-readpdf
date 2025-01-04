import { Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify/fastify";
import { PdfReader } from 'pdfreader';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PDFService {

    async handleFile (file: FastifyRequest) {
    const data = await file.file();
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); 
    }

    const filePath = path.join(uploadDir, data.filename);

    const writeStream = fs.createWriteStream(filePath);
    data.file.pipe(writeStream);
  
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    try {

      const extractedText = await this.extractTextFromPdf(filePath); 

     fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } 
      });

      return extractedText;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Error processing PDF');
    }

  }

  private extractTextFromPdf(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: string[] = [];

      new PdfReader().parseFileItems(filePath, (err, item) => {
        if (err) {
          reject('Error parsing PDF: ' + err);
        } else if (!item) {
          resolve(chunks.join(' ')); 
        } else if (item.text) {
          chunks.push(item.text); 
        }
      });
    });
  }
}