import joplin from 'api';
import { SettingItemType, ToolbarButtonLocation } from 'api/types';

import {
  countLines,
  countLetter,
  countChar,
  countNum,
  countWords,
  getByteSize,
  getNumLinks,
  getImageNum,
  readTime,
  noMdChar,
} from './noteMetaPlugin';

joplin.plugins.register({
  onStart: async function () {
    // Dailog
    const dialog = joplin.views.dialogs;

    const handle = await dialog.create('myDialog1');

    await dialog.setButtons(handle, [
      {
        id: 'Close',
      },
    ]);

    await joplin.views.dialogs.addScript(handle, './pluginScripts/dialog.css');

    // Registering commands
    await joplin.commands.register({
      name: 'viewDialog',
      label: 'Note Statistics',
      iconName: 'fas fa-info',
      execute: async () => {
        joplin.views.dialogs.open(handle);
      },
    });

    // adds command to the note toolbar
    await joplin.views.toolbarButtons.create(
      'viewDialog',
      'viewDialog',
      ToolbarButtonLocation.EditorToolbar
    );

    async function getCurrentNote() {
      const note = await joplin.workspace.selectedNote();
      const noteBody = note.body;

      if (note) {
        await dialog.setHtml(
          handle,
          `
        <h1>Statistics</h1>  
				<table ${countChar(noteBody)} id="customers">
          <col style="width:60%">
          <col style="width:20%">
          <col style="width:20%">
					<tr>
						<th></th>
						<th>Editor</th>
						<th>Viewer</th>
					</tr>
				
					<tr ${countWords(noteBody)}>
						<td class = "data">Words</td>
						<td>${countWords(noteBody)}</td>
						<td>${countWords(noteBody)}</td>
					</tr>
          <tr ${countLetter(noteBody)}>
						<td class = "data">Letters</td>
						<td>${countLetter(noteBody)}</td>
						<td>${countLetter(noteBody)}</td>
					</tr>
          <tr ${countNum(noteBody)}>
						<td class = "data">Numbers</td>
						<td>${countNum(noteBody)}</td>
						<td>${countNum(noteBody)}</td>
					</tr>
          <tr ${getNumLinks(noteBody)}>
						<td class = "data">Links</td>
						<td>${getNumLinks(noteBody)}</td>
						<td>${getNumLinks(noteBody)}</td>
					</tr>
					<tr ${getImageNum(noteBody)}>
						<td  class = "data">Images</td>
						<td>${getImageNum(noteBody)}</td>
						<td>${getImageNum(noteBody)}</td>
					</tr>
					<tr ${countNum(noteBody)}>
						<td class = "data">Lines</td>
						<td>${countLines(noteBody)}</td>
						<td>${countLines(noteBody)}</td>
					</tr>
          <tr ${countChar(noteBody)}>
						<td class = "data">Characters</td>
						<td>${countChar(noteBody)}</td>
						<td>${noMdChar(noteBody)}</td>
						
					</tr>
					
				</table>
       
				<p id = "size">Size: ${getByteSize(noteBody)}</p>
        <p id = "size">Read time: ${readTime(noteBody)}</p>

			`
        );
      } else {
        console.info('no note selected');
      }
    }

    await joplin.workspace.onNoteChange(() => {
      getCurrentNote();
    });

    await joplin.workspace.onNoteSelectionChange(() => {
      getCurrentNote();
    });

    getCurrentNote();
  },
});
