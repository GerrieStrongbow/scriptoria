# Document Storage Contract

This application persists scanned documents in the app-specific document directory provided by
`react-native-fs`. The notes below capture the conventions that code relies on today.

## Root Directory

All assets are stored inside:

```
${RNFS.DocumentDirectoryPath}/scanned_documents
```

The directory is created during app initialisation if it does not already exist.

## Naming Convention

| Item             | Pattern                                      | Notes |
|------------------|----------------------------------------------|-------|
| Single page file | `<baseName>.<extension>`                      | Scans currently save as JPEG (`.jpg`). |
| Multi-page file  | `<baseName>_page_<index>.<extension>`         | Index is 1-based to match UX copy. |
| Metadata file    | `<baseName>.metadata.json`                    | JSON descriptor for page order and metadata. |

`baseName` is a human-readable document title. It is guaranteed to be unique when created and is
updated when the document is renamed (all related files adopt the new base name).

## Metadata Schema

Multi-page documents have an accompanying metadata JSON file:

```json
{
  "documentName": "Untitled Manuscript",
  "pageCount": 2,
  "pages": [
    {
      "pageNumber": 1,
      "filePath": "/path/to/Untitled Manuscript_page_1.jpg",
      "fileName": "Untitled Manuscript_page_1.jpg"
    }
  ],
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

The file is rewritten on rename so `documentName`, `filePath`, and `fileName` stay in sync with the
actual assets.

## Cleanup Rules

- Temporary files returned by the scanner plugin are deleted as soon as they are copied into the
  document directory.
- Temporary exports created for sharing are written to `RNFS.CachesDirectoryPath` and scheduled for
  automatic cleanup after 10 seconds.

## Error Handling & Feedback

All file-system operations are guarded and log through `Logger`. User-facing failures now go through
`showError` / `showInfo` to ensure consistent alerts.

## Future Considerations

- Additional metadata (tags, annotations) should be added to the existing JSON structure.
- If storage moves to a database, provide a migration path to honour the current contract or cleanly
  import legacy documents.
