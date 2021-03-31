import joplin from 'api';
import { SettingItemType, ToolbarButtonLocation } from 'api/types';

import {
  countLines,
  countLetter,
  countChar,
  countNum,
  countWords,
} from './noteMetaPlugin';

joplin.plugins.register({
  onStart: async function () {
    const dialog = joplin.views.dialogs;

    const handle = await dialog.create('myDialog1');

    async function getCurrentNote() {
      const note = await joplin.workspace.selectedNote();
      const line = note.body;

      if (note) {
        console.info('words: ', countWords(line));
        console.info('lines: ', countLines(line));
        console.info('chars: ', countChar(line));
        console.info('numbers: ', countNum(line));
        console.info('letter: ', countLetter(line));
        await dialog.setHtml(
          handle,
          `<p>chars: ${countChar(line)}</p>
				<p>Lines: ${countLines(line)}</p>
				<p>Words: ${countWords(line)}</p>
				<p>Letters: ${countLetter(line)}</p>
				<p>Numbers: ${countNum(line)}</p>`
        );
        joplin.views.dialogs.open(handle);
      } else {
        console.info('no note selected');
      }
    }

    const result = await dialog.open(handle);
    console.info('Got result: ' + JSON.stringify(result));

    await joplin.workspace.onNoteChange(() => {
      getCurrentNote();
    });

    await joplin.workspace.onNoteSelectionChange(() => {
      getCurrentNote();
    });

    getCurrentNote();
  },
});
