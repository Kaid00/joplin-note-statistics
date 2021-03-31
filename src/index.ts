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

    await joplin.commands.register({
      name: 'incValue',
      label: 'Increment custom setting value',

      iconName: 'fas fa-music',
      execute: async () => {
        const value = await joplin.settings.value('myCustomSetting');
        console.info('Got value', value);
        await joplin.settings.setValue('myCustomSetting', value + 1);
      },
    });

    await joplin.commands.register({
      name: 'checkValue',
      label: 'Check custom setting value',
      iconName: 'fas fa-drum',
      execute: async () => {
        const value = await joplin.settings.value('myCustomSetting');
        alert('Current value is: ' + value);
      },
    });

    await joplin.views.toolbarButtons.create(
      'incValueButton',
      'incValue',
      ToolbarButtonLocation.NoteToolbar
    );
    await joplin.views.toolbarButtons.create(
      'checkValueButton',
      'checkValue',
      ToolbarButtonLocation.NoteToolbar
    );

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
