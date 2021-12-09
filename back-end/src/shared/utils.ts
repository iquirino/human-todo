import { getConnectionOptions, getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

export const toPromise = <T>(data: T): Promise<T> => {
  return new Promise<T>((resolve) => {
    resolve(data);
  });
};

export const getDbConnectionOptions = async (
  connectionName: string = 'default',
) => {
  const options = await getConnectionOptions(connectionName);
  return {
    ...options,
    name: connectionName,
  };
};

export const getDbConnection = async (connectionName: string = 'default') => {
  return await getConnection(connectionName);
};

export const runDbMigrations = async (connectionName: string = 'default') => {
  const conn = await getDbConnection(connectionName);
  await conn.synchronize(false);
  //await conn.runMigrations();
};

export const comparePasswords = async (userPassword, currentPassword) => {
  return await bcrypt.compare(currentPassword, userPassword);
};

export const sanitizeUrl = (value: string): string => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\W_]/g, '-')
    .toLowerCase();
};
