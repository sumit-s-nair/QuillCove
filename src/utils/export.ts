// Export utilities
import { NoteType } from '@/types/note';

// Export functions with simplified names
export function exportNotes(notes: NoteType[], format: 'json' | 'markdown'): void {
  if (format === 'json') {
    exportNotesToJSON(notes);
  } else {
    exportNotesToMarkdown(notes);
  }
}

export function importNotes(file: File): Promise<NoteType[]> {
  return importNotesFromJSON(file);
}

export function exportNotesToJSON(notes: NoteType[]): void {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `quillcove-notes-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportNotesToMarkdown(notes: NoteType[]): void {
  let markdown = '# QuillCove Notes Export\n\n';
  markdown += `Exported on: ${new Date().toLocaleString()}\n\n---\n\n`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  notes.forEach((note, index) => {
    markdown += `## ${note.title}\n\n`;
    markdown += `${note.content}\n\n`;
    
    if (note.labels && note.labels.length > 0) {
      markdown += `**Labels:** ${note.labels.join(', ')}\n\n`;
    }
    
    if (note.checklist && note.checklist.length > 0) {
      markdown += `**Checklist:**\n`;
      note.checklist.forEach(item => {
        markdown += `- [${item.completed ? 'x' : ' '}] ${item.text}\n`;
      });
      markdown += '\n';
    }
    
    if (note.starred) {
      markdown += `⭐ **Starred**\n\n`;
    }
    
    markdown += `---\n\n`;
  });

  const dataBlob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `quillcove-notes-${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importNotesFromJSON(file: File): Promise<NoteType[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const notes = JSON.parse(e.target?.result as string);
        resolve(notes);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
