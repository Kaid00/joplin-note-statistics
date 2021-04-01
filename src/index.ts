import joplin from 'api';
import { SettingItemType, ToolbarButtonLocation } from 'api/types';

import {
  countLines,
  countLetter,
  countChar,
  countNum,
  countWords,
  getByteSize,
  linksNumber,
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

    // Registering settings
    await joplin.settings.registerSection('myCustomSection', {
      label: 'Meta',
      iconName: 'fas fa-info',
    });

    await joplin.settings.registerSetting('myCustomSetting', {
      value: 100,
      type: SettingItemType.Int,
      section: 'myCustomSection',
      public: true,
      label: 'Some random number',
    });

    await joplin.settings.registerSetting('another', {
      value: true,
      type: SettingItemType.Bool,
      section: 'myCustomSection',
      public: true,
      label: 'Get Line number',
    });

    await joplin.settings.registerSetting('multiOptionTest', {
      value: 'en',
      type: SettingItemType.String,
      section: 'myCustomSection',
      isEnum: true,
      public: true,
      label: 'CHoose',
      options: {
        en: 'English',
        fr: 'French',
        es: 'Spanish',
      },
    });

    // Registering command
    await joplin.commands.register({
      name: 'View-Dialog',
      label: 'My Test Command 1',
      iconName: 'fas fa-info',
      execute: async () => {
        joplin.views.dialogs.open(handle);
      },
    });

    // adds command to the note toolbar
    await joplin.views.toolbarButtons.create(
      'Button1',
      'View-Dialog',
      ToolbarButtonLocation.EditorToolbar
    );

    async function getCurrentNote() {
      const note = await joplin.workspace.selectedNote();
      const line = note.body;

      if (note) {
        await dialog.setHtml(
          handle,
          `
				<table>
					<tr>
						<th></th>
						<th>Editor</th>
						<th>Viewer</th>
					</tr>
					<tr>
						<td>Characters</td>
						<td>${countChar(line)}</td>
						<td>${countChar(line)}</td>
						
					</tr>
					<tr>
						<td>Words</td>
						<td>${countWords(line)}</td>
						<td>${countWords(line)}</td>
					</tr>
					<tr>
						<td>Letters</td>
						<td>${countLetter(line)}</td>
						<td>${countLetter(line)}</td>
					</tr>
					<tr>
						<td>Numbers</td>
						<td>${countNum(line)}</td>
						<td>${countNum(line)}</td>
					</tr>
					<tr>
						<td>Lines</td>
						<td>${countLines(line)}</td>
						<td>${countLines(line)}</td>
					</tr>
					<tr>
						<td>Links</td>
						<td>${linksNumber(line)}</td>
						<td>${linksNumber(line)}</td>
					</tr>
				</table>
				<p>Size: ${getByteSize(line)}</p>
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
  },
});
