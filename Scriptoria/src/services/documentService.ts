import RNFS, { ReadDirItem } from 'react-native-fs';
import { createPdf } from 'react-native-images-to-pdf';
import Logger from '../utils/logger';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const MULTI_PAGE_PATTERN = /^(.+)_page_(\d+)\.(jpg|jpeg|png)$/i;
const DEFAULT_EXTENSION = 'jpg';
const METADATA_SUFFIX = '.metadata.json';

const DOCUMENTS_DIR = `${RNFS.DocumentDirectoryPath}/scanned_documents`;

export type DocumentPage = {
  path: string;
  name: string;
  pageNumber: number;
  mtime: number;
};

export type DocumentRecord = {
  id: string;
  displayName: string;
  isMultiPage: boolean;
  pageCount: number;
  pages: DocumentPage[];
  primaryPage: DocumentPage;
  metadataPath: string | null;
  metadata: DocumentMetadata | null;
  createdAt: number | null;
  updatedAt: number;
};

export type DocumentMetadata = {
  documentName: string;
  pageCount: number;
  pages: Array<{
    pageNumber: number;
    filePath: string;
    fileName: string;
  }>;
  createdAt: string;
};

const normaliseExtension = (extension: string = DEFAULT_EXTENSION) => {
  return extension.startsWith('.') ? extension.slice(1).toLowerCase() : extension.toLowerCase();
};

const normaliseMtime = (mtime: Date | number | string | undefined | null): number => {
  if (!mtime) {
    return Date.now();
  }
  if (mtime instanceof Date) {
    return mtime.getTime();
  }
  if (typeof mtime === 'number') {
    return mtime;
  }
  const parsed = Date.parse(mtime);
  return Number.isNaN(parsed) ? Date.now() : parsed;
};

const resolveDocumentId = (fileName: string): { baseName: string; pageNumber: number; isMulti: boolean } | null => {
  const match = fileName.match(MULTI_PAGE_PATTERN);
  if (match) {
    return {
      baseName: match[1],
      pageNumber: parseInt(match[2], 10),
      isMulti: true,
    };
  }

  const extensionIndex = fileName.lastIndexOf('.');
  if (extensionIndex === -1) {
    return null;
  }

  return {
    baseName: fileName.slice(0, extensionIndex),
    pageNumber: 1,
    isMulti: false,
  };
};

const getExtension = (fileName: string) => {
  const extensionIndex = fileName.lastIndexOf('.');
  if (extensionIndex === -1) {
    return DEFAULT_EXTENSION;
  }
  return normaliseExtension(fileName.slice(extensionIndex + 1));
};

export const getDocumentsDirectory = () => DOCUMENTS_DIR;

export const getMetadataFilePath = (baseName: string) => `${DOCUMENTS_DIR}/${baseName}${METADATA_SUFFIX}`;

export const getSinglePageFilePath = (baseName: string, extension: string = DEFAULT_EXTENSION) => {
  const ext = normaliseExtension(extension);
  return `${DOCUMENTS_DIR}/${baseName}.${ext}`;
};

export const getPageFilePath = (baseName: string, pageNumber: number, extension: string = DEFAULT_EXTENSION) => {
  const ext = normaliseExtension(extension);
  return `${DOCUMENTS_DIR}/${baseName}_page_${pageNumber}.${ext}`;
};

export const ensureDocumentsDirectory = async (): Promise<void> => {
  try {
    const exists = await RNFS.exists(DOCUMENTS_DIR);
    if (!exists) {
      Logger.fileOp('create', DOCUMENTS_DIR);
      await RNFS.mkdir(DOCUMENTS_DIR);
    }
  } catch (error) {
    Logger.error('documentService: failed to ensure directory', error);
    throw error;
  }
};

export const listDocuments = async (): Promise<DocumentRecord[]> => {
  await ensureDocumentsDirectory();
  let files: ReadDirItem[] = [];

  try {
    files = await RNFS.readDir(DOCUMENTS_DIR);
  } catch (error) {
    Logger.error('documentService: failed to read directory', error);
    throw error;
  }

  const metadataMap = new Map<string, { data: DocumentMetadata; path: string }>();

  await Promise.all(
    files
      .filter((file) => file.name.endsWith(METADATA_SUFFIX))
      .map(async (file) => {
        const baseName = file.name.replace(METADATA_SUFFIX, '');
        try {
          const raw = await RNFS.readFile(file.path, 'utf8');
          const parsed = JSON.parse(raw) as DocumentMetadata;
          metadataMap.set(baseName, { data: parsed, path: file.path });
        } catch (error) {
          Logger.warn('documentService: failed to parse metadata', file.path, error);
        }
      }),
  );

  const grouped = new Map<
    string,
    {
      baseName: string;
      pages: DocumentPage[];
      isMultiPage: boolean;
    }
  >();

  files.forEach((file) => {
    if (file.name.endsWith(METADATA_SUFFIX)) {
      return;
    }

    const extension = getExtension(file.name);
    if (!IMAGE_EXTENSIONS.includes(extension)) {
      return;
    }

    const identification = resolveDocumentId(file.name);
    if (!identification) {
      return;
    }

    const { baseName, pageNumber, isMulti } = identification;

    const documentPages = grouped.get(baseName) ?? {
      baseName,
      pages: [],
      isMultiPage: false,
    };

    documentPages.isMultiPage = documentPages.isMultiPage || isMulti || documentPages.pages.length > 0;

    documentPages.pages.push({
      path: file.path,
      name: file.name,
      pageNumber,
      mtime: normaliseMtime(file.mtime),
    });

    grouped.set(baseName, documentPages);
  });

  const documents: DocumentRecord[] = Array.from(grouped.values()).map((entry) => {
    const metadataEntry = metadataMap.get(entry.baseName);
    const metadata = metadataEntry?.data ?? null;

    let orderedPages = [...entry.pages].sort((a, b) => a.pageNumber - b.pageNumber);

    if (metadata?.pages?.length) {
      const pageByPath = new Map(entry.pages.map((page) => [page.path, page]));
      const pageByName = new Map(entry.pages.map((page) => [page.name, page]));

      const metadataPages = metadata.pages.reduce<DocumentPage[]>((acc, metaPage, index) => {
        const matched = pageByPath.get(metaPage.filePath) || pageByName.get(metaPage.fileName);
        if (matched) {
          acc.push({
            ...matched,
            pageNumber: metaPage.pageNumber || index + 1,
          });
        }
        return acc;
      }, []);

      const remaining = entry.pages.filter(
        (page) => !metadataPages.some((mappedPage) => mappedPage.path === page.path),
      );

      orderedPages = [...metadataPages, ...remaining].sort((a, b) => a.pageNumber - b.pageNumber);
    }

    if (!orderedPages.length) {
      orderedPages = [...entry.pages];
    }

    const updatedAt = orderedPages.reduce((latest, page) => Math.max(latest, page.mtime), 0);
    const createdAt = metadata?.createdAt ? normaliseMtime(metadata.createdAt) : null;

    return {
      id: entry.baseName,
      displayName: metadata?.documentName ?? entry.baseName,
      isMultiPage: entry.isMultiPage || orderedPages.length > 1,
      pageCount: orderedPages.length,
      pages: orderedPages,
      primaryPage: orderedPages[0],
      metadataPath: metadataEntry?.path ?? (metadata ? getMetadataFilePath(entry.baseName) : null),
      metadata,
      createdAt,
      updatedAt,
    };
  });

  documents.sort((a, b) => {
    const aTime = a.updatedAt || 0;
    const bTime = b.updatedAt || 0;
    return bTime - aTime;
  });

  return documents;
};

const ensureUniqueTargetPaths = async (paths: Array<{ currentPath: string; targetPath: string }>) => {
  for (const { currentPath, targetPath } of paths) {
    if (currentPath === targetPath) {
      continue;
    }
    const exists = await RNFS.exists(targetPath);
    if (exists) {
      throw new Error('A document with this name already exists');
    }
  }
};

export const renameDocument = async (document: DocumentRecord, nextName: string): Promise<void> => {
  const trimmed = nextName.trim();
  if (!trimmed) {
    throw new Error('Document name is required');
  }

  const plannedMoves = document.pages.map((page) => {
    const extension = getExtension(page.name);
    const fileName = document.isMultiPage ? `${trimmed}_page_${page.pageNumber}.${extension}` : `${trimmed}.${extension}`;
    const targetPath = `${DOCUMENTS_DIR}/${fileName}`;

    return {
      currentPath: page.path,
      targetPath,
      fileName,
    };
  });

  await ensureUniqueTargetPaths(plannedMoves);

  for (const move of plannedMoves) {
    if (move.currentPath === move.targetPath) {
      continue;
    }
    Logger.fileOp('rename', move.currentPath, '→', move.targetPath);
    await RNFS.moveFile(move.currentPath, move.targetPath);
  }

  if (document.metadataPath) {
    const newMetadataPath = getMetadataFilePath(trimmed);
    let metadataPath = document.metadataPath;

    if (newMetadataPath !== document.metadataPath && (await RNFS.exists(document.metadataPath))) {
      try {
        Logger.fileOp('rename', document.metadataPath, '→', newMetadataPath);
        await RNFS.moveFile(document.metadataPath, newMetadataPath);
        metadataPath = newMetadataPath;
      } catch (error) {
        Logger.warn('documentService: failed to rename metadata file', error);
      }
    } else {
      metadataPath = newMetadataPath;
    }

    try {
      const rawMetadata = await RNFS.readFile(metadataPath, 'utf8');
      const parsedMetadata = JSON.parse(rawMetadata) as DocumentMetadata;
      const updatedMetadata: DocumentMetadata = {
        ...parsedMetadata,
        documentName: trimmed,
        pageCount: plannedMoves.length,
        pages: plannedMoves.map(({ fileName, targetPath }, index) => ({
          pageNumber: index + 1,
          filePath: targetPath,
          fileName,
        })),
        createdAt: parsedMetadata?.createdAt ?? new Date().toISOString(),
      };

      await writeMetadataFile(trimmed, updatedMetadata, { logOperation: 'update' });
    } catch (error) {
      Logger.warn('documentService: failed to update metadata contents', error);
      const fallbackMetadata: DocumentMetadata = {
        documentName: trimmed,
        pageCount: plannedMoves.length,
        pages: plannedMoves.map(({ fileName, targetPath }, index) => ({
          pageNumber: index + 1,
          filePath: targetPath,
          fileName,
        })),
        createdAt: new Date().toISOString(),
      };

      try {
        await writeMetadataFile(trimmed, fallbackMetadata, { logOperation: 'update' });
      } catch (writeError) {
        Logger.warn('documentService: failed to regenerate metadata', writeError);
      }
    }
  }
};

export const deleteDocument = async (document: DocumentRecord): Promise<void> => {
  for (const page of document.pages) {
    try {
      await RNFS.unlink(page.path);
      Logger.fileOp('delete', page.path);
    } catch (error) {
      Logger.warn('documentService: failed to delete page', page.path, error);
    }
  }

  if (document.metadataPath && (await RNFS.exists(document.metadataPath))) {
    try {
      await RNFS.unlink(document.metadataPath);
      Logger.fileOp('delete', document.metadataPath);
    } catch (error) {
      Logger.warn('documentService: failed to delete metadata', error);
    }
  }
};

const doesDocumentExist = async (baseName: string, extension: string, _isMultiPage: boolean) => {
  const metadataPath = getMetadataFilePath(baseName);
  if (await RNFS.exists(metadataPath)) {
    return true;
  }

  const extensionsToCheck = Array.from(new Set([normaliseExtension(extension), ...IMAGE_EXTENSIONS]));

  for (const candidateExtension of extensionsToCheck) {
    const singlePagePath = getSinglePageFilePath(baseName, candidateExtension);
    if (await RNFS.exists(singlePagePath)) {
      return true;
    }
  }

  for (const candidateExtension of extensionsToCheck) {
    const firstMultiPagePath = getPageFilePath(baseName, 1, candidateExtension);
    if (await RNFS.exists(firstMultiPagePath)) {
      return true;
    }
  }

  return false;
};

export const generateUniqueDocumentName = async (
  baseName: string,
  options: {
    extension?: string;
    isMultiPage?: boolean;
  } = {},
): Promise<string> => {
  const extension = normaliseExtension(options.extension ?? DEFAULT_EXTENSION);
  const isMultiPage = options.isMultiPage ?? false;

  let candidate = baseName;
  let counter = 1;

  while (await doesDocumentExist(candidate, extension, isMultiPage)) {
    candidate = `${baseName} (${counter})`;
    counter += 1;
  }

  return candidate;
};

export const exportSinglePageAsImage = async (
  page: DocumentPage,
  options: { prefix?: string; cleanupDelayMs?: number } = {},
): Promise<{ sharedPath: string; fileName: string }> => {
  const exists = await RNFS.exists(page.path);
  if (!exists) {
    throw new Error(`Source file not found: ${page.path}`);
  }

  const prefix = options.prefix ?? 'scanned_doc';
  const extension = getExtension(page.name);
  const timestamp = Date.now();
  const fileName = `${prefix}_${timestamp}.${extension}`;
  const sharedPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  Logger.fileOp('copy', page.path, '→', sharedPath);
  await RNFS.copyFile(page.path, sharedPath);

  if (typeof options.cleanupDelayMs === 'number') {
    scheduleTemporaryCleanup(sharedPath, options.cleanupDelayMs);
  }

  return { sharedPath, fileName };
};

export const exportDocumentAsPdf = async (
  document: DocumentRecord,
  options: { fileName?: string; cleanupDelayMs?: number } = {},
): Promise<string> => {
  if (!document.pages.length) {
    throw new Error('Document has no pages to convert');
  }

  for (const page of document.pages) {
    const exists = await RNFS.exists(page.path);
    if (!exists) {
      throw new Error(`Page not found: ${page.path}`);
    }
  }

  const fileName = options.fileName ?? `${document.displayName}.pdf`;
  const outputPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  const pdfPath = await createPdf({
    pages: document.pages.map((page) => ({ imagePath: page.path })),
    outputPath,
  });

  if (typeof options.cleanupDelayMs === 'number') {
    scheduleTemporaryCleanup(pdfPath, options.cleanupDelayMs);
  }

  return pdfPath;
};

export const scheduleTemporaryCleanup = (path: string, delayMs = 10_000) => {
  if (!path) {
    return;
  }

  setTimeout(async () => {
    try {
      const exists = await RNFS.exists(path);
      if (exists) {
        await RNFS.unlink(path);
        Logger.fileOp('cleanup', path);
      }
    } catch (error) {
      Logger.warn('documentService: failed to cleanup temp file', path, error);
    }
  }, delayMs);
};

export const writeMetadataFile = async (
  baseName: string,
  metadata: DocumentMetadata,
  options: { logOperation?: 'create' | 'update' } = {},
): Promise<void> => {
  const metadataPath = getMetadataFilePath(baseName);
  try {
    await RNFS.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    Logger.fileOp(options.logOperation ?? 'create', metadataPath);
  } catch (error) {
    Logger.error('documentService: failed to write metadata', error);
    throw error;
  }
};
