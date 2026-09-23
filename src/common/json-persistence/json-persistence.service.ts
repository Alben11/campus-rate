import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class JsonPersistenceService {
  private readonly dataDir = path.join(process.cwd(), 'data');

  private async ensureDataDirExists(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(
        `Erreur lors de la création du dossier data : ${err.message}`,
      );
    }
  }

  async readData<T>(fileName: string): Promise<T[]> {
    await this.ensureDataDirExists();
    const filePath = path.join(this.dataDir, fileName);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as T[];
    } catch (error) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'ENOENT') {
        await this.writeData(fileName, []);
        return [];
      }
      throw new InternalServerErrorException(
        `Erreur lors de la lecture du fichier ${fileName} : ${err.message}`,
      );
    }
  }

  async writeData<T>(fileName: string, data: T[]): Promise<void> {
    await this.ensureDataDirExists();
    const filePath = path.join(this.dataDir, fileName);

    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(
        `Erreur lors de l'écriture dans le fichier ${fileName} : ${err.message}`,
      );
    }
  }
}