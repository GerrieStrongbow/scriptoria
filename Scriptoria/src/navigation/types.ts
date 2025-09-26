import type { DocumentRecord } from '../services/documentService';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}

export type AppStackParamList = {
  Home: undefined;
  Scan: undefined;
  Document: { document: DocumentRecord };
};
